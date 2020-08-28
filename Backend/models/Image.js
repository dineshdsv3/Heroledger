const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
	productId: { type: Number, required: true },
	productName: { type: String, required: true },
	productImage: { type: String, required: true },
});

module.exports = mongoose.model('image', imageSchema);
