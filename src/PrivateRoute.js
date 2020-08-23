import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRouter = ({ component: PureComponent, ...rest }) => {
	const userResponseDetails = {
		name: '',
		email: '',
		token: '',
		remember: '',
	};

	const user = JSON.parse(localStorage.getItem('user'));
	if (!user) {
		localStorage.setItem('user', JSON.stringify(userResponseDetails));
	}
	// console.log(user);
	const token = user.token;
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
