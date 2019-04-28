import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';

const Router = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' render={() => <div>upload</div>}/>
            <Route exact path='/filter' render={() => <div>filter</div>}/>
        </Switch>
    </BrowserRouter>
);

export default Router;
