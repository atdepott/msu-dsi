var csvstring;

var baseUrl = "http://dsiweb.cse.msu.edu:8080/"
//var baseUrl = "http://localhost:8080/"

$(document).ready(function () {

    // put upload handlers here for any file upload/dialog events needed
    addUploadHandler("uploadFile", "dialog")

    // adds change event to the specified file upload
    function addUploadHandler(uploadId, dialogId) {
        $("#" + uploadId).change(function () {
            var file = this.files[0];

            // check size of file to ensure it's not too big
            if (file.size > 1000000) {
                $("#fileSizeError").show();
                return;
            } else {
                $("#fileSizeError").hide();
            }

            // read CSV text and send to handler function
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
        // saves string in global variable for later use
        csvstring = mycsvstring;

        // extracts header text and index to show in dialog
        var rows = csvstring.split("\n");
        var headerRowString = rows[0];
        var headerRow = headerRowString.split(",");
        var headers = {};
        $.each(headerRow, function (idx, header) {
            headers[header] = idx;
        });
        
        // build select boxes in dialog using header text and index
        // tries to figure out most likely candidate for correct value by ignoring LAT & LONG column headers
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

        // opens jquery dialog
        $("#" + dialogId).dialog("open");
    }
});



