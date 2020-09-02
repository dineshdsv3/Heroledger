const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
	productId: {
		type: String,
		required: true,
		trim: true,
	},
	originatorEmail: {
		type: String,
		required: true,
		trim: true,
	},
	ownerEmail: {
		type: String,
		required: true,
		trim: true,
	},
	ownerAddress: {
		type: String,
		required: true,
		trim: true,
	},
	productName: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		required: true,
		trim: true,
	},
	fullDescription: {
		type: String,
	},
	licenseDescription: {
		type: String,
	},
	productType: {
		type: String,
		required: true,
		trim: true,
	},
	timestamp: {
		type: Number,
		required: true,
	},
	price: {
		type: Number,
		required: true,
		trim: true,
	},
	priceinUsd: {
		type: Number,
		trim: true,
	},
	blockHash: {
		type: String,
		trim: true,
	},
	transactionHash: {
		type: String,
		trim: true,
	},
	latitude: {
		type: String,
		trim: true,
	},
	longitude: {
		type: String,
		trim: true,
	},
	image: {
		type: String,
		required: true,
	},
	license: {
		type: Boolean,
	},
	InStore: {
		type: Boolean,
	},
	royalty: {
		type: Number,
	},
	term1StartDate: {
		type: Number,
	},
	term1EndDate: {
		type: Number,
	},
	licenseTerm2: {
		type: String,
	},
});

module.exports = mongoose.model('product', productSchema);
