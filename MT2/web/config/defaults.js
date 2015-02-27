/*
* NOTE: Feature layers must end with layer id (for example: http://dsidb.cse.msu.edu:6080/arcgis/rest/services/MT2/globalcities_time/MapServer/0)
*       For popup definitions on feature layers, see https://developers.arcgis.com/javascript/jsapi/popuptemplate-amd.html
*/

define([], function () {
    var configOptions = {
        "title": "Global Market Travel Time Calculator",
        "geometryServiceURL": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer",
        "travelTimeURL": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/MT2/TravelTime/MapServer/",
        "citySizeLayerId": "globalcities",

        "globalPopulationUrl":"http://dsidb.cse.msu.edu:6080/arcgis/rest/services/MT2/WorldPopulation_time/MapServer",
        "globalPopulationTitle":"Population Density",

        "globalCitiesUrl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/MT2/globalcities_time/MapServer/0",
        "globalCitiesTitle":"Cities",
        "globalCitiesPopup": {
            title: "{YEAR} {NAME1}",
            fieldInfos: [{
                fieldName: "POPULATION",
                label: "Population",
                visible: true
            },
            {
                fieldName: "NAME1",
                label: "1st Admin Level Name",
                visible: true
            },
            {
                fieldName: "NAME2",
                label: "2nd Admin Level Name",
                visible: true
            },
            {
                fieldName: "NAME3",
                label: "3rd Admin Level Name",
                visible: true
            },
            {
                fieldName: "NAME4",
                label: "4th Admin Level Name",
                visible: true
            },
            {
                fieldName: "NAME5",
                label: "5th Admin Level Name",
                visible: true
            },
            {
                fieldName: "COUNTRYNM",
                label: "Country",
                visible: true
            }]
        }

        /*
        "layergroups": [
			{ 	title:"Population",
				layers: [
					{ title:"Population Density", 
					  id:"globalpopulation", 
					  url:"http://dsidb.cse.msu.edu:6080/arcgis/rest/services/MT2/WorldPopulation_time/MapServer",
					  opacity:".8",
					  time: "true",
					  skipSubLayers:[1,2]
					}
				]
			},
            {
                title: "Global Cities",
                layers: [
					{
					    title: "Cities",
					    id: "globalcities",
					    url: "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/MT2/globalcities_time/MapServer/0",
					    opacity: "1",
					    time: "true",
					    skipSubLayers:[],
					    popup: 
					}
                ]
            }
		]
        */
    };
    return configOptions;
});