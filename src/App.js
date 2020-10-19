import React from 'react';

// For Routing
import { HashRouter, Router } from 'react-router-dom';

// import Routes
import Routes from './Routes/Routes';

function App() {
	return (
		<HashRouter>
			<Routes />
		</HashRouter>
	);
}

export default App;
