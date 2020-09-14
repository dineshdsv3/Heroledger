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
		image: productReq.image,
		InStore: productReq.inStore,
		license: productReq.license,
		fullDescription: productReq.fullDescription,
		priceinUsd: productReq.priceinUsd,
	});

	product.save().then((result) => {
		console.log('Product Added');
		res.send({ message: 'Product Added to DB' });
	});
});

router.get('/getUserAssets', async (req, res) => {
	// console.log(req.query.email)
	Product.find({ originatorEmail: req.query.email }, (err, data) => {
		if (err) {
			res.send({ message: 'Error', err });
		} else {
			res.send({ message: 'Data gathered', data });
		}
	});
});

router.get('/getPurchasedUserAssets', async (req, res) => {
	// console.log(req.query.email)
	Product.find({ ownerEmail: req.query.email }, (err, data) => {
		if (err) {
			res.send({ message: 'Error', err });
		} else {
			res.send({ message: 'Data gathered', data });
		}
	});
});

router.get('/getUserLicensorAssets', async (req, res) => {
	Product.find({ licensor: req.query.email }, (err, data) => {
		if (err) {
			res.send({ message: 'Error', err });
		} else {
			res.send({ message: 'Data gathered', data });
		}
	});
});

router.get('/getUserlicenseeAssets', async (req, res) => {
	Product.find({ licensee: req.query.email }, (err, data) => {
		if (err) {
			res.send({ message: 'Error', err });
		} else {
			res.send({ message: 'Data gathered', data });
		}
	});
});

router.get('/getSingleProduct', async (req, res) => {
	Product.find({ productId: req.query.productId }, (err, data) => {
		if (err) {
			res.send({ message: 'Error', err });
		} else {
			res.send({ message: 'Data gathered', data });
		}
	});
});

router.put('/updateProduct', async (req, res) => {
	console.log(req.body.updatedProduct);
	Product.findOneAndUpdate(
		{ productId: req.body.updatedProduct.productId },
		{
			price: req.body.updatedProduct.ethPrice,
			priceinUsd: req.body.updatedProduct.usdPrice,
			license: req.body.updatedProduct.license,
			InStore: req.body.updatedProduct.inStore,
			description: req.body.updatedProduct.description,
			fullDescription: req.body.updatedProduct.fullDescription,
			licensor: req.body.updatedProduct.licensor
		},
		{ new: true },
		(err, resu) => {
			if (err) {
				res.send({ message: 'Error', err });
				console.log(error);
			} else {
				// console.log("MobileVerification update succeded")
				res.send({ message: 'Product Updated' });
			}
		}
	);
});

router.put('/addLicense', async (req, res) => {
	console.log(req.body.license);
	Product.findOneAndUpdate(
		{ productId: req.body.license.productId },
		{
			licenseDescription: req.body.license.licenseDescription,
			licenseFeeUsd: req.body.license.licenseFeeUsd,
			licenseFee: req.body.license.licenseFee,
			royalty: req.body.license.royalty,
			term1StartDate: req.body.license.term1StartDate,
			term1EndDate: req.body.license.term1EndDate,
			term2: req.body.license.term2,
			licensor: req.body.license.licensor,
			licensee: req.body.license.licensee,
			licenseOwnerAddress: req.body.license.licenseOwnerAddress,
		},
		{ new: true },
		(err, resu) => {
			if (err) {
				res.send({ message: 'Error', err });
				console.log(error);
			} else {
				res.send({ message: 'License Added' });
			}
		}
	);
});

router.get('/getAllAssets', async (req, res) => {
	Product.find({}, (err, data) => {
		if (err) {
			res.status(404).send({ message: 'Error Not found Details', err });
		} else {
			res.send({ message: 'Data Fetched', data });
		}
	}).limit(5);
});

router.put('/purchaseProduct', async (req, res) => {
	console.log('Purchase Product triggered');
	console.log(req.body.updatedProduct);
	Product.findOneAndUpdate(
		{ productId: req.body.updatedProduct.productId },
		{
			ownerAddress: req.body.updatedProduct.ownerAddress,
			ownerEmail: req.body.updatedProduct.ownerEmail,
			InStore: req.body.updatedProduct.inStore,
		},
		{ new: true },
		(err, resu) => {
			if (err) {
				res.send({ message: 'Error', err });
				console.log(error);
			} else {
				console.log('Product purchase  api completed');
				res.send({ message: 'Product price updated' });
			}
		}
	);
});

router.put('/purchaseLicense', async (req, res) => {
	console.log('Purchase License Triggered');
	console.log(req.body.updatedLicense);
	Product.findOneAndUpdate(
		{ productId: req.body.updatedLicense.productId },
		{
			licensor: req.body.updatedLicense.licensorMail,
			licensee: req.body.updatedLicense.licenseeMail,
			term1StartDate: req.body.updatedLicense.startDate,
			term1EndDate: req.body.updatedLicense.endDate,
			license: req.body.updatedLicense.license,
			term2: req.body.updatedLicense.term2,
			licenseOwnerAddress: req.body.updatedLicense.ownerAddress,
		},
		{ new: true },
		(err, resu) => {
			if (err) {
				res.send({ message: 'Error', err });
				console.log(error);
			} else {
				console.log('Product license  api completed');
				res.send({ message: 'Product License updated' });
			}
		}
	);
});

module.exports = router;
