import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import axios from 'axios';
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
	const [submitLoader, setSubmitLoader] = useState(false);
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

	const addProductPostRequest = (product) => {
		axios.post('/addProduct', { product }).then((res) => {
			console.log(res.data.message);
		});
	};

	const addProduct = async (name, type, user, email, price) => {
		contract.methods
			.createProduct(name, type, user, email, price, false)
			.send({ from: account })
			.once('receipt', (receipt) => {
				const blockchainData = receipt.events.productCreated.returnValues;
				console.log(blockchainData);
				const product = {
					productId: blockchainData.productId,
					originatorEmail: blockchainData.originator,
					ownerEmail: blockchainData.ownerEmail,
					ownerAddress: blockchainData.owner,
					productName: blockchainData.productName,
					description: productDetails.description,
					productType: blockchainData.productType,
					price: blockchainData.price,
					transactionHash: receipt.transactionHash,
					blockHash: receipt.blockHash,
					timestamp: blockchainData.timestamp,
				};
				console.log(product);
				const upload = {
					id: product.productId,
					name: product.productName,
					upload: productDetails.upload,
				};
				console.log(upload);
				$('#register-asset').modal('hide');
				if (product.productType == 'audio') {
					axios
						.post('/addAudio', { upload })
						.then((res) => {
							if (res.data.message) {
								addProductPostRequest(product);
							}
						})
						.catch((error) => {
							alert('Product Registration Failed. Please register your product again');
						});
				} else if (product.productType == 'video') {
					axios
						.post('/addVideo', { upload })
						.then((res) => {
							if (res.data.message) {
								addProductPostRequest(product);
							}
						})
						.catch((error) => {
							alert('Product Registration Failed. Please register your product again');
						});
				} else if (product.productType == 'script') {
					axios
						.post('/addDocument', { upload })
						.then((res) => {
							if (res.data.message) {
								addProductPostRequest(product);
							}
						})
						.catch((error) => {
							alert('Product Registration Failed. Please register your product again');
						});
				} else {
					axios
						.post('/addImage', { upload })
						.then((res) => {
							if (res.data.message) {
								addProductPostRequest(product);
							}
						})
						.catch((error) => {
							alert('Product Registration Failed. Please register your product again');
						});
				}
			});
	};

	const handleUpload = (e) => {
		let result;
		let file = e.target.files[0];
		if (file) {
			if (file.size > 3148576) {
				alert('In Beta version you need to upload file less than 3 MB');
			} else {
				let reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onloadend = async () => {
					result = reader.result;
					console.log(reader.result);
					setProductDetails({ ...productDetails, upload: reader.result });
				};
			}
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
		setSubmitLoader(true);
		await addProduct(productDetails.name, productDetails.productType, user.name, user.email, productDetails.price);
		console.log(productDetails);
	};

	return (
		<section>
			<div className="container-fluid">
				<div className="row">
					<div className="col-xl-10 col-lg-9 col-md-8 ml-auto">
						<div className="row pt-5 mt-md-3 mb-5 ml-auto">
							<button
								className="btn btn-primary ml-auto mr-2"
								data-toggle="modal"
								data-target="#register-asset"
							>
								New Asset
							</button>
							<div className="col-12">
								<h3 className="text-muted text-center mb-3">Staff Salary</h3>
								<table className="table table-striped bg-light text-center">
									<thead>
										<tr className="text-muted">
											<th>#</th>
											<th>Name</th>
											<th>Salary</th>
											<th>Date</th>
											<th>Contact</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<th>1</th>
											<td>John</td>
											<td>$2000</td>
											<td>25/05/2018</td>
											<td>Message</td>
										</tr>
										<tr>
											<th>2</th>
											<td>Mark</td>
											<td>$2000</td>
											<td>25/05/2018</td>
											<td>Message</td>
										</tr>
										<tr>
											<th>3</th>
											<td>Mary</td>
											<td>$2000</td>
											<td>25/05/2018</td>
											<td>Message</td>
										</tr>
									</tbody>
								</table>
								{/* Pagination */}
								<nav>
									<ul className="pagination justify-content-center">
										<li className="page-item">
											<a href="#" className="page-link py-2 px-3">
												<span>&laquo;</span>
											</a>
										</li>
										<li className="page-item">
											<a href="#" className="page-link py-2 px-3">
												1
											</a>
										</li>
										<li className="page-item">
											<a href="#" className="page-link py-2 px-3">
												2
											</a>
										</li>
										<li className="page-item">
											<a href="#" className="page-link py-2 px-3">
												3
											</a>
										</li>
										<li className="page-item">
											<a href="#" className="page-link py-2 px-3">
												<span>&raquo;</span>
											</a>
										</li>
									</ul>
								</nav>
								{/* End of pagination */}
							</div>
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
								<h4 className="modal-title">Register your Comic Asset</h4>
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
									<label
										className="btn primary-btn text-center d-flex justify-content-center"
										htmlFor="upload"
									>
										<i className="fa fa-upload"></i>&nbsp;Upload
									</label>
									<input type="file" id="upload" onChange={handleUpload} accept="*" required hidden />
								</div>
							</div>
							<div className="modal-footer">
								<button type="submit" className="btn btn-success">
									{submitLoader ? (
										<div className="spinner-grow text-primary" role="status">
											<span className="sr-only">Loading...</span>
										</div>
									) : (
										'Confirm'
									)}
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
