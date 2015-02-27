import csv
import operator
import StringIO
from scipy import stats
import numpy
from scipy.cluster.vq import kmeans2
from sklearn import decomposition

class CSVHandler():
    def GetRowCount(self, csvstring):
        reader = csv.reader(StringIO.StringIO(csvstring), delimiter = ',')
        return sum(1 for row in reader)

    def ConvertToNPArray(self, csvstring):
        return numpy.genfromtxt(StringIO.StringIO(csvstring), delimiter=',', skip_header=1)

    def ConvertToNPArray2(self, csvstring, valFieldIdxs):
        return numpy.genfromtxt(StringIO.StringIO(csvstring), delimiter=',', skip_header=1, usecols=valFieldIdxs, comments=None)

    def GetTextCols(self, csvstring, valFieldIdxs):
        
        cols = []
        txtIdxs = []
        reader = csv.reader(StringIO.StringIO(csvstring), delimiter = ',')
        for row in reader:
            if len(txtIdxs) == 0:
                for i in range(0,len(row)):
                    if i not in valFieldIdxs:
                        txtIdxs.append(i)
            content = list(row[i] for i in txtIdxs)
            cols.append(content)
        return cols
        
    def GetHeaders(self, csvstring):
        incsv = StringIO.StringIO(csvstring)
        reader = csv.reader(incsv, delimiter=',')
        return reader.next()

    def AppendColumnToCSV(self, csvstring, nparray):
        print nparray
        incsv = StringIO.StringIO(csvstring)
        outcsv = StringIO.StringIO()
        reader = csv.reader(incsv, delimiter=',')
        writer = csv.writer(outcsv)
        for row in reader:
            print reader.line_num
            # reader line_num is 1-based
            if reader.line_num > 1:
                row.append(nparray[reader.line_num - 2])
            else:
                row.append("Cluster ID")
            writer.writerow(row)
        return outcsv.getvalue()

    def ConvertNPArrayToCSVString(self, data):
        s = StringIO.StringIO()
        numpy.savetxt(s, data, delimiter=',', fmt="%s")
        return s.getvalue()

    def GetNormalizedValues(self, csvstring, valueFieldIdxs):
        data = self.ConvertToNPArray(csvstring)
        for valueFieldIdx in valueFieldIdxs:
            norm_col = stats.zscore(data[:,valueFieldIdx])
            data[:,valueFieldIdx] = norm_col
        return data

class Clusterer():
    def DoKmeansClustering(self, num_clusters, num_iterations, data, valueFieldIndxs):
        centroid, label = kmeans2(data[:,valueFieldIndxs], num_clusters)
        return label
        
class FeatureSelector():
    def DoSpearmanCorrelation(self, data, featureIndexes, dependantIdx):
        feature_corr = []
        for idx in featureIndexes:
            correlation = stats.spearmanr(data[:,int(idx)],data[:,int(dependantIdx)])
            feature_corr.append((idx, correlation[0]))
        sorted_feature_corr = sorted(feature_corr, key=lambda x: abs(x[1]), reverse=True)
        return sorted_feature_corr

    def DoPCA(self, data):
        # first standardize data
        norm_data = stats.zscore(data)
        # do pca
        pca = decomposition.PCA()
        pca.fit(norm_data)
        data = pca.transform(norm_data)
        return data
    