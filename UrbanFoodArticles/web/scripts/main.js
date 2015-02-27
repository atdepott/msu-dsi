require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/dijit/Legend",
    "esri/dijit/Scalebar",
    "esri/dijit/BasemapToggle",
    "esri/dijit/Popup",
    "esri/dijit/PopupTemplate",
    "esri/dijit/Geocoder",
    "esri/dijit/AttributeInspector",
    "esri/dijit/editing/Editor",
    "esri/tasks/GeometryService",
    "esri/graphic",
    "esri/graphicsUtils",
    "dojo/parser", "dojo/on",
    "dojo/_base/array",
    "appConfig/defaults",
    "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
    "dijit/layout/AccordionContainer", "dojo/domReady!"
], function (
    Map,
    FeatureLayer,
    Legend,
    Scalebar,
    BasemapToggle,
    Popup,
    PopupTemplate,
    Geocoder,
    AttributeInspector,
    Editor,
    GeometryService,
    Graphic, graphicsUtils,
    parser, on,
    arrayUtils,
    config
) {
    // call this here to ensure that map fills entire content pane
    parser.parse();

    esriConfig.defaults.io.proxyUrl = "http://dsidb.cse.msu.edu/proxy.ashx"
    esriConfig.defaults.io.alwaysUseProxy = false;

    // set application title
    document.title = config.title;
    $("#title").empty();
    $("#title").append(config.title);

    var popup = Popup({
        titleInBody: false
    }, "popupDiv");

    var map = new Map("map", {
        basemap: "topo",
        infoWindow: popup
    });
    //map.infoWindow.resize(400, 300);

    var toggle = new BasemapToggle({
        map: map,
        basemap: "satellite"
    }, "BasemapToggle");
    toggle.startup();

    var scalebar = new Scalebar({
        map: map,
        scalebarUnit: "dual"
    });

    var geocoder = new Geocoder({
        map: map
    }, "search");
    geocoder.startup();

    var template = new PopupTemplate({
        title: "{Name}",
        description: "{PopupInfo}"
    });

    template.setContent(function (graphic) {
        // make any links in the PopupInfo field clickable
        var popupString = graphic.attributes.PopupInfo;
        var p = $('<p/>').text(popupString).linkify();
        return p.html();
    });
    
    var editlayer;
    var readlayer = new FeatureLayer(config.readurl, {
        infoTemplate: template,
        outFields: ["Name", "PopupInfo"],
    });
    map.addLayers([readlayer]);
    
    var layershandler = map.on("layers-add-result", function (evt) {
        if (typeof legend == 'undefined') {
            // Add the legend
            legend = new Legend({
                map: map,
                layerInfos: [{ layer: readlayer },]
            }, "legendDiv");
            legend.startup();
        } else {
            legend.refresh();
        }
    });
    
    $("#signInButton").button().click(function () {
        editlayer = new FeatureLayer(config.editurl, {
            outFields: ["Name", "PopupInfo"],
            visible: false
        });
        map.addLayer(editlayer);

        var handler = map.on("layer-add-result", function (evt) {
            //if user clicks "cancel" on sign-in box:
            if (typeof evt.error == 'undefined') {
                $("#signInButton").hide();
                $("#startEditing").show();
                legend.refresh([{ layer: readlayer }, { layer: editlayer }]);
            }
            handler.remove();
        });
    });

    var editorWidget = null;
    $("#startEditingButton").button().click(function () {

        // first hide read layer and add edit layer
        readlayer.hide();
        editlayer.show();

        //map.infoWindow.resize(650, 200);

        // start editor widget
        $("<div id='editorDiv'>").appendTo($("#editLayerDiv"));
        var editorWidgetDiv = dojo.create("div", { id: "myEditorDiv" }, "editorDiv");

        var layerInfos = [{
            "featureLayer": editlayer,
            "fieldInfos": [
                {
                    "fieldName": "Name",
                    "label": "Title",
                    "isEditable": true,
                    "stringFieldOption": AttributeInspector.STRING_FIELD_OPTION_TEXTAREA
                },
                {
                    "fieldName": "PopupInfo",
                    "label": "Description",
                    "isEditable": true,
                    "stringFieldOption": AttributeInspector.STRING_FIELD_OPTION_TEXTAREA
                }
            ]
        }]

        var settings = {
            map: map,
            layerInfos: layerInfos,
            geometryService: new GeometryService(config.geometryserviceurl)
        };
        var params = {
            settings: settings
        };
        editorWidget = new Editor(params, editorWidgetDiv);
        editorWidget.startup();

        $("#startEditing").hide();
        $("#stopEditing").show();

    });

    $("#stopEditingButton").button().click(function () {

        //map.infoWindow.resize(400, 300);

        //destroy editor widget
        editorWidget.destroy(false);
        editorWidget = null;
        
        // hide edit layer and show read layer
        editlayer.hide();
        readlayer.show();

        $("#startEditing").show();
        $("#stopEditing").hide();
    });

});



