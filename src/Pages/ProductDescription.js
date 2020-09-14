import React, { useState, useEffect } from 'react';
import Heroledger from '../blockchain/abis/heroledger.json';
import Navbar from '../Components/Navbar';
import axios from 'axios';
import Fortmatic from 'fortmatic';
import moment from 'moment';

import Web3 from 'web3';

function ProductDescription() {
	const [contract, setContract] = useState({});
	const [account, setAccount] = useState('');
	const [product, setProduct] = useState([]);
	const [user, setUser] = useState({});

	useEffect(() => {
		getProductDetails();
		loadContract();
	}, []);

	const getProductDetails = async () => {
		const user = JSON.parse(localStorage.getItem('user'));
		setUser(user);
		let url = window.location.href;
		let urlsplit = url.split('?');
		let params = urlsplit[1].split('=');
		let idArr = params[1].split('&').filter((ele) => ele > 0);
		let productId = idArr[0];
		await axios.get('/getSingleProduct', { params: { productId } }).then((res) => {
			console.log(res.data);
			setProduct(res.data.data[0]);
		});
	};

	const getImage = (characterType, image) => {
		if (characterType == 'audio') {
			return (
				<div>
					<img
						className="d-block w-100 img-fluid"
						style={{ height: '80vh' }}
						src={require('../Assets/Images/music.png')}
					/>
				</div>
			);
		} else if (characterType == 'video') {
			return (
				<div>
					<img
						className="d-block w-100 img-fluid"
						style={{ height: '80vh' }}
						src={require('../Assets/Images/video.jpeg')}
					/>
				</div>
			);
		} else if (characterType == 'script') {
			return (
				<div>
					<img
						className="d-block w-100 img-fluid"
						style={{ height: '80vh' }}
						src={require('../Assets/Images/doc.jpeg')}
					/>
				</div>
			);
		} else {
			return (
				<div>
					<img className="d-block w-100 img-fluid" style={{ height: '80vh' }} src={image} />
				</div>
			);
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

	const loadContract = async () => {
		let fm = new Fortmatic('pk_test_097457B513F0A02C', 'kovan');
		window.web3 = new Web3(fm.getProvider());
		const web3 = window.web3;
		console.log(web3);
		const accounts = await web3.eth.getAccounts();
		setAccount(accounts[0]);
		const networkId = await web3.eth.net.getId();
		const networkData = Heroledger.networks[networkId];
		if (networkData) {
			const heroledger = await new web3.eth.Contract(Heroledger.abi, networkData.address);
			setContract(heroledger);
		}
	};

	const getDate = (timestamp) => {
		const stamp = new Date(timestamp * 1000);
		let date = stamp.getDate();
		let month = stamp.getMonth() + 1;
		let year = stamp.getFullYear();

		const time = `${date <= 9 ? '0' + date : date}-${month <= 9 ? '0' + month : month}-${year}`;
		return time;
	};

	return (
		<div className="container product-container">
			<Navbar />
			<div className="row">
				<div className="col-md-5">
					{getImage(product.productType, product.image)}
					<img src={product.image} />
				</div>
				<div className="col-md-7 description-col">
					<p className="new-product text-center text-capitalize">{product.productType}</p>
					<h2>{product.productName}</h2>
					<p>
						Hash: <small>{product.transactionHash}</small>
					</p>
					<img className="star-rating-product" src={require('../Assets/Images/stars.jpeg')} />
					<p>
						<span className="product-short-header">Long Description:</span> {product.fullDescription}
						<br />
						<span className="product-price">
							Price {product.priceinUsd ? `$ ${product.priceinUsd} USD` : 'N/A'}{' '}
						</span>
						<button
							type="button"
							className="btn btn-primary product-btn p-2"
							onClick={() => purchaseProduct(product.productId, user.email, product.price)}
							disabled={!(user.email == product.ownerEmail)}
						>
							Purchase
						</button>
					</p>
					<p>
						<span className="product-short-header">License Description:</span>{' '}
						{product.licenseDescription ? product.licenseDescription : 'N/A'}
						<br />
						<span className="product-short-header">Term 1:</span>{' '}
						{product.term1StartDate
							? `${getDate(product.term1StartDate)} to ${getDate(product.term1EndDate)}`
							: 'N/A'}
						<br />
						<span className="product-short-header">Term 2:</span>{' '}
						{product.term2 ? (product.term2 == 'nonExclusive' ? 'Non-Exclusive' : 'Exclusive') : 'N/A'}{' '}
						&nbsp; <span className="product-short-header">Royalty:</span>{' '}
						{product.royalty ? `${product.royalty}%` : 'N/A'} <br />
						<span className="product-price">
							License Fee: {product.licenseFeeUsd ? `$ ${product.licenseFeeUsd.toFixed(2)} USD` : 'N/A'}{' '}
						</span>
						<button
							type="button"
							className="btn btn-info product-btn p-2"
							data-toggle="modal"
							data-target="#licensing-terms"
							disabled={
								!(product.license && product.licenseFeeUsd > 0 && !(user.email == product.ownerEmail))
							}
						>
							License
						</button>
					</p>
				</div>
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
							<button
								type="button"
								className="btn btn-success"
								onClick={() =>
									purchaseLicense(
										product.productId,
										user.email,
										product.licenseFee,
										product.term1EndDate
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

export default ProductDescription;
