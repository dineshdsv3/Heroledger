import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';

function Transactions() {
	const [user, setUser] = useState({});
	const [sellData, setsellData] = useState([]);
	const [buyData, setBuyData] = useState([]);

	useEffect(() => {
		getTransactions();
	}, []);

	const getTransactions = async () => {
		const user = await JSON.parse(localStorage.getItem('user'));
		setUser(user);
		let email = user.email;
		axios.get('/getTransactions', { params: { email } }).then((res) => {
			const buyRecords = res.data.data
				.filter((ele) => ele.currentOwner === email)
				.map((ele) => {
					console.log(ele);
					return {
						name: <a href={`/Product?id=${ele.productId}&prev=transactions`}>{ele.productName}</a>,
						hash: (
							<a href={`https://kovan.etherscan.io/tx/${ele.transactionHash}`} target="_blank">
								{ele.transactionHash}
							</a>
						),
						price: `${getPriceinUSD(ele.amountinEth)} USD`,
						previousOwner: ele.previousOwner,
						transactionType: <span className="text-capitalize">{ele.transactionType}</span>,
						registerDate: getDate(ele.registrationDate),
						purchaseDate: getDate(ele.purchaseDate),
					};
				});
			setBuyData(buyRecords);

			const sellRecords = res.data.data
				.filter((ele) => ele.previousOwner === email)
				.map((ele) => {
					console.log(ele);
					return {
						name: <a href={`/Product?id=${ele.productId}&prev=transactions`}>{ele.productName}</a>,
						hash: (
							<a href={`https://kovan.etherscan.io/tx/${ele.transactionHash}`} target="_blank">
								{ele.transactionHash}
							</a>
						),
						price: `${getPriceinUSD(ele.amountinEth)} USD`,
						currentOwner: ele.currentOwner,
						transactionType: <span className="text-capitalize">{ele.transactionType}</span>,
						registerDate: getDate(ele.registrationDate),
						purchaseDate: getDate(ele.purchaseDate),
					};
				});
			setsellData(sellRecords);
		});
	};

	const getPriceinUSD = (weiPrice) => {
		let Eth = window.web3.utils.fromWei(weiPrice.toString(), 'Ether');
		console.log(Eth);
		const usdPrice = Eth / 0.0026;
		console.log(usdPrice);
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

	const SellColumns = [
		{
			name: 'Asset Name',
			selector: 'name',
			width: '10%',
		},
		{
			name: 'Hash',
			selector: 'hash',
			center: true,
			width: '16%',
		},
		{
			name: 'Price',
			selector: 'price',
			sortable: true,
			center: true,
			width: '10%',
		},
		{
			name: 'Current Owner',
			selector: 'currentOwner',
			sortable: true,
			wrap: true,
			width: '20%',
		},
		{
			name: 'Transaction Type',
			selector: 'transactionType',
			sortable: true,
			center: true,
			width: '15%',
		},
		{
			name: 'Registration Date',
			selector: 'registerDate',
			sortable: true,
			center: true,
			wrap: true,
			width: '15%',
		},
		{
			name: 'Purchase Date',
			selector: 'purchaseDate',
			sortable: true,
			center: true,
			wrap: true,
			width: '15%',
		},
	];

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
			width: '16%',
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
			wrap: true,
			width: '20%',
		},
		{
			name: 'Transaction Type',
			selector: 'transactionType',
			sortable: true,
			center: true,
			width: '15%',
		},
		{
			name: 'Registration Date',
			selector: 'registerDate',
			sortable: true,
			center: true,
			wrap: true,
			width: '15%',
		},
		{
			name: 'Purchase Date',
			selector: 'purchaseDate',
			sortable: true,
			center: true,
			wrap: true,
			width: '15%',
		},
	];

	return (
		<div className="container-fluid">
			<div className="row align-items-center">
				<div className="col-xl-10 col-lg-9 col-md-8 ml-auto">
					<div className="row pt-5 mt-md-3 mb-5 ml-auto">
						<h5 className="text-primary">Buy Transactions</h5>
						{/* {console.log(buyData)} */}
						<DataTable
							noHeader
							columns={BuyColumns}
							data={buyData}
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
						<h5 className="text-primary">Sell Transactions</h5>
						<DataTable
							noHeader
							columns={SellColumns}
							data={sellData}
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
					</div>
				</div>
			</div>
		</div>
	);
}

export default Transactions;
