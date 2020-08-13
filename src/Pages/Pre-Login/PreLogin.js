import React, { useState } from 'react';
import baseUrl from '../../helpers/_API_URL';
import axios from 'axios';
import Signup from './Signup';
import Login from './Login';

function PreLogin() {

	const [togglePage, settogglePage] = useState({
		signup: '',
		login: '',
	});

	return (
		<div className="pre-login">
			<div>&nbsp;</div>
			<div className="button-box">
				<button
					type="button"
					className={togglePage.login ? 'login-toggle-btn active' : 'login-toggle-btn'}
					onClick={() => settogglePage({ signup: false, login: true })}
				>
					Login
				</button>
				<button
					type="button"
					className={togglePage.signup ? 'login-toggle-btn active' : 'login-toggle-btn'}
					onClick={() => settogglePage({ signup: true, login: false })}
				>
					Signup
				</button>
			</div>
			{togglePage.login ? <Login /> : <Signup />}
		</div>
	);
}

export default PreLogin;
