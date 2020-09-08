import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar';
import axios from 'axios';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

function Store() {
	const [data, setData] = useState([]);
	console.log(data);

	useEffect(() => {
		getAllAssets();
	}, [data]);

	const getAllAssets = async () => {
		await axios.get('/getAllAssets').then((res) => {
			setData(res.data.data);
		});
	};

	return (
		<div>
			<Navbar />
			<div className="store-page pt-5 mt-4">
				<h2 className="my-3 text-white ml-2">Characters</h2>
				<div className="ml-5 pl-5">
					<OwlCarousel className="owl-theme" loop dotsContainer="false" items={4}>
						{data.map((ele, ind) => (
							<div class="row item justify-content-around" key={ele + ind}>
								<div className="card store-card">
									<img src={ele.image} className="card-img-top store-card-image img-fluid" />
									<div className="card-body">
										<div className="card-title store-card-title text-capitalize">
											{ele.productName}
										</div>
										<div className="card-text store-card-text mt-1">
											<span className="text-primary">Short Description:</span> {ele.description}
										</div>
										<div className="row mt-1">
											<div className="col-6 d-flex justify-content-start">
												<button className="btn btn-success p-1">VIEW</button>
											</div>
											<div className="col-6 d-flex justify-content-end">
												<div>
													<small>
														Price: <b>$ {ele.priceinUsd}</b>
													</small>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</OwlCarousel>
				</div>
				<h2 className="my-3 text-white ml-2">Logos</h2>

				<div className="ml-5 pl-5">
					<OwlCarousel className="owl-theme" loop dotsContainer="false" items={4}>
						{data.map((ele, ind) => (
							<div class="row item justify-content-around" key={ele + ind}>
								<div className="card store-card">
									<img src={ele.image} className="card-img-top store-card-image img-fluid" />
									<div className="card-body">
										<div className="card-title store-card-title text-capitalize">
											{ele.productName}
										</div>
										<div className="card-text store-card-text mt-1">
											<span className="text-primary">Short Description:</span> {ele.description}
										</div>
										<div className="row mt-1">
											<div className="col-6 d-flex justify-content-start">
												<a
													href={`/product?id=${ele.productId}`}
													className="btn btn-success p-1"
												>
													VIEW
												</a>
											</div>
											<div className="col-6 d-flex justify-content-end">
												<div>
													<small>
														Price: <b>$ {ele.priceinUsd}</b>
													</small>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</OwlCarousel>
				</div>
				<div className="ml-5 pl-5">
					<OwlCarousel className="owl-theme" loop dotsContainer="false" items={4}>
						{data.map((ele, ind) => (
							<div class="row item justify-content-around" key={ele + ind}>
								<div className="card store-card">
									<img src={ele.image} className="card-img-top store-card-image img-fluid" />
									<div className="card-body">
										<div className="card-title store-card-title text-capitalize">
											{ele.productName}
										</div>
										<div className="card-text store-card-text mt-1">
											<span className="text-primary">Short Description:</span> {ele.description}
										</div>
										<div className="row mt-1">
											<div className="col-6 d-flex justify-content-start">
												<button className="btn btn-success p-1">VIEW</button>
											</div>
											<div className="col-6 d-flex justify-content-end">
												<div>
													<small>
														Price: <b>$ {ele.priceinUsd}</b>
													</small>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</OwlCarousel>
				</div>
			</div>
		</div>
	);
}

export default Store;
