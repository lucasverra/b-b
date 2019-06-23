import Excel from 'exceljs/dist/es5/exceljs.browser.js';
import _ from 'underscore';

function getBase64Image(url, callback, onError, outputFormat = 'image/jpeg') {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
        const canvas = document.createElement('CANVAS');
        const ctx = canvas.getContext('2d');
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL(outputFormat);
        callback(dataURL);
    };
    img.onerror = function () {
        if (onError) {
            onError({
                message: 'Can not get image',
                imageUrl: url,
            })
        }
    };
    // img.src = `https://cors-anywhere.herokuapp.com/${url}`;
    // img.src = `https://b-b-cors-fix.glitch.me/${url}`;
    img.src = url;
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

const writeExcel = (data, fileName, columns, brand, callback, onImageError) => {
    const date = new Date();
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const year = date.getFullYear();
    const fullDate = `${day}.${month}.${year}`;

    const wb = new Excel.Workbook();
    wb.creator = 'BB';
    wb.modified = new Date();
    const ws = wb.addWorksheet('Main', {
        pageSetup: {paperSize: data.length, orientation: 'landscape', fitToPage: true},
    });
    ws.state = 'visible';

    const allColumns = columns.map((col, i) => {
        const style = {alignment: {wrapText: true, horizontal: 'center'}};

        const wideCols = [
            'ACCROCHE PRODUIT',
            'DESCRIPTION OF PRODUCT',
            'COMPOSITION DETAILÉE ',
            'DETAILED COMPOSITION',
            'FICHE GARANTIE',
            'DESCRIPTION OF BRAND / BASE LINE',
            'ACCROCHE MARQUE /BASE LINE',
        ];

        if (wideCols.includes(col.toUpperCase()) || i === 42) {
            return {key: col, width: 150, style}
        }

        return {key: col, width: 50, style}
    });

    const colsForRemove = [
        'CHARGE MAXIMALE (KG)'.replace(' ', '-'),
        'PRIX EXW 2018 (EUROS)'.replace(' ', '-'),
        'PRODUCTION NAME'.replace(' ', '-'),
        'FABRIC NAME AND NUMBER'.replace(' ', '-'),
        'COULEUR POLISH'.replace(' ', '-'),
        'PRODUCTION CODE'.replace(' ', '-'),
        'DESCRIPTION FOR PRODUCTION'.replace(' ', '-'),
        'STOCK FOURNISSEUR'.replace(' ', '-'),
    ];

    const filteredColumns = allColumns.filter(col => {
        return !colsForRemove.includes(col.key.toUpperCase().replace(' ', '-'))
        && !col.key.toUpperCase().replace(' ', '-').includes(colsForRemove[0])
    });

    ws.columns = filteredColumns;
    ws.getRow(2).values = filteredColumns.map(col => col.key);
    ws.getRow(1).values = [brand, ..._.times(columns.length - 1, () => ' ')];
    ws.addRows(data);
    ws.getRow(1).fill = {
        type: 'pattern',
        pattern: 'darkTrellis',
        fgColor: {argb: '204E78'},
        bgColor: {argb: '204E78'},
    };
    ws.getRow(2).fill = {
        type: 'pattern',
        pattern: 'darkTrellis',
        fgColor: {argb: '204E78'},
        bgColor: {argb: '204E78'},
    };
    ws.getRow(2).font = {
        color: {argb: 'FFFFFFFF'},
        bold: true,
        size: 14,
    };
    ws.getRow(1).font = {
        color: {argb: 'FFFFFFFF'},
        bold: true,
        size: 16,
    };

    const imageIds = {};
    data.forEach((item, i) => {
        ws.getRow(i + 3).height = 120;
        ws.getRow(i + 3).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        const id = i;

        getBase64Image(encodeURI(item['LINK PHOTO']), async dataUrl => {
            imageIds[id] = wb.addImage({base64: dataUrl, extension: 'jpeg'});

            ws.addImage(imageIds[id], {
                tl: {col: 4, row: i + 2},
                br: {col: 5, row: i + 3},
                editAs: 'oneCell',
                // ext: {width: 350, height: 233},
            });

            if (Object.keys(imageIds).length === data.length) {
                wb.xlsx.writeBuffer().then(buf => {
                    const blob = new Blob([buf], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    saveAs(blob, `B&B_ficher_offre_${brand}_(${fullDate}).xlsx`);
                    callback();
                }).catch(console.error);
            }
        }, (error) => {
            imageIds[id] = {};
            onImageError(error);
            if (Object.keys(imageIds).length === data.length) {
                wb.xlsx.writeBuffer().then(buf => {
                    const blob = new Blob([buf], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                    saveAs(blob, `B&B_ficher_offre_${brand}_(${fullDate}).xlsx`);
                    callback();
                }).catch(console.error);
            }
        });
    });
};

export default writeExcel;
