define([], function () {
    var configOptions = {
        "geometryServiceURL": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer",
        "title": "Africa Crop Production Level",
        "cropsUrl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/AgVis/CropProduction/MapServer",
        "cropStatsUrl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/AgVis/CropStatsTool/GPServer/Crop%20Statistics"
    };
    return configOptions;
});