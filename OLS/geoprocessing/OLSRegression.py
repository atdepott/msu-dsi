import arcpy
import os
from arcpy import env
from arcpy.sa import *

try:
     # Get parameters
    features = arcpy.GetParameter(0)
    num_variables = arcpy.GetParameter(1)

    features_mem = 'in_memory\\input'
    arcpy.CopyFeatures_management(features,features_mem)
        
    # create fields for each variable
    ex_variables = []
    for i in range(1,num_variables+1):
        ex_variables.append("X"+str(i))
    arcpy.AddMessage("Using fields " + ';'.join(ex_variables))

    # add unique field
    arcpy.AddField_management(features_mem, 'UNIQUE_ID', 'SHORT')    
    arcpy.CalculateField_management(features_mem, 'UNIQUE_ID', '!OBJECTID!','PYTHON_9.3')
    arcpy.AddMessage('Unique field added')

    # Make a feature layer from input feature set
    feature_layer = "features"
    arcpy.MakeFeatureLayer_management(features_mem, feature_layer)
    arcpy.AddMessage('Created feature layer from points')

    # troubleshooting:
    count_result = arcpy.GetCount_management(feature_layer)
    arcpy.AddMessage(str(count_result.getOutput(0)) + " features found in layer.")
    desc = arcpy.Describe(feature_layer)
    fieldInfo = desc.fieldInfo
    fieldName = fieldInfo.exportToString()
    arcpy.AddMessage(fieldName)

    # tables that will store statistical information
    #out_coefficients_table = arcpy.CreateUniqueName('result_coefficients.dbf', arcpy.env.scratchWorkspace)
    #out_diagnostics_table = arcpy.CreateUniqueName('result_diagnostics.dbf', arcpy.env.scratchWorkspace)
    out_coefficients_table = 'result_coefficients.dbf'
    out_diagnostics_table = 'result_diagnostics.dbf'
    #out_coefficients_table = os.path.join('result_coefficients')
    #out_diagnostics_table = os.path.join('result_diagnostics')

    # Do OLS
    out_features = arcpy.CreateUniqueName('results', arcpy.env.scratchWorkspace)
    #out_features = os.path.join('in_memory','results')
    arcpy.AddMessage('Output: ' + out_features)
    arcpy.OrdinaryLeastSquares_stats(Input_Feature_Class=feature_layer,
                                     Unique_ID_Field='UNIQUE_ID', 
                                     Output_Feature_Class=out_features,
                                     Dependent_Variable='Y',
                                     Explanatory_Variables=';'.join(ex_variables),
                                     Coefficient_Output_Table=out_coefficients_table,
                                     Diagnostic_Output_Table=out_diagnostics_table)

    arcpy.AddMessage('OLS complete')
    
    # Write raster as result
    arcpy.SetParameter(2, out_features)
    arcpy.SetParameter(3, out_coefficients_table)
    arcpy.SetParameter(4, out_diagnostics_table)
    
except Exception as e:
    arcpy.AddError(str(e))

finally:
    arcpy.Delete_management('in_memory')
    