import React from 'react';
import {Upload as AntUpload, Icon} from 'antd';
import { read, utils } from 'xlsx';

const reader = new FileReader();
reader.onload = (evt) => {
    /* Parse data */
    const bstr = evt.target.result;
    const wb = read(bstr, {type: 'binary'});
    /* Get first worksheet */
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    /* Convert array of arrays */
    const data = utils.sheet_to_json(ws, {header: 1});
    /* Update state */
    console.log(data);
};

const draggerConfig = {
    name: 'file',
    multiple: false,
    accept: '.xlsx',
    action: (file) => {
        reader.readAsBinaryString(file);
    }
};

class Upload extends React.Component {
    render() {
        return (
            <div>
                <AntUpload.Dragger {...draggerConfig}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </AntUpload.Dragger>
            </div>
        )
    }
}

export default Upload;
