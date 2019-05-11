import Excel from 'exceljs/dist/es5/exceljs.browser.js';

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

const writeExcel = (data, fileName, columns) => {
    const wb = new Excel.Workbook();
    wb.creator = 'BB';
    wb.modified = new Date();
    const ws = wb.addWorksheet('Main', {
        pageSetup: {paperSize: data.length, orientation: 'landscape', fitToPage: true}
    });
    ws.state = 'visible';
    ws.columns = columns.map((col, i) => {
        const style = {alignment: {wrapText: true, horizontal: 'left'}};

        const wideCols = [
            'ACCROCHE PRODUIT',
            'DESCRIPTION OF PRODUCT',
            'COMPOSITION DETAILÉE ',
            'DETAILED COMPOSITION',
            'FICHE GARANTIE',
            'DESCRIPTION FOR PRODUCTION',
            'DESCRIPTION OF BRAND / BASE LINE',
        ];

        if (wideCols.includes(col)) {
            return {header: col, key: col, width: 150, style}
        } else if (i === 42) {
            // warranty
            return {header: col, key: col, width: 150, style}
        }

        return {header: col, key: col, width: 50, style}
    });
    ws.addRows(data);
    // ws.getRow(1).fill = {
    //     type: 'pattern',
    //     pattern: 'darkTrellis',
    //     fgColor: {argb: 'FFFFFF00'},
    //     bgColor: {argb: 'FF0000FF'}
    // };
    // ws.getRow(1).font = {
    //     color: {argb: 'FFFFFFFF'}
    // };

    wb.xlsx.writeBuffer().then(buf => {
        const blob = new Blob([buf], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
        saveAs(blob, `BB-${fileName}`);
    }).catch(console.error);
};

export default writeExcel;
