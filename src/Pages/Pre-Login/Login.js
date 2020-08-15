import React, { useState } from 'react';
import axios from 'axios';

function Login(props) {
	const [userDetails, setUserDetails] = useState({
		password: '',
		email: '',
	});
	const handleSubmit = async (e) => {
		e.preventDefault();
		// console.log(userDetails);
		await axios.post(`/login`, { userDetails }).then(async(res) => {
			// console.log(res);
			// console.log(res.data.user);
			if(res.error){
			  console.log(res)
			}
			const token = res.data.token;
			localStorage.setItem('token',token);
			const userResponseDetails = {
			  name : res.data.user.name,
			  email : res.data.user.email
			}
			localStorage.setItem('user',JSON.stringify(userResponseDetails));
			// alert("Log-in Successful")
			// console.log(props);
			props.props.history.push('/Welcome')
		  }).catch((error) => {
			if(error) {
			  // console.log(error);
			  alert("Incorrect Email and Password combination!!. Try again")
			}
		  })
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
