// NOTE: this updated version of the CSV tool requires PapaParse to handle CSVS
// http://papaparse.com/

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
            var result = Papa.parse(csvstring, { header: true });
            return result.meta.fields;
        },

        csvToGraphics: function (csvstring, latField, lonField, valField) {
            var result = Papa.parse(csvstring, { header: true });
            var graphics = [];
            $.each(result.data, function (idx, row) {
                if (!isNaN(row[lonField]) && !isNaN(row[latField])) {
                    var point = new Point(row[lonField], row[latField], new SpatialReference(4326));
                    var graphic = new Graphic(point, pointSymbol, { "VALUE": row[valField] }, infoTemplate);
                    graphics.push(graphic);
                } 
            });
            return graphics;
        },

        // creates graphics with multiple attributes
        // predictField is field that gets added to infotemplate but doesn't get parsed out of CSV
        csvToGraphicsAdv: function (csvstring, latField, lonField, valFields, depField, predictField) {
            var result = Papa.parse(csvstring, { header: true, fastMode: false });
            
            var graphics = [];
            var error = "";
            $.each(result.data, function (idx, row) {

                // check that lat and long fields are numbers
                if (!isNaN(row[lonField]) && !isNaN(row[latField])) {

                    // create geometry for graphic:
                    var point = new Point(row[lonField], row[latField], new SpatialReference(4326));

                    // create attributes for graphic:
                    var attribs = {};
                    infocontent = "<table>";

                    // add independant variables to infowindow and graphic attributes:
                    $.each(valFields, function (idx, valField) {
                        var attribval = row[valField];
                        if (typeof attribval == 'undefined' || !isNaN(attribval)) {
                            attribs[valField] = parseFloat(attribval);
                            infocontent = infocontent + "<tr><td>" + valField + ": </td><td>${" + valField + "}</td></tr>";
                        } else {
                            error = "Data variable " + valField + " contains a non-numerical values or is missing.";
                            return false;
                        }
                    });

                    if (typeof depField != 'undefined') {
                        // add dependant variable to infowindow and graphic attributes:
                        var dependantattribval = row[depField];
                        if (!isNaN(dependantattribval)) {
                            infocontent = infocontent + "<tr><td>" + depField + ":</td><td>" + row[depField] + "</td></tr>";
                            attribs[depField] = parseFloat(row[depField]);
                        } else {
                            error = "Dependant variable " + depField + " can only contain numerical values!";
                            return false;
                        }
                    }

                    // add this field to the infotemplate but don't try to get it from CSV
                    if (typeof predictField != 'undefined') {
                        infocontent = infocontent + "<tr><td>Predicted " + predictField + ":</td><td>${" + predictField + ":NumberFormat(places:10)}</td></tr>";
                    }

                    infocontent = infocontent + "</table>";

                    // create graphic and push into array:
                    var infoTemplate = new InfoTemplate("VALUE", infocontent);
                    var graphic = new Graphic(point, pointSymbol, attribs, infoTemplate);
                    graphics.push(graphic);
                }
            });

            if (error != "") {
                return { "ERROR": error };
            } else {
                return { "points": graphics };
            }
        },

        // returns a CSV-formatted string representing the graphics objects
        graphicsToCSV: function (graphics) {
            var attribsobj = $.map(graphics, function (obj) { 
                obj.attributes["LATITUDE"] = obj.geometry.y;
                obj.attributes["LONGITUDE"] = obj.geometry.x;
                return obj.attributes;
            });
            var resultstring = Papa.unparse(attribsobj);
            return resultstring;
        }
    });
});

