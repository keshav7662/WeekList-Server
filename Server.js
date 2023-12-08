const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const auth = require ('./Routes/auth.js');
const weeklist = require ('./Routes/weeklist.js');
const User = require('./models/user.js')
const app = express();
dotenv.config();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// root route
app.use('/api',auth);
app.use('/api',weeklist);

// health api
app.get('/health', (req, res) => {
    res.json({
        serverName: 'WeekList Server',
        currentTime: new Date(),
        state: 'active',
    })
})
// get user data (it will give detail of all registered user)
app.get('/user-data', async(req,res) => {
    const userData = await User.find({});
    res.json({
        message:'user found successfully!',
        data:userData
    })
})

// route not found
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});
// server running and mongoDB connection
app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MongoDB_URL)
        .then(() => {
            console.log(`Server running successfully on port ${process.env.PORT}`)
        })
        .catch((error) => {
            console.log(error)
        })
});