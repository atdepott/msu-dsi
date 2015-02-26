define([], function () {
    var configOptions = {
        "title": "Surface Interpolation Tool - Spline",
        "interpolationType": "SPLINE", // options: IDW, NN, or SPLINE
        "interpolationHtml": "<p>\"The Spline tool uses an interpolation method that estimates values using a mathematical function that minimizes overall surface curvature, resulting in a smooth surface that passes exactly through the input points.\" -Esri, 2014. For more information, see the ArcGIS documentation <a href='http://resources.arcgis.com/en/help/main/10.2/index.html#/How_Spline_works/009z00000078000000/' target='_blank'>here</a>.</p>",
		"sampleFile":"files/Yearly_Precipitation.csv",
        "idwInterpolationToolGPUrl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/InterpolationSurface/CreateSurfaceIDW/GPServer/Create%20Surface%20IDW",
        "idwInterpolationToolMapUrl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/InterpolationSurface/CreateSurfaceIDW/MapServer/jobs",
        "nnInterpolationToolGPUrl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/InterpolationSurface/CreateSurfaceNN/GPServer/Create%20Surface%20NN",
        "nnInterpolationToolMapUrl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/InterpolationSurface/CreateSurfaceNN/MapServer/jobs",
        "splineInterpolationToolGPUrl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/InterpolationSurface/CreateSurfaceSpline/GPServer/Create%20Surface%20Spline",
        "splineInterpolationToolMapUrl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/InterpolationSurface/CreateSurfaceSpline/MapServer/jobs"
    };
    return configOptions;
});