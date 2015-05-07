define([
      "dojo/_base/declare",
	  "esri/map",
      "esri/graphic",
      "esri/geometry/webMercatorUtils",
      "esri/tasks/query",
      "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
      "dojo/_base/Color",
      "app/GeometryOperations",
      "appConfig/defaults",
], function (
      declare,
	  Map, Graphic,
      webMercatorUtils,
      Query,
      SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
      Color, 
      GeometryOperations,
      configOptions
    ) {

    var map, googleMap;
    var googleMapDivId;
    var setupCallback, teardownCallback;
    var geometryOps, originPt;
    var googleMarkers = [];

    var citysize = "20K";
    var buffersize = 50;
    var bufferUnit = "MI";

    var citySymbol = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_CIRCLE, 
        6, 
        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([0, 255, 255]), 3),
        new Color([0, 255, 255]));

    var timeObjs = [];

    var traveltimelayers = {
        "20K": 0,
        "50K": 1,
        "100K": 2,
        "250K": 3,
        "500K": 4
    }

    var cityWheres = {
        "20K": "POPULATION >= 20000 and POPULATION < 50000",
        "50K": "POPULATION >= 50000 and POPULATION < 100000",
        "100K": "POPULATION >= 100000 and POPULATION < 25000",
        "250K": "POPULATION >= 250000 and POPULATION < 500000",
        "500K": "POPULATION >= 500000"
    }

    return declare(null, {
        constructor: function (_map, _googleMapDivId, _setupCallback, _teardownCallback) {
            map = _map;
            geometryOps = new GeometryOperations(map);
            googleMapDivId = _googleMapDivId;
            setupCallback = _setupCallback;
            teardownCallback = _teardownCallback;
        },

        setCitySize: function (_citysize) {
            citysize = _citysize;
        },

        setBufferSize: function (_buffersize) {
            buffersize = _buffersize;
        },

        setBufferUnit: function (_bufferunit) {
            bufferUnit = _bufferunit;
        },

        findTravelTime: function (_point) {
            originPt = _point;

            // Get buffer geometry
            var geom;
            geometryOps.bufferFeature(_point, buffersize, bufferUnit, function (bufferedGeometries) {
                if (bufferedGeometries.length > 0) {
                    // Query for all cities of this size inside buffer
                    geom = bufferedGeometries[0];
                    queryForCities(geom);
                } else {
                    //TODO this:
                    console.log("ERROR no geometries returned");
                }
            });
        }
    });

    function queryForCities(bufferGeom) {
        // Get city layer
        var cityLayer = map.getLayer(configOptions.citySizeLayerId);

        // Set up popup for results
        var template = cityLayer.infoTemplate;
        
        // Do query
        var query = new Query();
        query.timeExtent = map.timeExtent;
        query.geometry = bufferGeom;
        query.where = cityWheres[citysize];

        cityLayer.queryFeatures(query, function (response) {
            var cityPts = [];
            $.each(response.features, function (idx, feature) {
                var graphic = new Graphic(feature.geometry, citySymbol, feature.attributes);
                graphic.setInfoTemplate(template);
                map.graphics.add(graphic);
                cityPts.push(feature);
            });

            // Start Google map if not already started
            if (typeof googleMap == 'undefined') {
                googleMap = startGoogleMap();
            }
            // Do calculation and show map
            showGoogleMap(googleMap, originPt, cityPts);
        });
    }

    function startGoogleMap() {
        var centerPt = new google.maps.LatLng(-84.5467, 42.7336);
        var map = new google.maps.Map(document.getElementById(googleMapDivId),
            {
                center: centerPt,
                zoom: 6
            });

        // Create Exit button
        var exitDiv = document.createElement('div');
        exitDiv.style.padding = '5px';
        var exitControlUI = document.createElement('div');
        exitControlUI.style.backgroundColor = 'white';
        exitControlUI.style.borderStyle = 'solid';
        exitControlUI.style.borderWidth = '2px';
        exitControlUI.style.cursor = 'pointer';
        exitControlUI.style.textAlign = 'center';
        exitControlUI.title = 'Click to choose another city';
        exitDiv.appendChild(exitControlUI);
        var exitControlText = document.createElement('div');
        exitControlText.style.fontFamily = 'Arial,sans-serif';
        exitControlText.style.fontSize = '12px';
        exitControlText.style.paddingLeft = '8px';
        exitControlText.style.paddingRight = '8px';
        exitControlText.innerHTML = '<strong>Exit</strong>';
        exitControlUI.appendChild(exitControlText);
        google.maps.event.addDomListener(exitControlUI, 'click', function () {
            hideGoogleMap();
        });
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(exitDiv);

        // Create Export button
        var exportDiv = document.createElement('div');
        exportDiv.style.padding = '5px';
        var exportControlUI = document.createElement('div');
        exportControlUI.style.backgroundColor = 'white';
        exportControlUI.style.borderStyle = 'solid';
        exportControlUI.style.borderWidth = '2px';
        exportControlUI.style.cursor = 'pointer';
        exportControlUI.style.textAlign = 'center';
        exportControlUI.title = 'Click to export results as a CSV';
        exportDiv.appendChild(exportControlUI);
        var exportControlText = document.createElement('div');
        exportControlText.style.fontFamily = 'Arial,sans-serif';
        exportControlText.style.fontSize = '12px';
        exportControlText.style.paddingLeft = '8px';
        exportControlText.style.paddingRight = '8px';
        exportControlText.innerHTML = '<strong>Export</strong>';
        exportControlUI.appendChild(exportControlText);
        google.maps.event.addDomListener(exportControlUI, 'click', function () {
            exportToCSV();
        });
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(exportDiv);

        return map;
    }

    function showGoogleMap(map, startPoint, endFeatures) {
        setupCallback();

        timeObjs = [];
        var markersArray = [];
        var bounds = new google.maps.LatLngBounds();
        var endLocs = [];

        var pointGeog = webMercatorUtils.webMercatorToGeographic(startPoint);
        var startLoc = new google.maps.LatLng(pointGeog.y, pointGeog.x);
        bounds.extend(startLoc);
        var startMarker = new google.maps.Marker({
            position: startLoc,
            map: map,
            title: 'Start location'
        });
        var contentString = '<div id="content">' +
                      '<div id="siteNotice">' +
                      '</div>' +
                      '<h3 id="firstHeading" class="firstHeading">START LOCATION</h3>' +
                      '<div id="bodyContent">' +
                      '</div>' +
                      '</div>';
        var infowindow = new google.maps.InfoWindow({
            content: contentString
        });
        google.maps.event.addListener(startMarker, 'click', function () {
            infowindow.open(map, startMarker);
        });
        googleMarkers.push(startMarker);

        $.each(endFeatures, function (k, feature) {
            var pointGeog = webMercatorUtils.webMercatorToGeographic(feature.geometry);
            var endLoc = new google.maps.LatLng(pointGeog.y, pointGeog.x);
            bounds.extend(endLoc);
            endLocs.push(endLoc);
        });

        map.fitBounds(bounds);

        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [startLoc],
                destinations: endLocs,
                travelMode: google.maps.TravelMode.DRIVING
            }, function (response, status) {
                //console.log(response);
                var infowindow = null;
                if (typeof response.rows[0].elements != 'undefined') {
                    $.each(response.rows[0].elements, function (idx, result) {
                        var traveltime = result.duration.text;
                        var attributes = endFeatures[idx].attributes;

                        var endMarker = new google.maps.Marker({
                            position: endLocs[idx],
                            map: map,
                            title: 'End location'
                        });

                        var contentString = '<div id="content">' +
                          '<div id="siteNotice">' +
                          '</div>' +
                          '<h3 id="firstHeading" class="firstHeading">' + attributes.NAME1 + '</h3>' +
                          '<div id="bodyContent">' +
                          '<p>Travel time:' + traveltime + '</p>' +
                          '</div>' +
                          '</div>';
                        google.maps.event.addListener(endMarker, 'click', function () {
                            if (infowindow) {
                                infowindow.close();
                            }
                            infowindow = new google.maps.InfoWindow({
                                content: contentString
                            });
                            infowindow.open(map, endMarker);
                        });

                        time = [
                            attributes.NAME1,
                            attributes.NAME2,
                            attributes.NAME3,
                            attributes.NAME4,
                            attributes.NAME5,
                            attributes.COUNTRYNM,
                            traveltime,
                            attributes.POPULATION
                        ];
                        timeObjs.push(time);

                        googleMarkers.push(endMarker);
                    });
                }
            });
    }

    function exportToCSV() {
        var data = [["NAME1", "NAME2", "NAME3", "NAME4", "NAME5","COUNTRYNM","TIME","POPULATION"]];
        $.each(timeObjs, function (idx, city) {
            data.push(city);
        })

        var csvContent = "";
        $.each(data, function (index, infoArray) {
            dataString = infoArray.join(",");
            csvContent += dataString + "\n";
        });
        
        var blob = new Blob([csvContent], { type: 'text/csv' });
        // handle differently in IE than other browsers because IE does not allow data URIs
        if (window.navigator.msSaveOrOpenBlob) {
            $("#invisibleLink").click(function () {
                window.navigator.msSaveOrOpenBlob(blob, "MT2_traveltimes.csv");
            });
        } else {
            var encodedUri = URL.createObjectURL(blob);
            $("#invisibleLink").button().attr({ "href": encodedUri, "download": "MT2_traveltimes.csv" });
        }
        document.getElementById("invisibleLink").click();

        /*
        var blob = new Blob([csvContent], { type: 'text/csv' });
        var encodedUri = URL.createObjectURL(blob);

        var link = $("#invisibleLink");
        link.attr("href", encodedUri);
        var url = URL.createObjectURL(blob);
        link.attr("download", "MT2_traveltimes.csv");
        document.getElementById("invisibleLink").click();
        */
    }

    function hideGoogleMap() {
        $.each(googleMarkers, function (idx, marker) {
            marker.setMap(null);
        });
        googleMarkers = [];
        teardownCallback();
    }

});