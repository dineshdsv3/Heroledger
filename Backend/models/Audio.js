const mongoose = require('mongoose');

const audioSchema = mongoose.Schema({
	productId: { type: Number, required: true },
	productName: { type: String, required: true },
	productAudio: { type: String, required: true },
});

module.exports = mongoose.model('audio', audioSchema);
