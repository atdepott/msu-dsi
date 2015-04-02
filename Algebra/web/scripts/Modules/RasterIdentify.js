define([
      "dojo/_base/declare",
      "esri/tasks/IdentifyTask",
      "esri/tasks/IdentifyParameters",
      "dojo/on"
], function (
      declare,
      IdentifyTask,
      IdentifyParameters,
      on
    ) {

    return declare(null, {
        constructor: function (_map) {
            this.map = _map;
        },

        start: function (url, layerids) {
            var self = this;
            if (typeof self.clickhandler != 'undefined' && self.clickhandler != null) {
                self.clickhandler.remove();
            }
            self.clickhandler = self.map.on("click", function (event) {
                findRasterValue(event, url, layerids, self.map);
            });
        },

        stop: function () {
            if (typeof this.clickhandler != 'undefined' && this.clickhandler != null) {
                this.clickhandler.remove();
                this.clickhandler = null;
            }
        }
    });

    function findRasterValue(event, url, layerids, map) {
        var identifyTask = new IdentifyTask(url);

        var identifyParams = new IdentifyParameters();
        identifyParams.layerIds = layerids;
        identifyParams.tolerance = 3;
        identifyParams.geometry = event.mapPoint;
        identifyParams.mapExtent = map.extent;
        identifyParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;

        identifyTask.execute(identifyParams, function (result) {
            console.log(result);
            if (result.length > 0) {
                if (result.length == 1) {
                    map.infoWindow.resize(100, 100);
                    map.infoWindow.setContent(result[0].feature.attributes["Pixel Value"]);
                    map.infoWindow.show(event.mapPoint);
                } else {
                    var height = 100;
                    var content = "";
                    $.each(result, function (idx, resultval) {
                        if (resultval.layerName != "") {
                            content += resultval.layerName + ": ";
                        } else {
                            content += "LAYER " + resultval.layerId + ": ";
                        }
                        content += resultval.feature.attributes["Pixel Value"] + "\n";
                        height += 100;
                    });
                    map.infoWindow.resize(200, height);
                    map.infoWindow.setContent(content);
                    map.infoWindow.show(event.mapPoint);
                }
            } else {
                map.infoWindow.hide();
            }
        });
    }
});

