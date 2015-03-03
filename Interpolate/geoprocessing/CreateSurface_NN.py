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

    arcpy.AddMessage("CELL SIZE: " + str(cell_size))

    # Do IDW Interpolation
    out_raster_name = arcpy.CreateUniqueName("output.tif", arcpy.env.scratchFolder)
    if cell_size > 0:
        arcpy.NaturalNeighbor_3d(features, "VALUE", out_raster_name, cell_size)
    else:
        arcpy.NaturalNeighbor_3d(features, "VALUE", out_raster_name)
    
    # Write raster as result
    arcpy.SetParameter(2, out_raster_name)
    
except Exception as e:
    arcpy.AddError(str(e))

finally:
    arcpy.Delete_management('in_memory')
    

