import React, { useState, useEffect } from 'react';
import Heroledger from '../blockchain/abis/heroledger.json';
import axios from 'axios';

function ProductDescription() {
	const [contract, setContract] = useState({});
	const [account, setAccount] = useState('');

	useEffect(() => {
		// getProductDetails();
		// loadContract();
	});

	const getProductDetails = () => {
		console.log('hello');
	};

	const loadContract = async () => {
		const web3 = window.web3;
		const accounts = await web3.eth.getAccounts();
		console.log(accounts)
		// setAccount(accounts[0]);
		const networkId = await web3.eth.net.getId();
		const networkData = Heroledger.networks[networkId];
		if (networkData) {
			const heroledger = await new web3.eth.Contract(Heroledger.abi, networkData.address);
			setContract(heroledger);
			// const productCount = await heroledger.methods.productCount().call();
			// setproductCount(productCount);
		}
	};

	return (
		<div className="container product-container">
			<div className="row">
				<div className="col-md-5">
					<img src={require('../Assets/Images/heroledger-new.jpg')} className="d-block w-100" />
				</div>
				<div className="col-md-7 description-col">
					<p className="new-product text-center">Logo</p>
					<h2>Comic Name</h2>
					<p>Hash: oidiuwfhukwhfihfiaukfukreufkahfrkawjefiawfuhuh</p>
					<img className="star-rating-product" src={require('../Assets/Images/stars.jpeg')} />
					<p className="product-price">
						USD $ 15.00 <br />
						Fee $2
					</p>
					<p>
						<span className="product-short-header">Short Description:</span> jf wnfiwn wfunwiufnw wvwifjwjf
						wefnwnfw wvurnguiejvvr{' '}
					</p>
					<p>
						<span className="product-short-header">Long Description:</span> jf wnfiwn wfunwiufnw wvwifjwjf
						wefnwnfw wvurnguiejvvr vurvnw uiwnvfuwv wv wunvw vwuniwunvw wuvnwuivnw vcru viuwvnw vwk vuwv wj
						vuv uiwv wiu v
					</p>
					<p>
						<span className="product-short-header">License Description:</span> jf wnfiwn wfunwiufnw
						wvwifjwjf wefnwnfw wvurnguiejvvr vurvnw uiwnvfuwv wv wunvw vwuniwunvw wuvnwuivnw vcru viuwvnw
						vwk vuwv wj vuv uiwv wiu v
					</p>
					<p>
						<b>Availability:</b> In Stock
					</p>

					<button type="button" className="btn btn-primary product-btn">
						Purchase
					</button>
					<button type="button" className="btn btn-info product-btn">
						License
					</button>
				</div>
			</div>
		</div>
	);
}

export default ProductDescription;
