import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Heroledger from '../../blockchain/abis/heroledger.json';
import moment from 'moment';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

function Store() {
	const [contract, setContract] = useState({});
	const [account, setAccount] = useState('');
	const [user, setUser] = useState({});
	const [data, setData] = useState([]);
	const [loader, setLoader] = useState(false);
	const [selectedProduct, setSelectedProduct] = useState({});
	console.log(selectedProduct);

	useEffect(() => {
		loadContract();
		setLoader(true);
		getAllAssets();
	}, []);

	const getAllAssets = async () => {
		const user = JSON.parse(localStorage.getItem('user'));
		setUser(user);
		await axios.get('/getAllAssets').then((res) => {
			let resData = res.data.data.filter((ele) => ele.InStore == true && ele.priceinUsd > 0).map((ele) => ele);
			if (resData.length > 0) {
				setData(resData);
				setLoader(false);
			} else {
				alert('No Assets in your portfolio');
				setLoader(false);
			}
		});
	};

	const loadContract = async () => {
		const web3 = window.web3;
		const accounts = await web3.eth.getAccounts();
		setAccount(accounts[0]);
		const networkId = await web3.eth.net.getId();
		const networkData = Heroledger.networks[networkId];
		if (networkData) {
			const heroledger = await new web3.eth.Contract(Heroledger.abi, networkData.address);
			setContract(heroledger);
			// const productCount = await heroledger.methods.productCount().call();
			// setproductCount(productCount);
		}
	};

	const purchaseProduct = async (productId, buyerEmail, price) => {
		console.log(productId, buyerEmail, price);
		await contract.methods
			.purchaseProduct(productId, buyerEmail)
			.send({ from: account, value: price })
			.once('receipt', (receipt) => {
				const BCData = receipt.events.productPurchased;
				const returnData = receipt.events.productPurchased.returnValues;
				const updatedProduct = {
					productId: returnData.productId,
					ownerAddress: returnData.ownerAddress,
					ownerEmail: returnData.ownerEmail,
					inStore: returnData.inStore,
					timestamp: returnData.timestamp,
					transactionHash: BCData.transactionHash,
				};
				console.log('Product Purchase completed');
				axios
					.put('/purchaseProduct', { updatedProduct })
					.then((res) => {
						console.log(res);
						alert('Purchase Succesfful, Product added to your account');
						window.location.reload();
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
			console.log(productId, licensee, licenseFee, currentTime);
			await contract.methods
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
						term2: returnData.term2,
						transactionHash: BCData.transactionHash,
						timestamp: returnData.timestamp,
						ownerAddress: returnData.ownerAddress,
					};
					console.log('License Update purchased');
					console.log(updatedLicense);
					axios
						.put('/purchaseLicense', { updatedLicense })
						.then((res) => {
							console.log(res);
							alert('License successful, Product license added to your account');
							window.location.reload();
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
		<div>
			{loader ? (
				<div className="col-xl-10 col-lg-9 col-md-8 store-page pt-5 mt-4 text-white ml-auto">'Loading...'</div>
			) : (
				<div className="col-xl-10 col-lg-9 col-md-8 store-page pt-5 mt-4 ml-auto">
					<h2 className="my-3 text-white ml-2">Characters</h2>
					<div className="ml-5 pl-5">
						<OwlCarousel className="owl-theme" dotsContainer="false" items={4}>
							{data.map((ele, ind) => (
								<div className="row item justify-content-around" key={ele + ind}>
									<div className="card store-card">
										<img
											src={ele.image}
											className="card-img-top store-card-image img-fluid pt-2 pb-1 px-2"
											onClick={() => (window.location.href = `/Product?id=${ele.productId}`)}
										/>
										<div className="card-body store-card-body">
											<div className="row">
												<div className="col-12 card-title store-card-title text-capitalize font-weight-bold font-italic">
													{ele.productName}
												</div>
												<div className="col-7 px-1 m-0 d-flex justify-content-start">
													<p>
														<small>
															<b>Price:</b>$ {ele.priceinUsd}
														</small>
													</p>
												</div>
												<div className="col-5 px-1 m-0 d-flex justify-content-start">
													<small>
														<b>Fee:</b>{' '}
														{ele.licenseFeeUsd ? `$ ${ele.licenseFeeUsd}` : 'N/A'}
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
						</OwlCarousel>
					</div>
					<h2 className="my-3 text-white ml-2">Logos</h2>

					<div className="ml-5 pl-5">
						<OwlCarousel className="owl-theme" loop dotsContainer="false" items={4}>
							{data.map((ele, ind) => (
								<div className="row item justify-content-around" key={ele + ind}>
									<div className="card store-card">
										<img
											src={ele.image}
											className="card-img-top store-card-image img-fluid pt-2 pb-1 px-2"
											onClick={() => (window.location.href = `/Product?id=${ele.productId}`)}
										/>
										<div className="card-body">
											<div className="card-title store-card-title text-capitalize">
												{ele.productName}
											</div>

											<div className="row mt-0">
												<div className="col-6 d-flex justify-content-start">
													<button className="btn btn-info p-1 store-btn">Buy</button>
												</div>
												<div className="col-6 d-flex justify-content-end">
													<button className="btn btn-primary p-1 store-btn">License</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</OwlCarousel>
					</div>
					<h2 className="my-3 text-white ml-2">Props</h2>

					<div className="ml-5 pl-5">
						<OwlCarousel className="owl-theme" loop dotsContainer="false" items={4}>
							{data.map((ele, ind) => (
								<div className="row item justify-content-around" key={ele + ind}>
									<div className="card store-card">
										<img
											src={ele.image}
											className="card-img-top store-card-image img-fluid pt-2 pb-1 px-2"
											onClick={() => (window.location.pathname = `/Product?id=${ele.productId}`)}
										/>
										<div className="card-body">
											<div className="card-title store-card-title text-capitalize">
												{ele.productName}
											</div>

											<div className="row mt-1">
												<div className="col-6 d-flex justify-content-start">
													<button className="btn btn-info p-1 store-btn">Buy</button>
												</div>
												<div className="col-6 d-flex justify-content-end">
													<button className="btn btn-primary p-1 store-btn">License</button>
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</OwlCarousel>
					</div>
				</div>
			)}
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
							<p>
								<b>
									<i>Asset Name:</i>
								</b>{' '}
								{selectedProduct.productName}
							</p>
							<p>
								<b>
									<i>Hash: </i>
								</b>
								{selectedProduct.transactionHash}
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
							<button
								type="button"
								className="btn btn-success"
								onClick={() =>
									purchaseLicense(
										selectedProduct.productId,
										user.email,
										selectedProduct.licenseFee,
										selectedProduct.term1EndDate
									)
								}
							>
								Accept and Purchase
							</button>
							<button type="button" className="btn btn-danger" data-dismiss="modal">
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Store;
