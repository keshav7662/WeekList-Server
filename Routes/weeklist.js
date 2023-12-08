// all private api
const express = require('express')
const verifiedUser = require('../middlewares/verifyUser')

const router = express.Router();
//create weekList
router.get('/home', verifiedUser, (req, res) => {
    res.send('you are on home page')
})


//update weeklist


//delete weeklist



module.exports = router;