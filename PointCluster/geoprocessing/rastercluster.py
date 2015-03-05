import arcpy
import sys
import os
from arcpy.sa import *
from arcpy import env

try:
     # Get parameters
    raster_loc = arcpy.GetParameter(0)
    num_clusters = arcpy.GetParameter(1)
    
    # convert raster to points
    arcpy.AddMessage('Converting to points: ' + raster_loc)
    #in_point_mem = 'in_memory\\raster_points'
    in_point_mem = 'C:\\data\\temp.gdb\\raster_points'
    arcpy.RasterToPoint_conversion(raster_loc, in_point_mem, "VALUE")
    arcpy.AddMessage('Conversion complete')

    # add unique field
    #arcpy.AddField_management(in_point_mem, 'UNIQUE_ID', 'SHORT')    
    #arcpy.CalculateField_management(in_point_mem, 'UNIQUE_ID', '!OBJECTID!','PYTHON_9.3')
    #arcpy.AddMessage('Unique field added')
    
    # do knn cluster analysis
    out_group_features = arcpy.CreateUniqueName(os.path.join('out_group'), arcpy.env.scratchWorkspace)
    arcpy.GroupingAnalysis_stats(Input_Features=in_point_mem, 
                                 Unique_ID_Field='OBJECTID', 
                                 Output_Feature_Class=out_group_features, 
                                 Number_of_Groups=num_clusters, 
                                 Analysis_Fields="grid_code", 
                                 Spatial_Constraints='K_NEAREST_NEIGHBORS', 
                                 Distance_Method='EUCLIDEAN', 
                                 Number_of_Neighbors=8)
    arcpy.AddMessage('kNN Done')
 
    arcpy.SetParameter(2, out_group_features)
 
except Exception as e:
    arcpy.AddError(str(e))

finally:
    arcpy.Delete_management('in_memory')
    

