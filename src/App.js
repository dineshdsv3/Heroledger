import React from 'react';

// For Routing
import { HashRouter, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// import Routes
import Routes from './Routes/Routes';

function App() {
	// functionalites for navbar
	const history = createBrowserHistory();
	// console.log(history);
	// history={history}
	return (
		<HashRouter>
			<Routes />
		</HashRouter>
	);
}

export default App;
