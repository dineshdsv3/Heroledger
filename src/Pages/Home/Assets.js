import React, { useState, useEffect } from 'react';
import $ from 'jquery';
import axios from 'axios';
import Heroledger from '../../blockchain/abis/heroledger.json';
import DataTable from 'react-data-table-component';
import EditAssetModal from './EditAssetModal';

const productOptions = [
	{ id: 0, name: 'Character', value: 'character', type: 'image' },
	{ id: 1, name: 'Script', value: 'script', type: 'file' },
	{ id: 2, name: 'Logo', value: 'logo', type: 'image' },
	{ id: 3, name: 'Backgrounds', value: 'background', type: 'background' },
	{ id: 4, name: 'Audio', value: 'audio', type: 'audio' },
	{ id: 5, name: 'Video', value: 'video', type: 'video' },
	{ id: 6, name: 'Props', value: 'props', type: 'image' },
];

function Assets() {
	const [user, setUser] = useState({});
	const [contract, setContract] = useState({});
	const [submitLoader, setSubmitLoader] = useState(false);
	const [assets, setAssets] = useState([]);
	const [assetLoader, setAssetLoader] = useState(true);
	const [purchaseAssets, setPurchaseAssets] = useState([]);
	const [purchaseAssetLoader, setPurchaseAssetLoader] = useState(true);
	const [editAssetData, setEditAssetData] = useState([]);
	const [account, setAccount] = useState('');
	const [toggleEditAsset, setToggleEditAsset] = useState(false);
	const [productDetails, setProductDetails] = useState({
		name: '',
		description: '',
		terms: '',
		productType: '',
		upload: '',
		price: 0,
	});
	const [thumbnail, setThumbnail] = useState('');
	console.log(thumbnail);

	useEffect(() => {
		// getUserDetails();
		loadContract();
	}, []);

	useEffect(() => {
		getUserDetails();
	}, []);

	// Table Data Styling & Sorting
	const customStyles = {
		cells: {
			style: {
				fontSize: '9.9px',
			},
		},
		headCells: {
			style: {
				fontSize: '10.9px',
				fontWeight: 'bold',
				color: '#030303',
				alignItems: 'center',
				justifyContent: 'center',
			},
		},
	};

	const columns = [
		{
			name: 'Image',
			selector: 'image',
			center: true,
			width: '8%',
		},
		{
			name: 'Asset Name',
			selector: 'name',
			width: '12%',
		},
		{
			name: 'Hash',
			selector: 'hash',
			center: true,
			width: '10%',
		},
		{
			name: 'Owner',
			selector: 'owner',
			width: '10%',
			sortable: true,
		},
		{
			name: 'Uploaded On',
			selector: 'timestamp',
			sortable: true,
			center: true,
			wrap: true,
			width: '11%',
		},
		{
			name: 'Product Type',
			selector: 'productType',
			sortable: true,
			center: true,
			width: '12%',
		},
		{
			name: 'Price',
			selector: 'price',
			sortable: true,
			center: true,
			wrap: true,
			width: '8%',
		},
		{
			name: 'In Store',
			selector: 'inStore',
			sortable: true,
			center: true,
			width: '9%',
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
			width: '12%',
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
		const user = await JSON.parse(localStorage.getItem('user'));
		setUser(user);
		let email = user.email;

		axios.get('/getUserAssets', { params: { email } }).then((res) => {
			const assetData = res.data.data.map((ele) => {
				return {
					image: getImage(ele.productType, ele.image),
					name: <a href={`/Product?id=${ele.productId}&prev=assets`}>{ele.productName}</a>,
					hash: (
						<a href={`https://kovan.etherscan.io/tx/${ele.transactionHash}`} target="_blank">
							{ele.transactionHash}
						</a>
					),
					owner: ele.ownerEmail,
					timestamp: getDate(ele.timestamp),
					productType: ele.productType,
					price: `$ ${ele.priceinUsd}`,
					inStore: ele.InStore ? <span className="dot active"></span> : <span className="dot"></span>,
					licensing: ele.license ? <span className="dot active"></span> : <span className="dot"></span>,
					actions: (
						<div className="d-flex justify-content-between">
							<button
								className="btn border-0"
								disabled={ele.ownerEmail !== user.email}
								onClick={() => editAsset(ele.productId)}
							>
								<i className="fa fa-pencil text-info" aria-hidden="true"></i>
							</button>
							&nbsp;
							<button className="btn border-0" onClick={() => deleteAsset(ele.productId)}>
								<i className="fa fa-times text-danger" aria-hidden="true"></i>
							</button>
						</div>
					),
				};
			});
			setAssets(assetData);
			setAssetLoader(false);
		});
		axios.get('/getPurchasedUserAssets', { params: { email } }).then((res) => {
			const purchaseAssetData = res.data.data
				.filter((ele) => ele.originatorEmail !== ele.ownerEmail)
				.map((ele) => {
					return {
						image: getImage(ele.productType, ele.image),
						name: <a href={`/Product?id=${ele.productId}&prev=assets`}>{ele.productName}</a>,
						hash: (
							<a href={`https://kovan.etherscan.io/tx/${ele.transactionHash}`} target="_blank">
								{ele.transactionHash}
							</a>
						),
						owner: ele.ownerEmail,
						timestamp: getDate(ele.timestamp),
						productType: ele.productType,
						price: `$ ${ele.priceinUsd}`,
						inStore: ele.InStore ? <span className="dot active"></span> : <span className="dot"></span>,
						licensing: ele.license ? <span className="dot active"></span> : <span className="dot"></span>,
						actions: (
							<div className="d-flex justify-content-between">
								{/* onClick={() => editAsset(ele.productId)} */}
								<button className="btn border-0" disabled>
									<i className="fa fa-pencil text-info" aria-hidden="true"></i>
								</button>
								&nbsp;
								<button className="btn border-0" disabled onClick={() => deleteAsset(ele.productId)}>
									<i className="fa fa-times text-danger" aria-hidden="true"></i>
								</button>
							</div>
						),
					};
				});

			setPurchaseAssets(purchaseAssetData);
			setPurchaseAssetLoader(false);
		});
	};

	const editAsset = async (productId) => {
		console.log(productId + 'Edit');
		await axios.get('/getSingleProduct', { params: { productId } }).then((res) => {
			console.log(res.data);
			setEditAssetData(res.data.data);
		});
		setToggleEditAsset(true);
	};

	const deleteAsset = (productId) => {
		console.log(productId + 'delete');
	};

	const addProductPostRequest = (product) => {
		const formData = new FormData();
		formData.append('image', productDetails.upload);
		axios.post('/addUpload', formData).then((res) => {
			console.log(res.data.file.filename);
			product.image = res.data.file.filename;
			console.log(product);

			axios
				.post('/addProduct', { product })
				.then((res) => {
					console.log(res.data.message);
					$('#register-asset').modal('hide');
					alert('Your Product has been successfully Registered');
					window.location.href = '/Welcome?page=assets';
				})
				.catch((err) => {
					alert('Product Registration failed. Please try again in few minutes');
				});
		});
	};

	const addProduct = async (name, type, email, price) => {
		contract.methods
			.createProduct(name, type, email, price, false, false)
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
					// image: productDetails.upload,
					inStore: blockchainData.inStore,
					license: blockchainData.license,
					fullDescription: '',
					priceinUsd: 0,
				};
				// console.log(product);
				// const upload = {
				// 	id: product.productId,
				// 	name: product.productName,
				// 	upload: productDetails.upload,
				// };
				addProductPostRequest(product);
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
					<img
						className="rounded-circle"
						src={require('../../Assets/Images/music.png')}
						width="40"
						height="40"
					/>
				</div>
			);
		} else if (characterType == 'video') {
			return (
				<div>
					<img
						className="rounded-circle"
						src={require('../../Assets/Images/video.jpeg')}
						width="40"
						height="40"
					/>
				</div>
			);
		} else if (characterType == 'script') {
			return (
				<div>
					<img
						className="rounded-circle"
						src={require('../../Assets/Images/doc.jpeg')}
						width="40"
						height="40"
					/>
				</div>
			);
		} else {
			return (
				<div>
					<img className="rounded-circle" src={`/image/${image}`} width="40" height="40" />
				</div>
			);
		}
	};

	const handleUpload = (e) => {
		let result;
		let file = e.target.files[0];
		if (file) {
			if (file.size > 1148576) {
				alert('In Beta version you need to upload file less than or equal to 1 MB');
			} else {
				setProductDetails({ ...productDetails, upload: file });
				setThumbnail(file.name);
			}
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitLoader(true);
		await addProduct(productDetails.name, productDetails.productType, user.email, productDetails.price);
		console.log(productDetails);
	};

	return toggleEditAsset ? (
		<EditAssetModal data={editAssetData} setToggleEditAsset={setToggleEditAsset} />
	) : (
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
								<h5 className="text-primary">Registered Assets</h5>
								{assetLoader ? (
									<div className="spinner-border text-info" role="status">
										<span className="sr-only">Loading...</span>
									</div>
								) : assets.length > 0 ? (
									<DataTable
										noHeader
										columns={columns}
										data={assets}
										customStyles={customStyles}
										pagination={true}
										responsive={true}
										paginationPerPage={5}
										noDataComponent={
											<div className="spinner-border text-success" role="status">
												<span className="sr-only">Loading...</span>
											</div>
										}
									/>
								) : (
									<h5 className="text-center text-warning">No Registered assets found!!!</h5>
								)}

								<h5 className="text-primary mt-1">Purchased Assets</h5>
								{purchaseAssetLoader ? (
									<div className="spinner-border text-info" role="status">
										<span className="sr-only">Loading...</span>
									</div>
								) : purchaseAssets.length > 0 ? (
									<DataTable
										noHeader
										columns={columns}
										data={purchaseAssets}
										customStyles={customStyles}
										pagination={true}
										responsive={true}
										paginationPerPage={5}
										noDataComponent={
											<div className="spinner-border text-success" role="status">
												<span className="sr-only">Loading...</span>
											</div>
										}
									/>
								) : (
									<h5 className="text-center text-warning">No Purchased assets found!!!</h5>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Asset Registration Modal */}
			<div className="modal fade" id="register-asset">
				<div className="modal-dialog">
					<div className="modal-content">
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
										maxLength="20"
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
								{thumbnail && (
									<div className="text-success text-center">
										Uploaded <span className="text-secondary">{thumbnail}</span> Successfully
									</div>
								)}
							</div>
							<div className="modal-footer">
								<button type="submit" className="btn btn-success" disabled={submitLoader}>
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
