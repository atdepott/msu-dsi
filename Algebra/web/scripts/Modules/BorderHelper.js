define([
      "dojo/_base/declare",
      "esri/graphic",
      "esri/layers/FeatureLayer",
      "esri/layers/GraphicsLayer",
      "esri/symbols/SimpleFillSymbol",
      "dojo/on"
], function (
      declare,
      Graphic,
      FeatureLayer,
      GraphicsLayer,
      SimpleFillSymbol,
      on
    ) {

    var url = "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/worldborders/MapServer/0";
    var nameField = "NAME_0";
    var objIdField = "OBJECTID";

    return declare(null, {
        constructor: function (_map) {
            this.map = _map;
            this.bordersLayer = new FeatureLayer(url, {
                id: "districts",
                visible: false,
                outFields: [nameField]
            });
            this.highlightGraphicsLayer = new GraphicsLayer();
            this.map.addLayers([this.bordersLayer, this.highlightGraphicsLayer]);
        },

        getBorder: function(callback) {
            var self = this;

            this.map.setMapCursor("crosshair");

            this.bordersLayer.show();

            this.highlightGraphicsLayer.on("mouse-out", function (evt) {
                self.highlightGraphicsLayer.clear();
                $("#mousetooltipDiv").hide();
            });

            // districts highlight & mouse tooltip
            var hoverListener = this.bordersLayer.on("mouse-over", function (evt) {
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
                self.highlightGraphicsLayer.add(highlightGraphic);

                console.log(evt.graphic.attributes[nameField]);
                $("#mousetooltipDiv").html(evt.graphic.attributes[nameField]);
                $("#mousetooltipDiv").show();
                $("#mousetooltipDiv").css({
                    position: "absolute",
                    top: evt.offsetY,
                    left: evt.offsetX
                });
            });

            // need to listen on highlight layer because it's masking the districts layer
            var listener = this.highlightGraphicsLayer.on("click", function (evt) {
                var borderName = evt.graphic.attributes[nameField];
                var borderObjectId = evt.graphic.attributes[objIdField];
                
                // create graphic and add it to the map
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
                self.map.graphics.add(graphic);

                self.map.setMapCursor("default");
                listener.remove();
                hoverListener.remove();
                self.bordersLayer.hide();

                callback(graphic);
            });
        }
    });
});

