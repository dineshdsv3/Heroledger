const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
	productId: {
		type: String,
		required: true,
		trim: true,
	},
	productName: {
		type: String,
		required: true,
		trim: true,
	},
	transactionHash: {
		type: String,
		required: true,
		trim: true,
	},
	transactionType: {
		type: String,
		required: true,
		trim: true,
	},
	previousOwner: {
		type: String,
		required: true,
		trim: true,
	},
	currentOwner: {
		type: String,
		required: true,
		trim: true,
	},
	registrationDate: {
		type: Number,
		required: true,
		trim: true,
	},
	purchaseDate: {
		type: Number,
		required: true,
		trim: true,
	},
	amountinEth: {
		type: Number,
		trim: true,
	},
});

module.exports = mongoose.model('transaction', transactionSchema);
