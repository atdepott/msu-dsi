define([], function () {
    var configOptions = {
        "title": "Urban Agriculture/Food Security Article Tracker",
        "editurl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/UrbanFoodArticles/UrbanFoodArticles_Edit/FeatureServer/0",
        "readurl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/UrbanFoodArticles/UrbanFoodArticles_ReadOnly/MapServer/0",
        "geometryserviceurl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer"
    };
    return configOptions;
});