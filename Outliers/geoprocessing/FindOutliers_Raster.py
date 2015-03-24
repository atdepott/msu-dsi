import arcpy
import os
from arcpy import env
from arcpy.sa import *

try:
    # Get parameters
    raster_loc = arcpy.GetParameter(0)
    
    # save raster cellsize
    cellsize = arcpy.GetRasterProperties_management(raster_loc, 'CELLSIZEX')

    # convert raster to points
    arcpy.AddMessage('Converting to points: ' + str(raster_loc))
    in_point_mem = 'in_memory\\raster_points'
    arcpy.RasterToPoint_conversion(raster_loc, in_point_mem, "VALUE")
    arcpy.AddMessage('Conversion to points complete')

    # Do outlier
    out_features = 'in_memory\\out_group'
    arcpy.AddMessage('Output directory: ' + out_features)
    result = arcpy.ClustersOutliers_stats(Input_Feature_Class=in_point_mem, 
                                 Input_Field='grid_code',
                                 Output_Feature_Class=out_features)
    arcpy.AddMessage('Outlier analysis complete')

    # add field to use for classification
    arcpy.AddField_management(out_features, 'ISOUTLIER', 'SHORT')    
    codeblock = '''
def getClass(cotype):
    if cotype == 'HL' or cotype == 'LH':
        return 1
    else:
        return 0
    '''
    arcpy.CalculateField_management(out_features, 'ISOUTLIER', "getClass(!COType!)",'PYTHON_9.3', codeblock)
    arcpy.AddMessage('Classification field added')

    # convert clustered points to a raster
    arcpy.AddMessage('Converting to raster using field ' + result[2])
    out_rastername = arcpy.CreateUniqueName("output.tif", arcpy.env.scratchFolder)
    arcpy.PointToRaster_conversion(out_features, "ISOUTLIER", out_rastername, cellsize=cellsize)
    arcpy.AddMessage('Conversion to raster complete: ' + out_rastername)

    # set output parameter
    arcpy.SetParameter(1, out_rastername)
    
except Exception as e:
    arcpy.AddError(str(e))

finally:
    arcpy.Delete_management('in_memory')
    