import os
import arcpy
from arcpy import env
from arcpy.sa import *

debug = True
malawi_features = os.path.join('C:\data\Temp.gdb\malawi_poly')

# Set this to the folder containing all rasters
#workspace = "C:\data\AgVis"
workspace = "C:\AgVis\Production"

out_dir = "C:\AgVis\ProductionMalawi"



try:
    # Check out Spatial Analyst License
    arcpy.CheckOutExtension("Spatial")

    env.workspace = workspace

    feature_layer = arcpy.MakeFeatureLayer_management(malawi_features,'in_memory\features')
    crop_raster = "BANP_R.asc"

    # Extract only the area under the feature layer
    out_raster = ExtractByMask(crop_raster,feature_layer)
    
    out_raster.save(os.path.join(out_dir, crop_raster))

except Exception as e:
    print "ERROR"
    arcpy.AddError(str(e))

finally:    
    arcpy.Delete_management('in_memory')

    


