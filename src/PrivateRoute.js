import React, { useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRouter = ({ component: PureComponent, ...rest }) => {
	
	const token = localStorage.getItem('token') || '';
	console.log(token);
	// console.log('token: ', token, !!token);
	return (
		<Route
			{...rest}
			render={(props) =>
				!!token ? (
					<PureComponent {...props} />
				) : (
					<Redirect to={{ pathname: '/', state: { from: props.location } }} />
				)
			}
		/>
	);
};

export default PrivateRouter;
