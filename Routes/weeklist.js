const express = require('express')
const verifiedUser = require('../middlewares/verifyUser')
const WeekList = require('../models/weeklist')
const isWithin24Hours = require('../utils/IsWithin24hrs')
const calculateTimeLeft = require('../utils/TimeleftCalc')

const router = express.Router();
router.use(verifiedUser)

router.get('/weeklist/:id', async (req, res) => {
    const{id} = req.params
    const userData = await WeekList.findById(id);
    res.json({
        message: 'user found successfully!',
        data: userData,
    })
})

//create weekList
router.post('/add-weeklist', async (req, res) => {
    const { title, tasks } = req.body
    try {
        const avilableWeeklist = await WeekList.find({})
        if (avilableWeeklist.length < 2) {
            await WeekList.create({
                serialNumber: avilableWeeklist.length + 1,
                title,
                description: tasks.map(task => ({ task, checked: false })),
                isCompleted: false
            })
            res.json({
                message: 'Weeklist creted successfully!'
            })
        } else {
            res.json({
                message: 'please wait you have already two weeklists!'
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            message: 'Something went wrong!'
        })
    }
})

// add more task
router.put('/add-task/:weeklistId', async (req, res) => {
    try {
        const { weeklistId } = req.params
        const { task } = req.body
        await WeekList.findByIdAndUpdate(weeklistId, { $push: { description: { task, checked: false } } })
        res.json({
            status: 'Success',
            message: 'Task added Successfully'
        })
    } catch (error) {
        res.json({
            status: 'Failed!',
            message: 'something went wrong!'
        })
    }
})

//update weeklist
router.put('/update-task/:weeklistId/:taskId', async (req, res) => {
    try {
        const { weeklistId, taskId } = req.params;
        const { task } = req.body;
        const weeklist = await WeekList.findById(weeklistId);
        if (!weeklist || !isWithin24Hours(weeklist.createdAt)) {
            return res.status(403).json({
                status: 'Failed!',
                message: 'You cannot update the task. Weeklist not found or time limit exceeded.'
            });
        }

        await WeekList.updateOne({ 'description._id': taskId }, { $set: { 'description.$.task': task } })
        res.json({
            status: 'Success',
            message: 'Task updated Successfully!'
        })
    } catch (error) {
        console.log(error)
        res.json({
            status: 'Failed!',
            message: 'something went wrong!'
        })
    }
})

//delete weeklist and task
router.delete('/delete-weeklist/:weeklistId/:taskId?', async (req, res) => {
    try {
        const { weeklistId, taskId } = req.params
        const weeklist = await WeekList.findById(weeklistId);
        if (!weeklist || !isWithin24Hours(weeklist.createdAt)) {
            return res.status(403).json({
                status: 'Failed!',
                message: 'You cannot update the task. Weeklist not found or time limit exceeded.'
            });
        }

        if (taskId) {
            const deletedTask = await WeekList.findByIdAndUpdate(weeklistId,
                { $pull: { description: { _id: taskId } } })
            if (deletedTask) {
                res.json({
                    status: 'Success!',
                    message: 'Task deleted successfully!'
                })
            } else {
                res.json({
                    status: 'Failed!',
                    message: 'Task already deleted!'
                })
            }
        } else {
            const deletedWeeklist = await WeekList.findByIdAndDelete(weeklistId)
            if (deletedWeeklist) {
                res.json({
                    status: 'Success!',
                    message: 'weeklist deleted successfully!'
                })
            } else {
                res.json({
                    status: 'Failed!',
                    message: 'weeklist already deleted!'
                })
            }
        }
    } catch (error) {
        res.json({
            status: 'Failed!',
            message: 'something went wrong!'
        })
    }
})  

//mark-unmark weeklist

router.put('/mark-task/:id/:taskId', async (req, res) => {
    try {
        const { id, taskId } = req.params;
        const { checked } = req.body;

        const weekList = await WeekList.findById(id);
        
        if (!weekList) {
            return res.status(404).json({ message: 'Week list not found'});
        }
        if(weekList.isCompleted === false) {
            const taskFound = weekList.description.find(task => task._id.toString() === taskId);
            if (!taskFound) {
                return res.status(404).json({ message: 'Task not found' });
            }
            taskFound.checked = checked;
            if (checked) {
                taskFound.completedAt = new Date()
            }
            await weekList.save();
            res.json({ message: 'Task marked/unmarked successfully', weekList });
        }else{
            res.json({
                status:'Failed!',
                message:'Task deadline reached!'
            })
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
// get all weeklist with time left
router.get('/get-weeklist', async(req,res) => {
    const pendingWeekList = await WeekList.find({isCompleted:false})
    const pendingWeeklists = pendingWeekList.map((data) => ({
        title:data.title,
        timeleft:calculateTimeLeft(data.createdAt)
    }))
    res.json({
        pendingWeeklists
    })
})
//get all active weeklist


module.exports = router;