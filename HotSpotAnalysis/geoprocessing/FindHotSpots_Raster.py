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
    
    # Do hot spot
    out_features = 'in_memory\\out_group'
    arcpy.AddMessage('Output directory: ' + out_features)
    arcpy.HotSpots_stats(Input_Feature_Class=in_point_mem, 
                        Input_Field='grid_code',
                        Output_Feature_Class=out_features)
    arcpy.AddMessage('Hot spot analysis complete')
    
    # add field to use for classification
    arcpy.AddField_management(out_features, 'COLOR', 'SHORT')    
    codeblock = '''
def getColor(pval, zscore):
    if pval <= 0.01 and zscore > 0:
        return 1
    elif pval <= 0.01 and zscore <= 0:
        return -1
    elif pval <= 0.05 and zscore > 0:
        return 2
    elif pval <= 0.05 and zscore <= 0:
        return -2
    elif pval <= 0.1 and zscore > 0:
        return 3
    elif pval <= 0.1 and zscore <= 0:
        return -3
    else:
	    return 0 
    '''
    arcpy.CalculateField_management(out_features, 'COLOR', "getColor(!GiPValue!,!GiZScore!)",'PYTHON_9.3', codeblock)
    arcpy.AddMessage('Classification field added')

    # convert clustered points to a raster
    arcpy.AddMessage('Converting to raster')
    out_rastername = arcpy.CreateUniqueName("output.tif", arcpy.env.scratchFolder)
    arcpy.PointToRaster_conversion(out_features, "COLOR", out_rastername, cellsize=cellsize)
    arcpy.AddMessage('Conversion to raster complete: ' + out_rastername)

    # set output parameter
    arcpy.SetParameter(1, out_rastername)
    
except Exception as e:
    arcpy.AddError(str(e))

finally:
    arcpy.Delete_management('in_memory')
    