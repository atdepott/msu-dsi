import arcpy
import os
from arcpy import env
from arcpy.sa import *

try:
     # Get parameters
    features = arcpy.GetParameter(0)
    
    # Do outlier
    out_features = arcpy.CreateUniqueName('results', arcpy.env.scratchWorkspace)
    arcpy.AddMessage('Output directory: ' + out_features)
    arcpy.HotSpots_stats(Input_Feature_Class=features, 
                        Input_Field='VALUE',
                        Output_Feature_Class=out_features)
    arcpy.AddMessage('Outlier analysis complete')
    
    # Write raster as result
    arcpy.SetParameter(1, out_features)
    
except Exception as e:
    arcpy.AddError(str(e))

finally:
    arcpy.Delete_management('in_memory')
    