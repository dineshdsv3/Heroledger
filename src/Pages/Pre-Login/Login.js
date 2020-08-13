import React, { useState } from 'react';
import axios from 'axios';

function Login() {
	const [userDetails, setUserDetails] = useState({
		password: '',
		email: '',
	});
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(userDetails);
		axios.post(`/login`, { userDetails }).then((res) => {
			console.log(res);
		});
	};
	return (
		<div className="modal-dialog text-center login-modal">
			<div className="col-sm-8 main-section">
				<div className="modal-content login-modal-content">
					<div className="col-12 user-img">
						<img width="100px" height="100px" src={require('../../Assets/Images/heroledger-new.jpg')} />
					</div>
					<form className="col-12" onSubmit={handleSubmit}>
						<div className="form-group">
							<input
								type="email"
								className="form-control"
								placeholder="Enter Email"
								onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
							/>
							<input
								type="password"
								className="form-control"
								placeholder="Password"
								onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
							/>
							<button type="submit" className="login-btn">
								<i className="fas fa-sign-in-alt"></i>Login
							</button>
						</div>
					</form>
					<div className="col-12 forgot">
						<a href="#">Forgot Password?</a>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Login;
