const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const auth = require ('./Routes/auth.js');
const weeklist = require ('./Routes/weeklist.js');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// root route
app.use('/api',auth);
app.use('/api',weeklist);

// health api



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