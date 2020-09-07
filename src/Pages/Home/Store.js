import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import axios from 'axios';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

function Store() {
	const [data, setData] = useState([]);

	useEffect(() => {
		axios.get('/getAllAssets').then((res) => {
			console.log(res);
			setData(res.data.data);
		});
	}, []);

	return (
		<div>
			<Navbar />

			<OwlCarousel className="owl-theme pt-5 mt-4" loop dotsContainer="false" items={4}>
				<div class="row item justify-content-around">
					<div className="card store-card" style={{ width: '200px' }}>
						<img
							src={require('../../Assets/Images/Ant-Man.png')}
							className="card-img-top store-card-image img-fluid"
						/>
						<div className="card-body">
							<h5 className="card-title">Product Name</h5>
							<p className="card-text">
								Short Description: fjjf ofijfw fwfiweofn wiojowj woiwjgiwjgq goigowijgiowjg
							</p>
							<div className="row">
								<div className="col-6 d-flex justify-content-start">
									<button className="btn btn-success">VIEW</button>
								</div>
								<div className="col-6 d-flex justify-content-end">
									<button className="btn btn-info">$ 200</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="item">
					<div className="card store-card" style={{ width: '300px' }}>
						<img
							src={require('../../Assets/Images/Ant-Man.png')}
							className="card-img-top store-card-image img-fluid"
						/>
						<div className="card-body">
							<h5 className="card-title">Product Name</h5>
							<p className="card-text">
								Short Description: fjjf ofijfw fwfiweofn wiojowj woiwjgiwjgq goigowijgiowjg
							</p>
							<div className="row">
								<div className="col-6 d-flex justify-content-start">
									<button className="btn btn-success">VIEW</button>
								</div>
								<div className="col-6 d-flex justify-content-end">
									<button className="btn btn-info">$ 200</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="item">
					<div className="card store-card" style={{ width: '300px' }}>
						<img
							src={require('../../Assets/Images/Ant-Man.png')}
							className="card-img-top store-card-image img-fluid"
						/>
						<div className="card-body">
							<h5 className="card-title">Product Name</h5>
							<p className="card-text">
								Short Description: fjjf ofijfw fwfiweofn wiojowj woiwjgiwjgq goigowijgiowjg
							</p>
							<div className="row">
								<div className="col-6 d-flex justify-content-start">
									<button className="btn btn-success">VIEW</button>
								</div>
								<div className="col-6 d-flex justify-content-end">
									<button className="btn btn-info">$ 200</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="item">
					<div className="card store-card" style={{ width: '300px' }}>
						<img
							src={require('../../Assets/Images/Ant-Man.png')}
							className="card-img-top store-card-image img-fluid"
						/>
						<div className="card-body">
							<h5 className="card-title">Product Name</h5>
							<p className="card-text">
								Short Description: fjjf ofijfw fwfiweofn wiojowj woiwjgiwjgq goigowijgiowjg
							</p>
							<div className="row">
								<div className="col-6 d-flex justify-content-start">
									<button className="btn btn-success">VIEW</button>
								</div>
								<div className="col-6 d-flex justify-content-end">
									<button className="btn btn-info">$ 200</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="item">
					<div className="card store-card" style={{ width: '300px' }}>
						<img
							src={require('../../Assets/Images/Ant-Man.png')}
							className="card-img-top store-card-image img-fluid"
						/>
						<div className="card-body">
							<h5 className="card-title">Product Name</h5>
							<p className="card-text">
								Short Description: fjjf ofijfw fwfiweofn wiojowj woiwjgiwjgq goigowijgiowjg
							</p>
							<div className="row">
								<div className="col-6 d-flex justify-content-start">
									<button className="btn btn-success">VIEW</button>
								</div>
								<div className="col-6 d-flex justify-content-end">
									<button className="btn btn-info">$ 200</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</OwlCarousel>
		</div>
	);
}

export default Store;
