require([
    "esri/map",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/dijit/Legend",
    "esri/dijit/Scalebar",
    "esri/dijit/BasemapToggle",
    "esri/toolbars/draw",
    "esri/graphic",
    "esri/symbols/SimpleFillSymbol",
    "dojo/parser", "dojo/on",
    "appConfig/defaults",
    "app/GeometryOperations", "app/AdvancedRasterMath",
    "app/ExpressionBuilder",
    "app/MetadataHelper",
    "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer", "dojo/domReady!"
], function (
    Map,
    ArcGISDynamicMapServiceLayer,
    Legend,
    Scalebar,
    BasemapToggle,
    Draw, Graphic,
    SimpleFillSymbol,
    parser,on,
    config, 
    GeometryOperations, AdvancedRasterMath,
    ExpressionBuilder,
    MetadataHelper
) {
    // call this here to ensure that map fills entire content pane
    parser.parse();

    // set application title
    document.title = config.title;
    $("#title").empty();
    $("#title").append(config.title);

    // populate drop-down
    var categories = [];
    var categoryOptions = {};
    $.each(config.rasterSources, function (key, obj) {
        var cbdiv;

        // check if we already have this object's category in our list
        var catKey = obj.category.replace(/ /g, '');
        if (categories.indexOf(catKey) < 0) {
            categories.push(catKey);

            //create options in category select box
            categoryOptions[catKey] = [];
            catoption = $("<option/>").attr('value', catKey).attr('label', obj.category);
            $("#layerInputCategory").append(catoption);
            
            //create div in Choose Rasters popup
            cbanchor = $("<a/>", { href: "#", 'class': 'headerAnchor' }).text(obj.category).appendTo($("#raster-checkboxes"));
            $("#raster-checkboxes").append("<br/>");
            cbdiv = $("<div/>").attr('id', catKey + "_cbdiv").appendTo($("#raster-checkboxes"));
            cbdiv.slideToggle();
            cbanchor.click(function () {
                cbdiv.slideToggle();
            });

        } else {
            cbdiv = $("#" + catKey + "_cbdiv");
        }

        // create option for this data object and store it in the categoryOptions list
        var option = $("<option/>").attr('value', key).attr('label', obj.title);
        categoryOptions[catKey].push(option);

        // create checkbox & sliding description paragraph in the category div inside the Choose Rasters popup
        var checkbox = $("<input />", {type: 'checkbox', id: 'cb' + key, 'value':key}).data("raster",obj);
        var checkboxLabel = $("<label />", { 'for': 'cb' + key, text: obj.title + " " });
        var descripAnchor = $("<a/>", { href: "#" , 'class': 'descriptionAnchor' }).text("DESCRIPTION");
        var descripText = $("<p/>").text(obj.source).hide();
        cbdiv.append(checkbox).append(checkboxLabel).append(descripAnchor).append("<br/>").append(descripText);
        descripAnchor.click(function () {
            descripText.slideToggle();
        });
    });
    
    var map = new Map("map", {
        basemap: "topo",
        center: [36.8167, -1.2833],
        zoom: 8
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
    var mathTool = new AdvancedRasterMath(map, config.mathToolUrl, config.mathToolMapUrl);

    var currentExpr;
    var currentResultLayer;
    var expressionBuilder;
    
    var layer = new ArcGISDynamicMapServiceLayer(config.rasterUrl, {
        mode: ArcGISDynamicMapServiceLayer.MODE_ONDEMAND,
        id: "rasters",
        opacity: ".8",
        visible: false
    });

    var handler = map.on("layers-add-result", function (evt) {
        // Add the legend
        legend = new Legend({
            map: map,
            layerInfos: [{layer: layer, title: "Raster Layer"}]
        }, "legendDiv");
        legend.startup();

        handler.remove();
    });

    map.addLayers([layer]);

    function onRasterMathResult(resultObj) {
        $("#results").empty();
        var htmlString = "<tr><td>Minimum</td><td>" + resultObj.minimum + "</td></tr>" +
            "<tr><td>Maximum</td><td>" + resultObj.maximum + "</td></tr>" +
            "<tr><td>Mean</td><td>" + resultObj.mean + "</td></tr>" +
            "<tr><td>Std Deviation</td><td>" + resultObj.std + "</td></tr>";
        $("#results").append(htmlString);
        $("#results").show();

        mathTool.updateTransparency($("#slider").slider("option", "value"));

        $("#downloadButton").button().click(function () {
            window.open(resultObj.imgUrl);
        });
        $("#downloadButton").show();

        currentResultLayer = resultObj.layer;

        refreshLegend();
    }

    function refreshLegend() {
        var legendLayers = [];
        if (typeof currentResultLayer != 'undefined') {
            legendLayers.push({ layer: currentResultLayer, title: currentExpr.title });
        }

        var currentRaster = config.rasterSources[$('#layerInput').val()];
        var title = typeof currentRaster == 'undefined' ? "Raster Layer" : currentRaster.title;
        legendLayers.push({ layer: layer, title: title });

        legend.refresh(legendLayers);
    }

    // add the drawing toolbar (for polygon selections)
    var toolbar = new Draw(map);
    toolbar.on("draw-end", function (evt) {
        var graphic = new Graphic(evt.geometry, new SimpleFillSymbol());
        map.graphics.add(graphic);

        mathTool.add([evt.geometry], currentExpr, onRasterMathResult);
        
        toolbar.deactivate();
    });

    // CITATION
    $.each(config.citations, function (idx, citation) {
        $("#metadataContent").append("<p>" + citation + "</p>");
    });

    $("#metadataButton").button().click(function () {
        $("#metadataContent").slideToggle();
    });

    $("#layerInputCategory").change(function () {
        var catKey = $('#layerInputCategory').val();
        $("#layerInput").empty();
        $("#layerInput").append($("<option/>").attr('value', -1).attr('label', 'CHOOSE'));
        if (catKey != -1) {
            // fill layerInput select box with option list stored in categoryOptions object
            var options = categoryOptions[catKey];
            $("#layerInput").append(options);
        }
    });

    $("#layerInput").change(function () {
        var raster = $('#layerInput').val();
        var layer = map.getLayer("rasters");
        if (raster != -1) {
            $("#layerInput").attr("title", [config.rasterSources[raster].title]);
            layer.setVisibleLayers([config.rasterSources[raster].index]);
            layer.show();
        } else {
            $("#layerInput").attr("title", "Choose layer to display");
            layer.setVisibleLayers([-1]);
        }
        refreshLegend();
    });
    
    $("#polygonButton").button().click(function () {
        if (typeof currentExpr != 'undefined'){
            toolbar.activate(Draw.POLYGON);
        } else {
            alert("Please choose an expression before defining an area.");
        }
    });

    $("#bufferButton").button().click(function () {
        toolbar.deactivate();
        if (typeof currentExpr != 'undefined') {
            $("#bufferDialog").dialog("open");
        } else {
            alert("Please choose an expression before defining an area.");
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
                    map.setMapCursor("crosshair");
                    mapClick = map.on("click", function (evt) {
                        map.setMapCursor("default");
                        mapClick.remove();

                        geometryOps.bufferFeature(evt.mapPoint, distanceVal, $("#bufferUnitInput").val(), function (geometries) {
                            mathTool.add(geometries, currentExpr, onRasterMathResult);
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

    $("#slider").slider({
        min: 0, max: 1, step: 0.01, value: 1,
        change: function (event, ui) {
            mathTool.updateTransparency(ui.value);
        }
    });

    $("#clearButton").button().click(function () {
        map.graphics.clear();
        $('#layerInput').val(-1).trigger('change');
        toolbar.deactivate();
        map.setMapCursor("default");
        if (typeof mapClick != "undefined") {
            mapClick.remove();
        }
        mathTool.clear();
        $("#results").empty();
        $("#results").hide();
        $("#downloadButton").hide();
        currentExpr = "";
        currentResultLayer = null;
        if (typeof expressionBuilder != "undefined") {
            expressionBuilder.clear();
        }
        refreshLegend();
        $("#raster-checkboxes").find('input[type=checkbox]:checked').removeAttr('checked');
    });

    $("#exprBuildButton").button().click(function () {
        expressionBuilder.createExpression();
    });

    $("#chooseRastersDialog").dialog({
        autoOpen: false,
        modal: true,
        width: 550,
        maxHeight: 700,
        dialogClass: 'dialogClass',
        buttons: {
            "Choose": function () {
                var count = 0;
                var chosenRasters = {};
                $("#raster-checkboxes input:checked").each(function () {
                    count++;
                    chosenRasters[$(this).val()] = ($(this).data("raster"));
                });
                if (count > 0) {
                    expressionBuilder = new ExpressionBuilder(chosenRasters, "expressionBuilderDialog", function (expr) {
                         currentExpr = expr;
                     });
                     $(this).dialog("close");
                } else {
                    alert("Please choose at least 1 raster.");
                }
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

    $("#chooseRastersButton").button().click(function () {
        $("#chooseRastersDialog").dialog("open");
    });

    
});



