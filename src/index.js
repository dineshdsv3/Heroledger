import React from 'react';
import ReactDOM from 'react-dom';
import { Switch, Route, BrowserRouter as Router } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
// import $ from 'jquery';
// import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './Styles/main.scss';
import PrivateRouter from './PrivateRoute';
import * as serviceWorker from './serviceWorker';

import PreLogin1 from './Pages/Pre-Login/PreLogin1';
import Register from './Pages/Pre-Login/Register';
import Welcome from './Pages/Home/Welcome';
import ProductDescription from './Pages/ProductDescription';
import Store from './Pages/Home/Store';
import Profile from './Pages/Profile';

const routing = (
	<Router>
		<div>
			<Route exact path="/" component={PreLogin1} />
			<Route exact path="/register" component={Register} />

			<PrivateRouter exact path="/Welcome" component={Welcome} />
			<PrivateRouter exact path="/Product" component={ProductDescription} />
			<PrivateRouter exact path="/Store" component={Store} />
			<PrivateRouter exact path="/profile" component={Profile} />
		</div>
	</Router>
);

ReactDOM.render(routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
