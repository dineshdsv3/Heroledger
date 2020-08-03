import React from 'react';

import { Switch, Route } from "react-router-dom";

// Components
import PrivateRoute from '../Components/PrivateRoute';

// Importing Components
import PreLogin from '../Pages/Pre-Login/PreLogin';
// import ForgotPass from '../Pages/Pre-Login/ForgotPass'


const Routes = () => {
    return (
        <Switch>
            {/* pre login */}
            <Route exact path="/" component={PreLogin} />
            {/* <Route exact path="/forgot-password" component={ForgotPass} /> */}
            {/* <Route exact path="/create-password/:userID" component={CreatePassword} /> */}
            {/* <Route exact path="/privacy-policy" component={PrivacyPolicy} />
            <Route exact path="/terms-and-conditions" component={TermsCondition} />
            <Route exact path="/support" component={Help} /> */}

            {/* after Login */}
            {/* <PrivateRoute exact path="/Ownerhome" component={OwnerHome} /> */}

             {/* <PrivateRoute exact path="/profile" component={Profile} /> */}

        </Switch>
    )
}

export default Routes;