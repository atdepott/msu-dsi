import random
import string
import json
import numpy
import shutil
import os

import dsidata

import cherrypy

import win32serviceutil
import win32service

class DataMiningWebService(object):
    exposed = True
    
    # needed to get CORS stuff working
    def OPTIONS(self):
        cherrypy.response.headers['Connection'] = 'keep-alive'
        cherrypy.response.headers['Access-Control-Max-Age'] = '1440'
        cherrypy.response.headers['Access-Control-Allow-Headers'] = 'X-Auth-Token,Content-Type,Accept'
        return {}

class Normalize(DataMiningWebService):
    @cherrypy.tools.accept(media='text/plain')
    def POST(self):
        print ("NORMALIZE")

        # get data from body of POST request
        cl = cherrypy.request.headers['Content-Length']
        rawbody = cherrypy.request.body.read(int(cl))
        data = json.loads(rawbody)

        # normalize csv
        handler = dsidata.CSVHandler()
        csvdata = data["csvdata"]
        valueIdxs = data["valueindexes"]
        norm_values = handler.GetNormalizedValues(csvdata, valueIdxs)
        norm_csv = handler.ConvertNPArrayToCSVString(norm_values)

        # return something to show we did work
        retobj = {"original_data":csvdata, "norm_data":norm_csv}
        print retobj
        return json.dumps(retobj)

class Kmeans(DataMiningWebService):
    @cherrypy.tools.accept(media='text/plain')
    def POST(self):
        print ("KMEANS")

        # get data from body of POST request
        cl = cherrypy.request.headers['Content-Length']
        rawbody = cherrypy.request.body.read(int(cl))
        data = json.loads(rawbody)

        # get values and normalize
        handler = dsidata.CSVHandler()
        csvdata = data["csvdata"]
        valueIdxs = data["valueindexes"]
        clusterCount = int(data["clustercount"])
        norm_values = handler.GetNormalizedValues(csvdata, valueIdxs)
        
        # do kmeans
        clusterer = dsidata.Clusterer()
        cluster_labels = clusterer.DoKmeansClustering(num_clusters=clusterCount, num_iterations=10, data=norm_values, valueFieldIndxs=valueIdxs)
        clustered_csv = handler.AppendColumnToCSV(csvdata,cluster_labels)

        # return something to show we did work
        retobj = {"original_data":csvdata, "clustered_data":clustered_csv}
        return json.dumps(retobj)

class SpearmanFeatureSelection(DataMiningWebService):
    @cherrypy.tools.accept(media='text/plain')
    def POST(self):
        print ("SPEARMAN FEATURE SELECTION")

        # get data from body of POST request
        cl = cherrypy.request.headers['Content-Length']
        rawbody = cherrypy.request.body.read(int(cl))
        data = json.loads(rawbody)

        # get values
        csvdata = data["csvdata"]
        valueIdxs = data["valueindexes"]
        dependantIdx = data["dependantindex"]
        
        # do spearman correlation
        handler = dsidata.CSVHandler()
        dataarray = handler.ConvertToNPArray(csvdata)
        headers = handler.GetHeaders(csvdata)
        
        selector = dsidata.FeatureSelector()
        sorted_features = selector.DoSpearmanCorrelation(data=dataarray, featureIndexes=valueIdxs, dependantIdx=dependantIdx)
        sorted_feature_names = map(lambda x: (headers[int(x[0])], x[1]), sorted_features)
                
        # return something to show we did work
        retobj = {"sorted_features":sorted_feature_names}
        return json.dumps(retobj)

class PCAFeatureSelection(DataMiningWebService):
    @cherrypy.tools.accept(media='text/plain')
    def POST(self):
        print ("PCA FEATURE SELECTION")

        # get data from body of POST request
        cl = cherrypy.request.headers['Content-Length']
        rawbody = cherrypy.request.body.read(int(cl))
        data = json.loads(rawbody)

        # get values
        csvdata = data["csvdata"]
        valueIdxs = data["valueindexes"]
        #convert this list to ints
        valueIdxs = map(lambda x: int(x), valueIdxs)
        
        # do PCA
        handler = dsidata.CSVHandler()
        dataarray = handler.ConvertToNPArray2(csvdata, valueIdxs)
        textcols = handler.GetTextCols(csvdata, valueIdxs)
        headers = []
        i = 0
        for idx in valueIdxs:
            headers.append("FEATURE " + str(i))
            i+=1
        
        selector = dsidata.FeatureSelector()
        pca_rslt = selector.DoPCA(data=dataarray)
        
        # add headers
        #psa_csv = "\n".join([",".join(headers), handler.ConvertNPArrayToCSVString(pca_rslt)])
        psa_rslt = numpy.row_stack([headers, pca_rslt])
        # comment this out for now so we are only returned PCA features
        #psa_rslt = numpy.column_stack([psa_rslt, textcols])

        psa_csv = handler.ConvertNPArrayToCSVString(psa_rslt)

        retobj = {"pca_features":psa_csv}
        return json.dumps(retobj)

class UploadRaster(DataMiningWebService):
    @cherrypy.tools.accept(media='image/tiff')
    def POST(self):
        print ("UPLOAD RASTER")

        destination = os.path.join('c:/CherryPyData')                
        with open(destination, 'wb') as f:
          shutil.copyfileobj(cherrypy.request.body, f)

        return 'Okay'

        return "success"

class Root(object):
    pass

class MyService(win32serviceutil.ServiceFramework):
    """NT Service."""
    
    _svc_name_ = "CherryPyService"
    _svc_display_name_ = "CherryPy Service"

    def SvcDoRun(self):
        root = Root()

        root.kmeans = Kmeans()
        root.normalize = Normalize()
        root.spearman = SpearmanFeatureSelection()
        root.pca = PCAFeatureSelection()
        root.raster = UploadRaster()

        cherrypy.tools.CORS = cherrypy.Tool('before_finalize', CORS)
        conf = {
             '/': {
                 'request.dispatch': cherrypy.dispatch.MethodDispatcher(),
                 'tools.sessions.on': True,
                 'tools.CORS.on': True,
                 'server.socket_host': '35.9.24.58',
                 'server.socket_port': 80,
                 'tools.response_headers.on': True,
                 'tools.response_headers.headers': [('Content-Type', 'text/plain')],
             }
        }
        
        # in practice, you will want to specify a value for
        # log.error_file below or in your config file.  If you
        # use a config file, be sure to use an absolute path to
        # it, as you can't be assured what path your service
        # will run in.
        cherrypy.config.update({
            'global':{
                'log.screen': True,
                'engine.autoreload.on': False,
                'engine.SIGHUP': None,
                'engine.SIGTERM': None,
                'server.socket_host': '35.9.24.58',
                'server.socket_port': 80,
                'log.error_file': 'C:\\web\\log.txt'
                }
            })

        cherrypy.quickstart(root, '/', conf)
                
    def SvcStop(self):
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        cherrypy.engine.exit()
        
        self.ReportServiceStatus(win32service.SERVICE_STOPPED) 
        # very important for use with py2exe
        # otherwise the Service Controller never knows that it is stopped !

def CORS():
    cherrypy.response.headers["Access-Control-Allow-Origin"] = "*"

if __name__ == '__main__':
    win32serviceutil.HandleCommandLine(MyService)
