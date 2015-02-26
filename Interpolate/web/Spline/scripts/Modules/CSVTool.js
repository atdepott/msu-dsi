define([
      "dojo/_base/declare",
      "esri/geometry/Point",
      "esri/SpatialReference",
      "esri/graphic",
      "esri/InfoTemplate",
      "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/Color"
], function (
      declare,
      Point,
      SpatialReference,
      Graphic,
      InfoTemplate,
      SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Color
    ) {

    var pointSymbol = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_CIRCLE,
        12,
        new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID,
        new Color([156, 154, 149, 1]), 2
        ),
        new Color([163, 80, 186, 0.65])
    );

    var infoTemplate = new InfoTemplate("VALUE","${VALUE}");

    return declare(null, {

        getHeaders: function (csvstring) {
            var rows = csvstring.split("\n");
            var headerRowString = rows[0];
            var headerRow = headerRowString.split(",");
            var headers = {};
            $.each(headerRow, function (idx, header) {
                headers[header] = idx;
            });
            return headers;
        },
        csvToGraphics: function (csvstring, latIdx, lonIdx, valIdx) {
            var graphics = [];
            var rows = csvstring.split("\n");
            $.each(rows, function (idx, rowString) {
                var row = rowString.split(",");
                if (!isNaN(row[lonIdx]) && !isNaN(row[latIdx])) {
                    var point = new Point(row[lonIdx], row[latIdx], new SpatialReference(4326));
                    var graphic = new Graphic(point, pointSymbol, { "VALUE": row[valIdx] }, infoTemplate);
                    graphics.push(graphic);
                }
            });
            return graphics;
        }
    });
});

