import React, { useState, useEffect } from 'react';
import Navbar from '../../../Components/Navbar';
import axios from 'axios';
import Heroledger from '../../../blockchain/abis/heroledger.json';
import moment from 'moment';
import Fortmatic from 'fortmatic';
import Web3 from 'web3';

const Logos = () => {
	const [contract, setContract] = useState({});
	const [account, setAccount] = useState('');
	const [logos, setLogos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [user, setUser] = useState({});
	const [selectedProduct, setSelectedProduct] = useState({});
	const [check, setCheck] = useState(false);
	console.log(contract);

	useEffect(() => {
		getAllCharacters();
		loadContract();
	}, []);

	const loadContract = async () => {
		let fm = new Fortmatic('pk_test_097457B513F0A02C', 'kovan');
		window.web3 = new Web3(fm.getProvider());
		const web3 = window.web3;
		const accounts = web3.eth.getAccounts();
		setAccount(accounts[0]);
		const networkId = web3.eth.net.getId();
		const networkData = Heroledger.networks[networkId];
		if (networkData) {
			const heroledger = await new web3.eth.Contract(Heroledger.abi, networkData.address);
			console.log('hello');
			console.log(heroledger);
			setContract(heroledger);
		}
	};

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

		// await contract.methods
		// 	.purchaseProduct(productId, buyerEmail)
		// 	.send({ from: account, value: price })
		// .once('receipt', (receipt) => {
		// 	const BCData = receipt.events.productPurchased;
		// 	console.log(BCData);
		// 	const returnData = receipt.events.productPurchased.returnValues;
		// 	console.log(returnData);
		// 	const updatedProduct = {
		// 		productId: returnData.productId,
		// 		ownerAddress: returnData.ownerAddress,
		// 		ownerEmail: returnData.ownerEmail,
		// 		inStore: returnData.inStore,
		// 		timestamp: returnData.timestamp,
		// 		transactionHash: BCData.transactionHash,
		// 	};
		// 	const transactionDetails = {
		// 		productId: returnData.productId,
		// 		productName: returnData.productName,
		// 		transactionHash: BCData.transactionHash,
		// 		transactionType: 'Purchase',
		// 		previousOwner: returnData.seller,
		// 		currentOwner: returnData.ownerEmail,
		// 		purchaseDate: returnData.timestamp,
		// 		amountinEth: returnData.amount,
		// 		registrationDate: returnData.registrationDate,
		// 	};
		// 	console.log(transactionDetails);
		// 	axios
		// 		.put('/purchaseProduct', { updatedProduct })
		// 		.then((res) => {
		// 			axios.post('/addTransaction', { transactionDetails }).then((res) => {
		// 				console.log(res);
		// 				alert('Purchase Succesfful, Product added to your account');
		// 				window.location.reload();
		// 			});
		// 		})
		// 		.catch((error) => {
		// 			alert('Purchase not successful, Please try again');
		// 		});
		// }
		// );
	};

	const purchaseLicense = async (productId, licensee, licenseFee, endDate) => {
		var d = new Date();
		var date = d.getDate();
		console.log(date);
		var currentTime = moment(d).format('X');

		if (currentTime <= endDate) {
			console.log(productId, licensee, licenseFee, currentTime);
			console.log(contract);
			console.log(contract.methods);
			// await contract.methods
			// 	.purchaseLicense(productId, licensee)
			// 	.send({ from: account, value: licenseFee })
			// .once('receipt', (receipt) => {
			// 	// console.log(receipt);
			// 	const BCData = receipt.events.licensePurchased;
			// 	const returnData = receipt.events.licensePurchased.returnValues;
			// 	const updatedLicense = {
			// 		productId: returnData.productId,
			// 		endDate: returnData.endDate,
			// 		startDate: returnData.startDate,
			// 		license: returnData.license,
			// 		licenseeMail: returnData.licenseeMail,
			// 		licensorMail: returnData.licensorMail,
			// 		term2: 'N/A',
			// 		transactionHash: BCData.transactionHash,
			// 		timestamp: returnData.timestamp,
			// 		ownerAddress: returnData.ownerAddress,
			// 	};
			// 	console.log('License Update purchased');
			// 	console.log(BCData);
			// 	console.log(returnData);
			// 	const transactionDetails = {
			// 		productId: returnData.productId,
			// 		productName: returnData.productName,
			// 		transactionHash: BCData.transactionHash,
			// 		transactionType: 'license',
			// 		previousOwner: returnData.licensorMail,
			// 		currentOwner: returnData.licenseeMail,
			// 		purchaseDate: returnData.timestamp,
			// 		amountinEth: returnData.amount,
			// 		registrationDate: returnData.registrationDate,
			// 	};
			// 	axios
			// 		.put('/purchaseLicense', { updatedLicense })
			// 		.then((res) => {
			// 			axios.post('/addTransaction', { transactionDetails }).then((res) => {
			// 				console.log(res);
			// 				alert('License Purchase Succesfful, Product added to your account');
			// 				window.location.reload();
			// 			});
			// 		})
			// 		.catch((error) => {
			// 			alert('Purchase not successful, Please try again');
			// 		});
			// });
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
		</div>
	);
};

export default Logos;
