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
	productType: {
		type: String,
		required: true,
		trim: true,
    },
    timestamp: {
        type: Number,
        required: true
    },
	exclType: {
		type: String,
		trim: true,
	},
	price: {
		type: Number,
		required: true,
		trim: true,
	},
	trnsType: {
		type: String,
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
	rating: {
		type: Number,
		trim: true,
	},
	favoritesQuantity: {
		type: Number,
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
		required: true
	}

});

module.exports = mongoose.model('product', productSchema);
