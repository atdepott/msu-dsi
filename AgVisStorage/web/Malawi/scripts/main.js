require([
    "esri/map",
    "esri/geometry/Extent",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/GraphicsLayer",
    "esri/dijit/Legend",
    "esri/dijit/Scalebar",
    "esri/dijit/BasemapToggle",
    "esri/dijit/Popup",
    "esri/tasks/RelationshipQuery",
    "esri/tasks/IdentifyParameters",
    "esri/tasks/IdentifyTask",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/toolbars/draw",
    "esri/graphic",
    "esri/symbols/SimpleFillSymbol",
    "dojo/parser", "dojo/on",
    "appConfig/defaults",
    "app/GeometryOperations", "app/ProductionTools",
    "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer", "dojo/domReady!"
], function (
    Map, Extent,
    ArcGISDynamicMapServiceLayer,
    FeatureLayer,
    GraphicsLayer,
    Legend,
    Scalebar,
    BasemapToggle,
    Popup,
    RelationshipQuery,
    IdentifyParameters,
    IdentifyTask,
    Query, QueryTask,
    Draw, Graphic,
    SimpleFillSymbol,
    parser,on,
    config, 
    GeometryOperations, ProductionTools
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
    popup.setTitle("Market Opportunity");
    popup.resize(300, 200);

    var map = new Map("map", {
        basemap: "topo",
        extent: new Extent({ "xmin": 3519772.2784747826, "ymin": -1985557.8385615079, "xmax": 4114146.6104201553, "ymax": -986373.0048179495, "spatialReference": { "wkid": 102100 } }),
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

    var districtsLayer = new FeatureLayer(config.districtsUrl, {
        id: "districts",
        visible: true,
        outFields: ["NAME_1"]
    });

    var highlightGraphicsLayer = new GraphicsLayer(); //TODO this gets cleared

    map.on("layers-add-result", function (evt) {
        // Add the legend
        legend = new Legend({
            map: map,
            layerInfos: [{layer: layer}]
        }, "legendDiv");
        legend.startup();

        highlightGraphicsLayer.on("mouse-out", function (evt) {
            highlightGraphicsLayer.clear();
            $("#mousetooltipDiv").hide();
        });
    });

    map.addLayers([layer, districtsLayer, highlightGraphicsLayer]);
    
    // districts highlight & mouse tooltip
    districtsLayer.on("mouse-over", function (evt) {
        var highlightGraphic = new Graphic(evt.graphic.geometry, 
            new SimpleFillSymbol({
                "type": "esriSFS",
                "style": "esriSFSSolid",
                "color": [0, 255, 255, 80],
                "outline": {
                    "type": "esriSLS",
                    "style": "esriSLSSolid",
                    "color": [0, 255, 255, 255],
                    "width": 3
                }
            }), evt.graphic.attributes);
        highlightGraphicsLayer.add(highlightGraphic);

        $("#mousetooltipDiv").html(evt.graphic.attributes.NAME_1);
        $("#mousetooltipDiv").show();
        $("#mousetooltipDiv").css({
            position: "absolute",
            top: evt.offsetY,
            left: evt.offsetX
        });
    });
    
    // add the drawing toolbar (for polygon selections)
    var currentProdValue;
    var studyArea;
    var toolbar = new Draw(map);
    toolbar.on("draw-end", onPolygonComplete);

    var pixelCount;
    var productionValue;
    var increaseValue;
    var increaseProductionValue;
    var currentStorageCapacity;
    var currentUtilizationPercent;
    var bigSiloCap;
    var smallSiloCap;
    var smes = [];
    var smeMarketFns = [];

    $("#metadataButton").button().click(function () {
        $("#metadataContent").slideToggle();
    });

    $("#cropLayerInput").change(function () {
        selectCrop($('#cropLayerInput').val());
        $("#selectedCrop").html($('#cropLayerInput option:selected').text());
    });

    $("#polygonButton").button().click(function () {
        toolbar.activate(Draw.POLYGON);
    });

    $("#bufferButton").button().click(function () {
        $("#bufferDialog").dialog("open");
    });

    $("#districtsButton").button().click(function () {
        selectDistrict();
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
                    selectPoint(distanceVal);
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
        calculateIncreasedProduction();
    });

    $("#calcStorageButton").button().click(function () {
        calculateStorage();
    });

    $("#calcMktOppButton").button().click(function () {
        calculateMarketOpportunity();
    });

    $("#clearButton").button().click(function () {
        map.graphics.clear();
        map.infoWindow.hide();

        // step 1
        $('#cropLayerInput').val(-1).trigger('change');;
        $("#step1div").show();
        $("#step1ResultDiv").hide();

        // step 2
        toolbar.deactivate();
        map.setMapCursor("default");
        if (typeof mapClick != "undefined") {
            mapClick.remove();
        }
        $("#pixelCount").empty();
        $("#prodValue").empty();
        productionValue = 0;
        $("#step2div").hide();
        $("#step2ResultDiv").hide();
        $("#districtSummaryDiv").hide();

        // step 3
        $("#increaseProdValue").empty();
        $("#step3div").hide();
        $("#step3ResultDiv").hide();

        // step 4
        $("#totalCurrentCapacityValue").empty();
        $("#totalCurrentUtilizationValue").empty();
        $("#step4div").hide();
        $("#step4ResultDiv").hide();

        // step 5
        $("#futureCapacityValue").empty();
        $("#marketOpportunityValue").empty();
        $("#step5div").hide();
        $("#step5ResultDiv").hide();

        // results
        $("#resultsDiv").hide();

        studyArea = null;
    });

    $("#districtSummaryDiv a").click(function () {
        $("#districtSummary").slideToggle();
    });

    // do query to get inputs for search SME functionality
    getSMESearchInputs();

    $("#searchSMEsButton").button().click(searchSMEs);
    $("#searchSMEsClearButton").button().click(clearSMESearch);

    function getSMESearchInputs() {
        var queryTask = new QueryTask(config.districtsSMEUrl);
        var query = new Query();
        query.returnGeometry = false;
        query.outFields = ["MSME_Name", "Market_Function___Main", "Trading_Centre", "MSME_Type", "District", "Groundnut", "Soybean"];
        query.where = "1=1";
        queryTask.execute(query, function (results) {
            var msmeNames = [];
            var tradingCenters = [];
            var sizes = [];
            smes = results.features;
            $.each(results.features, function (idx, result) {
                if ($.inArray(result.attributes.MSME_Name, msmeNames) === -1) {
                    msmeNames.push(result.attributes.MSME_Name);
                }
                if ($.inArray(result.attributes.Market_Function___Main, smeMarketFns) === -1) {
                    smeMarketFns.push(result.attributes.Market_Function___Main);
                }
                if ($.inArray(result.attributes.Trading_Centre, tradingCenters) === -1) {
                    tradingCenters.push(result.attributes.Trading_Centre);
                }
                if ($.inArray(result.attributes.MSME_Type, sizes) === -1) {
                    sizes.push(result.attributes.MSME_Type);
                }
            });

            msmeNames.sort();
            smeMarketFns.sort();
            tradingCenters.sort();
            sizes.sort();

            $("#smeSearchCompanyName").autocomplete({
                source: msmeNames,
                delay: 0
            });
            var marketSelect = $("#smeSearchMarketFn");
            $.each(smeMarketFns, function (idx, market) {
                $("<option/>").attr("value", market).text(market).appendTo(marketSelect);
            });
            var tradingSelect = $("#smeSearchTradingCenter");
            $.each(tradingCenters, function (idx, trading) {
                $("<option/>").attr("value", trading).text(trading).appendTo(tradingSelect);
            });
            var sizeSelect = $("#smeSearchSize");
            $.each(sizes, function (idx, size) {
                $("<option/>").attr("value", size).text(size).appendTo(sizeSelect);
            });
        });
    }

    function selectCrop(crop) {
        var layer = map.getLayer("crops");
        if (crop != -1) {
            layer.setVisibleLayers([cropLayers[crop].index]);
            layer.show();
            $("#step1div").hide();
            $("#step1ResultDiv").show();
            $("#step2div").show();
        } else {
            layer.setVisibleLayers([-1]);
        }
        legend.refresh();
    }

    function selectDistrict() {
        //var layer = map.getLayer("districts");

        map.setMapCursor("crosshair");

        // need to listen on highlight layer because it's masking the districts layer
        var listener = highlightGraphicsLayer.on("click", function (evt) {
            var districtName = evt.graphic.attributes.NAME_1;
            var districtObjectId = evt.graphic.attributes.OBJECTID_1;
            querySelectedDistrict(districtObjectId, districtName);

            var graphic = new Graphic(evt.graphic.geometry,
                new SimpleFillSymbol({
                    "type": "esriSFS",
                    "style": "esriSFSSolid",
                    "color": [255, 255, 0, 80],
                    "outline": {
                        "type": "esriSLS",
                        "style": "esriSLSSolid",
                        "color": [255, 255, 0, 255],
                        "width": 3
                    }
            }));
            map.graphics.add(graphic);

            // do calculation
            studyArea = evt.graphic.geometry;
            $("#busy").show();
            productionTools.calculateProduction([studyArea], $("#cropLayerInput").val(), onCalculateProductionResult);

            map.setMapCursor("default");
            listener.remove();
        });        
    }

    function querySelectedDistrict(districtObjectId, districtName) {
        var marketFnName = "Market_Function___Main";
        
        var marketFns = {};
        $.each(smeMarketFns, function (idx, result) {
            marketFns[result] = 0;
        });

        var relatedQuery = new RelationshipQuery();
        relatedQuery.outFields = [marketFnName];
        relatedQuery.relationshipId = 0;    //found in REST services directory
        relatedQuery.objectIds = [districtObjectId];
        var currentCrop = $('#cropLayerInput').val();
        if (currentCrop.indexOf("GROU") > -1) {
            relatedQuery.definitionExpression = "Groundnut = 1";
            console.log("GROUNDNUT");
        } else if (currentCrop.indexOf("SOYB") > -1) {
            relatedQuery.definitionExpression = "Soybean = 1";
            console.log("SOYBEAN");
        }
        var layer = map.getLayer("districts");
        layer.queryRelatedFeatures(relatedQuery, function (relatedRecords) {
            if (typeof relatedRecords[districtObjectId] != 'undefined') {
                $.each(relatedRecords[districtObjectId].features, function (idx, feature) {
                    var marketFn = feature.attributes[marketFnName];
                    marketFns[marketFn] = marketFns[marketFn] + 1;
                });

                var table = $("#districtSummary tbody");
                table.empty();
                $.each(marketFns, function (marketFn, count) {
                    var icon = getIcon(marketFn);
                    var row = $("<tr/>").appendTo(table);
                    $("<td/>").text(count).appendTo(row);
                    var iconSpot = $("<td/>").appendTo(row);
                    $("<img/>").attr("src", icon).appendTo(iconSpot);
                    $("<td/>").text(marketFn).appendTo(row);
                });
                $("#districtSummary").show();
                $("#districtSummaryNoData").hide();
            } else {
                $("#districtSummary").hide();
                $("#districtSummaryNoData").show();
            }

            $("#districtSummaryDiv").show();
        });
    }

    function getIcon(marketFn) {
        switch (marketFn) {
            case "Agri-input supplier":
                return "styles/images/Input_supplier.png";
            case "Animal feed & health":
                return "styles/images/Animal_health.png";
            case "Farming - dairy":
                return "styles/images/Farming_dairy.png";
            case "Farming - groundnut":
                return "styles/images/Farming_groundnut.png";
            case "Milk retail":
                return "styles/images/Milk_retail.png";
            case "Processor - Oil":
                return "styles/images/Processor_oil.png";
            case "Processor - animal feed":
                return "styles/images/Processor_animal feed.png";
            case "Processor - cheese":
                return "styles/images/Processor_cheese.png";
            case "Processor - rice":
                return "styles/images/Processor_rice1.png";
            case "Seed production":
                return "styles/images/seed_production.png";
            case "Supplier-Dairy animals":
                return "styles/images/Supplier_dairy_animal.png";
            case "Trader":
                return "styles/images/Trader.png";
            case "Transporter":
                return "styles/images/Transporter.png";
            default:
                return "";
        }
    }

    function onPolygonComplete(evt) {
        var graphic = new Graphic(evt.geometry, new SimpleFillSymbol());
        map.graphics.add(graphic);

        studyArea = evt.geometry;

        $("#busy").show();
        productionTools.calculateProduction([evt.geometry], $("#cropLayerInput").val(), onCalculateProductionResult);

        toolbar.deactivate();
    }

    function selectPoint(distanceVal) {
        map.setMapCursor("crosshair");
        mapClick = map.on("click", function (evt) {
            map.setMapCursor("default");
            mapClick.remove();

            $("#busy").show();
            geometryOps.bufferFeature(evt.mapPoint, distanceVal, $("#bufferUnitInput").val(), function (geometries) {
                studyArea = geometries[0];
                productionTools.calculateProduction(geometries, $("#cropLayerInput").val(), onCalculateProductionResult);
            });
        });
    }

    function onCalculateProductionResult(result) {
        pixelCount = result.pixelCount;
        productionValue = result.productionValue;
        $("#pixelCount").html(result.pixelCount);
        $("#prodValue").html(result.productionValue + " mt");
        currentProdValue = result.productionValue;

        $("#busy").hide();
        $("#resultsDiv").show();
        $("#step2div").hide();
        $("#step2ResultDiv").show();
        $("#step3div").show();
    }

    function calculateIncreasedProduction() {
        increaseValue = productionTools.calculateIncreasedProduction(parseFloat($("#prodIncreaseValue").val().replace(/,/g, '')), productionValue);
        $("#increaseProdValue").html(increaseValue + " mt");
        increaseProductionValue = increaseValue;

        $("#step3div").hide();
        $("#step3ResultDiv").show();
        $("#step4div").show();
    }

    function calculateStorage() {
        currentUtilizationPercent = parseFloat($("#currentStorageUtil").val());
        bigSiloCap = parseFloat($("#bigStorageCapValue").val().replace(/,/g, ''));
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
        console.log(currentStorageCapacity);

        $("#step4div").hide();
        $("#step5div").show();
        $("#step4ResultDiv").show();
    }

    function calculateMarketOpportunity() {
        result = productionTools.calculateMarketOpportunity(
                increaseProductionValue,
                currentUtilizationPercent,
                parseFloat($("#futureStorageUtil").val().replace(/,/g, '')),
                currentStorageCapacity);
        $("#futureCapacityValue").html(result.futureCapacity + " mt");
        $("#marketOpportunityValue").html(result.marketOpportunity + " mt");
        
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

        $("#step5div").hide();
        $("#step5ResultDiv").show();
    }

    function searchSMEs() {
        var companyName = $("#smeSearchCompanyName").val();
        var size = $("#smeSearchSize").val();
        var tradingCenter = $("#smeSearchTradingCenter").val();
        var marketFunction = $("#smeSearchMarketFn").val();
        var crop = $("#smeSearchCrop").val();
        
        var smeResults = smes;
        if (companyName != "") {
            smeResults = $.grep(smeResults, function (obj) {
                return obj.attributes.MSME_Name == companyName;
            });
        }
        if (size != -1) {
            smeResults = $.grep(smeResults, function (obj) {
                return obj.attributes.MSME_Type == size;
            });
        }
        if (tradingCenter != -1) {
            smeResults = $.grep(smeResults, function (obj) {
                return obj.attributes.Trading_Centre == tradingCenter;
            });
        }
        if (marketFunction != -1) {
            smeResults = $.grep(smeResults, function (obj) {
                return obj.attributes.Market_Function___Main == marketFunction;
            });
        }
        if (crop == "ALL") {
            smeResults = $.grep(smeResults, function (obj) {
                return obj.attributes.Groundnut == 1 || obj.attributes.Soybean == 1;
            });
        } else if (crop == "GROUNDNUT") {
            smeResults = $.grep(smeResults, function (obj) {
                return obj.attributes.Groundnut == 1;
            });
        } else if (crop == "SOYBEAN") {
            smeResults = $.grep(smeResults, function (obj) {
                return obj.attributes.Soybean == 1;
            });
        }


        var districts = [];
        $.each(smeResults, function (idx, result) {
            if ($.inArray(result.attributes.District, districts) === -1) {
                districts.push(result.attributes.District);
            }
        });
        graphicsToCSV(smeResults);
        
        // highlight districts on the map
        map.graphics.clear();
        var layer = map.getLayer("districts");
        $.each(districts, function (idx, districtName) {
            var d = $.grep(layer.graphics, function (obj) {
                return obj.attributes.NAME_1 == districtName;
            });

            var graphic = new Graphic(d[0].geometry,
                new SimpleFillSymbol({
                    "type": "esriSFS",
                    "style": "esriSFSSolid",
                    "color": [255, 255, 0, 80],
                    "outline": {
                        "type": "esriSLS",
                        "style": "esriSLSSolid",
                        "color": [255, 255, 0, 255],
                        "width": 3
                    }
                }));
            map.graphics.add(graphic);
        });
    }

    function graphicsToCSV(graphics) {
        console.log(graphics);
        
        var data = [["DISTRICT", "COMPANY NAME", "SIZE", "MARKET FUNCTION", "TRADING CENTER", "GROUNDNUT","SOYBEAN"]];
        $.each(graphics, function (idx, graphic) {
            var row = [];
            row.push(graphic.attributes.District);
            row.push(graphic.attributes.MSME_Name);
            row.push(graphic.attributes.MSME_Type);
            row.push(graphic.attributes.Market_Function___Main);
            row.push(graphic.attributes.Trading_Centre);
            row.push(graphic.attributes.Groundnut);
            row.push(graphic.attributes.Soybean);
            data.push(row);
        })

        var csvContent = "";
        $.each(data, function (index, infoArray) {
            dataString = infoArray.join(",");
            csvContent += dataString + "\n";
        });
        var blob = new Blob([csvContent], { type: 'text/csv' });
        var encodedUri = URL.createObjectURL(blob);

        var link = $("#invisibleLink");
        link.attr("href", encodedUri);
        var url = URL.createObjectURL(blob);
        link.attr("download", "SME_Results.csv");
        document.getElementById("invisibleLink").click();
    }

    function clearSMESearch() {
        map.graphics.clear();
        var companyName = $("#smeSearchCompanyName").val("");
        var size = $("#smeSearchSize").val(-1);
        var tradingCenter = $("#smeSearchTradingCenter").val(-1);
        var marketFunction = $("#smeSearchMarketFn").val(-1);
    }
});



