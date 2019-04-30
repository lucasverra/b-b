import React from 'react';
import {Card, Skeleton, Button, Col, Row, Drawer} from 'antd';
import _ from 'underscore';

// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setFileData} from '../../../redux/actions/actionCreators';
import productModels from '../../../redux/selectors/productModels';

class Filters extends React.Component {
    state = {
        productModels: null,
        filteredData: null,
    };

    onFilterButtonClick = async (filterType, filter, isSelected, model) => {
        const selectedArr = _.clone(this.state.productModels[model].filters[filterType].selected);

        if (isSelected) {
            selectedArr.splice(selectedArr.indexOf(filter), 1);
        } else {
            selectedArr.push(filter);
        }

        await this.setState(st => ({
            productModels: {
                ...st.productModels,
                [model]: {
                    ...st.productModels[model],
                    filters: {
                        ...st.productModels[model].filters,
                        [filterType]: {
                            ...st.productModels[model].filters[filterType],
                            selected: selectedArr
                        }
                    }
                }
            }
        }));

        this.runFilter();
    };

    runFilter = () => {
        const {file} = this.props;

        const filteredData = _.filter(file.data, (item) => {
            const currentFilters = this.state.productModels[item['NOM  MODELE / MODEL NAME']].filters;

            let isInFilteredArray = 0;
            _.forEach(Object.keys(currentFilters), key => {
                if (currentFilters[key].selected.includes(item[key])) {
                    isInFilteredArray += 1;
                }
            });

            return Object.keys(currentFilters).length === isInFilteredArray;
        });

        this.setState({
            filteredData,
        })
    };

    componentDidMount() {
        const {location, setFileData} = this.props;

        setFileData(location.state);
        this.setState({
            productModels: productModels(location.state),
            filteredData: location.state,
        })
    }

    render() {
        const {file} = this.props;
        const {productModels, filteredData} = this.state;

        if (!filteredData) return <Skeleton/>;

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
                            <Row>
                                <h3>{productModels[model].filters.COULEUR.title}</h3>
                                <div>
                                    {productModels[model].filters.COULEUR.data.map(item => (
                                        <Button
                                            type={productModels[model].filters.COULEUR.selected.includes(item) ? 'primary' : 'secondary'}
                                            style={{margin: '2px'}}
                                            onClick={() => this.onFilterButtonClick(
                                                'COULEUR',
                                                item,
                                                productModels[model].filters.COULEUR.selected.includes(item),
                                                model,
                                            )}
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
                                            style={{margin: '2px'}}
                                            onClick={() => this.onFilterButtonClick(
                                                'TYPE/ CATEGORIE PRODUIT',
                                                item,
                                                productModels[model].filters['TYPE/ CATEGORIE PRODUIT'].selected.includes(item),
                                                model,
                                            )}
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
                                                style={{margin: '2px'}}
                                                onClick={() => this.onFilterButtonClick(
                                                    'TISSU/MATERIAU',
                                                    item,
                                                    productModels[model].filters['TISSU/MATERIAU'].selected.includes(item),
                                                    model,
                                                )}
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
                                                style={{margin: '2px'}}
                                                onClick={() => this.onFilterButtonClick(
                                                    'COULEUR PIEDS',
                                                    item,
                                                    productModels[model].filters['COULEUR PIEDS'].selected.includes(item),
                                                    model,
                                                )}
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
                    <h3>TOTAL produits sélectionnes: {filteredData.length || file.data.length}</h3>
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
