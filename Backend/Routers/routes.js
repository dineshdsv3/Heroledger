const express = require('express');
const router = express.Router();
const User = require('../Models/User');

router.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});


router.get('/addUser', async (req,res) => {
    try {
		// console.log(req.body.user);
		const user = new User({name: "Dinesh",email:"hello@123.com",password:"Hello@12345678"});
		console.log(user);
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ message: 'User registered Successfully', user, token });
	} catch (error) {
		res.status(400).send(error);
	}
})


module.exports = router;
