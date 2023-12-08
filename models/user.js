const mongoose = require('mongoose')

const User = mongoose.model('User', {
    fullName:String,
    email:String,
    password:String,
    age:Number,
    gender:String
})

module.exports = User;