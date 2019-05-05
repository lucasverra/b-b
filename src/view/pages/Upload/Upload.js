import React from 'react';
import {Upload as AntUpload, Icon, Button, Alert, Col, Row, Card} from 'antd';
import {read, utils} from 'xlsx';
import _ from 'underscore';
import localforage from 'localforage';

// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setFileData} from '../../../redux/actions/actionCreators';

// comps
import Header from '../../components/Header';

// other
import validate from './validate';
import sillon from '../../../assets/sillon.png';
import jajka from '../../../assets/jajka.png';

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
        antFileList: [],
    };

    componentDidMount() {
        reader.onSuccess = this.onFileUploadSuccess;
        localforage.clear(console.error);
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
        accept: '.xlsx',
        onRemove: () => this.setState({fileData: null, errors: null, antFileList: []}),
        customRequest: ({ onSuccess, file }) => {
            reader.readAsBinaryString(file);
            this.setState({
                antFileList: [{
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                }]
            });
            setTimeout(() => {
                onSuccess(null, file);
            }, 100);
        },
        beforeUpload: () => {
            setTimeout(() => {
                this.setState({fileData: null, errors: null});
            }, 1)
        },
    };

    render() {
        const {fileData, errors, antFileList} = this.state;

        return (
            <div>
                <Header />
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 80px', marginTop: "16px" }}>
                    <img src={sillon} style={{ height: '50px', marginRight: '12px' }} />
                    <h2 style={{ margin: '10px 0 0 0', fontWeight: 'lighter' }}><b>b&b</b> upload</h2>
                </div>
                <Row style={{ padding: '40px 80px' }}>
                    <Col span={14} offset={5}>
                        <Card>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <AntUpload.Dragger fileList={antFileList} {...this.draggerConfig}>
                                        <Icon
                                            type="plus-circle"
                                            style={{
                                                fontSize: '50px',
                                                color: '#79B2FF',
                                                marginTop: '60px',
                                                marginBottom: '24px',
                                            }}
                                        />
                                        <h3>Glissez et déposez vos fichiers Excel</h3>
                                        <p>ou cliquez sur le bouton pour télécharger</p>
                                        <br/>
                                        <Button
                                            type="primary"
                                            style={{
                                                marginBottom: '120px',
                                            }}
                                        >
                                            Checher Fichier
                                        </Button>
                                    </AntUpload.Dragger>
                                </Col>
                                <Col span={12}>
                                    <h2>Glissez vos fichiers simplement</h2>
                                    <p>Glissez ou ajoutez vos fichiers d'offre simplement. Pour éviter toute erreur de lecture veuillez vérifier que toutes les colonnes soient complètes, que tous les EAN / LINK PHOTO / REFERENCE B&B soient différents et que tous les éléments de MARQUE / BRAND soient le même.</p>
                                    <br />
                                    <img src={jajka} style={{ width: '100%' }}/>
                                </Col>
                            </Row>
                        </Card>
                        <br/>
                        {
                            fileData && !errors && <Button type="primary" onClick={this.onNext} size="large" style={{ width: '100%' }}>Next</Button>
                        }
                        <br/>
                        {
                            errors && Object.keys(errors).map(error => (
                                <Alert style={{marginBottom: '8px'}} key={error} message={errors[error]} type="error"/>
                            ))
                        }
                    </Col>
                </Row>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    setFileData: bindActionCreators(setFileData, dispatch),
});

export default connect(null, mapDispatchToProps)(Upload);
