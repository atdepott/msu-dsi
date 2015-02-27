define([], function () {
    var configOptions = {
        "geometryServiceURL": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer",
        "title": "Agricultural Storage Market Opportunities - Malawi",
        "cropsUrl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/AgVis/CropProductionMalawi/MapServer",
        "districtsUrl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/AgVis/MalawiDistricts/MapServer/0",
        "districtsSMEUrl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/AgVis/MalawiDistricts/MapServer/1",
        "districtsSMEMarketFnsUrl":"http://dsidb.cse.msu.edu:6080/arcgis/rest/services/AgVis/MalawiDistricts/FeatureServer/2",
        "cropStatsUrl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/AgVis/CropStatsMalawi/GPServer/Crop%20Statistics%20Malawi"
    };
    return configOptions;
});