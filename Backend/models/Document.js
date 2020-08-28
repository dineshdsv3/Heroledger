const mongoose = require('mongoose');

const docSchema = mongoose.Schema({
	productId: { type: Number, required: true },
	productName: { type: String, required: true },
	productDocument: { type: String, required: true },
});

module.exports = mongoose.model('document', docSchema);
