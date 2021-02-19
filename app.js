window.onload = function () {
    var spread = new GC.Spread.Sheets.Workbook(document.getElementById("ss"), {calcOnDemand: true});
    spread.fromJSON(jsonData);
    var excelIo = new GC.Spread.Excel.IO();
    document.getElementById('loadExcel').onclick = function () {
        var excelFile = document.getElementById("fileDemo").files[0];
        var incrementalEle = document.getElementById("incremental");
        var loadingStatus = document.getElementById("loadingStatus");
        
        incrementalEle.addEventListener('change', function (e) {
            document.getElementById('loading-container').style.display = incrementalEle.checked ? "block" : "none";
        });
        // here is excel IO API
        excelIo.open(excelFile, function (json) {
            var workbookObj = json;
            if (incrementalEle.checked) {
                spread.fromJSON(workbookObj, {
                    incrementalLoading: {
                        loading: function (progress) {
                            progress = progress * 100;
                            loadingStatus.value = progress;
                        },
                        loaded: function () {
                        }
                    }
                });
            } else {
                spread.fromJSON(workbookObj);
            }
        }, function (e) {
            // process error
            alert(e.errorMessage);
        });
    };
    document.getElementById('saveExcel').onclick = function () {

        var fileName = document.getElementById('exportFileName').value;
        var formatSelect = document.getElementById('format-select');
        

        formatSelect.addEventListener("change", (event) => {

            var format = formatSelect.value;
            filename="import CFA"+format;
        });

        if (fileName.substr(-5, 5) !== '.xlsx') {
            fileName += '.xlsx';
        }

        var json = spread.toJSON();

        // here is excel IO API
        excelIo.save(json, function (blob) {
            saveAs(blob, fileName);
        }, function (e) {
            // process error
            console.log(e);
        });

    };
};
