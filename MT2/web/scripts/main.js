var map;
var geometryOps;
var timeTravelTool;

require([
    "esri/map",
    "esri/tasks/GeometryService",
    "esri/geometry/Extent",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/FeatureLayer",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/dijit/Legend",
    "esri/dijit/Scalebar",
    "esri/dijit/Popup", "esri/dijit/PopupTemplate",
    "esri/TimeExtent", "esri/dijit/TimeSlider",
    "dojo/_base/array", "dojo/parser",
    "appConfig/defaults",
    "app/GeometryOperations", "app/TravelTimeTool", "app/MetadataHelper",
    "app/RasterIdentify",
    "dojo/dom-construct", "dojo/query", "dojo/on",
    "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer", "dojo/domReady!"
], function (
    Map,
    GeometryService,
    Extent,
    ArcGISDynamicMapServiceLayer,
    FeatureLayer,
    ArcGISTiledMapServiceLayer,
    Legend,
    Scalebar,
    Popup, PopupTemplate,
    TimeExtent, TimeSlider,
    arrayUtils, parser,
    config, 
    GeometryOperations, TravelTimeTool, MetadataTool,
    RasterIdentify,
    domConstruct, query, on
) {
    //call this here to ensure that map fills entire content pane
    parser.parse();

    document.title = config.title;
    $("#title").empty();
    $("#title").append(config.title);

    var popup = Popup({
        titleInBody: false
    }, domConstruct.create("div"));
    popup.setTitle("VALUE");

    map = new Map("map", {
        basemap: "topo",
        center: [36.8167, -1.2833],
        zoom: 10,
        infoWindow: popup
    });

    var scalebar = new Scalebar({
        map: map,
        scalebarUnit: "dual"
    });

    //var rasterIdentify = new RasterIdentify(map);

    geometryOps = new GeometryOperations(map);
    travelTimeTool = new TravelTimeTool(map, "map-google",
        function () {
            // Turn off Esri map and show Google map
            $("#map-google").css("display", "normal");
            $("#map").css("display", "none");
            $(".darkClass").css("display", "normal");
        }, function () {
            // Turn off Google map and show Esri map
            $("#map-google").css("display", "none");
            $("#map").css("display", "normal");
            $(".darkClass").css("display", "none");
        });

    // Create buffer link in popup
    /*
    var link = domConstruct.create("a", {
        "class": "action",
        "id": "bufferLink",
        "innerHTML": "Buffer",
        "href": "javascript: void(0);"
    }, query(".actionList", popup.domNode)[0]);
    on(link, "click", function () {
        $("#bufferDialog").dialog("open");
    });
    */

    // Global Cities layer
    var citiesLayer = new FeatureLayer(config.globalCitiesUrl, {
        mode: FeatureLayer.MODE_ONDEMAND,
        id: 'globalcities',
        opacity: 1,
        outFields: ["*"]
    });
    var template = new PopupTemplate(config.globalCitiesPopup);
    citiesLayer.setInfoTemplate(template);
    // add actions panel whenever user clicks on layer:
    citiesLayer.on("click", function (scnPt, mapPt, graphic) {
        $(".esriPopup .actionsPane").css("display", "block");
        $(".esriPopup .action").css("display", "normal");
        $(".travelTimeAction").css("display", "none");
    });
    citiesLayer.on("load", function (evt) {
        // Setup time control - this seems to load the layer quicker
        var timeSlider = new TimeSlider(
        {
            style: "width: 100%;"
        },
        "timeSliderDiv");
        map.setTimeSlider(timeSlider);

        var timeExtent = new TimeExtent();
        timeExtent.startTime = new Date("1/1/1990 UTC");
        timeExtent.endTime = new Date("1/1/2015 UTC");
        timeSlider.setThumbCount(1);
        timeSlider.createTimeStopsByTimeInterval(timeExtent, 5, "esriTimeUnitsYears");
        timeSlider.singleThumbAsTimeInstant(true);
        timeSlider.startup();

        var labels = arrayUtils.map(timeSlider.timeStops, function (timeStop, i) {
            return timeStop.getUTCFullYear();
        });

        timeSlider.setLabels(labels);

        timeSlider.on("time-extent-change", function (evt) {
            var startValString = evt.startTime.getUTCFullYear();
            var endValString = evt.endTime.getUTCFullYear();
            $("#daterange").innerHTML = "<i>" + startValString + " and " + endValString + "<\/i>";
        });
    });
    
    // Population layer
    var populationLayer = new ArcGISDynamicMapServiceLayer(config.globalPopulationUrl, {
        mode: ArcGISDynamicMapServiceLayer.MODE_ONDEMAND,
        id: "globalpopulation",
        opacity: 0.8
    });
    
    map.on("layers-add-result", function (evt) {
        
        // start the raster identify
        // this layer id is hardcoded here:
        //rasterIdentify.start(populationLayer.url, [3]);

        // Add the legends
        var legendDijit1 = new Legend({
            map: map,
            layerInfos: [{ layer: map.getLayer("globalpopulation"), title: "Legend", id: "globalpopulation" }]
        }, "populationLegendDiv");
        legendDijit1.startup();

        var legendDijit2 = new Legend({
            map: map,
            layerInfos: [{ layer: map.getLayer("globalcities"), title: "Legend", id: "globalcities" }]
        }, "citiesLegendDiv");
        legendDijit2.startup();
    });

    map.addLayers([populationLayer, citiesLayer]);

    var metadataTool = new MetadataTool(map);
    $("#globalPopMetadata").click(function(){
        metadataTool.getMetadataHtml(populationLayer, function(htmlString){
            $("#metadataContent").empty();
            $("#metadataContent").html(htmlString);
            $("#metadataDialog").dialog("open")
        });
    });

    $("#globalCitiesMetadata").click(function(){
        metadataTool.getMetadataHtml(citiesLayer, function (htmlString) {
            $("#metadataContent").empty();
            $("#metadataContent").html(htmlString);
            $("#metadataDialog").dialog("open")
        });
    });

});

