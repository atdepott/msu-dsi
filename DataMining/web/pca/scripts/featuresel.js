
$(document).ready(function () {

    function doPCA(valueIndexes) {
        // create POST data object
        var data = { "csvdata": csvstring, "valueindexes": valueIndexes };

        // POST ajax request to server
        $.ajax({
            url: baseUrl + "pca",
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: "json",
            crossDomain: true,
            success: function (result) {
                var resultDiv = $("#result");
                resultDiv.empty();
                var encodedUri = encodeURI("data:text/csv;charset=utf-8," + result.pca_features);
                $("<a/>").attr({ "href": encodedUri, "download": "pca_data.csv" }).text("RESULTS").appendTo(resultDiv);
            },
            error: function (error) {
                $("#result").empty();
            }
        });
    }

    // creates jquery dialog out of specified div
    $("#dialog").dialog({
        autoOpen: false,
        modal: true,
        buttons: {
            "OK": function () {
                // get selected column indexes from column input and push values onto a list
                valIdxs = []
                $("#valueColumns option:selected").each(function () {
                    valIdxs.push($(this).val());
                });

                console.log(valIdxs);

                // send request to server and close this dialog
                doPCA(valIdxs);
                $(this).dialog("close");
            },
            Cancel: function () {
                // do nothing, just close the dialog
                $(this).dialog("close");
            }
        }
    });
});