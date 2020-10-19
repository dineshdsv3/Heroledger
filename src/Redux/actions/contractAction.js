import axios from 'axios';
import Fortmatic from 'fortmatic';
import Web3 from 'web3';
import Heroledger from '../../blockchain/abis/heroledger.json';
import { CONTRACT_LIST_REQUEST, CONTRACT_LIST_SUCCESS } from '../constants/contractConstant';

export const getContract = () => async (dispatch) => {
	try {
		dispatch({ type: CONTRACT_LIST_REQUEST });

		let fm = new Fortmatic('pk_test_097457B513F0A02C', 'kovan');
		window.web3 = new Web3(fm.getProvider());
		// console.log(fm.getProvider().isFortmatic);
		// console.log(window.web3.currentProvider.isFortmatic);
		const web3 = window.web3;
		// console.log(web3);
		const accounts = await web3.eth.getAccounts();
		localStorage.setItem('account', accounts[0]);
		const networkId = await web3.eth.net.getId();
		const networkData = Heroledger.networks[networkId];
		if (networkData) {
			const heroledger = await new web3.eth.Contract(Heroledger.abi, networkData.address);
			console.log(heroledger);
			dispatch({
				type: CONTRACT_LIST_SUCCESS,
				payload: heroledger,
			});
		}
	} catch (error) {
		console.log('Contract execution error');
	}
};
