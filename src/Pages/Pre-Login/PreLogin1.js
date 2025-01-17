import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GoogleLogin from 'react-google-login';
import { useDispatch, useSelector } from 'react-redux';
import { getContract } from '../../Redux/actions/contractAction';
// Styles are in pre-login1

function PreLogin1() {
	const dispatch = useDispatch();

	const contract = useSelector((state) => state.contract);

	const [userDetails, setUserDetails] = useState({
		password: '',
		email: '',
		remember: false,
	});

	const [loader, setLoader] = useState(false);

	const responseGoogle = (response) => {
		console.log(response);
		try {
			let userDetails = {
				password: response.profileObj.googleId,
				email: response.profileObj.email,
			};
			console.log(userDetails);
			axios
				.post(`/login`, { userDetails })
				.then(async (res) => {
					if (res.error) {
						return new Error();
					}
					const userResponseDetails = {
						name: res.data.user.name,
						email: res.data.user.email,
						token: res.data.token,
						remember: userDetails.remember,
					};
					localStorage.setItem('token', res.data.token);
					localStorage.setItem('user', JSON.stringify(userResponseDetails));
					console.log('login successful');
					dispatch(getContract());
					alert('Log-in Successful');
					setLoader(false);
					window.location.href = '/Welcome?page=dashboard';
				})
				.catch((error) => {
					alert('Login Failed, Please register using Google and try again');
					setLoader(false);
				});
		} catch (error) {
			alert('Google Sign on Failed');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoader(true);
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
				console.log('login successful');
				alert('Log-in Successful');
				setLoader(false);
				window.location.href = '/Welcome?page=dashboard';
			})
			.catch((error) => {
				alert('Incorrect Email and Password combination!!. Try again');
				setLoader(false);
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
						<h6 className="title text-center mt-2">Login into Heroledger</h6>
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
									<label className="custom-control-label font-12" htmlFor="cb1">
										Remember me
									</label>
								</div>
							</div>
							<div className="mb-3">
								{loader ? (
									<button type="submit" disabled className="btn btn-block text-uppercase">
										<div className="spinner-border text-info" role="status">
											<span className="sr-only">Loading...</span>
										</div>
									</button>
								) : (
									<button type="submit" className="btn btn-block text-uppercase">
										<i className="fas fa-sign-in-alt"></i> Login
									</button>
								)}
							</div>
							<div className="text-right font-12">
								<a href="#" className="forget-link">
									Forgot Password?
								</a>
							</div>
							<div className="text-center font-12 mb-1"> or login with</div>

							<div className="row mb-1">
								<div className="col-6 font-12">
									<a href="#" className="btn btn-block btn-social btn-facebook">
										Facebook
									</a>
								</div>
								<div className="col-6 font-12">
									<GoogleLogin
										clientId="19141662008-gcd47nf7h9p4qjigkeloai8njjmjak1l.apps.googleusercontent.com"
										buttonText="Login"
										render={(renderProps) => (
											<button
												className="btn btn-block btn-social btn-google"
												onClick={renderProps.onClick}
												disabled={renderProps.disabled}
											>
												Google
											</button>
										)}
										onSuccess={responseGoogle}
										onFailure={responseGoogle}
										cookiePolicy={'single_host_origin'}
									/>
								</div>
							</div>
							<hr className="my-2" />
							<div className="text-center font-12 mb-1">
								Don't have an account?{' '}
								<a href="/register" className="register-link font-12">
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
