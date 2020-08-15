import React from 'react';

import { Switch, Route } from "react-router-dom";

// Components
import PrivateRoute from '../Components/PrivateRoute';

// Importing Components
import PreLogin from '../Pages/Pre-Login/PreLogin';
// import ForgotPass from '../Pages/Pre-Login/ForgotPass'

import Welcome from '../Pages/Home/Welcome'

const Routes = () => {
    return (
        <Switch>
            {/* pre login */}
            <Route exact path="/" component={PreLogin} />


            {/* after Login */}
            <PrivateRoute exact path="/Welcome" component={Welcome} />

             {/* <PrivateRoute exact path="/profile" component={Profile} /> */}

        </Switch>
    )
}

export default Routes;