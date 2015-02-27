var csvstring;

var baseUrl = "http://35.9.24.58:80/"
//var baseUrl = "http://localhost:8080/"

$(document).ready(function () {

    addUploadHandler("uploadFileNormalize", "normalizationDialog")
    addUploadHandler("uploadFileKmeans", "kmeansDialog")
    addUploadHandler("uploadFileSpearman", "spearmanDialog")

    // adds change event to the specified file upload
    function addUploadHandler(uploadId, dialogId) {
        $("#" + uploadId).change(function () {
            var file = this.files[0];
            if (file.data) {
                var decoded = bytesToString(dojox.encoding.base64.decode(file.data));
                handleCSV(decoded, dialogId);
            } else {
                var reader = new FileReader();
                reader.onload = function () {
                    handleCSV(reader.result, dialogId)
                };
                reader.readAsText(file);
            }
        });
    }

    // reads CSV file and opens correct dialog box to get tool parameters
    function handleCSV(mycsvstring, dialogId) {
        csvstring = mycsvstring;

        var rows = csvstring.split("\n");
        var headerRowString = rows[0];
        var headerRow = headerRowString.split(",");
        var headers = {};
        $.each(headerRow, function (idx, header) {
            headers[header] = idx;
        });
        
        // build select boxes in dialog
        var opts_val = [];
        var validx = -1;
        $.each(headers, function (headername, headerIdx) {
            if (headername.toUpperCase() != "LATITUDE" &&
                headername.toUpperCase() != "LAT" &&
                headername.toUpperCase() != "Y" &&
                headername.toUpperCase() != "LONGITUDE" &&
                headername.toUpperCase() != "LON" &&
                headername.toUpperCase() != "LONG" &&
                headername.toUpperCase() != "X") {
                validx = headerIdx;
            }

            opt = $("<option/>").text(headername).val(headerIdx);
            opts_val.push(opt);
        });
        $(".columnSelector").empty();
        $(".columnSelector").append(opts_val);

        if (validx > -1) {
            $(".columnSelector").val(validx);
        }

        $("#" + dialogId).dialog("open");
    }



    function doNormalization(valueIndexes) {
        var data = { "csvdata": csvstring, "valueindexes": valueIndexes };

        $.ajax({
            url: baseUrl + "normalize",
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            crossDomain: true,
            success: function (result) {
                var resultDiv = $("#resultNormalize");
                resultDiv.empty();

                console.log(result.norm_data)
                
                var encodedUri = encodeURI("data:text/csv;charset=utf-8," + result.norm_data);
                $("<a/>").attr({ "href": encodedUri, "download": "normalized_data.csv" }).text("RESULTS").appendTo(resultDiv);
            },
            error: function (error) {
                // TODO handle this
            }
        });
    }

    $("#normalizationDialog").dialog({
        autoOpen: false,
        //width: 200,
        modal: true,
        buttons: {
            "OK": function () {
                valIdxs = []
                $("#normValueColumns option:selected").each(function () {
                    valIdxs.push($(this).val());
                });

                doNormalization(valIdxs);
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

    function doKmeans(valueIndexes, clusterCount) {
        var data = { "csvdata": csvstring, "valueindexes": valueIndexes, "clustercount" : clusterCount };

        $.ajax({
            url: baseUrl + "kmeans",
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            crossDomain: true,
            success: function (result) {
                var resultDiv = $("#resultKmeans");
                resultDiv.empty();

                console.log(result.clustered_data)

                var encodedUri = encodeURI("data:text/csv;charset=utf-8," + result.clustered_data);
                $("<a/>").attr({ "href": encodedUri, "download": "clustered_data.csv" }).text("RESULTS").appendTo(resultDiv);
            },
            error: function (error) {
                // TODO handle this
            }
        });
    }

    $("#kmeansDialog").dialog({
        autoOpen: false,
        //width: 200,
        modal: true,
        buttons: {
            "OK": function () {
                valIdxs = []
                $("#kmeansValueColumns option:selected").each(function () {
                    valIdxs.push($(this).val());
                });

                clusterCount = $("#kmeansClustCountInput").val()

                doKmeans(valIdxs, clusterCount);
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

    function doSpearman(valueIndexes, dependantIndex) {
        var data = { "csvdata": csvstring, "valueindexes": valueIndexes, "dependantindex": dependantIndex };

        $.ajax({
            url: baseUrl + "spearman",
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            crossDomain: true,
            success: function (result) {
                var resultDiv = $("#resultSpearman");
                resultDiv.empty();
                console.log(result.sorted_features)
                $.each(result.sorted_features, function (idx, colname) {
                    resultDiv.append(colname + "<br/>");
                })
            },
            error: function (error) {
                // TODO handle this
            }
        });
    }

    $("#spearmanDialog").dialog({
        autoOpen: false,
        //width: 200,
        modal: true,
        buttons: {
            "OK": function () {
                valIdxs = []
                $("#spearmanValueColumns option:selected").each(function () {
                    valIdxs.push($(this).val());
                });

                depIdx = $("#spearmanDependantColumn").val();

                console.log(valIdxs);
                console.log(depIdx)

                doSpearman(valIdxs, depIdx);
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });

});



