require([
    "esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/dijit/Legend",
    "esri/dijit/Scalebar",
    "esri/dijit/BasemapToggle",
    "esri/dijit/Popup",
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
    Legend,
    Scalebar,
    BasemapToggle,
    Popup,
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

    var popup = Popup({
        titleInBody: false
    }, "popupDiv");
    popup.setTitle("VALUE");
    popup.resize(100, 100);

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

    var rasterIdentify = new RasterIdentify(map);

    // add the drawing toolbar (for polygon selections)
    var currentProdValue;
    var studyArea;
    var toolbar = new Draw(map);
    toolbar.on("draw-end", function (evt) {
        var graphic = new Graphic(evt.geometry, new SimpleFillSymbol());
        map.graphics.add(graphic);

        studyArea = evt.geometry;

        productionTools.calculateProduction([evt.geometry], $("#cropLayerInput").val(), function (result) {
            pixelCount = result.pixelCount;
            productionValue = result.productionValue;
            $("#pixelCount").html(result.pixelCount);
            $("#prodValue").html(result.productionValue + " mt");
            currentProdValue = result.productionValue;

            currentstep = "STEP2";
        });

        toolbar.deactivate();

		rasterIdentify.resume();
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
            layer.setVisibleLayers([cropLayers[crop].index]);
            layer.show();
            currentstep = "STEP1";
            rasterIdentify.start(layer.url, [cropLayers[crop].index]);
        } else {
            layer.setVisibleLayers([-1]);
            currentstep = "INIT";
            rasterIdentify.stop();
        }
        legend.refresh();
    });

    $("#polygonButton").button().click(function () {
        if (currentstep == "STEP1") {
			rasterIdentify.pause();
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
                rasterIdentify.pause();

                var distanceVal = parseFloat($("#bufferDistanceInput").val());

                if (distanceVal > 0) {
                    map.setMapCursor("crosshair");
                    mapClick = map.on("click", function (evt) {
						rasterIdentify.resume();
                        map.setMapCursor("default");
                        mapClick.remove();

                        geometryOps.bufferFeature(evt.mapPoint, distanceVal, $("#bufferUnitInput").val(), function (geometries) {
                            studyArea = geometries[0];
                            productionTools.calculateProduction(geometries, $("#cropLayerInput").val(), function (result) {
                                pixelCount = result.pixelCount;
                                productionValue = result.productionValue;
                                $("#pixelCount").html(result.pixelCount);
                                $("#prodValue").html(result.productionValue + " mt");
                                currentProdValue = result.productionValue;

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

    var increaseProductionValue;
    $("#increaseProdButton").button().click(function () {
        if (currentstep == "STEP2") {
            increaseValue = productionTools.calculateIncreasedProduction(parseFloat($("#prodIncreaseValue").val().replace(/,/g, '')), productionValue);
            $("#increaseProdValue").html(increaseValue + " mt");
            increaseProductionValue = increaseValue;
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
        studyArea = null;
        map.infoWindow.hide();
        rasterIdentify.stop();
    });

    var currentStorageCapacity;
    var currentUtilizationPercent;
    var bigSiloCap;
    var smallSiloCap;
    $("#calcStorageButton").button().click(function () {
        if (currentstep == "STEP3") {
            currentUtilizationPercent = parseFloat($("#currentStorageUtil").val());
            bigSiloCap = parseFloat($("#bigStorageCapValue").val().replace(/,/g,''));
            smallSiloCap = parseFloat($("#smallStorageCapValue").val().replace(/,/g, ''));
            result = productionTools.calculateCurrentStorage(
                parseInt($("#bigStorageCountValue").val().replace(/,/g, '')),
                bigSiloCap,
                parseInt($("#smallStorageCountValue").val().replace(/,/g, '')),
                smallSiloCap,
                currentUtilizationPercent, currentProdValue);
            $("#totalCurrentCapacityValue").html(result.currentCapacity + " mt");
            $("#totalCurrentUtilizationValue").html(result.currentUtilization + " mt");
            currentStorageCapacity = result.currentCapacity;
            currentstep = "STEP4";
        } else {
            alert("Please wait until future production has been calculated.");
        }
    });

    $("#calcMktOppButton").button().click(function () {
        if (currentstep == "STEP4") {
            result = productionTools.calculateMarketOpportunity(
                increaseProductionValue,
                currentUtilizationPercent,
                parseFloat($("#futureStorageUtil").val().replace(/,/g, '')),
                currentStorageCapacity);
            $("#futureCapacityValue").html(result.futureCapacity + " mt");
            $("#marketOpportunityValue").html(result.marketOpportunity + " mt");
            currentstep = "STEP5";

            
            var infoWindowContent = "Total storage requirement: " + result.marketOpportunity + " mt<br/>";

            if (result.marketOpportunity >= 0) {
                var bigSiloCount = Math.ceil(result.marketOpportunity / bigSiloCap);
                var smallSiloCount = Math.ceil(result.marketOpportunity / smallSiloCap);
                infoWindowContent = infoWindowContent + "<br/>" + 
                    bigSiloCount + " big silos" + " OR " +
                    smallSiloCount + " small silos";
            } else {
                infoWindowContent = infoWindowContent + "<br/>" +
                    "0 big silos" + " OR " +
                    "0 small silos";
            }
            map.infoWindow.setContent(infoWindowContent);
            map.infoWindow.show(studyArea.getCentroid());
        } else {
            alert("Please wait until current storage capacity has been calculated.");
        }
    });
});



