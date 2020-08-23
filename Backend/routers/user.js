const express = require('express')
const User = require('../models/User')

const router = express.Router()

router.post('/signup', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body.registerDetails)
        await user.save()
        const token = await user.generateAuthToken()
		res.status(201).send({ message: 'User Registered Successfully', user, token });
    } catch (error) {
        res.status(400).send({error: 'Registration failed'})
    }
})

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
		console.log(JSON.stringify(error))
		res.status(401).send({ error: 'Login failed! Check authentication credentials' });
	}
});

module.exports = router
