import React from 'react';
import {Upload as AntUpload, Icon, Button} from 'antd';
import {read, utils} from 'xlsx';

const reader = new FileReader();

class Upload extends React.Component {
    state = {
        fileData: null,
    };

    componentDidMount() {
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
            this.setState({
                fileData: data,
            });
        };
    }

    draggerConfig = {
        name: 'file',
        multiple: false,
        accept: '.xlsx',
        action: (file) => {
            reader.readAsBinaryString(file);
        }
    };

    render() {
        const { fileData } = this.state;

        return (
            <div>
                <AntUpload.Dragger {...this.draggerConfig}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </AntUpload.Dragger>
                {
                    fileData && <Button type="primary">Next</Button>
                }
            </div>
        )
    }
}

export default Upload;
