
# Esri start of added imports
import sys, os, arcpy
# Esri end of added imports

# Esri start of added variables
g_ESRI_variable_1 = u'VALUE'
# Esri end of added variables

import arcpy
import os
from arcpy import env
from arcpy.sa import *

try:
    # Check out 3D License
    arcpy.CheckOutExtension("3D")

     # Get parameters
    features = arcpy.GetParameter(0)
    cell_size = arcpy.GetParameter(1)
    power = arcpy.GetParameter(2)

    arcpy.AddMessage("CELL SIZE: " + str(cell_size))
    arcpy.AddMessage("POWER: " + str(power))

    # Do IDW Interpolation
    out_raster_name = arcpy.CreateUniqueName("output.tif", arcpy.env.scratchFolder)
    if cell_size > 0 and power != 0:
        arcpy.Idw_3d(features, g_ESRI_variable_1, out_raster_name, cell_size, power)
    elif cell_size > 0:
        arcpy.Idw_3d(features, g_ESRI_variable_1, out_raster_name, cell_size=cell_size)
    elif power != 0:
        arcpy.Idw_3d(features, g_ESRI_variable_1, out_raster_name, power=power)
    else:
        arcpy.Idw_3d(features, g_ESRI_variable_1, out_raster_name)
    
    # Write raster as result
    arcpy.SetParameter(3, out_raster_name)
    
except Exception as e:
    arcpy.AddError(str(e))

finally:
    arcpy.Delete_management('in_memory')
    
