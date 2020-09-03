import React, { useState, useEffect } from 'react';
import Heroledger from '../../blockchain/abis/heroledger.json';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import moment from 'moment';

function Licensing() {
	const [user, setUser] = useState({});
	const [contract, setContract] = useState({});
	const [submitLoader, setSubmitLoader] = useState(false);
	const [assets, setAssets] = useState([]);
	const [account, setAccount] = useState('');
	const [licenseLoader, setLicenseLoader] = useState(false);
	const [selectedLicensedAsset, setselectedLicensedAsset] = useState([]);
	const [licenseDetails, setLicenseDetails] = useState({
		licenseDescription: '',
		fee: 0,
		royalty: 0,
		term1StartDate: '',
		term1EndDate: '',
	});
	const [term2Details, setTerm2Details] = useState({
		exclusive: true,
		nonexclusive: false,
	});

	useEffect(() => {
		getUserDetails();
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
			const assetData = res.data.data
				.filter((ele) => ele.license == true)
				.map((ele) => {
					return {
						image: getImage(ele.productType, ele.image),
						name: ele.productName,
						hash: (
							<a href={`https://kovan.etherscan.io/tx/${ele.transactionHash}`} target="_blank">
								{ele.transactionHash}
							</a>
						),
						fee: ele.licenseFeeUsd ? `$ ${ele.licenseFeeUsd}` : 'N/A',
						royalty: ele.royalty ? `${ele.royalty}%` : 'N/A',
						term1: ele.term1StartDate
							? `${getDate(ele.term1StartDate)} to ${getDate(ele.term1EndDate)}`
							: 'N/A',
						term2: ele.term2 ? (ele.term2 == 'nonExclusive' ? 'Non-Exclusive' : 'Exclusive') : 'N/A',
						transfer: <i className="fa fa-exchange" aria-hidden="true"></i>,
						manage: (
							<div className="d-flex justify-content-between">
								<button
									className="btn border-0 text-info"
									data-toggle="modal"
									data-target="#add-license"
									onClick={() => addLicenseProduct(ele.productId)}
								>
									<i className="fa fa-pencil" aria-hidden="true"></i>
								</button>
								&nbsp;
								<button className="btn border-0 text-danger">
									<i className="fa fa-times" aria-hidden="true"></i>
								</button>
							</div>
						),
					};
				});
			setAssets(assetData);
			setSubmitLoader(false);
		});
	};

	const addLicenseProduct = async (productId) => {
		await axios.get('/getSingleProduct', { params: { productId } }).then((res) => {
			console.log(res.data);
			setselectedLicensedAsset(res.data.data[0]);
		});
	};

	const getDate = (timestamp) => {
		const stamp = new Date(timestamp * 1000);
		let date = stamp.getDate();
		let month = stamp.getMonth() + 1;
		let year = stamp.getFullYear();

		const time = `${date <= 9 ? '0' + date : date}-${month <= 9 ? '0' + month : month}-${year}`;
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
					<img className="rounded-circle" src={image} width="40" height="40" />
				</div>
			);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log(licenseDetails);
		setLicenseLoader(true);
		const feeUsd = licenseDetails.fee;
		const feeEth = window.web3.utils.toWei(feeUsd.toString(), 'Ether');
		let term2 = term2Details.exclusive ? 'exclusive' : 'nonExclusive';
		await contract.methods
			.addLicense(
				selectedLicensedAsset.productId,
				selectedLicensedAsset.productName,
				user.name,
				feeEth,
				moment(licenseDetails.term1StartDate).format('X'),
				moment(licenseDetails.term1EndDate).format('X'),
				term2
			)
			.send({ from: account })
			.once('receipt', (receipt) => {
				const returnData = receipt.events.licenseCreated.returnValues;
				console.log(returnData);
				const license = {
					productId: returnData.productId,
					licenseDescription: licenseDetails.licenseDescription,
					licenseFee: returnData.licenseFee,
					licenseFeeUsd: feeUsd,
					royalty: licenseDetails.royalty,
					term1StartDate: returnData.term1StartDate,
					term1EndDate: returnData.term1EndDate,
					term2: returnData.term2,
				};
				console.log(license);
				axios.put('/addLicense', { license }).then((res) => {
					alert('License added to the product successfully!!!');
					setLicenseLoader(false);
					window.location.reload();
				});
			});
	};

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
			width: '7%',
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
			width: '18%',
		},
		{
			name: 'Fee',
			selector: 'fee',
			sortable: true,
			center: true,
			width: '10%',
		},
		{
			name: 'Royalty',
			selector: 'royalty',
			sortable: true,
			center: true,
			wrap: true,
			width: '7%',
		},
		{
			name: 'Term 1',
			selector: 'term1',
			sortable: true,
			center: true,
			width: '16%',
		},
		{
			name: 'Term 2',
			selector: 'term2',
			sortable: true,
			center: true,
			width: '10%',
		},
		{
			name: 'Transfer',
			selector: 'transfer',
			sortable: true,
			center: true,
			wrap: true,
			width: '5%',
		},
		{
			name: 'Manage',
			selector: 'manage',
			sortable: true,
			center: true,
			wrap: true,
			width: '10%',
		},
	];

	return (
		<div className="container-fluid edit-asset-modal">
			<div className="row align-items-center">
				<div className="col-xl-10 col-lg-9 col-md-8 ml-auto">
					<div className="row pt-5 mt-md-3 mb-5 ml-1">
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
								noDataComponent={
									<div className="spinner-border text-success" role="status">
										<span className="sr-only">Loading...</span>
									</div>
								}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="modal fade" id="add-license">
				<div className="modal-dialog">
					<div className="modal-content asset-modal">
						<form onSubmit={handleSubmit}>
							<div className="modal-header">
								<h4 className="modal-title">Add License</h4>
								<button type="button" className="close" data-dismiss="modal">
									&times;
								</button>
							</div>
							<div className="modal-body asset-modal-body">
								<p>
									Hash: <br />
									<small style={{ fontSize: '8.5px' }} className="text-info">
										{selectedLicensedAsset.transactionHash}
									</small>
								</p>
								<p>
									Asset Name: <span className="text-info">{selectedLicensedAsset.productName}</span>
								</p>
								<div>
									<label htmlFor="description">License Description</label>
									<textarea
										id="description"
										required
										onChange={(e) =>
											setLicenseDetails({ ...licenseDetails, licenseDescription: e.target.value })
										}
									/>
								</div>
								<div>
									<label htmlFor="fee">Fee</label>
									<input
										id="fee"
										required
										placeholder="Fee in USD"
										onChange={(e) => setLicenseDetails({ ...licenseDetails, fee: e.target.value })}
									/>
								</div>
								<div>
									<label htmlFor="royalty">Royalty</label>
									<input
										id="royalty"
										type="number"
										required
										min="1"
										max="100"
										placeholder="Value in %"
										onChange={(e) =>
											setLicenseDetails({ ...licenseDetails, royalty: e.target.value })
										}
									/>
								</div>
								<div>
									<label>Term 1</label>
									<div className="row  justify-content-between">
										<div className="col-6">
											<label className="font-weight-normal pb-0 mb-0">From Date</label>
											<input
												className="mt-1"
												id="term1"
												type="date"
												required
												onChange={(e) =>
													setLicenseDetails({
														...licenseDetails,
														term1StartDate: e.target.value,
													})
												}
											/>
										</div>
										<div className="col-6">
											<label className="font-weight-normal pb-0 mb-0">To Date</label>
											<input
												className="mt-1"
												id="term1"
												type="date"
												required
												onChange={(e) =>
													setLicenseDetails({
														...licenseDetails,
														term1EndDate: e.target.value,
													})
												}
											/>
										</div>
									</div>
								</div>
								<div className="pt-2">
									<label htmlFor="term2">Term 2</label>
									<div className="row justify-content-between">
										<div className="col-5">
											<div className="row justify-content-around">
												<div className="col-8">
													<label htmlFor="term2" className="font-weight-normal">
														Exclusive
													</label>
												</div>
												<div className="col-4">
													<input
														id="term2"
														type="checkbox"
														checked={term2Details.exclusive}
														onChange={() =>
															setTerm2Details({ exclusive: true, nonexclusive: false })
														}
													/>
												</div>
											</div>
										</div>
										<div className="col-7">
											<div className="row justify-content-between">
												<div className="col-8">
													<label htmlFor="term2" className="font-weight-normal">
														Non-Exclusive
													</label>
												</div>
												<div className="col-4">
													<input
														id="term2"
														type="checkbox"
														checked={term2Details.nonexclusive}
														onChange={() =>
															setTerm2Details({
																exclusive: false,
																nonexclusive: true,
															})
														}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button type="submit" className="btn btn-info" disabled={licenseLoader}>
									{licenseLoader ? 'Adding..' : 'Add License'}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
			{/* End of Modal */}
		</div>
	);
}

export default Licensing;
