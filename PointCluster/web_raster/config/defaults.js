define([], function () {
    var configOptions = {
        "title": "k Nearest Neighbor Clustering",
        "kNN_upload_url": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/knn_point_cluster/RasterCluster_kNN/GPServer/uploads/upload",
        "kNN_GP_url": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/knn_point_cluster/RasterCluster_kNN/GPServer/Raster%20kNN",
        "kNN_MapService_url": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/knn_point_cluster/RasterCluster_kNN/MapServer"
    };
    return configOptions;
});