import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { contractReducer } from './reducers/contractReducer';

const reducer = combineReducers({
	contract: contractReducer,
});

const middleware = [thunk];
const initialState = {};

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
