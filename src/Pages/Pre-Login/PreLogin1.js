import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Styles are in pre-login1

function PreLogin1() {
	const [userDetails, setUserDetails] = useState({
		password: '',
		email: '',
		remember: false,
	});

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem('user'));
		const token = localStorage.getItem('token') || '';
		if (user) {
			if (user.remember && token) {
				window.location.href = '/Welcome?page=dashboard';
			}
		}
	}, []);

	// console.log(userDetails);
	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(userDetails);
		await axios
			.post(`/login`, { userDetails })
			.then(async (res) => {
				// console.log(res);
				// console.log(res.data.user);
				if (res.error) {
					console.log(res);
				}
				const userResponseDetails = {
					name: res.data.user.name,
					email: res.data.user.email,
					token: res.data.token,
					remember: userDetails.remember,
				};
				localStorage.setItem('token', res.data.token);
				localStorage.setItem('user', JSON.stringify(userResponseDetails));
				alert('Log-in Successful');
				window.location.href = '/Welcome?page=dashboard';
			})
			.catch((error) => {
				alert('Incorrect Email and Password combination!!. Try again');
			});
	};
	return (
		<div className="container-fluid pre-login-home">
			<div className="row px-3 pre-login-card">
				<div className="col-6 img-left d-flex">
					<span className="text-center">
						<img className="img-fluid" src={require('../../Assets/Images/heroledger-white.png')} />
						<br />
						<p className="text-center text-white">A Multiverse Application</p>
					</span>
					<div className="d-flex align-self-end justify-content-start version-text mb-2 text-white">
						Version Beta
					</div>
				</div>
				<div className="col-6 card flex-row mx-auto px-0">
					<div className="pre-login-card-body card-body">
						<h4 className="title text-center mt-4">Login into Heroledger</h4>
						<form className="pre-login-form-box px-3" onSubmit={handleSubmit}>
							<div className="form-input">
								<span>
									<i className="fa fa-envelope-o"></i>
								</span>
								<input
									type="email"
									name="email"
									placeholder="Email"
									required
									onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
								/>
							</div>
							<div className="form-input">
								<span>
									<i className="fa fa-key"></i>
								</span>
								<input
									type="password"
									name="password"
									placeholder="Password"
									required
									onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
								/>
							</div>
							<div className="mb-3">
								<div className="custom-control custom-checkbox">
									<input
										type="checkbox"
										className="custom-control-input"
										id="cb1"
										name="remember"
										checked={userDetails.remember}
										onChange={() =>
											setUserDetails({ ...userDetails, remember: !userDetails.remember })
										}
									/>
									<label className="custom-control-label" htmlFor="cb1">
										Remember me
									</label>
								</div>
							</div>
							<div className="mb-3">
								<button type="submit" className="btn btn-block text-uppercase">
									<i className="fas fa-sign-in-alt"></i> Login
								</button>
							</div>
							<div className="text-right">
								<a href="#" className="forget-link">
									Forgot Password?
								</a>
							</div>
							<div className="text-center mb-3"> or login with</div>

							<div className="row mb-3">
								<div className="col-6">
									<a href="#" className="btn btn-block btn-social btn-facebook">
										Facebook
									</a>
								</div>
								<div className="col-6">
									<a href="#" className="btn btn-block btn-social btn-google">
										Google
									</a>
								</div>
							</div>
							<hr className="my-4" />
							<div className="text-center mb-2">
								Don't have an account?{' '}
								<a href="/register" className="register-link">
									Register here
								</a>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PreLogin1;
