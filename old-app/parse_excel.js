$('#input-excel').change(function(e) {
    $('.loading').show();
    $('#filterTable').click(function () {

        var rABS = true;
        var files = e.target.files;
        var i, f;
        for (i = 0; i != files.length; ++i) {
            f = files[i];
            var name = f.name;
            reader.onload = function (e) {
                var data = e.target.result;
                var workbook;
                if (rABS) {
                    /* if binary string, read with type 'binary' */
                    workbook = XLSX.read(data, {type: 'binary'});
                } else {
                    /* if array buffer, convert to base64 */
                    var arr = fixdata(data);
                    workbook = XLSX.read(btoa(arr), {type: 'base64'});
                }
                var arrayOfData = to_json(workbook);
                var theadHtml = "";
                var tbodyHtml = "";
                $.each(arrayOfData, function (index, subArray) {
                    for (var key in subArray) {
                        if (key == 0) {
                            theadHtml += "<tr>";
                            for (var key1 in subArray[key]) {
                                theadHtml += '<th>' + key1 + '</th>';
                            }
                            theadHtml += "</tr>";
                        }
                        tbodyHtml += "<tr>";

                        for (var key1 in subArray[key]) {
                            tbodyHtml += '<td>' + subArray[key][key1] + '</td>';
                        }
                        tbodyHtml += "</tr>";

                    }
                });
                $('#theadHtml').html(theadHtml);
                $('#tbodyHtml').html(tbodyHtml);
                $('.loading').hide();
                /* DO SOMETHING WITH workbook HERE */
            };
            reader.readAsBinaryString(f);
        }
    });
});
function to_json(workbook) {
    var result = {};
    workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLS.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if(roa.length > 0){
            result[sheetName] = roa;
        }
    });
    return result;
}
