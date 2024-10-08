 const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")



const userSchema = new mongoose.Schema({

    name: {
        type: String, // corrected to String
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name cannot exceed 30 characters"],
        minLength: [4, "Name should be more than 4 characters"],
    },
    email: {
        type: String, // corrected to String
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter a Valid Email"],
    },
    password: {
        type: String, // corrected to String
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be more than 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String, // corrected to String
        default: "user",
    },
    createdAt:{
type:Date,
default:Date.now,
    },
    resetPasswordToken: String, // corrected to String
    resetPasswordExpire: Date,

});

userSchema.pre("save", async function(next){

  if(!this.isModified("password")){
    next();
  }
  this.password = await bcrypt.hash(this.password,10);
})

// jwt

userSchema.methods.getJWTToken = function (){
  return jwt. sign({ id:this._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
