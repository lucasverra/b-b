import React from 'react';

// redux
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setFileData} from '../../../redux/actions/actionCreators';

class Filters extends React.Component {
    componentDidMount() {
        const {location, setFileData} = this.props;
        setFileData(location.state);
    }

    render() {
        return <div>filters</div>
    }
}

const mapDispatchToProps = (dispatch) => ({
    setFileData: bindActionCreators(setFileData, dispatch),
});

export default connect(null, mapDispatchToProps)(Filters);
