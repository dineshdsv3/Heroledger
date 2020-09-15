import React from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';


function Transactions() {

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
			name: 'Price',
			selector: 'price',
			sortable: true,
			center: true,
			width: '10%',
		},
		{
			name:'Previous Owner',
			selector: 'royalty',
			sortable: true,
			wrap: true,
			width: '7%',
		},
		{
			name: 'Asset Type',
			selector: 'type',
			sortable: true,
			center: true,
			width: '16%',
		},
		{
			name: 'Transaction Type',
			selector: 'transactionType',
			sortable: true,
			center: true,
			width: '10%',
		},
		{
			name: 'Registration Date',
			selector: 'registerDate',
			sortable: true,
			center: true,
			wrap: true,
			width: '10%',
        },
        {
            name: 'Purchase Date',
			selector: 'purchaseDate',
			sortable: true,
			center: true,
			wrap: true,
			width: '10%',
        }
	];


	return (
		<div className="container-fluid">
			<div className="row align-items-center">
				<div className="col-xl-10 col-lg-9 col-md-8 ml-auto">
					<div className="row pt-5 mt-md-3 mb-5 ml-auto">
                        <h1>Transactions</h1>
                        {console.log("transactions")}
                    </div>
				</div>
			</div>
		</div>
	);
}

export default Transactions;
