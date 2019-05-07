import React from 'react';
import { withRouter } from 'react-router-dom';

import logo from '../../assets/logo.png';

const Header = ({ history }) => (
    <div
        style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '8px',
            backgroundColor: 'white',
        }}
    >
        <img
            src={logo}
            alt='BB'
            style={{ height: '70px', cursor: 'pointer' }}
            onClick={() => history.push('/')}
        />
    </div>
);

export default withRouter(Header);
