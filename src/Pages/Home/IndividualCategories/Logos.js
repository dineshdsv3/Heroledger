import React, { useState, useEffect } from 'react';
import Navbar from '../../../Components/Navbar';
import axios from 'axios';
import moment from 'moment';
import { useSelector } from 'react-redux';

const Logos = () => {
	const contract = useSelector((state) => state.contract);
	const account = localStorage.getItem('account');
	const [logos, setLogos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState({});
	const [product, setSelectedProduct] = useState({});
	const [check, setCheck] = useState(false);
	console.log(contract);

	useEffect(() => {
		getAllCharacters();
	}, []);

	const getAllCharacters = async () => {
		const user = await JSON.parse(localStorage.getItem('user'));
		setUser(user);
		await axios.get('/getAllLogos').then((res) => {
			setLogos(res.data.data);
			setLoading(false);
		});
	};

	const getImage = (characterType, image) => {
		if (characterType == 'audio') {
			return require('../../../Assets/Images/music.png');
		} else if (characterType == 'video') {
			return require('../../../Assets/Images/video.jpeg');
		} else if (characterType == 'script') {
			return require('../../../Assets/Images/doc.jpeg');
		} else {
			return `/image/${image}`;
		}
	};

	const purchaseProduct = async (productId, buyerEmail, price) => {
		console.log(productId, buyerEmail, price);

		await contract.state.methods
			.purchaseProduct(productId, buyerEmail)
			.send({ from: account, value: price })
			.once('receipt', (receipt) => {
				const BCData = receipt.events.productPurchased;
				console.log(BCData);
				const returnData = receipt.events.productPurchased.returnValues;
				console.log(returnData);
				const updatedProduct = {
					productId: returnData.productId,
					ownerAddress: returnData.ownerAddress,
					ownerEmail: returnData.ownerEmail,
					inStore: returnData.inStore,
					timestamp: returnData.timestamp,
					transactionHash: BCData.transactionHash,
				};
				const transactionDetails = {
					productId: returnData.productId,
					productName: returnData.productName,
					transactionHash: BCData.transactionHash,
					transactionType: 'Purchase',
					previousOwner: returnData.seller,
					currentOwner: returnData.ownerEmail,
					purchaseDate: returnData.timestamp,
					amountinEth: returnData.amount,
					registrationDate: returnData.registrationDate,
				};
				console.log(transactionDetails);
				axios
					.put('/purchaseProduct', { updatedProduct })
					.then((res) => {
						axios.post('/addTransaction', { transactionDetails }).then((res) => {
							console.log(res);
							alert('Purchase Succesfful, Product added to your account');
							window.location.reload();
						});
					})
					.catch((error) => {
						alert('Purchase not successful, Please try again');
					});
			});
	};

	const purchaseLicense = async (productId, licensee, licenseFee, endDate) => {
		var d = new Date();
		var date = d.getDate();
		console.log(date);
		var currentTime = moment(d).format('X');

		if (currentTime <= endDate) {
			await contract.state.methods
				.purchaseLicense(productId, licensee)
				.send({ from: account, value: licenseFee })
				.once('receipt', (receipt) => {
					// console.log(receipt);
					const BCData = receipt.events.licensePurchased;
					const returnData = receipt.events.licensePurchased.returnValues;
					const updatedLicense = {
						productId: returnData.productId,
						endDate: returnData.endDate,
						startDate: returnData.startDate,
						license: returnData.license,
						licenseeMail: returnData.licenseeMail,
						licensorMail: returnData.licensorMail,
						term2: 'N/A',
						transactionHash: BCData.transactionHash,
						timestamp: returnData.timestamp,
						ownerAddress: returnData.ownerAddress,
					};
					console.log('License Update purchased');
					console.log(BCData);
					console.log(returnData);
					const transactionDetails = {
						productId: returnData.productId,
						productName: returnData.productName,
						transactionHash: BCData.transactionHash,
						transactionType: 'license',
						previousOwner: returnData.licensorMail,
						currentOwner: returnData.licenseeMail,
						purchaseDate: returnData.timestamp,
						amountinEth: returnData.amount,
						registrationDate: returnData.registrationDate,
					};
					axios
						.put('/purchaseLicense', { updatedLicense })
						.then((res) => {
							axios.post('/addTransaction', { transactionDetails }).then((res) => {
								console.log(res);
								alert('License Purchase Succesfful, Product added to your account');
								window.location.reload();
							});
						})
						.catch((error) => {
							alert('Purchase not successful, Please try again');
						});
				});
		} else {
			alert('license expired for the selected product');
		}
	};

	return (
		<div className="category-page bg-dark">
			<Navbar />
			<div className="mt-5 mx-2">
				<h4 className="text-white mt-5 pt-5">Logos</h4>
				<div>
					<a href="/Welcome?page=dashboard">Dashbord</a> => &nbsp;
					<a className="text-capitalize" href={`/Welcome?page=store`}>
						Store
					</a>
				</div>
				{loading ? (
					<div className="spinner-border text-success mt-5" role="status">
						<span className="sr-only">Loading...</span>
					</div>
				) : (
					<div className="row mx-1">
						{logos.map((ele, ind) => (
							<div
								className="col-sm-12 col-md-6 col-lg-4 col-xl-3 item justify-content-between"
								key={ele + ind}
							>
								<div className="card store-card">
									<img
										src={`${getImage(ele.productType, ele.image)}`}
										className="card-img-top img-fluid category-card-image "
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
													<br /> {ele.licenseFeeUsd ? `$ ${ele.licenseFeeUsd}` : 'N/A'}
												</small>
											</div>
										</div>

										<div className="row">
											<div className="col-6 d-flex justify-content-start">
												<button
													className="btn btn-info store-btn"
													onClick={() =>
														purchaseProduct(ele.productId, user.email, ele.price)
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
					</div>
				)}
			</div>
			{/* Modal-licensing terms */}
			<div className="modal licensing-modal" id="licensing-terms">
				<div className="modal-dialog modal-lg" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title ">LICENSING AGREEMENT</h5>
							<button type="button" className="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div className="modal-body">
							<div className="watermark">SAMPLE</div>
							<p>
								<b>
									<i>Asset Name:</i>
								</b>{' '}
								{product.productName}
							</p>
							<p>
								<b>
									<i>Hash: </i>
								</b>
								{product.transactionHash}
							</p>
							<p>
								This Artist Licensing Agreement (the “AGREEMENT”) is entered into effective this date,
								(date added here) between LICENSOR NAME (“ARTIST”) and LICENSEE (“CLIENT”).
							</p>
							<p>
								<b>Scope of this Agreement.</b> This Agreement applies to any image, graphics, digital
								assets, or digital images created or taken by Artist and delivered to the Client
								(collectively known as “IMAGES”). This Agreement governs the relationship between the
								parties and in no communication or other exchange, shall modify the terms of this
								Agreement unless agreed to in writing.
							</p>
							<p>
								<b>Rights:</b> All Images and rights relating to them, including copyright and ownership
								rights in the media in which the Images are stored, remain the sole and exclusive
								property of the Artist. This license provides the Client with the limited right to
								reproduce, publicly display, and distribute the Images only for the agreed upon terms as
								set forth in the Client Invoice and signed by both parties. Images used for any purpose
								not directly related outside of those terms must be with the express permission of
								Artist and may include the payment of additional fees, unless otherwise agreed to in
								writing. Images may contain copyright management information (CMI) at the discretion of
								the Artist in the form of either 1) a copyright notice © and/or 2) other copyright and
								ownership information embedded in the metadata or elsewhere unless otherwise agreed to
								by the Parties. Removing and/or altering such information is prohibited and constitutes
								a violation of the Digital Millennium Copyright Act (DMCA) and Client will be
								responsible to the Artist for any penalties and awards available under that statute.
							</p>{' '}
							<p>
								{' '}
								<b>Relationship of the Parties:</b> The parties agree that Artist is an independent
								contractor and that neither Artist nor Artist’s employees or contract personnel are, or
								shall be deemed to be, employees of Client. No agency, partnership, joint venture, or
								employee-employer relationship is intended or created by this Agreement. Neither party
								is authorized to act as agent or bind the other party except as expressly stated in this
								Agreement. Artist and the Images or any other deliverables prepared by Artist shall not
								be deemed a work for hire as defined under Copyright Law. All rights granted to Client
								are contractual in nature and are expressly defined by this Agreement.
							</p>
							<p>
								<b>Creation:</b> The manner and method of creating any Image is solely at the discretion
								of Artist and the Client has no right to control Artist’s manner and method of
								performance under this Agreement. Artist will use his/her best efforts to: (a) ensure
								that the Images conform to Client’s specifications; and (b) submit all Images to Client
								in publishable quality, on or before the applicable deadlines.
							</p>
							<p>
								<b>Delivery:</b> Artist may select delivery of designs in PDF, JPEG, PNG, or other
								standard formats at a resolution that Artist determines will be suitable for the Images
								as licensed. It is the Client’s responsibility to verify that the Images are suitable
								for reproduction and that if the Images are not deemed suitable, to notify the Artist
								within five (5) business days. Artist’s sole obligation will be to replace the Images at
								a suitable resolution but in no event will Artist be liable for poor reproduction
								quality, delays, or consequential damages.
							</p>
						</div>
						<div className="modal-footer">
							<div className="mr-auto">
								<input type="checkbox" value={check} onChange={() => setCheck(!check)} /> {'    '}{' '}
								&nbsp;I have read and accept the terms and information contained in this license.
							</div>
							<button
								type="button"
								className="btn btn-success"
								disabled={!check}
								onClick={() =>
									purchaseLicense(
										product.productId,
										user.email,
										product.licenseFee,
										product.term1EndDate
									)
								}
							>
								Proceed to purchase
							</button>
							<button type="button" className="btn btn-danger" data-dismiss="modal">
								Close
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* End of Modal */}
		</div>
	);
};

export default Logos;
