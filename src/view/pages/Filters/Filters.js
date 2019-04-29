import React from 'react';
import {Card, Skeleton} from 'antd';

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

        console.log(productModels);

        return (
            <div>
                <h1>{file.brand[0]}</h1>
                {
                    Object.keys(productModels).map(model => (
                        <Card
                            title={model}
                            style={{marginBottom: '8px'}}
                            extra={productModels[model].data.length}
                            key={model}
                        >
                            models
                        </Card>
                    ))
                }
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
