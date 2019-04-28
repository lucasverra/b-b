import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

// comps
import Upload from './view/pages/Upload';

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Upload}/>
            <Route exact path='/filter' render={() => <div>filter</div>}/>
        </Switch>
    </BrowserRouter>
);

export default Router;
