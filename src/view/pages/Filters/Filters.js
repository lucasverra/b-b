import React from 'react';

// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setFileData} from '../../../redux/actions/actionCreators';
import productModels from '../../../redux/selectors/productModels';

class Filters extends React.Component {
    componentDidMount() {
        const {location, setFileData} = this.props;
        setFileData(location.state);
    }

    render() {
        console.log(this.props.productModels);

        return <div>filters</div>
    }
}

const mapStateToProps = (store) => ({
    productModels: productModels(store)
});

const mapDispatchToProps = (dispatch) => ({
    setFileData: bindActionCreators(setFileData, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
