const express = require('express');
const User = require('../models/User');
const Image = require('../models/Image');
const Audio = require('../models/Audio');
const Video = require('../models/Video');
const Document = require('../models/Document');
const Product = require('../models/Product');

const router = express.Router();

router.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

router.post('/signup', async (req, res) => {
	// Create a new user
	try {
		const user = new User(req.body.registerDetails);
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ message: 'User Registered Successfully', user, token });
	} catch (error) {
		res.status(400).send({ error: 'Registration failed' });
	}
});

router.post('/login', async (req, res) => {
	//Login a registered user
	try {
		const { email, password } = req.body.userDetails;
		const user = await User.findByCredentials(email, password);
		if (!user) {
			return res.send({
				error: 'Login failed! Check authentication credentials',
			});
		}
		const token = await user.generateAuthToken();
		res.send({ message: 'Logged In Successfully', user, token });
	} catch (error) {
		console.log(JSON.stringify(error));
		res.status(401).send({ error: 'Login failed! Check authentication credentials' });
	}
});

router.put('/logout', async (req, res) => {
	try {
		const emailId = req.body.email;
		console.log(emailId);
		let updatedTokens = [];
		User.findOneAndUpdate({ email: emailId }, { tokens: updatedTokens }, { new: true }, (err, resu) => {
			if (err) {
				console.log(error);
			} else {
				res.send({ message: 'Logout successful' });
			}
		});
	} catch (error) {
		res.status(500).send({ error: 'Signout failed' });
	}
});
// Add Image Route
router.post('/addImage', async (req, res) => {
	console.log(req.body);
	const image = new Image({
		productId: req.body.upload.id,
		productName: req.body.upload.name,
		productImage: req.body.upload.upload,
	});

	// console.log(image);
	image.save().then((result) => {
		console.log('Image Added');
		res.send({ message: 'Image Added to DB' });
	});
});
// Add Audio Route
router.post('/addAudio', async (req, res) => {
	// console.log(req.body.upload)
	const audio = new Audio({
		productId: req.body.upload.id,
		productName: req.body.upload.name,
		productAudio: req.body.upload.upload,
	});

	// console.log(audio);
	audio.save().then((result) => {
		console.log('Audio Added');
		res.send({ message: 'Audio File Added to DB' });
	});
});
// Add Video Route
router.post('/addVideo', async (req, res) => {
	// console.log(req.body.upload)
	const video = new Video({
		productId: req.body.upload.id,
		productName: req.body.upload.name,
		productVideo: req.body.upload.upload,
	});

	// console.log(video);
	video.save().then((result) => {
		console.log('Video Added');
		res.send({ message: 'Video File Added to DB' });
	});
});
// Add Document Route
router.post('/addDocument', async (req, res) => {
	// console.log(req.body.upload)
	const document = new Document({
		productId: req.body.upload.id,
		productName: req.body.upload.name,
		productDocument: req.body.upload.upload,
	});

	// console.log(document);
	document.save().then((result) => {
		console.log('Document Added');
		res.send({ message: 'Document Added to DB' });
	});
});

router.post('/addProduct', async (req, res) => {
	// console.log(req.body.product);
	const productReq = req.body.product;
	const product = new Product({
		productId: productReq.productId,
		originatorEmail: productReq.originatorEmail,
		ownerEmail: productReq.ownerEmail,
		ownerAddress: productReq.ownerAddress,
		productName: productReq.productName,
		description: productReq.description,
		productType: productReq.productType,
		timestamp: productReq.timestamp,
		price: productReq.price,
		blockHash: productReq.blockHash,
		transactionHash: productReq.transactionHash,
	});

	product.save().then((result) => {
		console.log('Product Added');
		res.send({ message: 'Product Added to DB' });
	});
});

module.exports = router;
