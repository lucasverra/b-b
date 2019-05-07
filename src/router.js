import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

// comps
import Upload from './view/pages/Upload';
import Filters from './view/pages/Filters';

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Upload}/>
            <Route exact path='/filters' component={Filters}/>
        </Switch>
    </BrowserRouter>
);

export default Router;
