import arcpy
import sys
import os
from arcpy.sa import *

try:
     # Get parameters
    in_points = arcpy.GetParameter(0)
    num_clusters = arcpy.GetParameter(1)
    
    analysis_feature = 'VALUE'
    in_point_mem = 'in_memory\\esrisad'
    Spatial_Constraints = 'K_NEAREST_NEIGHBORS'
    
    out_group = os.path.join('out_group')
    out_group_features = arcpy.CreateUniqueName(out_group, arcpy.env.scratchWorkspace)
    
    arcpy.CopyFeatures_management(in_points,in_points_mem)

    # add unique field
    arcpy.AddField_management(in_point_mem, 'UNIQUE_ID', 'SHORT')    
    arcpy.CalculateField_management(in_point_mem, 'UNIQUE_ID', '!OBJECTID!','PYTHON_9.3')
    arcpy.AddMessage('Field added')
    
    # do knn cluster analysis
    arcpy.GroupingAnalysis_stats(in_point_mem, 'UNIQUE_ID', out_group_features, num_clusters, analysis_feature , Spatial_Constraints, Distance_Method='EUCLIDEAN', Number_of_Neighbors=8)
    arcpy.AddMessage('kNN Done')
 
    arcpy.SetParameter(2, out_group_features)
 
except Exception as e:
    arcpy.AddError(str(e))

finally:
    arcpy.Delete_management('in_memory')
    

