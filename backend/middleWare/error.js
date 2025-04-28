const ErrorHandler = require("../utils/errorhander");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Wrong Mongodb Id error
  if (err.name === "CastError") {
   const message = `Resource not found. Invalid: ${err.path}`;
   err = new ErrorHandler(message, 400);
 }

 //mongoose duplicate error
 if(err.code === 11000){
const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
err = new ErrorHandler(message,400);
 }
 //WRONG JWT error
 if(err.code === "JsonwebTokenError"){
const message = `json web token is invalid , Try again`;
err = new ErrorHandler(message,400);
 }

 //JWT EXPIRE ERROR
 if(err.code === "TokenExpiredError"){
const message = `json web token is Expired, Try again`;
err = new ErrorHandler(message,400);
 }


 res.status(err.statusCode).json({
   success: false,
   message: err.message,
 });
};
