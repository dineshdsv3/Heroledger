const express = require('express')
const User = require('../models/User')

const router = express.Router()

router.post('/signup', async (req, res) => {
    // Create a new user
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken()
		res.status(201).send({ message: 'User Registered Successfully', user, token });
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/login', async(req, res) => {
    //Login a registered user
    try {
        const { email, password } = req.body
        const user = await User.findByCredentials(email, password)
        if (!user) {
            return res.status(401).send({error: 'Login failed! Check authentication credentials'})
        }
        const token = await user.generateAuthToken()
        res.send({message: "Login Successful", user, token })
    } catch (error) {
        res.status(400).send({message: 'Login failed! Check authentication credentials',error})
    }

})

module.exports = router
