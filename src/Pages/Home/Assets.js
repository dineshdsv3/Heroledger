import React, { useState, useEffect } from 'react';
import Heroledger from '../../blockchain/abis/heroledger.json';

const productOptions = [
	{ id: 0, name: 'Character', value: 'character', type: 'image' },
	{ id: 1, name: 'Script', value: 'script', type: 'file' },
	{ id: 2, name: 'Logo', value: 'logo', type: 'image' },
	{ id: 3, name: 'Backgrounds', value: 'background', type: 'background' },
	{ id: 4, name: 'Audio', value: 'audio', type: 'audio' },
	{ id: 5, name: 'Video', value: 'video', type: 'video' },
];

function Assets() {
	const [user, setUser] = useState({});
	const [contract, setContract] = useState({});
	const [blockReceipt, setBlockReceipt] = useState({});
	console.log(blockReceipt);
	// const [productCount, setproductCount] = useState();
	const [account, setAccount] = useState('');
	const [productDetails, setProductDetails] = useState({
		name: '',
		description: '',
		terms: '',
		productType: '',
		upload: '',
		price: 0,
	});

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

	useEffect(() => {
		getUserDetails();
		loadContract();
	}, []);

	const getUserDetails = () => {
		const user = JSON.parse(localStorage.getItem('user'));
		setUser(user);
	};

	const addProduct = async (name, type, user, email, price) => {
		contract.methods
			.createProduct(name, type, user, email, price, false)
			.send({ from: account })
			.once('receipt', (receipt) => {
				setBlockReceipt(receipt);
			});
	};

	const handleUpload = (e) => {
		let result;
		let file = e.target.files[0];
		if (file.size > 3148576) {
			alert('Please upload file less than 3 MB');
		} else {
			let reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = async () => {
				result = reader.result;
				console.log(reader.result);
				setProductDetails({ ...productDetails, upload: reader.result });
			};
		}
	};

	const handlePrice = (e) => {
		let usdValue = e.target.value;
		let ethValue = usdValue * 0.0026;
		let ethPrice = window.web3.utils.toWei(ethValue.toString(), 'Ether');
		setProductDetails({ ...productDetails, price: ethPrice });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await addProduct(productDetails.name,productDetails.productType,user.name,user.email,productDetails.price)
		console.log(productDetails);
	};

	return (
		<section>
			<div className="container-fluid">
				<div className="row">
					<div className="col-xl-10 col-lg-9 col-md-8 ml-auto">
						<div className="row pt-5 mt-md-3 mb-5 ml-2">
							<button className="btn btn-primary" data-toggle="modal" data-target="#register-asset">
								New Asset
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Asset Registration Modal */}
			<div className="modal fade" id="register-asset">
				<div className="modal-dialog">
					<div className="modal-content asset-modal">
						<form onSubmit={handleSubmit}>
							<div className="modal-header">
								<h4 className="modal-title">Register your Asset</h4>
								<button type="button" className="close" data-dismiss="modal">
									&times;
								</button>
							</div>
							<div className="modal-body asset-modal-body">
								<div>
									<label htmlFor="name">Product Name</label>
									<input
										id="name"
										onChange={(e) => setProductDetails({ ...productDetails, name: e.target.value })}
										required
									/>
								</div>
								<div>
									<label htmlFor="description">Description</label>
									<textarea
										id="description"
										onChange={(e) =>
											setProductDetails({ ...productDetails, description: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<label htmlFor="terms">Terms</label>
									<input
										id="terms"
										onChange={(e) =>
											setProductDetails({ ...productDetails, terms: e.target.value })
										}
										required
									/>
								</div>
								<div>
									<label htmlFor="productType">Product type</label>
									<select
										id="productType"
										name="productType"
										onChange={(e) =>
											setProductDetails({ ...productDetails, productType: e.target.value })
										}
										required
									>
										<option value="">Select an option</option>
										{productOptions.map((ele, ind) => (
											<option key={ele + ind} value={ele.value}>
												{ele.name}
											</option>
										))}
									</select>
								</div>
								<div>
									<label className="btn primary-btn" htmlFor="upload">
										<i className="fa fa-upload"></i>Upload
									</label>
									<input type="file" id="upload" onChange={handleUpload} accept="*" required hidden />
								</div>
								<div>
									<label htmlFor="price">Price in USD</label>
									<input id="price" onChange={handlePrice} required />
								</div>
							</div>
							<div className="modal-footer">
								<button type="submit" className="btn btn-success">
									Confirm
								</button>
								<button type="button" className="btn btn-danger" data-dismiss="modal">
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			{/* End of Modal */}
		</section>
	);
}

export default Assets;
