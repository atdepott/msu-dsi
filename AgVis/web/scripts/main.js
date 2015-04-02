require([
    "esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/dijit/Popup",
    "esri/dijit/Legend",
    "esri/dijit/Scalebar",
    "esri/dijit/BasemapToggle",
    "esri/toolbars/draw",
    "esri/graphic",
    "esri/symbols/SimpleFillSymbol",
    "dojo/parser", "dojo/on",
    "appConfig/defaults",
    "app/GeometryOperations", "app/ProductionTools",
    "app/RasterIdentify",
    "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer", "dojo/domReady!"
], function (
    Map,
    ArcGISDynamicMapServiceLayer,
    Popup,
    Legend,
    Scalebar,
    BasemapToggle,
    Draw, Graphic,
    SimpleFillSymbol,
    parser,on,
    config, 
    GeometryOperations, ProductionTools,
    RasterIdentify
) {
    // call this here to ensure that map fills entire content pane
    parser.parse();

    // set application title
    document.title = config.title;
    $("#title").empty();
    $("#title").append(config.title);

    // populate drop-down
    $.each(cropLayers, function (key, obj) {
        $("#cropLayerInput").append("<option value='"+key+"'>"+obj.title+"</option>");
    });

    var popup = new Popup({}, "popup");
    popup.resize(100, 100);
    popup.setTitle("VALUE");

    var map = new Map("map", {
        basemap: "topo",
        center: [36.8167, -1.2833],
        zoom: 8,
        infoWindow: popup
    });

    var toggle = new BasemapToggle({
        map: map,
        basemap: "satellite"
    }, "BasemapToggle");
    toggle.startup();

    var scalebar = new Scalebar({
        map: map,
        scalebarUnit: "dual"
    });
    
    var geometryOps = new GeometryOperations(map, config.geometryServiceURL);
    var productionTools = new ProductionTools(map, config.cropStatsUrl);
    var rasterIdentify = new RasterIdentify(map);

    var layer = new ArcGISDynamicMapServiceLayer(config.cropsUrl, {
        mode: ArcGISDynamicMapServiceLayer.MODE_ONDEMAND,
        id: "crops",
        opacity: ".8",
        visible: false
    });

    map.on("layers-add-result", function (evt) {
        // Add the legend
        legend = new Legend({
            map: map,
            layerInfos: [{layer: layer}]
        }, "legendDiv");
        legend.startup();
    });

    map.addLayers([layer]);

    // add the drawing toolbar (for polygon selections)
    var toolbar = new Draw(map);
    toolbar.on("draw-end", function (evt) {
        var graphic = new Graphic(evt.geometry, new SimpleFillSymbol());
        map.graphics.add(graphic);

        productionTools.calculateProduction([evt.geometry], $("#cropLayerInput").val(), function (result) {
            pixelCount = result.pixelCount;
            productionValue = result.productionValue;
            $("#pixelCount").html(result.pixelCount);
            $("#prodValue").html(result.productionValue + " mt");

            currentstep = "STEP2";
        });

        toolbar.deactivate();
    });


    // Setup all the UI stuff
    var pixelCount;
    var productionValue;
    var increaseValue;
    
    var currentstep = "INIT";


    $("#metadataButton").button().click(function () {
        $("#metadataContent").slideToggle();
    });

    $("#cropLayerInput").change(function () {
        var crop = $('#cropLayerInput').val();
        var layer = map.getLayer("crops");
        if (crop != -1) {
            var idx = cropLayers[crop].index;
            layer.setVisibleLayers([idx]);
            layer.show();
            currentstep = "STEP1";
            rasterIdentify.start(layer.url, [idx]);
        } else {
            layer.setVisibleLayers([-1]);
            currentstep = "INIT";
            rasterIdentify.stop();
        }
        legend.refresh();
    });

    $("#polygonButton").button().click(function () {
        if (currentstep == "STEP1") {
            rasterIdentify.stop();
            toolbar.activate(Draw.POLYGON);
        } else if (currentstep == "INIT") {
            alert("Please select a crop.");
        } else {
            alert("To choose another area, please clear and restart your analysis.");
        }
    });

    $("#bufferButton").button().click(function () {
        if (currentstep == "STEP1") {
            $("#bufferDialog").dialog("open");
        } else if (currentstep == "INIT") {
            alert("Please select a crop.");
        } else {
            alert("To choose another area, please clear and restart your analysis.");
        }
    });

    $("#bufferDialog").dialog({
        autoOpen: false,
        height: 250,
        width: 350,
        modal: true,
        dialogClass: 'dialogClass',
        buttons: {
            "Choose Point": function () {
                var distanceVal = parseFloat($("#bufferDistanceInput").val());

                if (distanceVal > 0) {
                    rasterIdentify.stop();
                    map.setMapCursor("crosshair");
                    mapClick = map.on("click", function (evt) {
                        map.setMapCursor("default");
                        mapClick.remove();

                        geometryOps.bufferFeature(evt.mapPoint, distanceVal, $("#bufferUnitInput").val(), function (geometries) {
                            productionTools.calculateProduction(geometries, $("#cropLayerInput").val(), function (result) {
                                pixelCount = result.pixelCount;
                                productionValue = result.productionValue;
                                $("#pixelCount").html(result.pixelCount);
                                $("#prodValue").html(result.productionValue + " mt");

                                currentstep = "STEP2";
                            });
                        });
                    });

                    $(this).dialog("close");
                }
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

    $("#prodIncreaseSlider").slider({
        min: 0,
        max: 100,
        step: 0.1,
        value: 5,
        change: function (evt, ui) {
            $("#prodIncreaseValue").val(ui.value);
        }
    });

    $("#increaseProdButton").button().click(function () {
        if (currentstep == "STEP2") {
            increaseValue = productionTools.calculateIncreasedProduction(parseFloat($("#prodIncreaseValue").val()), productionValue);
            $("#increaseProdValue").html(increaseValue + " mt");
            currentstep = "STEP3";
        } else {
            alert("Please wait until current production has been calculated.");
        } 
    });

    $("#clearButton").button().click(function () {
        map.graphics.clear();
        $('#cropLayerInput').val(-1).trigger('change');;
        $("#pixelCount").empty();
        $("#prodValue").empty();
        productionValue = 0;
        $("#increaseProdValue").empty();
        toolbar.deactivate();
        map.setMapCursor("default");
        if (typeof mapClick != "undefined") {
            mapClick.remove();
        }
        currentstep = "INIT";
        rasterIdentify.stop();
    });
});



