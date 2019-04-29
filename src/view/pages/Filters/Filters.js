import React from 'react';
import {Card, Skeleton, Button, Col, Row, Drawer} from 'antd';

// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setFileData} from '../../../redux/actions/actionCreators';
import productModels from '../../../redux/selectors/productModels';

class Filters extends React.Component {
    state = {
        productModels: null,
    };

    componentDidMount() {
        const {location, setFileData} = this.props;

        setFileData(location.state);
        this.setState({
            productModels: productModels(location.state),
        })
    }

    render() {
        const {file} = this.props;
        const {productModels} = this.state;

        if (!productModels) return <Skeleton/>;

        return (
            <div>
                <h1>{file.brand[0]}</h1>
                {
                    Object.keys(productModels).map(model => (
                        <Card
                            title={model}
                            style={{marginBottom: '8px'}}
                            extra={`Produits séléctionnés: ${productModels[model].data.length}`}
                            key={model}
                        >
                            {
                                console.log(productModels[model].filters)
                            }
                            <Row>
                                <h3>{productModels[model].filters.COULEUR.title}</h3>
                                <div>
                                    {productModels[model].filters.COULEUR.data.map(item => (
                                        <Button
                                            type={productModels[model].filters.COULEUR.selected.includes(item) ? 'primary' : 'secondary'}
                                            style={{ margin: '2px' }}
                                        >
                                            {item}
                                        </Button>
                                    ))}
                                </div>
                            </Row>
                            <br/>
                            <Row>
                                <h3>{productModels[model].filters['TYPE/ CATEGORIE PRODUIT'].title}</h3>
                                <div>
                                    {productModels[model].filters['TYPE/ CATEGORIE PRODUIT'].data.map(item => (
                                        <Button
                                            type={productModels[model].filters['TYPE/ CATEGORIE PRODUIT'].selected.includes(item) ? 'primary' : 'secondary'}
                                            style={{ margin: '2px' }}
                                        >
                                            {item}
                                        </Button>
                                    ))}
                                </div>
                            </Row>
                            <br/>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <h3>{productModels[model].filters['TISSU/MATERIAU'].title}</h3>
                                    <div>
                                        {productModels[model].filters['TISSU/MATERIAU'].data.map(item => (
                                            <Button
                                                type={productModels[model].filters['TISSU/MATERIAU'].selected.includes(item) ? 'primary' : 'secondary'}
                                                style={{ margin: '2px' }}
                                            >
                                                {item}
                                            </Button>
                                        ))}
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <h3>{productModels[model].filters['COULEUR PIEDS'].title}</h3>
                                    <div>
                                        {productModels[model].filters['COULEUR PIEDS'].data.map(item => (
                                            <Button
                                                type={productModels[model].filters['COULEUR PIEDS'].selected.includes(item) ? 'primary' : 'secondary'}
                                                style={{ margin: '2px' }}
                                            >
                                                {item}
                                            </Button>
                                        ))}
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    ))
                }
                <Drawer
                    visible
                    placement="bottom"
                    mask={false}
                    closable={false}
                    height={80}
                >
                    <h3>TOTAL produits sélectionnes: {file.data.length}</h3>
                </Drawer>
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    file: store.file,
});

const mapDispatchToProps = (dispatch) => ({
    setFileData: bindActionCreators(setFileData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
