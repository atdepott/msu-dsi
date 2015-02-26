
# Esri start of added imports
import sys, os, arcpy
# Esri end of added imports

# Esri start of added variables
g_ESRI_variable_1 = u'VALUE'
g_ESRI_variable_2 = u'in_memory\\esrisad'
g_ESRI_variable_3 = u'out_group'
g_ESRI_variable_4 = u'UNIQUE_ID'
g_ESRI_variable_5 = u'!OBJECTID!'
# Esri end of added variables

import arcpy
import os
from arcpy import env
from arcpy.sa import *


try:

     # Get parameters
    in_point = arcpy.GetParameter(0)
    num_clusters = arcpy.GetParameter(1)
    
    analysis_feature = g_ESRI_variable_1
    in_point_mem = g_ESRI_variable_2
    Spatial_Constraints = 'K_NEAREST_NEIGHBORS'
    
    out_group = os.path.join(g_ESRI_variable_3)
    out_group_features = arcpy.CreateUniqueName(out_group, arcpy.env.scratchWorkspace)
    
    arcpy.CopyFeatures_management(in_point,in_point_mem)
    arcpy.AddField_management(in_point_mem, 'UNIQUE_ID', 'SHORT')    
    arcpy.CalculateField_management(in_point_mem, g_ESRI_variable_4, g_ESRI_variable_5,'PYTHON_9.3')
    arcpy.AddMessage('Field added')
    arcpy.GroupingAnalysis_stats(in_point_mem, g_ESRI_variable_4, out_group_features, num_clusters, analysis_feature , Spatial_Constraints, Distance_Method='EUCLIDEAN', Number_of_Neighbors=8)
    arcpy.AddMessage('kNN Done')
 
    arcpy.SetParameter(2, out_group_features)
 
except Exception as e:
    arcpy.AddError(str(e))

finally:
    arcpy.Delete_management('in_memory')
    

