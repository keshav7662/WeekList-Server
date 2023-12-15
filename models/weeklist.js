const mongoose = require('mongoose')

const weeklistSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    serialNumber:{
        type:Number,
        required:true,
    },
    timeLeft:Date,
    description:[
        {
            task:String,
            checked:Boolean,
            completedAt:Date
        }
    ],
    isCompleted:Boolean,
    createdAt:{
        type:Date,
        default:Date.now()
    }
})
const WeekList = mongoose.model('WeekList', weeklistSchema)

module.exports = WeekList