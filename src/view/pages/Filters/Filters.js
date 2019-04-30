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
        modelsWithCounts: {},
    };

    onFilterButtonClick = async (filterType, filter, isSelected, model) => {
        const selectedArr = _.clone(this.state.productModels.modelsWithData[model].filters[filterType].selected);

        if (isSelected) {
            selectedArr.splice(selectedArr.indexOf(filter), 1);
        } else {
            selectedArr.push(filter);
        }

        await this.setState(st => ({
            productModels: {
                ...st.productModels,
                modelsWithData: {
                    ...st.productModels.modelsWithData,
                    [model]: {
                        ...st.productModels.modelsWithData[model],
                        filters: {
                            ...st.productModels.modelsWithData[model].filters,
                            [filterType]: {
                                ...st.productModels.modelsWithData[model].filters[filterType],
                                selected: selectedArr
                            }
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
            const currentFilters = this.state.productModels.modelsWithData[item['NOM  MODELE / MODEL NAME']].filters;

            let isInFilteredArray = 0;
            _.forEach(Object.keys(currentFilters), key => {
                if (currentFilters[key].selected.includes(item[key])) {
                    isInFilteredArray += 1;
                }
            });

            return Object.keys(currentFilters).length === isInFilteredArray;
        });

        const colName = 'NOM  MODELE / MODEL NAME';
        const modelsWithCounts = _.countBy(filteredData, colName);

        this.setState({
            filteredData,
            modelsWithCounts,
        })
    };

    componentDidMount() {
        const {location, setFileData} = this.props;
        const intialProductModels = productModels(location.state);

        setFileData(location.state);
        this.setState({
            productModels: intialProductModels,
            filteredData: location.state,
            modelsWithCounts: intialProductModels.modelsWithCounts,
        })
    }

    render() {
        const {file} = this.props;
        const {productModels, filteredData, modelsWithCounts} = this.state;

        if (!filteredData) return <Skeleton/>;

        return (
            <div>
                <h1>{file.brand[0]}</h1>
                {
                    Object.keys(productModels.modelsWithData).map(model => (
                        <Card
                            title={model}
                            style={{marginBottom: '8px'}}
                            extra={`Produits séléctionnés: ${modelsWithCounts[model] || 0}`}
                            key={model}
                        >
                            <Row>
                                <h3>{productModels.modelsWithData[model].filters.COULEUR.title}</h3>
                                <div>
                                    {productModels.modelsWithData[model].filters.COULEUR.data.map(item => (
                                        <Button
                                            type={productModels.modelsWithData[model].filters.COULEUR.selected.includes(item) ? 'primary' : 'secondary'}
                                            style={{margin: '2px'}}
                                            onClick={() => this.onFilterButtonClick(
                                                'COULEUR',
                                                item,
                                                productModels.modelsWithData[model].filters.COULEUR.selected.includes(item),
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
                                <h3>{productModels.modelsWithData[model].filters['TYPE/ CATEGORIE PRODUIT'].title}</h3>
                                <div>
                                    {productModels.modelsWithData[model].filters['TYPE/ CATEGORIE PRODUIT'].data.map(item => (
                                        <Button
                                            type={productModels.modelsWithData[model].filters['TYPE/ CATEGORIE PRODUIT'].selected.includes(item) ? 'primary' : 'secondary'}
                                            style={{margin: '2px'}}
                                            onClick={() => this.onFilterButtonClick(
                                                'TYPE/ CATEGORIE PRODUIT',
                                                item,
                                                productModels.modelsWithData[model].filters['TYPE/ CATEGORIE PRODUIT'].selected.includes(item),
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
                                    <h3>{productModels.modelsWithData[model].filters['TISSU/MATERIAU'].title}</h3>
                                    <div>
                                        {productModels.modelsWithData[model].filters['TISSU/MATERIAU'].data.map(item => (
                                            <Button
                                                type={productModels.modelsWithData[model].filters['TISSU/MATERIAU'].selected.includes(item) ? 'primary' : 'secondary'}
                                                style={{margin: '2px'}}
                                                onClick={() => this.onFilterButtonClick(
                                                    'TISSU/MATERIAU',
                                                    item,
                                                    productModels.modelsWithData[model].filters['TISSU/MATERIAU'].selected.includes(item),
                                                    model,
                                                )}
                                            >
                                                {item}
                                            </Button>
                                        ))}
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <h3>{productModels.modelsWithData[model].filters['COULEUR PIEDS'].title}</h3>
                                    <div>
                                        {productModels.modelsWithData[model].filters['COULEUR PIEDS'].data.map(item => (
                                            <Button
                                                type={productModels.modelsWithData[model].filters['COULEUR PIEDS'].selected.includes(item) ? 'primary' : 'secondary'}
                                                style={{margin: '2px'}}
                                                onClick={() => this.onFilterButtonClick(
                                                    'COULEUR PIEDS',
                                                    item,
                                                    productModels.modelsWithData[model].filters['COULEUR PIEDS'].selected.includes(item),
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
