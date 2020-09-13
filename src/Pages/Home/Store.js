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
	console.log(data);
	const [loader, setLoader] = useState(false);

	console.log(contract);

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
				}
				console.log("Product Purchase completed")
				axios.put('/purchaseProduct', {updatedProduct}).then(res => {
					console.log(res);
					alert("Purchase Succesfful, Product added to your account");
					window.location.reload();
				}).catch((error) => {
					alert("Purchase not successful, Please try again")
				})
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
						ownerAddress: returnData.ownerAddress
					};
					console.log("License Update purchased")
					console.log(updatedLicense);
					axios.put('/purchaseLicense', {updatedLicense}).then((res) => {
						console.log(res);
					})
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
											onClick={() => (window.location.pathname = `/Product?id=${ele.productId}`)}
										/>
										<div className="card-body">
											<div className="card-title store-card-title text-capitalize font-weight-bold text-white font-italic">
												{ele.productName}
											</div>

											<div className="row mt-1">
												<div className="col-6 d-flex justify-content-start">
													<button
														className="btn btn-info p-1 store-btn"
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
														onClick={() =>
															purchaseLicense(
																ele.productId,
																user.email,
																ele.licenseFee,
																ele.term1EndDate
															)
														}
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
		</div>
	);
}

export default Store;
