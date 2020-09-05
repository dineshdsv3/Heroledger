import React, { useState, useEffect } from 'react';
import Heroledger from '../blockchain/abis/heroledger.json';
import Navbar from '../Components/Navbar';
import axios from 'axios';
import Fortmatic from 'fortmatic';

import Web3 from 'web3';

function ProductDescription() {
	const [contract, setContract] = useState({});
	const [account, setAccount] = useState('');
	const [product, setProduct] = useState([]);
	console.log(product);

	useEffect(() => {
		getProductDetails();
		loadContract();
	}, []);

	const getProductDetails = async () => {
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
					<img src={product.image} className="d-block w-100 img-fluid" style={{ height: '80vh' }} />
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
						<button type="button" className="btn btn-primary product-btn p-2">
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
						<button type="button" className="btn btn-info product-btn p-2" disabled={!product.license}>
							License
						</button>
					</p>
				</div>
			</div>
		</div>
	);
}

export default ProductDescription;
