import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Fortmatic from 'fortmatic';
import Web3 from 'web3';
import Dashboard from './Dashboard';
import Assets from './Assets';
import Licensing from './Licensing';
import Store from './Store';
import Transactions from './Transactions';
import Profile from '../Profile';
import Heroledger from '../../blockchain/abis/heroledger.json';
import publicIp from 'public-ip';
// Style is in welcome.scss

function Welcome() {
	const [contract, setContract] = useState({});

	useEffect(() => {
		async function loadWeb3() {
			let fm = new Fortmatic('pk_test_097457B513F0A02C', 'kovan');
			window.web3 = new Web3(fm.getProvider());
			// console.log(fm.getProvider().isFortmatic);
			// console.log(window.web3.currentProvider.isFortmatic);
			const web3 = window.web3;
			// console.log(web3);
			const accounts = await web3.eth.getAccounts();
			localStorage.setItem('account', accounts[0]);
			const networkId = await web3.eth.net.getId();
			const networkData = Heroledger.networks[networkId];
			if (networkData) {
				const heroledger = await new web3.eth.Contract(Heroledger.abi, networkData.address);
				setContract(heroledger);
			}
		}
		loadWeb3();
		loadPage();
		loadImage();
		getLocation();
	}, []);

	const getLocation = async () => {
		let ip = await publicIp.v4().then((res) => res);
		// Used https://geolocation-db.com/dashboard# to get location by IP
		axios.get(`https://geolocation-db.com/json/697de680-a737-11ea-9820-af05f4014d91/${ip}`).then((res) => {
			const location = {
				latitude: res.data.latitude,
				longitude: res.data.longitude,
				state: res.data.state,
				city: res.data.city,
				countryName: res.data.country_name,
				countryCode: res.data.country_code,
			};
			localStorage.setItem('location', JSON.stringify(location));
		});
	};

	const user = JSON.parse(localStorage.getItem('user'));
	const email = user.email;
	const [image, setImage] = useState('');
	const [toggle, setToggleItems] = useState({
		dashboard: false,
		assets: false,
		licensing: false,
		store: false,
		transactions: false,
		profile: false,
	});
	// console.log(toggle);

	const loadPage = async () => {
		let url = window.location.href;
		let urlsplit = url.split('?');
		let params = urlsplit[1].split('=');
		let page = params[1];
		setToggleItems({ ...toggle, [page]: true });
	};

	const loadImage = async () => {
		axios.get('/getImage', { params: { email } }).then((res) => {
			setImage(res.data.data[0].image);
		});
	};

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
								<div className="bottom-border py-1">
									<a
										href="/Welcome?page=profile"
										className={
											toggle.profile
												? 'nav-link text-white p-2 mb-2 current'
												: 'nav-link text-white p-2 mb-2 sidebar-link'
										}
									>
										<img
											className="rounded-circle"
											src={image ? `/image/${image}` : require('../../Assets/Images/face.png')}
											width="30"
										/>{' '}
										<small>{user.name}</small>
									</a>
								</div>
								<ul className="navbar-nav flex-column mt-4">
									<li className="nav-item">
										<a
											className={
												toggle.dashboard
													? 'nav-link text-white p-3 mb-2 current'
													: 'nav-link text-white p-3 mb-2 sidebar-link'
											}
											href="/Welcome?page=dashboard"
										>
											<small>
												<i className="fa fa-dashboard text-light fa-lg mr-3"></i>Dashboard
											</small>
										</a>
									</li>
									<li className="nav-item">
										<a
											className={
												toggle.assets
													? 'nav-link text-white p-3 mb-2 current'
													: 'nav-link text-white p-3 mb-2 sidebar-link'
											}
											href="/Welcome?page=assets"
										>
											<small>
												<i
													className="fa fa-folder text-light fa-lg mr-3"
													aria-hidden="true"
												></i>
												Assets
											</small>
										</a>
									</li>
									<li className="nav-item">
										<a
											className={
												toggle.store
													? 'nav-link text-white p-3 mb-2 current'
													: 'nav-link text-white p-3 mb-2 sidebar-link'
											}
											href="/Welcome?page=store"
										>
											<small>
												<i
													className="fa fa-television text-light fa-lg mr-3"
													aria-hidden="true"
												></i>
												Store
											</small>
										</a>
									</li>
									<li className="nav-item">
										<a
											className={
												toggle.licensing
													? 'nav-link text-white p-3 mb-2 current'
													: 'nav-link text-white p-3 mb-2 sidebar-link'
											}
											href="/Welcome?page=licensing"
										>
											<small>
												<i className="fa fa-file-o text-light fa-lg mr-3"></i>Licensing
											</small>
										</a>
									</li>
									<li className="nav-item">
										<a
											className={
												toggle.transactions
													? 'nav-link text-white p-3 mb-2 current'
													: 'nav-link text-white p-3 mb-2 sidebar-link'
											}
											href="/Welcome?page=transactions"
										>
											<small>
												<i className="fas fa fa-files-o text-light fa-lg mr-3"></i>Transactions
											</small>
										</a>
									</li>
								</ul>
							</div>
							{/* End of sidebar */}

							{/* Top-nav */}
							<div className="col-xl-10 col-lg-9 col-md-8 ml-auto fixed-top py-2 top-navbar-welcome">
								<div className="row align-items-center">
									<div className="col-md-4">
										{/* <h4 className="text-light text-uppercase">Dashboard</h4> */}
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
												<a className="nav-link icon-bullet">
													<i className="fas fa-comments text-muted fa-lg"></i>
												</a>
											</li>
											<li className="nav-item icon-parent">
												<a className="nav-link icon-bullet">
													<i className="fas fa-bell text-muted fa-lg"></i>
												</a>
											</li>
											<li className="nav-item icon-parent ml-md-auto">
												<a
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
			{toggle.dashboard ? (
				<Dashboard />
			) : toggle.assets ? (
				<Assets contract={contract} />
			) : toggle.licensing ? (
				<Licensing />
			) : toggle.store ? (
				<Store contract={contract} />
			) : toggle.transactions ? (
				<Transactions />
			) : toggle.profile ? (
				<Profile />
			) : (
				<div className="pt-5 mt-5 col-10 mr-auto">Nothing selected, Please contact your Admin</div>
			)}

			{/* End of Cards */}
		</div>
	);
}

export default Welcome;
