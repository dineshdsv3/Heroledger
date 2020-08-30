import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import axios from 'axios';
import Heroledger from '../../blockchain/abis/heroledger.json';
import DataTable, { createTheme } from 'react-data-table-component';

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
	const [assets, setAssets] = useState([]);
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

	useEffect(() => {
		getUserDetails();
		loadContract();
	}, []);

	// Table Data Styling & Sorting
	const customStyles = {
		cells: {
			style: {
				fontSize: '10px',
			},
		},
		headCells: {
			style: {
				fontSize: '11px',
				fontWeight: 'bold',
				color: '#030303',
				alignItems: 'center',
				justifyContent: 'center',
				paddingLeft: '2px',
				paddingRight: '2px',
			},
		},
	};

	createTheme('solarized', {
		text: {
			primary: '#268bd2',
			secondary: '#2aa198',
		},
		background: {
			default: '#002b36',
		},
		context: {
			background: '#cb4b16',
			text: '#FFFFFF',
		},
		divider: {
			default: '#073642',
		},
		action: {
			button: 'rgba(0,0,0,.54)',
			hover: 'rgba(0,0,0,.08)',
			disabled: 'rgba(0,0,0,.12)',
		},
	});

	const columns = [
		{
			name: 'Image',
			selector: 'image',
			center: true,
			width: '10%',
		},
		{
			name: 'Asset Name',
			selector: 'name',
			width: '13%',
		},
		{
			name: 'Hash',
			selector: 'hash',
			center: true,
			width: '25%',
		},
		{
			name: 'Uploaded On',
			selector: 'timestamp',
			sortable: true,
			center: true,
			wrap: true,
			width: '10%',
		},
		{
			name: 'Product Type',
			selector: 'productType',
			sortable: true,
			center: true,
			wrap: true,
			width: '10%',
		},
		{
			name: 'Price',
			selector: 'price',
			sortable: true,
			center: true,
			wrap: true,
			width: '10%',
		},
		{
			name: 'In Store',
			selector: 'inStore',
			sortable: true,
			center: true,
			width: '7%',
		},
		{
			name: 'Licensing',
			selector: 'licensing',
			sortable: true,
			center: true,
			width: '5%',
		},
		{
			name: 'Actions',
			selector: 'actions',
			sortable: true,
			center: true,
			wrap: true,
			width: '10%',
		},
	];

	// End of Table Data Styling & Sorting

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

	const getUserDetails = async () => {
		const user = JSON.parse(localStorage.getItem('user'));
		setUser(user);
		let email = user.email;
		console.log(email);

		await axios.get('/getUserAssets', { params: { email } }).then((res) => {
			const assetData = res.data.data.map((ele) => {
				return {
					image: getImage(ele.productType, ele.image),
					name: ele.productName,
					hash: (
						<a href={`https://kovan.etherscan.io/tx/${ele.transactionHash}`} target="_blank">
							{ele.transactionHash}
						</a>
					),
					timestamp: getDate(ele.timestamp),
					productType: ele.productType,
					price: ele.price,
					inStore: <span className="dot active"></span>,
					licensing: <span className="dot"></span>,
					actions: (
						<div className="d-flex justify-content-between">
							<i className="fa fa-pencil fa-1x" aria-hidden="true"></i>&nbsp;&nbsp;
							<i className="fa fa-times fa-1x" aria-hidden="true"></i>
						</div>
					),
				};
			});
			setAssets(assetData);
		});
	};

	const addProductPostRequest = (product) => {
		axios
			.post('/addProduct', { product })
			.then((res) => {
				console.log(res.data.message);
				$('#register-asset').modal('hide');
				alert('Your Product has been successfully Registered');
			})
			.catch((err) => {
				alert('Product Registration failed. Please try again in few minutes');
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
					image: productDetails.upload,
				};
				console.log(product);
				const upload = {
					id: product.productId,
					name: product.productName,
					upload: productDetails.upload,
				};
				console.log(upload);
				if (product.productType == 'audio') {
					axios
						.post('/addAudio', { upload })
						.then((res) => {
							if (res.data.message) {
								product.upload = '';
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
								product.upload = '';
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
								product.upload = '';
								addProductPostRequest(product);
							}
						})
						.catch((error) => {
							alert('Product Registration Failed. Please register your product again');
						});
				} else {
					addProductPostRequest(product);
				}
			});
	};

	const getDate = (timestamp) => {
		const stamp = new Date(timestamp * 1000);
		let date = stamp.getDate();
		let month = stamp.getMonth() + 1;
		let year = stamp.getFullYear();
		let hours = stamp.getHours();
		let minutes = stamp.getMinutes();
		let seconds = stamp.getSeconds();

		const time = `${date <= 9 ? '0' + date : date}-${month <= 9 ? '0' + month : month}-${year} ${
			hours <= 9 ? '0' + hours : hours
		}:${minutes <= 9 ? '0' + minutes : minutes}:${seconds <= 9 ? '0' + seconds : seconds}`;
		return time;
	};

	const getImage = (characterType, image) => {
		if (characterType == 'audio') {
			return (
				<div>
					<img className="rounded-circle" src={require('../../Assets/Images/music.png')} width="40" />
				</div>
			);
		} else if (characterType == 'video') {
			return (
				<div>
					<img className="rounded-circle" src={require('../../Assets/Images/video.jpeg')} width="40" />
				</div>
			);
		} else if (characterType == 'script') {
			return (
				<div>
					<img className="rounded-circle" src={require('../../Assets/Images/doc.jpeg')} width="40" />
				</div>
			);
		} else {
			return (
				<div>
					<img className="rounded-circle" src={image} width="40" />
				</div>
			);
		}
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
				<div className="row align-items-center">
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
								<DataTable
									noHeader
									columns={columns}
									data={assets}
									customStyles={customStyles}
									// theme="solarized"
									pagination={true}
									responsive={true}
									paginationPerPage={10}
								/>

								{/* <table className="table table-striped bg-light text-center mt-1 asset-table">
									<thead>
										<tr className="text-muted">
											<th>Image</th>
											<th>Asset Name</th>
											<th>Hash</th>
											<th>Uploaded On</th>
											<th>Product Type</th>
											<th>Price</th>
											<th>In Store</th>
											<th>Licensing</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{assets.map((ele, ind) => (
											<tr key={ele + ind}>
												<td>{getImage(ele.productType, ele.productId)}</td>
												<td className="text-capitalize">{ele.productName}</td>
												<td>{ele.transactionHash}</td>
												<td>{getDate(ele.timestamp)}</td>
												<td className="text-capitalize">{ele.productType}</td>
												<td>{ele.price}</td>
												<td>
													<span className="dot active"></span>
												</td>
												<td>
													<span className="dot"></span>
												</td>
												<td className="d-flex justify-content-around">
													<i className="fa fa-pencil" aria-hidden="true"></i>
													<i className="fa fa-times" aria-hidden="true"></i>
												</td>
											</tr>
										))}
									</tbody>
								</table> */}
								{/* Pagination */}
								{/* <nav>
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
								</nav> */}
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
									{submitLoader ? 'Registering...' : 'Confirm'}
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
