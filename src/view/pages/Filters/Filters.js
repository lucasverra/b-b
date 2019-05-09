import React from 'react';
import {Card, Skeleton, Button, Col, Row, Drawer, Icon} from 'antd';
import _ from 'underscore';
import localforage from 'localforage';

// redux
import {connect} from 'react-redux';
import productModels from '../../../redux/selectors/productModels';
import {setFileData} from '../../../redux/actions/actionCreators';
import {bindActionCreators} from 'redux';

// comps
import FiltersTable from './FiltersTable';
import Header from '../../components/Header';

// other
import writeExcel from './writeExcel';

class Filters extends React.Component {
    state = {
        productModels: null,
        filteredData: null,
        modelsWithCounts: {},
        additionalFilters: {},
        additionalFiltersData: [],
        mergedFiltersData: [],
    };

    onClearAll = async (model) => {
        const filterTypes = ['COULEUR', 'TYPE/ CATEGORIE PRODUIT', 'TISSU/MATERIAU', 'COULEUR PIEDS'];

        await _.forEach(filterTypes, async filterType => {
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
                                    selected: [],
                                }
                            }
                        }
                    }
                }
            }));
        });

        this.runFilter();
    };

    onRestart = async (model) => {
        const filterTypes = ['COULEUR', 'TYPE/ CATEGORIE PRODUIT', 'TISSU/MATERIAU', 'COULEUR PIEDS'];

        await _.forEach(filterTypes, async filterType => {
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
                                    selected: st.productModels.modelsWithData[model].filters[filterType].data,
                                }
                            }
                        }
                    }
                }
            }));
        });

        this.runFilter();
    };

    onFilter = async (filterType, filter, isSelected, model) => {
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
                                selected: selectedArr,
                            }
                        }
                    }
                }
            }
        }));

        this.runFilter();
    };

    runAdditionalFilter = async () => {
        const {file} = this.props;
        const { additionalFilters } = this.state;
        let mergedAdditionalFilterModelsData = [];
        const colName = 'NOM  MODELE / MODEL NAME';
        const oneFiltered = (modelData, filters) => _.filter(modelData, (item) => {
            let isInFilteredArray = 0;
            _.forEach(Object.keys(filters), key => {
                if (filters[key].selected.includes(item[key])) {
                    isInFilteredArray += 1;
                }
            });

            return Object.keys(filters).length === isInFilteredArray;
        });

        _.forEach(Object.keys(additionalFilters), model => {
            _.forEach(additionalFilters[model], ({filters}) => {
                const filtered = oneFiltered(file.data.filter(i => i[colName] === model), filters);
                mergedAdditionalFilterModelsData = [...new Set([...mergedAdditionalFilterModelsData, ...filtered])];
            });
        });

        await this.setState({
            additionalFiltersData: mergedAdditionalFilterModelsData,
        });

        this.mergeFilteredData();
    };

    runFilter = async () => {
        const {file} = this.props;
        const colName = 'NOM  MODELE / MODEL NAME';

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

        const modelsWithCounts = _.countBy(filteredData, colName);

        await this.setState({
            filteredData,
            modelsWithCounts,
        });

        this.mergeFilteredData();
    };

    mergeFilteredData = () => {
        const { filteredData, additionalFiltersData } = this.state;

        this.setState({
            mergedFiltersData: [...new Set([...filteredData, ...additionalFiltersData])],
        });
    };

    countInProductModelByFilter = (filters, modelData) => {
        return  _.filter(modelData, (item) => {
            let isInFilteredArray = 0;
            _.forEach(Object.keys(filters), key => {
                if (filters[key].selected.includes(item[key])) {
                    isInFilteredArray += 1;
                }
            });

            return Object.keys(filters).length === isInFilteredArray;
        }).length;
    };

    onAdditionalFilter = async (filterType, filter, isSelected, model, filterKey) => {
        const { additionalFilters, productModels } = this.state;

        const updatedModelAdditionalFilters = _.map(additionalFilters[model], (oneFilter) => {
           if (oneFilter.key !== filterKey) {
               return oneFilter;
           }
            const updatedOneFilter = {...oneFilter};
            if (isSelected) {
                updatedOneFilter.filters[filterType].selected.splice(updatedOneFilter.filters[filterType].selected.indexOf(filter), 1);
            } else {
                updatedOneFilter.filters[filterType].selected.push(filter);
            }

            const productCount = this.countInProductModelByFilter(updatedOneFilter.filters, productModels.modelsWithData[model].data);

            return {
                ...updatedOneFilter,
                productCount,
            };
        });

        await this.setState((st) => ({
            additionalFilters: {
                ...st.additionalFilters,
                [model]: updatedModelAdditionalFilters,
            }
        }));

        this.runAdditionalFilter();
    };

    toggleAllAdditionalFilter = async (model, filterKey, showAll) => {
        const { additionalFilters, productModels } = this.state;

        const updatedModelAdditionalFilters = _.map(additionalFilters[model], (oneFilter) => {
            if (oneFilter.key !== filterKey) {
                return oneFilter;
            }
            const updatedFiltersValues = {};

            _.forEach(Object.keys(oneFilter.filters), oneFilterKey => {
                updatedFiltersValues[oneFilterKey] = {
                    ...oneFilter.filters[oneFilterKey],
                    selected: showAll ? _.clone(oneFilter.filters[oneFilterKey].data) : [],
                }
            });

            const updatedOneFilter = {
                ...oneFilter,
                filters: updatedFiltersValues,
            };

            const productCount = this.countInProductModelByFilter(updatedOneFilter.filters, productModels.modelsWithData[model].data);

            return {
                ...updatedOneFilter,
                productCount,
            };
        });

        await this.setState((st) => ({
            additionalFilters: {
                ...st.additionalFilters,
                [model]: updatedModelAdditionalFilters,
            }
        }));

        this.runAdditionalFilter();
    };

    addNewFilter = (model, modelFilters) => {
        const filters = {};
        _.forEach(Object.keys(modelFilters), filterKey => {
           filters[filterKey] = {
               ...modelFilters[filterKey],
               selected: [],
           }
        });

        this.setState((state) => ({
            additionalFilters: {
                ...state.additionalFilters,
                [model]: [
                    ...state.additionalFilters[model],
                    {
                        key: state.additionalFilters[model].length,
                        productCount: 0,
                        filters,
                    }
                ],
            }
        }))
    };

    removeFilter = async (model, filterKey) => {
        await this.setState((state) => ({
            additionalFilters: {
                ...state.additionalFilters,
                [model]: _.filter(state.additionalFilters[model], filter => filter.key !== filterKey),
            }
        }));

        this.runAdditionalFilter();
    };

    componentDidMount() {
        const {file} = this.props;

        if (!!Object.keys(file).length) {
            const intialProductModels = productModels(file);
            const additionalFilters = {};

            _.forEach(Object.keys(intialProductModels.modelsWithCounts), key => {
               additionalFilters[key] = [];
            });

            this.setState({
                productModels: intialProductModels,
                filteredData: file.data,
                mergedFiltersData: file.data,
                modelsWithCounts: intialProductModels.modelsWithCounts,
                brand: file.brand[0],
                additionalFilters,
            });
        } else {
            localforage.getItem('FILE', (err, file) => {
                if (err) {
                    console.error(err)
                } else {
                    const { setFileData } = this.props;
                    const intialProductModels = productModels(file);
                    const additionalFilters = {};

                    _.forEach(Object.keys(intialProductModels.modelsWithCounts), key => {
                        additionalFilters[key] = [];
                    });

                    setFileData(file);

                    this.setState({
                        productModels: intialProductModels,
                        filteredData: file.data,
                        mergedFiltersData: file.data,
                        modelsWithCounts: intialProductModels.modelsWithCounts,
                        brand: file.brand[0],
                        additionalFilters,
                    });
                }
            });
        }
    }

    render() {
        const {
            productModels, filteredData, modelsWithCounts, brand, additionalFilters, mergedFiltersData,
        } = this.state;

        if (!filteredData) return <Skeleton/>;

        return (
            <>
                <Header/>
                <br/>
                <Col style={{ paddingBottom: '150px' }} span={20} offset={2}>
                    <h1>{brand}</h1>
                    {
                        Object.keys(productModels.modelsWithData).map(model => (
                            <Card
                                title={model}
                                style={{marginBottom: '16px', backgroundColor: '#efefef'}}
                                key={model}
                            >
                                <Card
                                    title={`Produits séléctionnés: ${modelsWithCounts[model] || 0}`}
                                    extra={
                                        <>
                                            <Icon type="retweet" style={{ color: 'blue' }} onClick={() => this.onRestart(model)}/>
                                            <Icon type="close-circle" style={{ color: 'orange', marginLeft: '8px' }} onClick={() => this.onClearAll(model)}/>
                                        </>
                                    }
                                >
                                    <Row>
                                        <h3>{productModels.modelsWithData[model].filters.COULEUR.title}</h3>
                                        <div>
                                            {productModels.modelsWithData[model].filters.COULEUR.data.map(item => (
                                                <Button
                                                    type={productModels.modelsWithData[model].filters.COULEUR.selected.includes(item) ? 'primary' : 'secondary'}
                                                    style={{margin: '2px'}}
                                                    key={item}
                                                    onClick={() => this.onFilter(
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
                                                    key={item}
                                                    onClick={() => this.onFilter(
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
                                                        key={item}
                                                        onClick={() => this.onFilter(
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
                                                        key={item}
                                                        onClick={() => this.onFilter(
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
                                {
                                    additionalFilters[model].map((additionalFilter) => (
                                        <Card
                                            title={`Produits séléctionnés: ${additionalFilter.productCount}`}
                                            style={{ marginTop: '16px' }}
                                            extra={
                                                <>
                                                    <Icon
                                                        type="retweet"
                                                        style={{ color: 'blue' }}
                                                        onClick={() => this.toggleAllAdditionalFilter(model, additionalFilter.key, true)}
                                                    />
                                                    <Icon
                                                        type="close-circle"
                                                        style={{ color: 'orange', marginLeft: '8px' }}
                                                        onClick={() => this.toggleAllAdditionalFilter(model, additionalFilter.key, false)}
                                                    />
                                                    <Icon type="delete" style={{ color: 'red', marginLeft: '8px' }} onClick={() => this.removeFilter(model, additionalFilter.key)}/>
                                                </>
                                            }                                    >
                                            <Row>
                                                <h3>{additionalFilter.filters.COULEUR.title}</h3>
                                                <div>
                                                    {additionalFilter.filters.COULEUR.data.map(item => (
                                                        <Button
                                                            type={additionalFilter.filters.COULEUR.selected.includes(item) ? 'primary' : 'secondary'}
                                                            style={{margin: '2px'}}
                                                            key={item}
                                                            onClick={() => this.onAdditionalFilter(
                                                                'COULEUR',
                                                                item,
                                                                additionalFilter.filters.COULEUR.selected.includes(item),
                                                                model,
                                                                additionalFilter.key,
                                                            )}
                                                        >
                                                            {item}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </Row>
                                            <br/>
                                            <Row>
                                                <h3>{additionalFilter.filters['TYPE/ CATEGORIE PRODUIT'].title}</h3>
                                                <div>
                                                    {additionalFilter.filters['TYPE/ CATEGORIE PRODUIT'].data.map(item => (
                                                        <Button
                                                            type={additionalFilter.filters['TYPE/ CATEGORIE PRODUIT'].selected.includes(item) ? 'primary' : 'secondary'}
                                                            style={{margin: '2px'}}
                                                            key={item}
                                                            onClick={() => this.onAdditionalFilter(
                                                                'TYPE/ CATEGORIE PRODUIT',
                                                                item,
                                                                additionalFilter.filters['TYPE/ CATEGORIE PRODUIT'].selected.includes(item),
                                                                model,
                                                                additionalFilter.key,
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
                                                    <h3>{additionalFilter.filters['TISSU/MATERIAU'].title}</h3>
                                                    <div>
                                                        {additionalFilter.filters['TISSU/MATERIAU'].data.map(item => (
                                                            <Button
                                                                type={additionalFilter.filters['TISSU/MATERIAU'].selected.includes(item) ? 'primary' : 'secondary'}
                                                                style={{margin: '2px'}}
                                                                key={item}
                                                                onClick={() => this.onAdditionalFilter(
                                                                    'TISSU/MATERIAU',
                                                                    item,
                                                                    additionalFilter.filters['TISSU/MATERIAU'].selected.includes(item),
                                                                    model,
                                                                    additionalFilter.key,
                                                                )}
                                                            >
                                                                {item}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </Col>
                                                <Col span={12}>
                                                    <h3>{additionalFilter.filters['COULEUR PIEDS'].title}</h3>
                                                    <div>
                                                        {additionalFilter.filters['COULEUR PIEDS'].data.map(item => (
                                                            <Button
                                                                type={additionalFilter.filters['COULEUR PIEDS'].selected.includes(item) ? 'primary' : 'secondary'}
                                                                style={{margin: '2px'}}
                                                                key={item}
                                                                onClick={() => this.onAdditionalFilter(
                                                                    'COULEUR PIEDS',
                                                                    item,
                                                                    additionalFilter.filters['COULEUR PIEDS'].selected.includes(item),
                                                                    model,
                                                                    additionalFilter.key,
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
                                <Button
                                    type="dashed"
                                    size="large"
                                    icon="plus-circle"
                                    style={{ width: '100%', marginTop: '16px' }}
                                    onClick={() => {
                                        this.addNewFilter(
                                            model,
                                            productModels.modelsWithData[model].filters,
                                        );
                                    }}
                                />
                            </Card>
                        ))
                    }
                    <FiltersTable dataSource={mergedFiltersData}/>
                    <br />

                    <Row gutter={16}>
                        <Col span={12}>
                            <Button
                                type="primary"
                                onClick={() => this.props.history.push('/')}
                                size="large"
                                style={{ width: '100%', backgroundColor: '#c83b42', borderColor: '#c83b42' }}
                            >
                                Editer la sélection
                            </Button>
                        </Col>
                        <Col span={12}>
                            <Button
                                type="primary"
                                onClick={() => writeExcel(mergedFiltersData, this.props.file.name, this.props.file.columns)}
                                size="large"
                                style={{ width: '100%', backgroundColor: '#00C851', borderColor: '#00C851' }}
                            >
                                Télécharger le fichier d’offre
                            </Button>
                        </Col>
                    </Row>
                    <Drawer
                        visible
                        placement="bottom"
                        mask={false}
                        closable={false}
                        height={80}
                    >
                        <h3>TOTAL produits sélectionnes: {mergedFiltersData.length}</h3>
                    </Drawer>
                </Col>
            </>
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
