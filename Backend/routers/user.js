const express = require('express');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const bodyparser = require('body-parser');
const User = require('../models/User');
const Product = require('../models/Product');
const Transaction = require('../models/Transactions');
const mongoose = require('mongoose');
const path = require('path');

const router = express.Router();

const conn = mongoose.createConnection(process.env.MONGODB_URL, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
});

conn.once('open', () => {
	// initialize stream
	gfs = Grid(conn.db, mongoose.mongo);
	gfs.collection('uploads');
});

// Create Storage Engine
const storage = new GridFsStorage({
	url: process.env.MONGODB_URL,
	file: (req, file) => {
		return new Promise((resolve, reject) => {
			crypto.randomBytes(16, (err, buf) => {
				if (err) {
					return reject(err);
				}
				const filename = buf.toString('hex') + path.extname(file.originalname);
				const fileInfo = {
					productName: 'Sample image Uploads',
					filename: filename,
					bucketName: 'uploads',
				};
				resolve(fileInfo);
			});
		});
	},
});
const upload = multer({ storage });

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

router.post('/addTransaction', async (req, res) => {
	console.log(req.body.transactionDetails);
	let transaction = new Transaction({
		productId: req.body.transactionDetails.productId,
		productName: req.body.transactionDetails.productName,
		transactionHash: req.body.transactionDetails.transactionHash,
		transactionType: req.body.transactionDetails.transactionType,
		previousOwner: req.body.transactionDetails.previousOwner,
		currentOwner: req.body.transactionDetails.currentOwner,
		purchaseDate: req.body.transactionDetails.purchaseDate,
		amountinEth: req.body.transactionDetails.amountinEth,
		registrationDate: req.body.transactionDetails.registrationDate,
	});
	transaction.save().then((result) => {
		console.log('Transaction Added');
		res.send({ message: 'Transaction Added to DB' });
	});
});

router.post('/imageUpload', async (req, res) => {
	console.log('image request triggered');
	User.findOneAndUpdate(
		{ email: req.body.updatedUser.email },
		{ image: req.body.updatedUser.image },
		{ new: true },
		(err, resu) => {
			if (err) {
				res.status(404).send({ message: 'Error', err });
				console.log(error);
			} else {
				res.send({ message: 'Image Uploaded' });
			}
		}
	);
});

router.get('/getImage', async (req, res) => {
	const email = req.query.email;
	User.find({ email: email }, (err, data) => {
		if (err) {
			res.status(404).send({ message: 'Error', err });
		} else {
			res.send({ message: 'User Data gathered', data });
		}
	});
});

// Handle Upload
router.post('/addUpload', upload.single('image'), (req, res) => {
	res.status(200).send({ file: req.file });
	console.log('file upload successful');
	console.log(req.file);
});

// Display Image
router.get('/image/:filename', (req, res) => {
	// console.log('get Image Triggered');
	gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
		// Check if file exists
		if (!file || file.length === 0) {
			return res.status(404).json({
				err: 'No files exist',
			});
		}
		// Check if image
		if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
			// Read output to browser
			const readstream = gfs.createReadStream(file.filename);
			readstream.pipe(res);
		} else {
			// console.log(file.contentType)
			const readstream = gfs.createReadStream(file.filename);
			readstream.pipe(res);
		}
	});
});

router.post('/addProduct', async (req, res) => {
	const productReq = req.body.product;
	console.log(productReq);
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
		// console.log('Product Added');
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
	// console.log(req.body.updatedProduct);
	Product.findOneAndUpdate(
		{ productId: req.body.updatedProduct.productId },
		{
			price: req.body.updatedProduct.ethPrice,
			priceinUsd: req.body.updatedProduct.usdPrice,
			license: req.body.updatedProduct.license,
			InStore: req.body.updatedProduct.inStore,
			description: req.body.updatedProduct.description,
			fullDescription: req.body.updatedProduct.fullDescription,
			licensor: req.body.updatedProduct.licensor,
			licensee: 'N/A',
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

router.get('/getScriptAssets', async (req, res) => {
	Product.find({ productType: 'script', InStore: true }, (err, data) => {
		if (err) {
			res.status(404).send({ message: 'Error Not found Details', err });
		} else {
			res.send({ message: 'Data Fetched', data });
		}
	}).limit(4);
});

router.get('/getLogoAssets', async (req, res) => {
	Product.find({ productType: 'logo', InStore: true }, (err, data) => {
		if (err) {
			res.status(404).send({ message: 'Error Not found Details', err });
		} else {
			res.send({ message: 'Data Fetched', data });
		}
	}).limit(4);
});

router.get('/getBackgroundAssets', async (req, res) => {
	Product.find({ productType: 'background', InStore: true }, (err, data) => {
		if (err) {
			res.status(404).send({ message: 'Error Not found Details', err });
		} else {
			res.send({ message: 'Data Fetched', data });
		}
	}).limit(4);
});

router.get('/getAudioAssets', async (req, res) => {
	Product.find({ productType: 'audio', InStore: true }, (err, data) => {
		if (err) {
			res.status(404).send({ message: 'Error Not found Details', err });
		} else {
			res.send({ message: 'Data Fetched', data });
		}
	}).limit(4);
});

router.get('/getVideoAssets', async (req, res) => {
	Product.find({ productType: 'video', InStore: true }, (err, data) => {
		if (err) {
			res.status(404).send({ message: 'Error Not found Details', err });
		} else {
			res.send({ message: 'Data Fetched', data });
		}
	}).limit(4);
});

router.get('/getPropsAssets', async (req, res) => {
	Product.find({ productType: 'props', InStore: true }, (err, data) => {
		if (err) {
			res.status(404).send({ message: 'Error Not found Details', err });
		} else {
			res.send({ message: 'Data Fetched', data });
		}
	}).limit(4);
});

router.get('/getCharacterAssets', async (req, res) => {
	Product.find({ productType: 'character', InStore: true }, (err, data) => {
		if (err) {
			res.status(404).send({ message: 'Error Not found Details', err });
		} else {
			res.send({ message: 'Data Fetched', data });
		}
	}).limit(4);
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
				res.send({ message: 'Product License updated' });
			}
		}
	);
});

router.get('/getTransactions', async (req, res) => {
	let email = req.query.email;
	Transaction.find({ $or: [{ previousOwner: email }, { currentOwner: email }] }, (err, data) => {
		if (err) {
			res.status(404).send({ message: 'Error Not found Details', err });
		} else {
			res.send({ message: 'Transactions Fetched', data });
		}
	});
});

router.get('/getProductType', async (req, res) => {
	let id = req.query.productId;
	Product.find({ productId: id }, (err, data) => {
		if (err) {
			res.status(404).send({ message: 'Error Not found Details', err });
		} else {
			res.send({ message: 'productType Fetched', data });
		}
	});
});

module.exports = router;
