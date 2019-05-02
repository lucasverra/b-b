import React from 'react';
import {Upload as AntUpload, Icon, Button, Alert} from 'antd';
import {read, utils} from 'xlsx';
import _ from 'underscore';
import localforage from 'localforage';

// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setFileData} from '../../../redux/actions/actionCreators';

// other
import validate from './validate';

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
    reader.onSuccess(_.filter(data, arr => !!arr.length));
};

class Upload extends React.Component {
    state = {
        fileData: null,
        errors: null,
    };

    componentDidMount() {
        reader.onSuccess = this.onFileUploadSuccess;
    }

    onFileUploadSuccess = (file) => {
        const brand = file[0];
        const columns = file[1];
        const data = _.map(file.slice(2), item => {
            const obj = {};
            _.forEach(columns, (col, index) => {
                obj[col.toUpperCase()] = item[index];
            });

            return obj;
        });

        const errors = validate(data);

        if (!errors) {
            this.setState({
                fileData: {
                    brand,
                    columns,
                    data,
                },
            });
        } else {
            this.setState({
                errors,
            })
        }
    };

    onNext = () => {
        const {history, setFileData} = this.props;
        const {fileData} = this.state;

        localforage.setItem('FILE', fileData, err => {
           if (err) {
               console.error(err)
           } else {
               setFileData(fileData);
               history.push('/filters');
           }

        });
    };

    draggerConfig = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        accept: '.xlsx',
        action: (file) => {
            reader.readAsBinaryString(file);
        },
        onRemove: () => this.setState({fileData: null, errors: null}),
    };

    render() {
        const {fileData, errors} = this.state;

        return (
            <div>
                <AntUpload.Dragger {...this.draggerConfig}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox"/>
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </AntUpload.Dragger>
                <br/>
                {
                    fileData && !errors && <Button type="primary" onClick={this.onNext}>Next</Button>
                }
                <br/>
                {
                    errors && Object.keys(errors).map(error => (
                        <Alert style={{marginBottom: '8px'}} key={error} message={errors[error]} type="error"/>
                    ))
                }
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    setFileData: bindActionCreators(setFileData, dispatch),
});

export default connect(null, mapDispatchToProps)(Upload);
