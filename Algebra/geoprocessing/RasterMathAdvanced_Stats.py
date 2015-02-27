
# Esri start of added imports
import sys, os, arcpy
# Esri end of added imports

# Esri start of added variables
g_ESRI_variable_1 = u'C:\\Raster\\Data'
# Esri end of added variables

import os
import arcpy
import json
from arcpy import env
from arcpy.sa import *

def evalExpression(expr, aoi_layer):
    arcpy.AddMessage(expr)
    if expr.get("value_raster"):
        return ExtractByMask(expr.get("value_raster"),aoi_layer)
    elif expr.get("value"):
        return float(expr.get("value"))
    else:
        raster_1 = evalExpression(expr.get("left"), aoi_layer);
        raster_2 = evalExpression(expr.get("right"), aoi_layer);
        if expr.get("operator") == "ADD":
            return raster_1 + raster_2;
        elif expr.get("operator") == "SUBTRACT":
            return raster_1 - raster_2;
        elif expr.get("operator") == "MULTIPLY":
            return raster_1 * raster_2;
        elif expr.get("operator") == "DIVIDE":
            return raster_1 / raster_2;
        else:
            raise Exception("Operator " + expr.get("operator") + " not defined");


# Set this to the folder containing all rasters
workspace = g_ESRI_variable_1

out_raster_name = 'outputraster'

try:
    # Check out Spatial Analyst License
    arcpy.CheckOutExtension("Spatial")

    env.workspace = workspace
    
    # Get parameters
    aoi_layer = arcpy.GetParameter(0)
    expressionAsJSON = arcpy.GetParameterAsText(1)
    
    # Convert JSON string to expression object
    expression = json.loads(expressionAsJSON)

    # Evaluate expression and save result raster
    result_raster = evalExpression(expression, aoi_layer);
    name = arcpy.CreateUniqueName(out_raster_name, arcpy.env.scratchFolder)
    result_raster.save(name)
    arcpy.SetParameter(2, name)
    
    # Get statistics on result raster
    arcpy.CalculateStatistics_management(result_raster)
    arcpy.SetParameter(3, arcpy.GetRasterProperties_management(result_raster, "MINIMUM"))
    arcpy.SetParameter(4, arcpy.GetRasterProperties_management(result_raster, "MAXIMUM"))
    arcpy.SetParameter(5, arcpy.GetRasterProperties_management(result_raster, "MEAN"))
    arcpy.SetParameter(6, arcpy.GetRasterProperties_management(result_raster, "STD"))
    
except Exception as e:
    arcpy.AddError(str(e))

finally:
    arcpy.Delete_management('in_memory')
    




