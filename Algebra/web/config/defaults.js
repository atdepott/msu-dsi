define([], function () {
    var configOptions = {
        "geometryServiceURL": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/Utilities/Geometry/GeometryServer",
        "title": "Map Algebra Tool",
        "rasterUrl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/Raster/Rasters/MapServer",
        "mathToolUrl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/Raster/AdvancedMathWithStats/GPServer/AdvancedMathWithStats",
        "mathToolMapUrl": "http://dsidb.cse.msu.edu:6080/arcgis/rest/services/Raster/AdvancedMathWithStats/MapServer/jobs",
        "citations": ['United Nations Environment Programme, Environment for Development, 2014. Environmental Data Explorer. Available online at:  <a href="http://geodata.grid.unep.ch/">http://geodata.grid.unep.ch/</a>',
            'FAO Geonetwork. Available online at <a href="http://www.fao.org/geonetwork/srv/en/main.home">http://www.fao.org/geonetwork/srv/en/main.home</a>',
            'UNEP, 2013. Global risk data platform. United Nations Environmental Program. <a href="http://preview.grid.unep.ch/">http://preview.grid.unep.ch/</a>'],
        "rasterSources": {
            "Crop Suitability\\yield_gap_major_crops.tif": {
                "index": "88",
                "category": "Crop Suitability",
                "source": "Yield gap for a combination of major crops",
                "title": "Yield gap for a combination of major crops"
            },
            "Crop Suitability\\wheat_yield_high.tif": {
                "index": "89",
                "category": "Crop Suitability",
                "source": "Temperature and radiation limited yield for rain-fed wheat (high inputs)",
                "title": "Global temperature and radiation limited yield for rain-fed wheat (high inputs)"
            },
            "Crop Suitability\\wheat_suit_int.tif": {
                "index": "90",
                "category": "Crop Suitability",
                "source": "Suitability for rain-fed wheat (intermediate inputs)",
                "title": "Suitability for rain-fed wheat (intermediate inputs)"
            },
            "Crop Suitability\\wheat_suit_2c.tif": {
                "index": "91",
                "category": "Crop Suitability",
                "source": "Suitability for rain-fed Wheat (intermediate inputs) - Animation Part 3 - +3deg.C and +10% precip",
                "title": "Global suitability for rain-fed wheat (intermediate inputs) at +3deg.C and +10% precip"
            },
            "Crop Suitability\\wheat_suit_2b.tif": {
                "index": "92",
                "category": "Crop Suitability",
                "source": "Suitability for rain-fed Wheat (intermediate inputs) - Animation Part 2 - +2deg.C",
                "title": "Global suitability for rain-fed wheat (intermediate inputs) at +2 degC"
            },
            "Crop Suitability\\wheat_suit_2a.tif": {
                "index": "93",
                "category": "Crop Suitability",
                "source": "Suitability for rain-fed Wheat (intermediate inputs) - Animation Part 1 - Reference Climate",
                "title": "Global suitability for rain-fed wheat (intermediate inputs) - Reference Climate"
            },
            "Crop Suitability\\wheat_rain_high.tif": {
                "index": "94",
                "category": "Crop Suitability",
                "source": "Agro-climatic suitability for rainfed wheat (high inputs)",
                "title": "Global agro-climatic suitability for rain-fed wheat (high inputs)"
            },
            "Crop Suitability\\wheat_irr_high.tif": {
                "index": "95",
                "category": "Crop Suitability",
                "source": "Suitability for rain-fed and irrigated Wheat (high input)",
                "title": "Global agro-climatic suitability for rain-fed and irrigated wheat (high inputs)"
            },
            "Crop Suitability\\sugar_suit_low.tif": {
                "index": "96",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on global land area are global raster datalayers with a resolution of 5 arc-minutes.  Each pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Sugar crops-global suitability rainfed (low input)"
            },
            "Crop Suitability\\sugar_suit_int.tif": {
                "index": "97",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on global land area are global raster datalayers with a resolution of 5 arc-minutes.  Each pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Sugar crops Global suitability rainfed (intermediate input)"
            },
            "Crop Suitability\\sugar_suit_high.tif": {
                "index": "98",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on global land area are global raster datalayers with a resolution of 5 arc-minutes.  Each pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Sugar crops-global suitability rainfed (high input)"
            },
            "Crop Suitability\\sugar_prod_low.tif": {
                "index": "99",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on global land area are global raster datalayers with a resolution of 5 arc-minutes.  Each pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Sugar crops-rainfed (low input)"
            },
            "Crop Suitability\\sugar_prod_int.tif": {
                "index": "100",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on global land area are global raster datalayers with a resolution of 5 arc-minutes.  Each pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Sugar crops-rainfed production (intermediate level of inputs)"
            },
            "Crop Suitability\\sugar_prod_high.tif": {
                "index": "101",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on global land area are global raster datalayers with a resolution of 5 arc-minutes.  Each pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Sugar crops-rain-fed production (high input)"
            },
            "Crop Suitability\\sugar_irr_high.tif": {
                "index": "102",
                "category": "Crop Suitability",
                "source": "Suitability for rain-fed and irrigated Sugar Crops (high input)",
                "title": "Sugar crops-rainfed and irrigated (high input)"
            },
            "Crop Suitability\\root_avail_low.tif": {
                "index": "103",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on currently available land are global raster datalayers with a resolution of 5 arc-minutes.  Pixels classified as urban, closed forest or irrigated contain values of zero. Each remaining pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of currently available land for rainfed production of roots and tubers (low level of inputs) (FGGD)"
            },
            "Crop Suitability\\root_avail_int.tif": {
                "index": "104",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on currently available land are global raster datalayers with a resolution of 5 arc-minutes.  Pixels classified as urban, closed forest or irrigated contain values of zero. Each remaining pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of currently available land for rainfed production of roots and tubers (intermediate level of inputs) (FGGD)"
            },
            "Crop Suitability\\root_avail_high.tif": {
                "index": "105",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on currently available land are global raster datalayers with a resolution of 5 arc-minutes.  Pixels classified as urban, closed forest or irrigated contain values of zero. Each remaining pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of currently available land for rainfed production of roots and tubers (high level of inputs) (FGGD)"
            },
            "Crop Suitability\\root_area_low.tif": {
                "index": "106",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on global land area are global raster datalayers with a resolution of 5 arc-minutes.  Each pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of global land area for rainfed production of roots and tubers (low level of inputs) (FGGD)"
            },
            "Crop Suitability\\root_area_int.tif": {
                "index": "107",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on global land area are global raster datalayers with a resolution of 5 arc-minutes.  Each pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of global land area for rainfed production of roots and tubers (Intermediate level of inputs) (FGGD)"
            },
            "Crop Suitability\\root_area_high.tif": {
                "index": "108",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on global land area are global raster datalayers with a resolution of 5 arc-minutes.  Each pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of global land area for rainfed production of roots and tubers (high level of inputs) (FGGD)"
            },
            "Crop Suitability\\rice.tif": {
                "index": "109",
                "category": "Crop Suitability",
                "source": "The ratings are differentiated between those that apply to the whole group of upland crops, for which a water supply is necessary because of too dry climatic conditions, and those that refer to requirements of paddy rice under irrigation. In both cases the ratings are given on the assumption that the irrigation infrastructure has been realized and that a high level of inputs (e.g. fertilizer) is applied.",
                "title": "Suitability for rain-fed and irrigated rice (high input)"
            },
            "Crop Suitability\\pulse_avail_low.tif": {
                "index": "110",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on currently available land are global raster datalayers with a resolution of 5 arc-minutes.  Pixels classified as urban, closed forest or irrigated contain values of zero. Each remaining pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of currently available land for rainfed production of pulses (low level of inputs) (FGGD)"
            },
            "Crop Suitability\\pulse_avail_int.tif": {
                "index": "111",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on currently available land are global raster datalayers with a resolution of 5 arc-minutes.  Pixels classified as urban, closed forest or irrigated contain values of zero. Each remaining pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of currently available land for rainfed production of pulses (intermediate level of inputs) (FGGD)"
            },
            "Crop Suitability\\pulse_avail_high.tif": {
                "index": "112",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on currently available land are global raster datalayers with a resolution of 5 arc-minutes.  Pixels classified as urban, closed forest or irrigated contain values of zero. Each remaining pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of currently available land for rainfed production of pulses (high level of inputs) (FGGD)"
            },
            "Crop Suitability\\pulse_area_low.tif": {
                "index": "113",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on global land area are global raster datalayers with a resolution of 5 arc-minutes.  Each pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of global land area for rainfed production of pulses (low level of inputs) (FGGD)"
            },
            "Crop Suitability\\pulse_area_int.tif": {
                "index": "114",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on global land area are global raster datalayers with a resolution of 5 arc-minutes.  Each pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of global land area for rainfed production of pulses (intermediate level of inputs) (FGGD)"
            },
            "Crop Suitability\\pulse_area_high.tif": {
                "index": "115",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on global land area are global raster datalayers with a resolution of 5 arc-minutes.  Each pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of global land area for rainfed production of pulses (high level of inputs) (FGGD)"
            },
            "Crop Suitability\\maize_yeild.tif": {
                "index": "116",
                "category": "Crop Suitability",
                "source": "Temperature, radiation and water-limited yield for 120 day rain-fed grain maize (high inputs)",
                "title": "Global limited yeld for rain-fed grain maize"
            },
            "Crop Suitability\\maize_suitability_2c.tif": {
                "index": "117",
                "category": "Crop Suitability",
                "source": "Suitability for rain-fed Grain Maize (intermediate inputs) - Animation Part 3 - +3deg.C and +10% precip",
                "title": "Global suitability for rain-fed grain maize (intermediate inputs) at +3deg.C and +10% precip"
            },
            "Crop Suitability\\maize_suitability_2b.tif": {
                "index": "118",
                "category": "Crop Suitability",
                "source": "Suitability for rain-fed Grain Maize (intermediate inputs) - Animation Part 2 - +2 deg.C",
                "title": "Global suitability for rain-fed grain maize (intermediate inputs) at +2 degC"
            },
            "Crop Suitability\\maize_suitability_2a.tif": {
                "index": "119",
                "category": "Crop Suitability",
                "source": "Suitability for rain-fed Grain Maize (intermediate inputs) - Animation 1 Reference Climate",
                "title": "Global suitability for rain-fed grain maize (intermediate inputs) - Reference Climate"
            },
            "Crop Suitability\\maize_exp_out_rain.tif": {
                "index": "120",
                "category": "Crop Suitability",
                "source": "Expected grid-cell output/ha across all 13 rain-fed grain-maize types (high inputs)",
                "title": "Global expected output for all rain-fed grain-maize"
            },
            "Crop Suitability\\maize_exp_out_irr_rain.tif": {
                "index": "121",
                "category": "Crop Suitability",
                "source": "Expected grid-cell ouput/ha for rain-fed and irrrigated grain-maize across all 13 types (high inputs)",
                "title": "Global expected output for all rain-fed and irrigated grain-maize"
            },
            "Crop Suitability\\fruit_avail_low.tif": {
                "index": "122",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on currently available land are global raster datalayers with a resolution of 5 arc-minutes.  Pixels classified as urban, closed forest or irrigated contain values of zero. Each remaining pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of currently available land for rainfed production of tree fruits (low level of inputs) (FGGD)"
            },
            "Crop Suitability\\fruit_avail_int.tif": {
                "index": "123",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on currently available land are global raster datalayers with a resolution of 5 arc-minutes.  Pixels classified as urban, closed forest or irrigated contain values of zero. Each remaining pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of currently available land for rainfed production of tree fruits (intermediate level of inputs) (FGGD)"
            },
            "Crop Suitability\\fruit_avail_high.tif": {
                "index": "124",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on currently available land are global raster datalayers with a resolution of 5 arc-minutes.  Pixels classified as urban, closed forest or irrigated contain values of zero. Each remaining pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of currently available land for rainfed production of tree fruits (high level of inputs) (FGGD)"
            },
            "Crop Suitability\\fruit_area_low.tif": {
                "index": "125",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on global land area are global raster datalayers with a resolution of 5 arc-minutes.  Each pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of global land area for rainfed production of tree fruits (low level of inputs) (FGGD)"
            },
            "Crop Suitability\\fruit_area_int.tif": {
                "index": "126",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on global land area are global raster datalayers with a resolution of 5 arc-minutes.  Each pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of global land area for rainfed production of tree fruits (intermediate level of inputs) (FGGD)"
            },
            "Crop Suitability\\fruit_area_high.tif": {
                "index": "127",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on global land area are global raster datalayers with a resolution of 5 arc-minutes.  Each pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of global land area for rainfed production of tree fruits (high level of inputs) (FGGD)"
            },
            "Crop Suitability\\cereal_low_input.tif": {
                "index": "128",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on currently available land are global raster datalayers with a resolution of 5 arc-minutes.  Pixels classified as urban, closed forest or irrigated contain values of zero. Each remaining pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of currently available land for rainfed production of cereals (low level of inputs) (FGGD)"
            },
            "Crop Suitability\\cereal_intermediate_input.tif": {
                "index": "129",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on currently available land are global raster datalayers with a resolution of 5 arc-minutes.  Pixels classified as urban, closed forest or irrigated contain values of zero. Each remaining pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of currently available land for rainfed production of cereals (intermediate level of inputs) (FGGD)"
            },
            "Crop Suitability\\cereal_high_input.tif": {
                "index": "130",
                "category": "Crop Suitability",
                "source": "The FGGD crop suitability maps at low, intermediate and high levels of inputs under rainfed conditions on currently available land are global raster datalayers with a resolution of 5 arc-minutes.  Pixels classified as urban, closed forest or irrigated contain values of zero. Each remaining pixel contains the 2005 version of the suitability index for rainfed production of the crop or crop group concerned.  The method and crop coverage of each crop group are described in FAO and IIASA, 2007, Mapping biophysical factors that influence agricultural production and rural vulnerability",
                "title": "Suitability of currently available land for rainfed production of cereals (high level of inputs) (FGGD)"
            },
            "Disaster\\Multiple_Risk.tif": {
                "index": "132",
                "category": "Disaster",
                "source": "This dataset includes an estimate of the global risk induced by multiple hazards (tropical cyclone, flood and landslide induced by precipitations). Unit is estimated risk index from 1 (low) to 5 (extreme). This product was designed by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: UNEP/GRID-Europe",
                "title": "Global estimated risk index for multiple hazards"
            },
            "Disaster\\Landslide_risk.tif": {
                "index": "133",
                "category": "Disaster",
                "source": "This dataset includes an estimate of the global risk induced by landslide hazard triggered by precipitations. Unit is estimated risk index from 1 (low) to 5 (extreme). This product was designed by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: UNEP/GRID-Europe",
                "title": "Global estimated risk index for landslide hazard triggered by precipitations"
            },
            "Disaster\\Landslide_pr.tif": {
                "index": "134",
                "category": "Disaster",
                "source": "This dataset includes an estimate of the annual frequency of landslide triggered by precipitations. It depends on the combination of trigger and susceptibility defined by six parameters: slope factor, lithological (or geological) conditions, soil moisture condition, vegetation cover, precipitation and seismic conditions. Unit is expected annual probability and percentage of pixel of occurrence of a potentially destructive landslide event x 1000000. This product was designed by International Centre for Geohazards /NGI for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing International Centre for Geohazards /NGI",
                "title": "Frequency of lanslides triggered by precipitations"
            },
            "Disaster\\Landslide_physexp2.tif": {
                "index": "135",
                "category": "Disaster",
                "source": "This dataset includes an estimate of the annual physical exposition of landslide triggered by precipitations. It depends on the combination of trigger and susceptibility defined by six parameters: slope factor, lithological (or geological) conditions, soil moisture condition, vegetation cover, precipitation and seismic conditions. A population grid for the year 2010, provided by LandScanTM Global Population Database (Oak Ridge, TN: Oak Ridge National Laboratory). Unit is expected average annual population (2010 as the year of reference) exposed (inhabitants). This product was designed by International Centre for Geohazards /NGI for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data and aggregated to ~ 5 km resolution for distribution. Credit: GIS processing International Centre for Geohazards /NGI",
                "title": "Physical exposition to lanslides triggered by precipitations"
            },
            "Disaster\\Landslide_physexp.tif": {
                "index": "136",
                "category": "Disaster",
                "source": "This dataset includes an estimate of the annual physical exposition of landslide triggered by earthquakes. It depends on the combination of trigger and susceptibility defined by six parameters: slope factor, lithological (or geological) conditions, soil moisture condition, vegetation cover, precipitation and seismic conditions. A population grid for the year 2010, provided by LandScanTM Global Population Database (Oak Ridge, TN: Oak Ridge National Laboratory) has also been used. Unit is expected average annual population (2010 as the year of reference) exposed (inhabitants) . This product was designed by International Centre for Geohazards /NGI for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing International Centre for Geohazards /NGI",
                "title": "Physical exposition to lanslides triggered by earthquakes"
            },
            "Disaster\\Landslide_eq.tif": {
                "index": "137",
                "category": "Disaster",
                "source": "This dataset includes an estimate of the annual frequency of landslide triggered by earthquakes. It depends on the combination of trigger and susceptibility defined by six parameters: slope factor, lithological (or geological) conditions, soil moisture condition, vegetation cover, precipitation and seismic conditions. Unit is expected annual probability and percentage of pixel of occurrence of a potentially destructive landslide event x 1000000. This product was designed by International Centre for Geohazards /NGI for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing International Centre for Geohazards /NGI",
                "title": "Frequency of lanslides triggered by earthquakes"
            },
            "Disaster\\Landslide_ecoexp2.tif": {
                "index": "132",
                "category": "Disaster",
                "source": "This dataset includes an estimate of the annual economical exposition of landslide triggered by precipitations. It depends on the combination of trigger and susceptibility defined by six parameters: slope factor, lithological (or geological) conditions, soil moisture condition, vegetation cover, precipitation and seismic conditions. A Global Domestic Product grid for the year 2010, provided by the World Bank, has also been used. Unit is expected average annual GDP (2010 as the year of reference) exposed in (US $, year 2000 equivalent). This product was designed by International Centre for Geohazards /NGI for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing International Centre for Geohazards /NGI",
                "title": "Economical exposition to lanslides triggered by precipitations"
            },
            "Disaster\\Landslide_ecoexp.tif": {
                "index": "138",
                "category": "Disaster",
                "source": "This dataset includes an estimate of the annual economical exposition of landslide triggered by earthquakes. It depends on the combination of trigger and susceptibility defined by six parameters: slope factor, lithological (or geological) conditions, soil moisture condition, vegetation cover, precipitation and seismic conditions. A Global Domestic Product grid for the year 2010, provided by the World Bank, has also been used. Unit is expected average annual GDP (2010 as the year of reference) exposed in (US $, year 2000 equivalent). This product was designed by International Centre for Geohazards /NGI for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing International Centre for Geohazards /NGI",
                "title": "Economical exposition to lanslides triggered by earthquakes"
            },
            "Disaster\\Flood_risk.tif": {
                "index": "139",
                "category": "Disaster",
                "source": "This dataset includes an estimate of the global risk induced by flood hazard. Unit is estimated risk index from 1 (low) to 5 (extreme). This product was designed by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: UNEP/GRID-Europe",
                "title": "Global estimated risk index for flood hazard"
            },
            "Disaster\\Flood_physexp.tif": {
                "index": "140",
                "category": "Disaster",
                "source": "This dataset includes an estimate of the annual physical exposition to flood. It is based on three sources: 1) A GIS modeling using a statistical estimation of peak-flow magnitude and a hydrological model using HydroSHEDS dataset and the Manning equation to estimate river stage for the calculated discharge value. 2) Observed flood from 1999 to 2007, obtained from the Dartmouth Flood Observatory (DFO). 3) The frequency was set using the frequency from UNEP/GRID-Europe PREVIEW flood dataset. In area where no information was available, it was set to 50 years returning period. 4) A population grid for the year 2010, provided by LandScanTM Global Population Database (Oak Ridge, TN: Oak Ridge National Laboratory). Unit is expected average annual population (2007 as the year of reference) exposed (inhabitants) . This product was designed by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing UNEP/GRID-Europe, with key support from USGS EROS Data Center, Dartmouth Flood Observatory 2008",
                "title": "Physical exposition to flood"
            },
            "Disaster\\Flood_frequency.tif": {
                "index": "141",
                "category": "Disaster",
                "source": "This dataset includes an estimate of flood frequency. It is based on three sources: 1) A GIS modeling using a statistical estimation of peak-flow magnitude and a hydrological model using HydroSHEDS dataset and the Manning equation to estimate river stage for the calculated discharge value. 2) Observed flood from 1999 to 2007, obtained from the Dartmouth Flood Observatory (DFO). 3) The frequency was set using the frequency from UNEP/GRID-Europe PREVIEW flood dataset. In area where no information was available, it was set to 50 years returning period. Unit is expected average number of event per 100 years. This product was designed by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing UNEP/GRID-Europe, with key support from USGS EROS Data Center, Dartmouth Flood Observatory 2008",
                "title": "Flood frequency"
            },
            "Disaster\\Flood_ecoexp.tif": {
                "index": "142",
                "category": "Disaster",
                "source": "This dataset includes an estimate of the annual economical exposition to flood. It is based on four sources: 1) A GIS modeling using a statistical estimation of peak-flow magnitude and a hydrological model using HydroSHEDS dataset and the Manning equation to estimate river stage for the calculated discharge value. 2) Observed flood from 1999 to 2007, obtained from the Dartmouth Flood Observatory (DFO). 3) The frequency was set using the frequency from UNEP/GRID-Europe PREVIEW flood dataset. In area where no information was available, it was set to 50 years returning period. 4) A population grid for the year 2010, provided by LandScanTM Global Population Database (Oak Ridge, TN: Oak Ridge National Laboratory). 4) A Global Domestic Product grid for the year 2010, provided by the World Bank. Unit is expected average annual GDP (2010 as the year of reference) exposed in (US $, year 2000 equivalent). This product was designed by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing UNEP/GRID-Europe, with key support from USGS EROS Data Center, Dartmouth Flood Observatory 2008",
                "title": "Economical exposition to flood"
            },
            "Disaster\\Earthquake_physexp9.tif": {
                "index": "143",
                "category": "Disaster",
                "source": "This dataset includes an estimate the annual economical exposition to earthquakes of MMI categories higher than 9 over the period 1973-2007. It is based on two data sources: 1) Modified Mercalli Intensity map available in the Shakemap Atlas from USGS. 2) A population grid for the year 2010, provided by LandScanTM Global Population Database (Oak Ridge, TN: Oak Ridge National Laboratory). Unit is expected average annual population (2010 as the year of reference) exposed (inhabitants). This product was compiled by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing Shakemap Atlas from USGS, compilation and global hazard distribution UNEP/GRID-Europe",
                "title": "Physical exposure to earthquakes of MMI categories higher than 9 1973-2007"
            },
            "Disaster\\Earthquake_physexp8.tif": {
                "index": "144",
                "category": "Disaster",
                "source": "This dataset includes an estimate the annual economical exposition to earthquakes of MMI categories higher than 8 over the period 1973-2007. It is based on two data sources: 1) Modified Mercalli Intensity map available in the Shakemap Atlas from USGS. 2) A population grid for the year 2010, provided by LandScanTM Global Population Database (Oak Ridge, TN: Oak Ridge National Laboratory). Unit is expected average annual population (2010 as the year of reference) exposed (inhabitants). This product was compiled by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing Shakemap Atlas from USGS, compilation and global hazard distribution UNEP/GRID-Europe",
                "title": "Physical exposure to earthquakes of MMI categories higher than 8 1973-2007"
            },
            "Disaster\\Earthquake_physexp7.tif": {
                "index": "145",
                "category": "Disaster",
                "source": "This dataset includes an estimate the annual economical exposition to earthquakes of MMI categories higher than 7 over the period 1973-2007. It is based on two data sources: 1) Modified Mercalli Intensity map available in the Shakemap Atlas from USGS. 2) A population grid for the year 2010, provided by LandScanTM Global Population Database (Oak Ridge, TN: Oak Ridge National Laboratory). Unit is expected average annual population (2010 as the year of reference) exposed (inhabitants). This product was compiled by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing Shakemap Atlas from USGS, compilation and global hazard distribution UNEP/GRID-Europe",
                "title": "Physical exposure to earthquakes of MMI categories higher than 7 1973-2007"
            },
            "Disaster\\Earthquake_physexp5.tif": {
                "index": "146",
                "category": "Disaster",
                "source": "This dataset includes an estimate the annual economical exposition to earthquakes of MMI categories higher than 5 over the period 1973-2007. It is based on two data sources: 1) Modified Mercalli Intensity map available in the Shakemap Atlas from USGS. 2) A population grid for the year 2010, provided by LandScanTM Global Population Database (Oak Ridge, TN: Oak Ridge National Laboratory). Unit is expected average annual population (2010 as the year of reference) exposed (inhabitants). This product was compiled by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing Shakemap Atlas from USGS, compilation and global hazard distribution UNEP/GRID-Europe",
                "title": "Physical exposure to earthquakes of MMI categories higher than 5 1973-2007"
            },
            "Disaster\\Earthquake_frequency.tif": {
                "index": "147",
                "category": "Disaster",
                "source": "This dataset includes an estimate of earthquake frequency of MMI categories higher than 9 over the period 1973-2007. It is based on Modified Mercalli Intensity map available in the Shakemap Atlas from USGS. Unit is expected average number of events per 1000 years. This product was compiled by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing Shakemap Atlas from USGS, compilation and global hazard distribution UNEP/GRID-Europe",
                "title": "Earthquakes frequency for MMI categories higher than 9 1973-2007"
            },
            "Disaster\\Earthquake_ecoexp9.tif": {
                "index": "148",
                "category": "Disaster",
                "source": "This dataset includes an estimate the annual economical exposition to earthquakes of MMI categories higher than 9 over the period 1973-2007. It is based on two data sources: 1) Modified Mercalli Intensity map available in the Shakemap Atlas from USGS. 2) A Global Domestic Product grid for the year 2010, provided by the World Bank. Unit is expected average annual GDP (2010 as the year of reference) exposed in (US $, year 2000 equivalent) . This product was compiled by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing Shakemap Atlas from USGS, compilation and global hazard distribution UNEP/GRID-Europe",
                "title": "Economical exposure to earthquakes of MMI categories higher than 9 1973-2007"
            },
            "Disaster\\Earthquake_ecoexp8.tif": {
                "index": "149",
                "category": "Disaster",
                "source": "This dataset includes an estimate the annual economical exposition to earthquakes of MMI categories higher than 8 over the period 1973-2007. It is based on two data sources: 1) Modified Mercalli Intensity map available in the Shakemap Atlas from USGS. 2) A Global Domestic Product grid for the year 2010, provided by the World Bank. Unit is expected average annual GDP (2010 as the year of reference) exposed in (US $, year 2000 equivalent) . This product was compiled by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing Shakemap Atlas from USGS, compilation and global hazard distribution UNEP/GRID-Europe",
                "title": "Economical exposure to earthquakes of MMI categories higher than 8 1973-2007"
            },
            "Disaster\\Earthquake_ecoexp7.tif": {
                "index": "150",
                "category": "Disaster",
                "source": "This dataset includes an estimate the annual economical exposition to earthquakes of MMI categories higher than 7 over the period 1973-2007. It is based on two data sources: 1) Modified Mercalli Intensity map available in the Shakemap Atlas from USGS. 2) A Global Domestic Product grid for the year 2010, provided by the World Bank. Unit is expected average annual GDP (2010 as the year of reference) exposed in (US $, year 2000 equivalent) . This product was compiled by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing Shakemap Atlas from USGS, compilation and global hazard distribution UNEP/GRID-Europe",
                "title": "Economical exposure to earthquakes of MMI categories higher than 7 1973-2007"
            },
            "Disaster\\Earthquake_ecoexp5.tif": {
                "index": "151",
                "category": "Disaster",
                "source": "This dataset includes an estimate the annual economical exposition to earthquakes of MMI categories higher than 5 over the period 1973-2007. It is based on two data sources: 1) Modified Mercalli Intensity map available in the Shakemap Atlas from USGS. 2) A Global Domestic Product grid for the year 2010, provided by the World Bank. Unit is expected average annual GDP (2010 as the year of reference) exposed in (US $, year 2000 equivalent) . This product was compiled by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing Shakemap Atlas from USGS, compilation and global hazard distribution UNEP/GRID-Europe",
                "title": "Economical exposure to earthquakes of MMI categories higher than 5 1973-2007"
            },
            "Disaster\\Drought_physexp.tif": {
                "index": "152",
                "category": "Disaster",
                "source": "This dataset includes an estimation of the annual physical exposition to drought based on Standardized Precipitation Index. It is based on three sources: 1) A global monthly gridded precipitation dataset obtained from the Climatic Research Unit (University of East Anglia). 2) A GIS modelling of global Standardized Precipitation Index based on Brad Lyon (IRI, Columbia University) methodology. 3) A population grid for the year 2010, provided by LandScanTM Global Population Database (Oak Ridge, TN: Oak Ridge National Laboratory). Unit is expected average annual population (2010 as the year of reference) exposed (inhabitants). This product was designed by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modelled using global data. Credit: GIS processing UNEP/GRID-Europe",
                "title": "Physical exposition to droughts events 1980-2001"
            },
            "Disaster\\Drought_ecoexp.tif": {
                "index": "153",
                "category": "Disaster",
                "source": "This dataset includes an estimation of the annual economical exposition to drought based on Standardized Precipitation Index. It is based on three sources: 1) A global monthly gridded precipitation dataset obtained from the Climatic Research Unit (University of East Anglia). 2) A GIS modeling of global Standardized Precipitation Index based on Brad Lyon (IRI, Columbia University) methodology. 3) A Global Domestic Product grid for the year 2010, provided by the World Bank. Unit is expected average annual GDP (2007 as the year of reference) exposed in (US $, year 2000 equivalent) . This product was designed by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: GIS processing UNEP/GRID-Europe",
                "title": "Economical exposition to droughts events 1980-2001"
            },
            "Disaster\\Cyclone_physexp.tif": {
                "index": "154",
                "category": "Disaster",
                "source": "This dataset includes an estimation of the annual physical exposition to tropical cyclones of Saffir-Simpson category 5. It is based on three sources: 1) IBTrACS v02r01 (1969 - 2008, http://www.ncdc.noaa.gov/oa/ibtracs/), year 2009 completed by online data from JMA, JTWC, UNISYS, Meteo France and data sent by Alan Sharp from the Australian Bureau of Meteorology. 2) A GIS modeling based on an initial equation from Greg Holland, which was further modified to take into consideration the movement of the cyclones through time. 3) A population grid for the year 2010, provided by LandScanTM Global Population Database (Oak Ridge, TN: Oak Ridge National Laboratory). Unit is expected average annual population (2010 as the year of reference) exposed (inhabitants). This product was designed by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: Raw data: IBTrACS, compilation and GIS processing UNEP/GRID-Europe",
                "title": "Physical exposition to tropical cyclone of Saffir-Simpson category 5 1970-2009"
            },
            "Disaster\\Cyclone_freq.tif": {
                "index": "155",
                "category": "Disaster",
                "source": "This dataset includes an estimate of tropical cyclone frequency of Saffir-Simpson category 5. It is based on two sources: 1) IBTrACS v02r01 (1969 - 2008, http://www.ncdc.noaa.gov/oa/ibtracs/), year 2009 completed by online data from JMA, JTWC, UNISYS, Meteo France and data sent by Alan Sharp from the Australian Bureau of Meteorology. 2) A GIS modeling based on an initial equation from Greg Holland, which was further modified to take into consideration the movement of the cyclones through time. Unit is expected average number of event per 100 years multiplied by 100. This product was designed by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: Raw data: IBTrACS, compilation and GIS processing UNEP/GRID-Europe",
                "title": "Tropical cyclone frequency of Saffir-Simpson category 5 1970-2009"
            },
            "Disaster\\Cyclone_ecoexp.tif": {
                "index": "156",
                "category": "Disaster",
                "source": "This dataset includes an estimation of the annual economical exposition to tropical cyclones of Saffir-Simpson category 5. It is based on three sources: 1) IBTrACS v02r01 (1969 - 2008, http://www.ncdc.noaa.gov/oa/ibtracs/), year 2009 completed by online data from JMA, JTWC, UNISYS, Meteo France and data sent by Alan Sharp from the Australian Bureau of Meteorology. 2) A GIS modeling based on an initial equation from Greg Holland, which was further modified to take into consideration the movement of the cyclones through time. 3) A Global Domestic Product grid for the year 2010, provided by the World Bank. Unit is expected average annual GDP (2010 as the year of reference) exposed in (US $, year 2000 equivalent) . This product was designed by UNEP/GRID-Europe for the Global Assessment Report on Risk Reduction (GAR). It was modeled using global data. Credit: Raw data: IBTrACS, compilation and GIS processing UNEP/GRID-Europe",
                "title": "Economical exposition to tropical cyclone of Saffir-Simpson category 5 1970-2009"
            },
            "Ecosystem\\Adjusted_HWS_Threat.tif": {
                "index": "30",
                "category": "Ecosystem",
                "source": "Rivers maintain unique biotic resources and provide critical water supplies to people. The Earth's limited supplies of fresh water and irreplaceable biodiversity are vulnerable to human mismanagement of watersheds and waterways. Multiple environmental stressors, such as agricultural runoff, pollution and invasive species, threaten rivers that serve 80 percent of the world’s population. These same stressors endanger the biodiversity of 65 percent of the world’s river habitats putting thousands of aquatic wildlife species at risk. Efforts to abate fresh water degradation through highly engineered solutions are effective at reducing the impact of threats but at a cost that can be an economic burden and often out of reach for developing nations.",
                "title": "Adjusted Human Water Security Threat"
            },
            "Ecosystem\\glc_art.tif": {
                "index": "31",
                "category": "Ecosystem",
                "source": "Artificial surfaces and associated areas (urban areas greater than 50%), class 190, are extracted from the GlobCover Land Cover v22 map with a resolution of 300m.",
                "title": "Artificial Surfaces and Associated Areas - from GlobCover Land Cover (v2.2)"
            },
            "Ecosystem\\tree_umd.tif": {
                "index": "32",
                "category": "Ecosystem",
                "source": "This prototype data set contains 1km cells estimating percent tree cover. Each pixel in the layers has a value between 10 and 80 percent. These layers can be directly used as parameters in models or aggregated into more conventional land cover maps. For the latter, the product offers the flexibility to derive land cover maps based on user's requirements for a particular application. The product is intended for use in terrestrial carbon cycle models, in conjunction with other spatial data sets such as climate and soil type, to obtain more consistent and reliable estimates of carbon stocks. Data acquired in 1992-93 from NOAA's AVHRR at a 1km spatial resolution and processed under the guidance of the International Geosphere Biosphere Program (IGBP) (Eidenshink and Faudeen 1994) were used to derive the tree cover, leaf type and leaf longevity maps.",
                "title": "Continuous Fields Tree Cover"
            },
            "Ecosystem\\soil_water.tif": {
                "index": "33",
                "category": "Ecosystem",
                "source": "This is an indicator for the amount of stored soil moisture readily available to crops.The water retention at 2 bar suction is used to separate easily available water (EAV) from water which is more tightly held at higher suctions and difficult to abstract, especially from deeper subsoils; and in the use of a conceptual model of effective rooting depth.",
                "title": "Easy Available Water"
            },
            "Ecosystem\\igbp.tif": {
                "index": "34",
                "category": "Ecosystem",
                "source": "The U.S. Geological Survey (USGS), the University of Nebraska-Lincoln (UNL), and the European Commission's Joint Research Centre (JRC) have generated a 1-km resolution global land cover characteristics data base for use in a wide range of environmental research and modeling applications. The global land cover characteristics database was developed on a continent-by-continent basis. All continental databases share the same map projections (Interrupted Goode Homolosine and Lambert Azimuthal Equal Area), have 1-km nominal spatial resolution, and are based on 1-km Advanced Very High Resolution Radiometer (AVHRR) data spanning April 1992 through March 1993.",
                "title": "Global 1km Land Cover - IGBP Legend"
            },
            "Ecosystem\\olson.tif": {
                "index": "35",
                "category": "Ecosystem",
                "source": "The U.S. Geological Survey (USGS), the University of Nebraska-Lincoln (UNL), and the European Commission's Joint Research Centre (JRC) have generated a 1-km resolution global land cover characteristics data base for use in a wide range of environmental research and modeling applications. The global land cover characteristics database was developed on a continent-by-continent basis. All continental databases share the same map projections (Interrupted Goode Homolosine and Lambert Azimuthal Equal Area), have 1-km nominal spatial resolution, and are based on 1-km Advanced Very High Resolution Radiometer (AVHRR) data spanning April 1992 through March 1993.",
                "title": "Global 1km Land Cover - Olson Global Ecosystem Legend"
            },
            "Ecosystem\\umd.tif": {
                "index": "36",
                "category": "Ecosystem",
                "source": "AVHRR data were resampled to a spatial resolution of one by one degree and used to carry out a conventional, supervised classification of global land cover. Classifications have also proceeded at a finer spatial resolution of 8km at a continental scale. In addition to describing vegetative cover according to topological schemes, the project has explored methodologies to represent vegetative cover more realistically as gradients and mosaics of cover types. To identify the pixels to be used for training of the 1 km AVHRR Pathfinder data, we collected a total of over 200 high resolution scenes of which we were confident of which cover type occurs. Most of the scenes used were acquired by the Landsat Multispectral Scanner System (MSS), and a few by Landsat Thematic Mapper and the LISS (Linear Imaging Self-Scanning Sensor), These training data provide the basis for carrying out a global land cover classification. They also provide data for validating other land cover classification products. The methodology and Landsat images used for deriving these training data for classification of AVHRR data at 8km resolution can also be applied to 1km AVHRR data and, in the future, MODIS data at 250m and 500m resolution. For a full description of the data set, please see: Hansen, M., DeFries, R., Townshend, J. R. G. and Sohlberg, R., 2000, Global land cover classification at 1km resolution using a decision tree classifier, International Journal of Remote Sensing. 21: 1331-1365.",
                "title": "Global 1Km Land Cover - UMD Legend"
            },
            "Ecosystem\\africa_ford.tif": {
                "index": "37",
                "category": "Ecosystem",
                "source": "Modified mixture analysis, geographic stratification, and other classification techniques were used to estimate forest canopy density within 1 square kilometer pixels, which formed the basis for the first two classes: the closed forest (40% - 100% canopy cover), and open or fragmented forest (10 - 40% canopy cover).",
                "title": "Global Forest Canopy Density Africa"
            },
            "Ecosystem\\asia_pac_ford.tif": {
                "index": "38",
                "category": "Ecosystem",
                "source": "Modified mixture analysis, geographic stratification, and other classification techniques were used to estimate forest canopy density within 1 square kilometer pixels, which formed the basis for the first two classes: the closed forest (40% - 100% canopy cover), and open or fragmented forest (10 - 40% canopy cover).",
                "title": "Global Forest Canopy Density Asia Pacific"
            },
            "Ecosystem\\europe_ford.tif": {
                "index": "39",
                "category": "Ecosystem",
                "source": "Modified mixture analysis, geographic stratification, and other classification techniques were used to estimate forest canopy density within 1 square kilometer pixels, which formed the basis for the first two classes: the closed forest (40% - 100% canopy cover), and open or fragmented forest (10 - 40% canopy cover).",
                "title": "Global Forest Canopy Density Europe"
            },
            "Ecosystem\\la_america_ford.tif": {
                "index": "40",
                "category": "Ecosystem",
                "source": "Modified mixture analysis, geographic stratification, and other classification techniques were used to estimate forest canopy density within 1 square kilometer pixels, which formed the basis for the first two classes: the closed forest (40% - 100% canopy cover), and open or fragmented forest (10 - 40% canopy cover).",
                "title": "Global Forest Canopy Density Latin America and Caribbean"
            },
            "Ecosystem\\n_america_ford.tif": {
                "index": "41",
                "category": "Ecosystem",
                "source": "Modified mixture analysis, geographic stratification, and other classification techniques were used to estimate forest canopy density within 1 square kilometer pixels, which formed the basis for the first two classes: the closed forest (40% - 100% canopy cover), and open or fragmented forest (10 - 40% canopy cover).",
                "title": "Global Forest Canopy Density North America"
            },
            "Ecosystem\\w_asia_ford.tif": {
                "index": "42",
                "category": "Ecosystem",
                "source": "Modified mixture analysis, geographic stratification, and other classification techniques were used to estimate forest canopy density within 1 square kilometer pixels, which formed the basis for the first two classes: the closed forest (40% - 100% canopy cover), and open or fragmented forest (10 - 40% canopy cover).",
                "title": "Global Forest Canopy Density West Asia"
            },
            "Ecosystem\\africa_forc.tif": {
                "index": "43",
                "category": "Ecosystem",
                "source": "The forest cover map, produced at the U.S. Geological Survey (USGS) EROS Data Center (EDC), has five classes: closed forest, open or fragmented forest, other wooded land, other land cover, and water. The classes were delineated based on circa 1995 monthly AVHRR composite images processed using a hybrid maximum-NDVI and minimum-red compositing technique. Grid Legend: 0=Ocean, 1=Closed Forest, 2=Open or Fragmented Forest, 3=Other Wooded Land, 4=Other Land Cover, 5=Water",
                "title": "Global Forest Cover Africa"
            },
            "Ecosystem\\asia_pac_forc.tif": {
                "index": "44",
                "category": "Ecosystem",
                "source": "The forest cover map, produced at the U.S. Geological Survey (USGS) EROS Data Center (EDC), has five classes: closed forest, open or fragmented forest, other wooded land, other land cover, and water. The classes were delineated based on circa 1995 monthly AVHRR composite images processed using a hybrid maximum-NDVI and minimum-red compositing technique. Grid Legend: 0=Ocean, 1=Closed Forest, 2=Open or Fragmented Forest, 3=Other Wooded Land, 4=Other Land Cover, 5=Water",
                "title": "Global Forest Cover Asia Pacific"
            },
            "Ecosystem\\europe_forc.tif": {
                "index": "45",
                "category": "Ecosystem",
                "source": "The forest cover map, produced at the U.S. Geological Survey (USGS) EROS Data Center (EDC), has five classes: closed forest, open or fragmented forest, other wooded land, other land cover, and water. The classes were delineated based on circa 1995 monthly AVHRR composite images processed using a hybrid maximum-NDVI and minimum-red compositing technique. Grid Legend: 0=Ocean, 1=Closed Forest, 2=Open or Fragmented Forest, 3=Other Wooded Land, 4=Other Land Cover, 5=Water",
                "title": "Global Forest Cover Europe"
            },
            "Ecosystem\\la_america_forc.tif": {
                "index": "46",
                "category": "Ecosystem",
                "source": "The forest cover map, produced at the U.S. Geological Survey (USGS) EROS Data Center (EDC), has five classes: closed forest, open or fragmented forest, other wooded land, other land cover, and water. The classes were delineated based on circa 1995 monthly AVHRR composite images processed using a hybrid maximum-NDVI and minimum-red compositing technique. Grid Legend: 0=Ocean, 1=Closed Forest, 2=Open or Fragmented Forest, 3=Other Wooded Land, 4=Other Land Cover, 5=Water",
                "title": "Global Forest Cover Latin America and Caribbean"
            },
            "Ecosystem\\n_america_forc.tif": {
                "index": "47",
                "category": "Ecosystem",
                "source": "The forest cover map, produced at the U.S. Geological Survey (USGS) EROS Data Center (EDC), has five classes: closed forest, open or fragmented forest, other wooded land, other land cover, and water. The classes were delineated based on circa 1995 monthly AVHRR composite images processed using a hybrid maximum-NDVI and minimum-red compositing technique. Grid Legend: 0=Ocean, 1=Closed Forest, 2=Open or Fragmented Forest, 3=Other Wooded Land, 4=Other Land Cover, 5=Water",
                "title": "Global Forest Cover North America"
            },
            "Ecosystem\\w_asia_forc.tif": {
                "index": "48",
                "category": "Ecosystem",
                "source": "The forest cover map, produced at the U.S. Geological Survey (USGS) EROS Data Center (EDC), has five classes: closed forest, open or fragmented forest, other wooded land, other land cover, and water. The classes were delineated based on circa 1995 monthly AVHRR composite images processed using a hybrid maximum-NDVI and minimum-red compositing technique. Grid Legend: 0=Ocean, 1=Closed Forest, 2=Open or Fragmented Forest, 3=Other Wooded Land, 4=Other Land Cover, 5=Water",
                "title": "Global Forest Cover West Asia"
            },
            "Ecosystem\\glasod.tif": {
                "index": "49",
                "category": "Ecosystem",
                "source": "Soil degradation Severity : Overall severity by which the polygon is affected by soil degradation. This item takes the degree and extent of both types into account. For the classification from 1 (low) to 4 (very high), a look-up table created by ISRIC was used. This item should be used for mapping only, not for area calculations!",
                "title": "Human Induced Soil Degradation (GLASOD)"
            },
            "Ecosystem\\irrig_land.tif": {
                "index": "50",
                "category": "Ecosystem",
                "source": "The map depicts the fraction of each 5 min by 5 min cell (9.25 km x 9.25 km at the equator) cell that was equipped for irrigation around 1995. It has been derived by combining statistical data on the area quipped for irrigation within administrative units (counties, districts, federal states, countries) and geographical information on the location of irrigated areas (point, polygon and raster format)",
                "title": "Irrigated Areas"
            },
            "Ecosystem\\growing.tif": {
                "index": "51",
                "category": "Ecosystem",
                "source": "The concept of the length of the available growing period (LGP) combines temperature and moisture considerations to determine the length of time crops are able to grow, hence excluding periods which are too cold or too dry or both. LGP refers to the number of days within the period of temperatures above 5degC when moisture conditions are considered adequate. Under rain-fed conditions, the begin of the LGP is linked to the start of the rainy season. The growing period for most crops continues beyond the rainy season and, to a greater or lesser extent, crops mature on moisture stored in the soil profile",
                "title": "Length of Available Growing Period"
            },
            "Ecosystem\\grain_h.tif": {
                "index": "53",
                "category": "Ecosystem",
                "source": "The potential grain production per person estimates combine potential total food production in an area with actual population living there. This is an indicator for local food self sufficiency which does not take into account internal or external trade.",
                "title": "Potential Grain Production per Person - High Inputs"
            },
            "Ecosystem\\grain_l.tif": {
                "index": "52",
                "category": "Ecosystem",
                "source": "The potential grain production per person estimate combines potential total food production in an area with the actual population living there. This is an indicator for local food self sufficiency which does not take into account internal or external trade. It is generally estimated that 250 - 500 kg grain per year is required per person to have an adequate diet. The method used is a generalization of the land class approach in which each major AT 2010 zone is associated with an overall agricultural production potential (at low inputs corresponding to 1.2 Ton/ha for the best land) and the soil productivity index is associated with this potential to incorporate the extent of potentially available agricultural land. The result is then divided by the population in the area to obtain an approximation of what amount of grain would be available to each person.",
                "title": "Potential Grain Production per Person - Low Inputs"
            },
            "Ecosystem\\food_l.tif": {
                "index": "54",
                "category": "Ecosystem",
                "source": "The potential food production in an area is indicated by the anticipated yield level calculated on the basis of a land class potential yield for low inputs and the extent of suitable land in the pixel.",
                "title": "Potential Rainfed Food Production - Low Inputs"
            },
            "Ecosystem\\soil_prod.tif": {
                "index": "55",
                "category": "Ecosystem",
                "source": "The soil production index considers the suitability of the best adapted crop to each soil’s condition in an area and makes a weighted average for all soils present in a pixel based on the formula: 0.9 * VS + 0.6 * S + 0.3 * MS + 0 * NS",
                "title": "Soil Production Index"
            },
            "Ecosystem\\access_50k.tif": {
                "index": "56",
                "category": "Ecosystem",
                "source": "A new map of Travel Time to Major Cities - developed by the European Commission and the World Bank - captures this connectivity and the concentration of economic activity and also highlights that there is little wilderness left. The map shows how accessible some parts of the world have become whilst other regions have remained isolated.",
                "title": "Traveltime to Major Cities A Global Map of Accessibility"
            },
            "Ecosystem\\wwf_bioeco.tif": {
                "index": "57",
                "category": "Ecosystem",
                "source": "An ecoregion is defined as a large area of land or water that contains a geographically distinct assemblage of natural communities that (a) share a large majority of their species and ecological dynamics; (b) share similar environmental conditions, and; (c) interact ecologically in ways that are critical for their long-term persiste. BIOME (Formally known as Major Habitat Types or MHTs) - Broad kinds of ecoregions that: a) Experience comparable climatic regimes; b) Have similar vegetation structure; c) Display similar spatial patterns of biodiversity; and d) Contain flora and fauna with similar guild structures and life histories. e) Similar minimum requirements and thresholds for maintaining certain biodiversity features. f) Have similar sensitivities to human disturbance.",
                "title": "WWF Ecoregions - Major Habitat Types (Biomes) Legend"
            },
            "Ecosystem\\wwf_ecoreg_tot_po.tif": {
                "index": "58",
                "category": "Ecosystem",
                "source": "An ecoregion is defined as a large area of land or water that contains a geographically distinct assemblage of natural communities that (a) share a large majority of their species and ecological dynamics; (b) share similar environmental conditions, and; (c) interact ecologically in ways that are critical for their long-term persiste. The Conservation Science Program has identified 825 terrestrial ecoregions across the globe, and a set of approximately 500 freshwater ecoregions is under development.",
                "title": "WWF Ecoregions - Terrestrial Ecoregions Legend"
            },
            "DEM\\etopo5_all.tif": {
                "index": "28",
                "category": "Elevation",
                "source": "ETOPO5 was generated from a digital data base of land and sea- floor elevations on a 5-minute latitude/longitude grid. The resolution of the gridded data varies from true 5-minute for the ocean floors, the USA., Europe, Japan,and Australia to 1 degree in data-deficient parts of Asia, South America, northern Canada, and Africa. Data sources are as follows: Ocean Areas: US Naval Oceanographic Ofice; USA., W. Europe, Japan/Korea: US Defense Mapping Agency; Australia: Bureau of Mineral Resources, Australia; New Zealand: Department of Industrial and Scientific Research, New Zealand; balance of world land masses: US Navy Fleet Numerical Oceanographic Center. These various data bases were originally assembled in 1988 into the worldwide 5-minute grid by Margo Edwards, then at Washington University, St. Louis, MO. The ETOPO5 data may be credited in publications by reference to \"Data Announcement 88-MGG-02, Digital relief of the Surface of the Earth. NOAA, National Geophysical Data Center, Boulder, Colorado, 1988.\" The version of the data making up ETOPO5 is from May, 1988, with the exception of a small area in Canada (120-130 W, 65-70 N), which was regridded in 1990.",
                "title": "All DEM 5 minutes"
            },
            "Emissions\\total_ch4_90.tif": {
                "index": "65",
                "category":"Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC)",
                "title": "Emissions of CH4 - from All Anthropogenic Sources (Model Estimations, RIVM-MNP) World 1990"
            },
            "Emissions\\total_ch4_95.tif": {
                "index": "64",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC)",
                "title": "Emissions of CH4 - from All Anthropogenic Sources (Model Estimations, RIVM-MNP) World 1995"
            },
            "Emissions\\animal_ch4_90.tif": {
                "index": "77",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC) Methane production from herbivores is a by-product of enteric Emissions of CH4 from animal breeding corresponds to IPCC category 4A. All Anthropogenic Sources also includes international air traffic and international shipping.",
                "title": "Emissions of CH4 - from Animal Breeding Enteric Fermentation (Model Estimations, RIVM-MNP) World 1990"
            },
            "Emissions\\animal_ch4_95.tif": {
                "index": "76",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC) Methane production from herbivores is a by-product of enteric Emissions of CH4 from animal breeding corresponds to IPCC category 4A. All Anthropogenic Sources also includes international air traffic and international shipping.",
                "title": "Emissions of CH4 - from Animal Breeding Enteric Fermentation (Model Estimations, RIVM-MNP) World 1995"
            },
            "Emissions\\total_co2_90.tif": {
                "index": "63",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC)",
                "title": "Emissions of CO2 - from All Anthropogenic Sources (Model Estimations, RIVM-MNP) World 1990"
            },
            "Emissions\\total_co2_95.tif": {
                "index": "62",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC)",
                "title": "Emissions of CO2 - from All Anthropogenic Sources (Model Estimations, RIVM-MNP) World 1995"
            },
            "Emissions\\cement_co2_90.tif": {
                "index": "75",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC)",
                "title": "Emissions of CO2 - from Cement Production (Model Estimations, RIVM-MNP) World 1990"
            },
            "Emissions\\cement_co2_95.tif": {
                "index": "74",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC)",
                "title": "Emissions of CO2 - from Cement Production (Model Estimations, RIVM-MNP) World 1995"
            },
            "Emissions\\power_co2_90.tif": {
                "index": "71",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC) Emissions of co2 from Power Generation (public and auto, including cogeneration) corresponds to IPCC category 1A1a.",
                "title": "Emissions of CO2 - from Power Generation (Model Estimations, RIVM-MNP) World 1990"
            },
            "Emissions\\power_co2_95.tif": {
                "index": "70",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC) Emissions of co2 from Power Generation (public and auto, including cogeneration) corresponds to IPCC category 1A1a.",
                "title": "Emissions of CO2 - from Power Generation (Model Estimations, RIVM-MNP) World 1995"
            },
            "Emissions\\resid_co2_90.tif": {
                "index": "69",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC) Emissions of co2 from Residential, Commercials and Other sector corresponds to IPCC category 1A4.",
                "title": "Emissions of CO2 - from Residentials, Commercials and Other Sector (Model Estimations, RIVM-MNP) World 1990"
            },
            "Emissions\\resid_co2_95.tif": {
                "index": "68",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC) Emissions of co2 from Residential, Commercials and Other sector corresponds to IPCC category 1A4.",
                "title": "Emissions of CO2 - from Residentials, Commercials and Other Sector (Model Estimations, RIVM-MNP) World 1995"
            },
            "Emissions\\road_co2_90.tif": {
                "index": "67",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC) Emissions of co2 from transport road corresponds to IPCC category 1A3b.",
                "title": "Emissions of CO2 - from Transport Road (Model Estimations, RIVM-MNP) World 1990"
            },
            "Emissions\\road_co2_95.tif": {
                "index": "66",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC) Emissions of co2 from transport road corresponds to IPCC category 1A3b.",
                "title": "Emissions of CO2 - from Transport Road (Model Estimations, RIVM-MNP) World 1995"
            },
            "Emissions\\total_n2o_90.tif": {
                "index": "61",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC)",
                "title": "Emissions of N2O - from All Anthropogenic Sources (Model Estimations, RIVM-MNP) World 1990"
            },
            "Emissions\\total_n2o_95.tif": {
                "index": "60",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC)",
                "title": "Emissions of N2O - from All Anthropogenic Sources (Model Estimations, RIVM-MNP) World 1995"
            },
            "Emissions\\fertil_n2o_90.tif": {
                "index": "73",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC) Emissions of N2O from fertilizer use in arable land: synthetic and animal waste handling.",
                "title": "Emissions of N2O - from Fertilizer Use in Arable Land (Model Estimations, RIVM-MNP) World 1990"
            },
            "Emissions\\fertil_n2o_95.tif": {
                "index": "72",
                "category": "Emissions",
                "source": "A global emissions source database called EDGAR has been developed jointly by TNO and RIVM to meet the urgent need of atmospheric chemistry and climate modellers and the need of policy-makers. The EDGAR database was to estimate the annual emissions of direct and indirect greenhouse gases (CO2, CH4, N2O; CO, NOx, non-methane VOC; SO2), including ozone-depleting compounds (halocarbons) for 1990 on a regional and grid basis. To meet the aim of establishing the global emissions from both anthropogenic and biogenic sources, a complete set of data would be required to estimate the total source strength of the various gases with a 1x1 degree resolution (altitude resolution of 1 km), as agreed upon in the Global Emissions Inventory Activity (GEIA) of the International Atmospheric Chemistry Programme (IGAC) Emissions of N2O from fertilizer use in arable land: synthetic and animal waste handling.",
                "title": "Emissions of N2O - from Fertilizer Use in Arable Land (Model Estimations, RIVM-MNP) World 1995"
            },
            "Misc\\cereal_suit.tif": {
                "index": "26",
                "category": "Misc",
                "source": "In each area the biophysical suitability to grow 4 grain crops have been compared: rice, wheat, maize and sorghum and a yield estimate arrived at. This yield estimate was then weighted according to present market prices for the crop and the highest value arrived at was used to select the best suited cereal",
                "title": "Most Suitable Cereal"
            },
            "Population\\pop_90.tif": {
                "index": "83",
                "category": "Population",
                "source": "Gridded Population of the World, Version 3 (GPWv3) consists of estimates of human population for the years 1990, 1995, and 2000 by 2.5 arc-minute grid cells and associated datasets dated circa 2000). Population counts adjusted to match UN totals.",
                "title": "1990 Gridded Population of the World - Population"
            },
            "Population\\pop_95.tif": {
                "index": "84",
                "category": "Population",
                "source": "Gridded Population of the World, Version 3 (GPWv3) consists of estimates of human population for the years 1990, 1995, and 2000 by 2.5 arc-minute grid cells and associated datasets dated circa 2000). Population counts adjusted to match UN totals.",
                "title": "1995 Gridded Population of the World - Population"
            },
            "Population\\pop_00.tif": {
                "index": "85",
                "category": "Population",
                "source": "Gridded Population of the World, Version 3 (GPWv3) consists of estimates of human population for the years 1990, 1995, and 2000 by 2.5 arc-minute grid cells and associated datasets dated circa 2000). Population counts adjusted to match UN totals.",
                "title": "2000 Gridded Population of the World - Population"
            },
            "Population\\pop_05.tif": {
                "index": "86",
                "category": "Population",
                "source": "Gridded Population of the World, Version 3 (GPWv3) consists of estimates of human population for the years 1990, 1995, and 2000 by 2.5 arc-minute grid cells and associated datasets dated circa 2000). Population counts adjusted to match UN totals.",
                "title": "Future 2005 Gridded Population of the World - Population"
            },
            "Population\\popd_90.tif": {
                "index": "79",
                "category": "Population",
                "source": "Gridded Population of the World, Version 3 (GPWv3) consists of estimates of human population for the years 1990, 1995, and 2000 by 2.5 arc-minute grid cells and associated datasets dated circa 2000). Population counts adjusted to match UN totals.",
                "title": "1990 Gridded Population of the World - Population Density"
            },
            "Population\\popd_95.tif": {
                "index": "80",
                "category": "Population",
                "source": "Gridded Population of the World, Version 3 (GPWv3) consists of estimates of human population for the years 1990, 1995, and 2000 by 2.5 arc-minute grid cells and associated datasets dated circa 2000). Population counts adjusted to match UN totals.",
                "title": "1995 Gridded Population of the World - Population Density"
            },
            "Population\\popd_00.tif": {
                "index": "81",
                "category": "Population",
                "source": "Gridded Population of the World, Version 3 (GPWv3) consists of estimates of human population for the years 1990, 1995, and 2000 by 2.5 arc-minute grid cells and associated datasets dated circa 2000). Population counts adjusted to match UN totals.",
                "title": "2000 Gridded Population of the World - Population Density"
            },
            "Population\\popd_05.tif": {
                "index": "82",
                "category": "Population",
                "source": "Gridded Population of the World, Version 3 (GPWv3) consists of estimates of human population for the years 1990, 1995, and 2000 by 2.5 arc-minute grid cells and associated datasets dated circa 2000). Population counts adjusted to match UN totals.",
                "title": "Future 2005 Gridded Population of the World - Population Density"
            },
            "Temperature\\Max\\tmax_1": {
                "index": "1",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Maximum Temperature - January"
            },
            "Temperature\\Max\\tmax_2": {
                "index": "2",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Maximum Temperature - February"
            },
            "Temperature\\Max\\tmax_3": {
                "index": "3",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Maximum Temperature - March"
            },
            "Temperature\\Max\\tmax_4": {
                "index": "4",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Maximum Temperature - April"
            },
            "Temperature\\Max\\tmax_5": {
                "index": "5",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Maximum Temperature - May"
            },
            "Temperature\\Max\\tmax_6": {
                "index": "6",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Maximum Temperature - June"
            },
            "Temperature\\Max\\tmax_7": {
                "index": "7",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Maximum Temperature - July"
            },
            "Temperature\\Max\\tmax_8": {
                "index": "8",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Maximum Temperature - August"
            },
            "Temperature\\Max\\tmax_9": {
                "index": "9",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Maximum Temperature - September"
            },
            "Temperature\\Max\\tmax_10": {
                "index": "10",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Maximum Temperature - October"
            },
            "Temperature\\Max\\tmax_11": {
                "index": "11",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Maximum Temperature - November"
            },
            "Temperature\\Max\\tmax_12": {
                "index": "12",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Maximum Temperature - December"
            },
            "Temperature\\Min\\tmin_1": {
                "index": "13",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Minimum Temperature - January"
            },
            "Temperature\\Min\\tmin_2": {
                "index": "14",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Minimum Temperature - February"
            },
            "Temperature\\Min\\tmin_3": {
                "index": "15",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Minimum Temperature - March"
            },
            "Temperature\\Min\\tmin_4": {
                "index": "16",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Minimum Temperature - April"
            },
            "Temperature\\Min\\tmin_5": {
                "index": "17",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Minimum Temperature - May"
            },
            "Temperature\\Min\\tmin_6": {
                "index": "18",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Minimum Temperature - June"
            },
            "Temperature\\Min\\tmin_7": {
                "index": "19",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Minimum Temperature - July"
            },
            "Temperature\\Min\\tmin_8": {
                "index": "20",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Minimum Temperature - August"
            },
            "Temperature\\Min\\tmin_9": {
                "index": "21",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Minimum Temperature - September"
            },
            "Temperature\\Min\\tmin_10": {
                "index": "22",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Minimum Temperature - October"
            },
            "Temperature\\Min\\tmin_11": {
                "index": "23",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Minimum Temperature - November"
            },
            "Temperature\\Min\\tmin_12": {
                "index": "24",
                "category": "Temperature",
                "source": "average monthly maximum temperature (degC * 10) These layers (grid data) cover the global land areas except Antarctica. spatial resolution is 30 seconds. WorldClim is a set of global climate layers (climate grids) with a spatial resolution of a square kilometer. They can be used for mapping and spatial modeling in a GIS or other computer program. The data are described in: Hijmans, R.J., S.E. Cameron, J.L. Parra, P.G. Jones and A. Jarvis, 2005. Very high resolution interpolated climate surfaces for global land areas. International Journal of Climatology 25: 1965-1978",
                "title": "Average Monthly Minimum Temperature - December"
            }
        }

    };
    return configOptions;
});