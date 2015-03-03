import os
import arcpy
from arcpy import env
from arcpy.sa import *

debug = False
# note: we're using os.path.join as a workaround for broken data source errors
debug_features = os.path.join('C:\data\Temp.gdb\small')

# Set this to the folder containing all rasters
#workspace = "C:\data\AgVis"
workspace = "C:\AgVis\ProductionMalawi"

# Temp data items - all should be deleted after script runs
raster_table = os.path.join('rastertable.dbf')
raster_table_view = 'in_memory\rastertable'
out_raster = ''
stats_table = 'statstable.dbf'

try:
    # Check out Spatial Analyst License
    arcpy.CheckOutExtension("Spatial")

    env.workspace = workspace
    
    # Get parameters
    if not debug:
        feature_layer = arcpy.GetParameter(0)
        crop_type = arcpy.GetParameterAsText(1)
        crop_raster = crop_type+".asc"
    else:
        feature_layer = arcpy.MakeFeatureLayer_management(debug_features,'in_memory\features')
        crop_raster = "MAIZ_H.asc"

    # Extract only the area under the feature layer
    out_raster = ExtractByMask(crop_raster,feature_layer)
    
    # Convert raster to a table
    Sample(out_raster,out_raster,raster_table)
    
    # Select only rows with a value greater than 0
    arcpy.MakeTableView_management(raster_table,raster_table_view,'"Extract__1" > 0')
    
    # Get count
    result = arcpy.GetCount_management(raster_table_view)
    count = int(result.getOutput(0))
    
    arcpy.SetParameterAsText(2, count)

    # Get sum
    #arcpy.Statistics_analysis(raster_table_view, stats_table, [["Extract__1", "MEAN"]])
    #sc = arcpy.SearchCursor(stats_table, ["MEAN_Extra"])
    arcpy.Statistics_analysis(raster_table_view, stats_table, [["Extract__1", "SUM"]])
    sc = arcpy.SearchCursor(stats_table, ["SUM_Extrac"])
    x = 0
    for row in sc:
        if x != 0:
            raise Exception("Stats search cursor has multiple rows");
        x = x + row.getValue("SUM_Extrac")
    
    arcpy.SetParameterAsText(3, x)

    if debug:
        print "COUNT: " + str(count)
        print "SUM: " + str(x)

except Exception as e:
    print "ERROR"
    arcpy.AddError(str(e))

finally:
    try:
        arcpy.Delete_management(out_raster)
    except Exception as e:
        print e
        pass
    try:
        arcpy.Delete_management(raster_table)
    except Exception as e:
        print e
        pass
    try:
        arcpy.Delete_management(stats_table)
    except Exception as e:
        print e
        pass
    
    arcpy.Delete_management('in_memory')

    


