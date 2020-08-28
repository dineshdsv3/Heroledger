const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
	productId: { type: Number, required: true },
	productName: { type: String, required: true },
	productVideo: { type: String, required: true },
});

module.exports = mongoose.model('video', videoSchema);
