const jwt = require("jsonwebtoken")
const User = require ("../models/usermodel");
const ErrorHandler = require("../utils/errorhandler");

exports.isAuthenticatedUser = async( req , res , next)=>{
    const {token} = req.cookies;

    if(!token) {
 return next("please login to access this resources",401)
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

req.user = await User.findById(decodedData.id);

next();
};

exports.authorizeRoles = (...roles)=> {
    return (req, res , next)=>{
        if(!roles.includes(req.user.role)){
         return next  ( new ErrorHandler(
                `Role: ${req.user.role} is not allowed to access this resources`
            )
         );
        }
        next();
    }
}