
$(document).ready(function () {

    function doSpearman(valueIndexes, dependantIndex) {
        // create POST data object
        var data = { "csvdata": csvstring, "valueindexes": valueIndexes, "dependantindex": dependantIndex };

        // POST ajax request to server
        $.ajax({
            url: baseUrl + "spearman",
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            crossDomain: true,
            success: function (result) {
                var resultTable = $("#resultSpearman tbody");
                resultTable.empty();
                
                $.each(result.sorted_features, function (idx, result) {
                    var row = $("<tr/>").appendTo(resultTable);
                    $("<td/>").text(idx).appendTo(row);
                    $("<td/>").text(result[0]).appendTo(row);
                    $("<td/>").text(result[1]).appendTo(row);
                });

                $("#resultSpearman").show();
            },
            error: function (error) {
                // TODO handle this
                $("#resultSpearman").hide();
            }
        });
    }

    // creates jquery dialog out of specified div
    $("#spearmanDialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "OK": function () {
                // get selected column indexes from column input and push values onto a list
                valIdxs = []
                $("#spearmanValueColumns option:selected").each(function () {
                    valIdxs.push($(this).val());
                });

                // gets selected column index
                depIdx = $("#spearmanDependantColumn").val();

                console.log(valIdxs);
                console.log(depIdx)

                // send request to server and close this dialog
                doSpearman(valIdxs, depIdx);
                $(this).dialog("close");
            },
            Cancel: function () {
                // do nothing, just close the dialog
                $(this).dialog("close");
            }
        }
    });
});