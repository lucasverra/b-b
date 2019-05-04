import React from 'react';

// redux
import {Provider} from 'react-redux'
import configureStore from './redux/store';

// comps
import Router from './router';

// css
import 'antd/dist/antd.css';
import './app.css';

function App() {
    return (
        <div id="App">
            <Provider store={configureStore()}>
                <Router/>
            </Provider>
        </div>
    );
}

export default App;
