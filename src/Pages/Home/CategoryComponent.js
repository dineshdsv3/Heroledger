import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HorizontalLine from '../../Components/HorizontalLine';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const CategoryComponent = ({
	loader,
	data,
	user,
	header,
	image,
	selectedProduct,
	setSelectedProduct,
	purchaseProduct,
	purchaseLicense,
}) => {
	const getImage = (characterType, image) => {
		if (characterType == 'audio') {
			return require('../../Assets/Images/music.png');
		} else if (characterType == 'video') {
			return require('../../Assets/Images/video.jpeg');
		} else if (characterType == 'script') {
			return require('../../Assets/Images/doc.jpeg');
		} else {
			return `/image/${image}`;
		}
	};

	return (
		<section id={header}>
			{loader ? (
				<div className="spinner-border text-success my-2" role="status">
					<span className="sr-only">Loading...</span>
				</div>
			) : (
				<div className="ml-2 mt-2 py-5 pl-2">
					{data.length > 0 ? (
						<div className="row">
							<div className="col-3 store-card-header m-0 p-0">
								<Link to={`/${header}`}>
									<img src={image} className="card-img img-fluid" />
								</Link>
							</div>
							<div className="col-9">
								<h5 className="mb-0 text-white">
									{header} <HorizontalLine />
								</h5>
								<OwlCarousel className="owl-theme" dotsContainer="false" loop nav items={3}>
									{data.map((ele, ind) => (
										<div className="row item justify-content-around" key={ele + ind}>
											<div className="card store-card">
												<img
													src={`${getImage(ele.productType, ele.image)}`}
													className="card-img-top store-card-image img-fluid pt-2 pb-1 px-2"
													onClick={() =>
														(window.location.href = `/Product?id=${ele.productId}&prev=store`)
													}
												/>
												<div className="card-body store-card-body">
													<div className="row">
														<div className="col-12 card-title store-card-title text-capitalize font-weight-bold font-italic mb-0">
															{ele.productName}
														</div>

														<small className="pl-1">{ele.ownerEmail}</small>

														<div className="col-7 px-1 m-0 d-flex justify-content-start">
															<small className="font-9">
																<b>Price:</b>
																<br />
																{ele.priceinUsd ? `$ ${ele.priceinUsd}` : 'N/A'}
															</small>
														</div>
														<div className="col-5 px-1 m-0 d-flex justify-content-start">
															<small className="font-9">
																<b>Licensing Fee:</b>
																<br />{' '}
																{ele.licenseFeeUsd ? `$ ${ele.licenseFeeUsd}` : 'N/A'}
															</small>
														</div>
													</div>

													<div className="row">
														<div className="col-6 d-flex justify-content-start">
															<button
																className="btn btn-info store-btn"
																onClick={() =>
																	purchaseProduct(
																		ele.productId,
																		user.email,
																		ele.price
																	)
																}
																disabled={user.email == ele.ownerEmail}
															>
																Buy
															</button>
														</div>
														<div className="col-6 d-flex justify-content-end">
															<button
																className="btn btn-primary p-1 store-btn"
																data-toggle="modal"
																data-target="#licensing-terms"
																onClick={() => setSelectedProduct(ele)}
																disabled={
																	!(
																		ele.license &&
																		ele.licenseFeeUsd > 0 &&
																		!(user.email == ele.ownerEmail)
																	)
																}
															>
																License
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</OwlCarousel>
							</div>
						</div>
					) : (
						<h5 className="text-center text-warning">No Characters Found!!!</h5>
					)}
				</div>
			)}
		</section>
	);
};

export default CategoryComponent;
