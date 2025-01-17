import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Transactions() {
	const [user, setUser] = useState({});
	const [buyData, setBuyData] = useState([]);
	const [loader, setLoader] = useState(true);

	useEffect(() => {
		getTransactions();
	}, []);

	const getTransactions = async () => {
		const user = await JSON.parse(localStorage.getItem('user'));
		setUser(user);
		let email = user.email;
		axios.get('/getTransactions', { params: { email } }).then((res) => {
			const buyRecords = res.data.data.map((ele) => {
				return {
					name: <Link to={`/Product?id=${ele.productId}&prev=transactions`}>{ele.productName}</Link>,
					hash: (
						<a href={`https://kovan.etherscan.io/tx/${ele.transactionHash}`} target="_blank">
							{ele.transactionHash}
						</a>
					),
					price: `${getPriceinUSD(ele.amountinEth)} USD`,
					previousOwner: ele.previousOwner,
					currentOwner: ele.currentOwner,
					transactionType: <span className="text-capitalize">{ele.transactionType}</span>,
					registerDate: getDate(ele.registrationDate),
					transactionDate: getDate(ele.purchaseDate),
				};
			});
			setBuyData(buyRecords);
			setLoader(false);
		});
	};

	const getPriceinUSD = (weiPrice) => {
		let Eth = window.web3.utils.fromWei(weiPrice.toString(), 'Ether');
		const usdPrice = Eth / 0.0026;
		return usdPrice.toFixed(2);
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

	const BuyColumns = [
		{
			name: 'Asset Name',
			selector: 'name',
			width: '10%',
		},
		{
			name: 'Hash',
			selector: 'hash',
			center: true,
			width: '15%',
		},
		{
			name: 'Price',
			selector: 'price',
			sortable: true,
			center: true,
			width: '10%',
		},
		{
			name: 'Previous Owner',
			selector: 'previousOwner',
			sortable: true,
			width: '18%',
		},
		{
			name: 'Current Owner',
			selector: 'currentOwner',
			sortable: true,
			width: '18%',
		},

		{
			name: 'Transaction Type',
			selector: 'transactionType',
			sortable: true,
			wrap: false,
			center: true,
			width: '10%',
		},
		{
			name: 'Registration Date',
			selector: 'registerDate',
			sortable: true,
			wrap: false,
			center: true,
			wrap: true,
			width: '10%',
		},
		{
			name: 'Transaction Date',
			selector: 'transactionDate',
			sortable: true,
			center: true,
			wrap: true,
			width: '10%',
		},
	];

	return (
		<div className="container-fluid">
			<div className="row align-items-center">
				<div className="col-xl-10 col-lg-9 col-md-8 ml-auto">
					<div className="pt-5 mt-md-3 mb-5 ml-auto">
						<h5 className="text-primary">Transactions</h5>
						<br />
						{/* {console.log(buyData)} */}
						<div>
							{loader ? (
								<div className="spinner-border text-success" role="status">
									<span className="sr-only">Loading...</span>
								</div>
							) : buyData.length > 0 ? (
								<DataTable
									noHeader
									columns={BuyColumns}
									data={buyData}
									customStyles={customStyles}
									pagination={true}
									responsive={true}
									paginationPerPage={10}
									noDataComponent={
										<div className="spinner-border text-success" role="status">
											<span className="sr-only">Loading...</span>
										</div>
									}
								/>
							) : (
								<h5 className="text-center text-warning">No Transactions Found</h5>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Transactions;
