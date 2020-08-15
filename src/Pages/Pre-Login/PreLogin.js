import React, { useState } from 'react';
import baseUrl from '../../helpers/_API_URL';
import axios from 'axios';
import Signup from './Signup';
import Login from './Login';
import Particles from '../../Components/Particles';
 
function PreLogin(props) {
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
				<div className="particles-bg"><Particles /></div>
				<button
					type="button"
					className={togglePage.signup ? 'login-toggle-btn active' : 'login-toggle-btn'}
					onClick={() => settogglePage({ signup: true, login: false })}
				>
					Signup
				</button>
			</div>
			{togglePage.login ? (
				<Login props={props} togglePage={togglePage} settogglePage={settogglePage} />
			) : (
				<Signup togglePage={togglePage} settogglePage={settogglePage} />
			)}
		</div>
	);
}

export default PreLogin;
