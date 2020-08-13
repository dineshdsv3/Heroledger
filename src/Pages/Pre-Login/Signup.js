import React, { useState } from 'react';
import axios from 'axios';

function Signup() {
	const [userDetails, setUserDetails] = useState({
		name: '',
		email: '',
		password: '',
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(userDetails);
		axios.post(`/signup`, { userDetails }).then((res) => {
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
								type="text"
								className="form-control"
								placeholder="Username"
								onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
							/>
							<input
								type="email"
								className="form-control"
								placeholder="Email"
								onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
							/>
							<input
								type="password"
								className="form-control"
								placeholder="Password"
								onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
							/>
							<input type="password" className="form-control" placeholder="Confirm Password" />

							<button type="submit" className="signup-btn" >
								<i className="fas fa-sign-in-alt"></i>Signup
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Signup;
