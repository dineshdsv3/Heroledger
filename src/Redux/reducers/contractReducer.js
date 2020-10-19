import { CONTRACT_LIST_REQUEST, CONTRACT_LIST_SUCCESS } from '../constants/contractConstant';

const initialState = {};

export const contractReducer = (state = initialState, action) => {
	switch (action.type) {
		case CONTRACT_LIST_REQUEST:
			return { loading: true, products: [] };
		case CONTRACT_LIST_SUCCESS:
			return { loading: false, state: action.payload };
		default:
			return state;
	}
};
