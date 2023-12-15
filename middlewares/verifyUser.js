const jwt = require('jsonwebtoken')
const verifiedUser = (req,res,next) => {
    try{
        const {jwttoken} = req.headers
        const user = jwt.verify(jwttoken,process.env.JWT_SECRET)
        req.user = user;
        next();
    }catch(error) {
        console.log(error)
        res.json({
            status:'Authorization Failed!',
        })
    }
}
module.exports = verifiedUser;
