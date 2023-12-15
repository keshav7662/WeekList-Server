const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');
const bcrypt = require('bcrypt');
const router = express.Router();
//health api
router.get('/health', (req, res) => {
    res.json({
        serverName: 'WeekList Server',
        currentTime: new Date(),
        state: 'active',
    })
})
// Signup
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password, age, gender } = req.body;
        const uniqueUser = await User.findOne({ email });

        // Bcrypt hash method encrypts original password
        if (uniqueUser === null) {
            const encryptedPassword = await bcrypt.hash(password, 10);
            await User.create({ fullName, email, password: encryptedPassword, age, gender });

            const jwttoken = jwt.sign({ fullName, email, age, gender }, process.env.JWT_SECRET);

            res.json({
                status: 'Success!',
                message: 'User Created Successfully!',
                jwttoken,
            });
        } else {
            res.status(409).json({
                message: 'User already exists',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'Failed!',
            message: 'Something Went Wrong!',
        });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const userFound = await User.findOne({ email });

        if (userFound) {
            // Bcrypt compare method decrypts the original password and returns a boolean value
            if (await bcrypt.compare(password, userFound.password)) {
                const jwttoken = jwt.sign({ email: userFound.email }, process.env.JWT_SECRET);

                res.json({
                    message: 'Login successful!',
                    jwttoken,
                });
            } else {
                res.status(401).json({
                    message: 'Invalid password',
                });
            }
        } else {
            res.status(404).json({
                message: "User doesn't exist!",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Something went wrong!',
        });
    }
});

module.exports = router;
