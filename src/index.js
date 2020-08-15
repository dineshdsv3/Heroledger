import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
// import $ from 'jquery';
// import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './Styles/main.scss'
import PrivateRouter from './PrivateRoute';
import * as serviceWorker from './serviceWorker';

import PreLogin from './Pages/Pre-Login/PreLogin';
import Welcome from './Pages/Home/Welcome';

const routing = (
    <Router>
      <div>
        <Route exact path="/" component={PreLogin} />
        <PrivateRouter exact path="/Welcome" component={Welcome} />
      </div>
    </Router>
  )

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
