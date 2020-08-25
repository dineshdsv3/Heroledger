import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';
import Assets from './Assets';
// Style is in welcome.scss

function Welcome() {
	const user = JSON.parse(localStorage.getItem('user'));
	const email = user.email;

	const [toggle, setToggleItems] = useState({
		dashboard: true,
		assets: false,
	});
	console.log(toggle);

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
			{/* Navbar */}
			<nav className="navbar navbar-expand-md navbar-light">
				<button
					className="navbar-toggler ml-auto mb-2 bg-light"
					type="button"
					data-toggle="collapse"
					data-target="#myNavbar"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="myNavbar">
					<div className="container-fluid">
						<div className="row">
							{/* sidebar */}
							<div className="col-xl-2 col-lg-3 col-md-4 sidebar fixed-top">
								<div className="bottom-border">
									<img
										src={require('../../Assets/Images/heroledger-white.png')}
										className="img-fluid rounded rounded mx-auto d-block mb-2"
										width="100"
									/>
								</div>
								{/* <a
									href="#"
									className="navar-brand text-white d-block mx-auto text-center py-3 mb-4 bottom-border"
								>
									Heroledger
								</a> */}
								<div className="bottom-border py-3">
									<img
										className="rounded-circle"
										src={require('../../Assets/Images/face.png')}
										width="50"
									/>{' '}
									<a href="#" className="text-white">
										{user.name}
									</a>
								</div>
								<ul className="navbar-nav flex-column mt-4">
									<li className="nav-item">
										<a
											href="#"
											className={
												toggle.dashboard
													? 'nav-link text-white p-3 mb-2 current'
													: 'nav-link text-white p-3 mb-2 sidebar-link'
											}
											onClick={() => setToggleItems({ dashboard: true, assets: false })}
										>
											<i className="fas fa-home text-light fa-lg mr-3"></i>Dashboard
										</a>
									</li>
									<li className="nav-item">
										<a href="#" className="nav-link text-white p-3 mb-2 sidebar-link">
											<i className="fas fa-user text-light fa-lg mr-3"></i>Profile
										</a>
									</li>
									<li className="nav-item">
										<a
											href="#"
											className={
												toggle.assets
													? 'nav-link text-white p-3 mb-2 current'
													: 'nav-link text-white p-3 mb-2 sidebar-link'
											}
											onClick={() => setToggleItems({ dashboard: false, assets: true })}
										>
											<i className="fas fa-envelope text-light fa-lg mr-3"></i>Assets
										</a>
									</li>
									<li className="nav-item">
										<a href="#" className="nav-link text-white p-3 mb-2 sidebar-link">
											<i className="fas fa-chart-line text-light fa-lg mr-3"></i>Store
										</a>
									</li>
									<li className="nav-item">
										<a href="#" className="nav-link text-white p-3 mb-2 sidebar-link">
											<i className="fas fa-chart-bar text-light fa-lg mr-3"></i>Licensing
										</a>
									</li>
								</ul>
							</div>
							{/* End of sidebar */}

							{/* Top-nav */}
							<div className="col-xl-10 col-lg-9 col-md-8 ml-auto bg-dark fixed-top py-2 top-navbar">
								<div className="row align-items-center">
									<div className="col-md-4">
										<h4 className="text-light text-uppercase">Dashboard</h4>
									</div>
									<div className="col-md-5">
										<form>
											<div className="input-group">
												<input
													type="text"
													className="form-control search-input"
													placeholder="Search..."
												/>
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
											<li className="nav-item icon-parent ml-md-auto">
												<a
													href="#"
													className="nav-link icon-bullet"
													data-toggle="modal"
													data-target="#sign-out"
												>
													<i className="fas fa-sign-out-alt text-info fa-lg"></i>
												</a>
											</li>
										</ul>
									</div>
								</div>
							</div>
							{/* End of top-nav */}
						</div>
					</div>
				</div>
			</nav>
			{/* End of Navbar */}

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

			{/* Cards */}
			{
				toggle.dashboard ? <Dashboard />  : toggle.assets ? <Assets /> : <div>Nothing selected</div>
			}
			
			{/* End of Cards */}
		</div>
	);
}

export default Welcome;
