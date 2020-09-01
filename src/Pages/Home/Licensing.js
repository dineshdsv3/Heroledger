import React, { useState, useEffect } from 'react';
import Heroledger from '../../blockchain/abis/heroledger.json';
import DataTable from 'react-data-table-component';
import axios from 'axios';

function Licensing() {
	const [user, setUser] = useState({});
	const [contract, setContract] = useState({});
	const [submitLoader, setSubmitLoader] = useState(false);
	const [assets, setAssets] = useState([]);
	const [account, setAccount] = useState('');

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
			const assetData = res.data.data.map((ele) => {
				return {
					image: getImage(ele.productType, ele.image),
					name: ele.productName,
					hash: (
						<a href={`https://kovan.etherscan.io/tx/${ele.transactionHash}`} target="_blank">
							{ele.transactionHash}
						</a>
                    ),
                    price: `$ 120`,
					royalty: '25%',
					term1: `1/9/2020 to 1/3/2021`,
					term2: 'Non-Exclusive',
					transfer: <i className="fa fa-exchange" aria-hidden="true"></i>,
					manage: (
						<div className="d-flex justify-content-between">
							<button className="btn border-0">
								<i className="fa fa-pencil" aria-hidden="true"></i>
							</button>
							&nbsp;
							<button className="btn border-0">
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
					<img className="rounded-circle" src={image} width="40" height="40" />
				</div>
			);
		}
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
			width: '23%',
		},
		{
			name: 'Price',
			selector: 'price',
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
			width: '12%',
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
			width: '6%',
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
						<button
							className="btn btn-primary ml-auto mr-2"
							data-toggle="modal"
							data-target="#new-license"
						>
							Add License
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
		</div>
	);
}

export default Licensing;
