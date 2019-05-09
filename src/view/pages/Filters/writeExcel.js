import xlsx from 'xlsx'

function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

function saveAs(data, fileName) {
    const a = document.createElement("a");
    const url = URL.createObjectURL(data);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        },
        0);
}

const writeExcel = (data, fileName) => {
    const wb = xlsx.utils.book_new();
    wb.SheetNames.push('Main');
    wb.Sheets['Main'] = xlsx.utils.json_to_sheet(data);
    const wbout = xlsx.write(wb, {bookType:'xlsx', bookSST:true, type: 'binary'});

    saveAs(new Blob([s2ab(wbout)], {type: "application/octet-stream"}), `BB-${fileName}`);
};

export default writeExcel;
