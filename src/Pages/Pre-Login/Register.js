import React, { useState, useEffect } from 'react';
import axios from 'axios';
import publicIp from 'public-ip';
// Styles are in pre-login1

function Register() {
	const [userDetails, setUserDetails] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		latitude: '',
		longitude: '',
		countryCode: '',
		countryName: '',
		state: '',
	});

	const [loader, setLoader] = useState(false);

	useEffect(() => {
		const getLocation = async () => {
			let ip = await publicIp.v4().then((res) => res);
			// Used https://geolocation-db.com/dashboard# to get location by IP
			axios.get(`https://geolocation-db.com/json/697de680-a737-11ea-9820-af05f4014d91/${ip}`).then((res) => {
				setUserDetails({
					...userDetails,
					latitude: res.data.latitude,
					longitude: res.data.longitude,
					countryCode: res.data.country_code,
					countryName: res.data.country_name,
					state: res.data.state,
				});
			});
		};
		getLocation();
		// The below code is used for asking permission for location from browser
		// if ('geolocation' in navigator) {
		// 	console.log('Available');
		// } else {
		// 	console.log('Not Available');
		// }

		// navigator.geolocation.getCurrentPosition(function (position) {
		// 	setUserDetails({
		// 		...userDetails,
		// 		latitude: position.coords.latitude,
		// 		longitude: position.coords.longitude,
		// 	});
		// });
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		setLoader(true);
		if (userDetails.password === userDetails.confirmPassword) {
			const registerDetails = {
				name: userDetails.name,
				email: userDetails.email,
				password: userDetails.password,
				latitude: userDetails.latitude,
				longitude: userDetails.longitude,
				countryCode: userDetails.countryCode,
				countryName: userDetails.countryName,
				state: userDetails.state,
			};
			console.log(registerDetails);
			axios
				.post(`/signup`, { registerDetails })
				.then((res) => {
					alert('Registration Successful, continue to login');
					setLoader(false);
					window.location.pathname = '/';
				})
				.catch((error) => {
					alert('Registration Failed, Please try again');
					setLoader(false);
				});
		} else {
			alert('Passwords dont match');
		}
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
						<h6 className="title mt-1 text-center">Register into Heroledger</h6>

						<form className="pre-login-form-box px-3" onSubmit={handleSubmit}>
							<div className="form-input">
								<span>
									<i className="fa fa-user"></i>
								</span>
								<input
									type="text"
									name="username"
									placeholder="Name"
									maxLength={16}
									required
									onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
								/>
							</div>
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
							<div className="form-input">
								<span>
									<i className="fa fa-key"></i>
								</span>
								<input
									type="password"
									name="confirmPassword"
									placeholder="Confirm Password"
									required
									onChange={(e) =>
										setUserDetails({ ...userDetails, confirmPassword: e.target.value })
									}
								/>
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
										<i className="fas fa-sign-in-alt"></i> Register
									</button>
								)}
							</div>

							<div className="text-center font-12 mb-1"> or login with</div>

							<div className="row mb-1">
								<div className="col-6 font-12">
									<a href="#" className="btn btn-block btn-social btn-facebook">
										Facebook
									</a>
								</div>
								<div className="col-6 font-12">
									<a href="#" className="btn btn-block btn-social btn-google">
										Google
									</a>
								</div>
							</div>
							<hr className="my-2" />
							<div className="text-center font-12 mb-1">
								Already have an account?{' '}
								<a href="/" className="register-link">
									Login here
								</a>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Register;
