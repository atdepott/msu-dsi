define([
      "dojo/_base/declare",
	  "esri/map",
      "esri/layers/layer",
      "esri/request"
    ], function(
      declare, 
	  Map,
      Layer,
      esriRequest
    ) {
	
        var map;
			
	return declare(null,{
		constructor: function(_map){
		    map = _map;
		},

		getMetadataHtml: function (layer, callback) {
		    var htmlString = "";
		    // Get details from service:
		    var requestHandle = esriRequest({
		        "url": layer.url,
		        "content": {
		            "f": "json"
		        },
		        "callbackParamName": "callback"
		    });
		    requestHandle.then(function (response, io) {
		        // Build HTML string to return:
		        if (response.hasOwnProperty("description") && response.description.length > 0) {
		            htmlString = htmlString + "<h3>Description</h3><p>" + response.description + "</p>";
		        } else if (response.hasOwnProperty("serviceDescription") && response.serviceDescription.length > 0) {
		            htmlString = htmlString + "<h3>Description</h3><p>" + response.serviceDescription + "</p>";
		        }
		        if (response.hasOwnProperty("copyrightText") && response.copyrightText.length > 0) {
		            htmlString = htmlString + "<h3>Copyright</h3><p>" + response.copyrightText + "</p>";
		        }
		        callback(htmlString);
		    }, function () {
		        //TODO this
		        console.log("request failed");
		    });
        }
	});
});

