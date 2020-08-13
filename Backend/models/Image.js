const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
	id: { type: Number, required: true },
	name: { type: String, required: true },
	email: { type: String, required: true },
	images: { type: Array, required: true },
});

module.exports = mongoose.model('image', imageSchema);
