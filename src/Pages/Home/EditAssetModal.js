import React, { useState, useEffect } from 'react';
import Heroledger from '../../blockchain/abis/heroledger.json';
import axios from 'axios';

function EditAsset(props) {
	const data = props.data[0];
	const [contract, setContract] = useState({});
	const [account, setAccount] = useState('');
	const [editLoader, setEditLoader] = useState(false);

	useEffect(() => {
		loadContract();
	}, []);

	const loadContract = async () => {
		const web3 = window.web3;
		const accounts = await web3.eth.getAccounts();
		setAccount(accounts[0]);
		const networkId = await web3.eth.net.getId();
		const networkData = Heroledger.networks[networkId];
		if (networkData) {
			const heroledger = await new web3.eth.Contract(Heroledger.abi, networkData.address);
			setContract(heroledger);
		}
	};

	const [editDetails, setEditDetails] = useState({
		price: 0,
		license: data.license,
		inStore: data.InStore,
		briefDescription: data.description,
		fullDescription: data.fullDescription,
		priceinUSD: data.priceinUsd,
	});

	const handlePrice = (e) => {
		let usdValue = e.target.value;
		let ethValue = usdValue * 0.0026;
		let ethPrice = window.web3.utils.toWei(ethValue.toString(), 'Ether');
		setEditDetails({ ...editDetails, price: ethPrice, priceinUSD: usdValue });
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		setEditLoader(true);
		await contract.methods
			.editProduct(data.productId, editDetails.price, editDetails.inStore, editDetails.license)
			.send({ from: account })
			.once('receipt', (receipt) => {
				// console.log(receipt);
				const returnData = receipt.events.productEdited.returnValues;
				console.log(returnData);
				const updatedProduct = {
					productId: data.productId,
					license: returnData.license,
					inStore: returnData.inStore,
					ethPrice: returnData.price,
					usdPrice: editDetails.priceinUSD,
					description: editDetails.briefDescription,
					fullDescription: editDetails.fullDescription,
					licensor: data.originatorEmail,
				};
				axios
					.put('/updateProduct', { updatedProduct })
					.then((res) => {
						alert('Changed Asset Details Successfully!!!');
						window.location.href = '/Welcome?page=assets';
					})
					.catch((err) => {
						alert('Error in Changing Asset Details, Please co');
					});
			});
	};

	return (
		<div className="container-fluid edit-asset-modal">
			<div className="row align-items-center">
				<div className="col-xl-10 col-lg-9 col-md-8 ml-auto">
					<form onSubmit={handleSubmit}>
						<div className="row pt-5 mt-md-3 mb-5 ml-1">
							<div className="col-5 mt-1">
								<div className="my-1">
									Hash:{' '}
									<a href={`https://kovan.etherscan.io/tx/${data.transactionHash}`} target="_blank">
										<small>{data.transactionHash}</small>
									</a>
								</div>
								<div className="my-1">
									Registration Date: <span className="text-info">{getDate(data.timestamp)}</span>
								</div>
								<div className="my-1">
									Product Name: <span className="text-info text-capitalize">{data.productName}</span>
								</div>
								<div className="my-1">
									Product Type: <span className="text-info text-capitalize">{data.productType}</span>
								</div>
								<div className="asset-edit-image-col">
									{data.productType == 'script' ? (
										<img
											className="img-fluid mt-2"
											src={require('../../Assets/Images/doc.jpeg')}
											width="45%"
											height="30vh"
										/>
									) : data.productType == 'audio' ? (
										<img
											className="img-fluid mt-2"
											src={require('../../Assets/Images/music.png')}
											width="45%"
											height="30vh"
										/>
									) : data.productType == 'video' ? (
										<img
											className="img-fluid mt-2"
											src={require('../../Assets/Images/video.jpeg')}
											width="45%"
											height="30vh"
										/>
									) : (
										<img className="img-fluid mt-2" src={`/image/${data.image}`} width="45%" height="30vh" />
									)}
								</div>
							</div>
							<div className="col-2 mt-5">
								<div className="row mt-3">
									<div className="col-12 mt-5">
										<div className="asset-form-input">
											${' '}
											<input
												type="number"
												id="price"
												name="price"
												placeholder="Price"
												onChange={handlePrice}
												required
												value={editDetails.priceinUSD}
											/>{' '}
											USD
										</div>
									</div>
									<div className="col-12 d-flex asset-form-input">
										<span className="ml-3 mr-2">License&nbsp;</span>
										<input
											id="license"
											name="license"
											type="checkbox"
											className="custom-checkbox"
											onChange={(e) =>
												setEditDetails({
													...editDetails,
													license: !editDetails.license,
												})
											}
											checked={editDetails.license}
										/>
									</div>
									<div className="col-12 d-flex asset-form-input">
										<span className="ml-3 mr-2">In Store&nbsp;</span>
										<input
											id="inStore"
											name="inStore"
											type="checkbox"
											className="custom-checkbox"
											onChange={(e) =>
												setEditDetails({
													...editDetails,
													inStore: !editDetails.inStore,
												})
											}
											checked={editDetails.inStore}
										/>
									</div>
								</div>
							</div>
							<div className="col-5 mt-5">
								<h5 className="text-primary">Comic Asset Details</h5>
								<div className="asset-form-input my-3">
									<input
										id="briefDescription"
										name="briefDescription"
										value={editDetails.briefDescription}
										onChange={(e) =>
											setEditDetails({ ...editDetails, briefDescription: e.target.value })
										}
										placeholder="Brief Description"
										required
									/>
								</div>
								<div className="asset-form-input my-3">
									<textarea
										id="briefDescription"
										name="briefDescription"
										value={editDetails.fullDescription}
										onChange={(e) =>
											setEditDetails({ ...editDetails, fullDescription: e.target.value })
										}
										required
										placeholder="Full Description"
									/>
								</div>
								<div className="d-flex justify-content-end">
									{editLoader ? (
										<button type="submit" className="btn btn-success mr-2" disabled>
											Updating
										</button>
									) : (
										<button type="submit" className="btn btn-success mr-2">
											Update
										</button>
									)}
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default EditAsset;
