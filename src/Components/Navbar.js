import React from 'react';
import axios from 'axios';

function Navbar() {
	const user = JSON.parse(localStorage.getItem('user'));
	const email = user.email;
	const logout = () => {
		console.log(email);
		axios.put('/logout', { email }).then((res) => {
			if (res.status === 200) {
				localStorage.removeItem('token');
				localStorage.removeItem('user');
				window.location.pathname = '/';
			}
		});
	};
	return (
		<div>
			<nav className="navbar navbar-expand-lg navbar-light bg-dark fixed-top">
				<div className="col-md-4">
					<h4 className="text-light text-uppercase">Dashboard</h4>
				</div>
				<div className="col-md-5">
					<form>
						<div className="input-group">
							<input type="text" className="form-control search-input" placeholder="Search..." />
							<button type="button" className="btn btn-white search-btn">
								<i className="fas fa-search text-danger"></i>
							</button>
						</div>
					</form>
				</div>
				<div className="col-md-3">
					<ul className="navbar-nav">
						<li className="nav-item icon-parent">
							<a href="#" className="nav-link icon-bullet">
								<i className="fas fa-comments text-muted fa-lg"></i>
							</a>
						</li>
						<li className="nav-item icon-parent">
							<a href="#" className="nav-link icon-bullet">
								<i className="fas fa-bell text-muted fa-lg"></i>
							</a>
						</li>
						<li className="nav-item mx-auto">
							<a className="nav-link" href={'/profile'}>
								<img
									className="rounded-circle"
									src={require('../Assets/Images/face.png')}
									width="20"
								/>{' '}
								<span className="text-white">Profile</span>
							</a>
						</li>
						<li className="nav-item icon-parent ml-md-auto">
							<a href="#" className="nav-link icon-bullet" data-toggle="modal" data-target="#sign-out">
								<i className="fas fa-sign-out-alt text-info fa-lg"></i>
							</a>
						</li>
					</ul>
				</div>
				{/* End of Navbar */}
			</nav>
			{/* Modal */}
			<div className="modal fade" id="sign-out">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h4 className="modal-title">Want to leave?</h4>
							<button type="button" className="close" data-dismiss="modal">
								&times;
							</button>
						</div>
						<div className="modal-body">Press logout to leave</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-success" data-dismiss="modal">
								Stay Here
							</button>
							<button
								type="button"
								onClick={() => logout()}
								className="btn btn-danger"
								data-dismiss="modal"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* End of Modal */}
		</div>
	);
}

export default Navbar;