function bufferFeature(distance, unit) {
    var geometry = map.infoWindow.getSelectedFeature().geometry;
    geometryOps.bufferFeature(geometry, distance, unit);
}

//LAYER CONTROL
function onLayerClick(layerid) {
    var layer = map.getLayer(layerid);
    var layercontrol = $('#label_' + layerid);
    if (layer.loaded && layer.visible) {
        layercontrol.removeClass("css-layerlabel-selected").addClass("css-layerlabel-unselected");
        layer.hide();
    } else if (layer.loaded) {
        layercontrol.removeClass("css-layerlabel-unselected").addClass("css-layerlabel-selected");
        layer.show();
    }
}


// TRAVEL TIME TOOL
var mapClick;
function initTravelTimeTool(travelTimeDialogId, citySizeInputId, bufferSizeInputId, bufferUnitInputId) {
    // Create JQuery dialog
    $("#" + travelTimeDialogId).dialog({
        autoOpen: false,
        height: 300,
        modal: true,
        dialogClass: 'dialogClass',
        buttons: {
            "OK": function () {
                travelTimeTool.setCitySize($("#" + citySizeInputId).val());
                travelTimeTool.setBufferSize(parseFloat($("#" + bufferSizeInputId).val()));
                travelTimeTool.setBufferUnit($("#" + bufferUnitInputId).val());

                map.setMapCursor("crosshair");
                mapClick = map.on("click", function (evt) {
                    map.setMapCursor("default");
                    mapClick.remove();
                    travelTimeTool.findTravelTime(evt.mapPoint);
                });

                $(this).dialog("close");
            },
            Cancel: function () {
                map.setMapCursor("default");
                //mapClick.remove();
                $(this).dialog("close");
            }
        },
        close: function () {
            //$("#bufferDistanceInput").val("10");
        }
    });
}

function startTravelTimeTool() {
    $("#travelTimeDialog").dialog("open");
}

function clearGraphics() {
    map.graphics.clear();
}
