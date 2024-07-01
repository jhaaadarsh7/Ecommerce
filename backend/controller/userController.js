const User = require ("../models/usermodel");
const bcrypt = require('bcryptjs');
const ErrorHandler = require("../utils/errorhandler");
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto");
const sendToken = require("../utils/jwtToken")
//register   a user
exports.registerUser = async(req, res , next)=>{
    const {name , email ,password}= req.body;

    const user = await User.create({
        name , email ,password,
        avatar :{
            public_id:"this is a smple id",
            url:"profilepicUrl"
        }
    })

    sendToken(user , 201 ,res);
}


exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // Check if user has given email and password both
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please enter email & password" });
    }

    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // Compare the provided password with the hashed password stored in the database
        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        // If password matches, generate JWT token and send it in response
       sendToken(user , 200 ,res);
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
// logout
exports.logout = async(req,res,next)=>{
res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
});
res.status(200).json({
    success:true,
    massage: "Logged Out",
})
}


// Forgot Password
exports.forgotPassword = (async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
  
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
  
    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();
  
    await user.save({ validateBeforeSave: false });
  
    const resetPasswordUrl = `${req.protocol}://${req.get(
      "host"
    )}/password/reset/${resetToken}`;
  
    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;
  
    try {
      await sendEmail({
        email: user.email,
        subject: `Ecommerce Password Recovery`,
        message,
      });
  
      res.status(200).json({
        success: true,
        message: `Email sent to ${user.email} successfully`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
  
      await user.save({ validateBeforeSave: false });
  
      return next(new ErrorHandler(error.message, 500));
    }
  });

//Reset password
exports.resetPassword = (async (req, res, next) => {

// creating token hash
const resetPasswordToken = crypto
.createHash("sha256")
.update(req.params.token)
.digest("hex");


const user = await user.findOne({
  resetPasswordToken,
  resetPasswordExpire: { $gt:Date.now()},
})
if (!user) {
  return next ("Reset password Token id Invalid or has beem expired" , 400);
}

if (req.body.password !== req.body.confirmPassword) {
  return next ("password does not match" , 400);
}

user.password = req.body.password;
user.resetPasswordToken = undefined;
user.resetPasswordExpire = undefined;


  await user.save();

  sendToken(user , 200 , res);
})

//Get user details

exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};
//Update user password
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Check if current password provided by the user matches the stored password
    if (!req.body.currentPassword || !req.body.newPassword || !req.body.confirmPassword) {
      return next(new ErrorHandler("Please provide current password, new password, and confirm password", 400));
    }

    const isMatched = await bcrypt.compare(req.body.currentPassword, user.password);

    if (!isMatched) {
      return next(new ErrorHandler("Current password is incorrect", 400));
    }

    // Check if new password and confirm password match
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("New password and confirm password do not match", 400));
    }

    // Update the user's password
    user.password = req.body.newPassword;
    await user.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

//Update user profile
exports.updateProfile= async (req, res, next) => {
  try {
   
    const newUserData={
      name:req.body.name,
      email:req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user.id , newUserData,{
      new:true,
      runValidators:true,
      useFindAndModify:false,
    })

res.status(200).json({
  success:true
})
  } catch (error) {
    next(error);
  }
};

//Get all users
exports.getAllUser =  async(req,res,next) =>{
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  })
}


//Get single user (admin)
exports.getSingleUser =  async(req,res,next) =>{
  const user = await User.findById(req.params.id);

if (!user) {
  return next( ErrorHandler(`User does not exist with Id: ${req.params.id}`)
)
}

  res.status(200).json({
    success: true,
    user,
  })
}


//Update user role
exports.updateUserRole= async (req, res, next) => {
  try {
    const newUserData={
      name:req.body.name,
      email:req.body.email,
      role:req.body.role,
    };

   await User.findByIdAndUpdate(req.params.id , newUserData,{
      new:true,
      runValidators:true,
      useFindAndModify:false,
    })

res.status(200).json({
  success:true
})
  } catch (error) {
    next(error);
  }
};

// //delete user 

exports.removeUser = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Assuming userId is passed in the request params

    // Find and delete the user by ID
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      // If no user was found with the given ID, return an error response
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // If the user was successfully deleted, send a success response
    res.status(200).json({ success: true, message: 'User deleted successfully', deletedUser });
  } catch (error) {
    // If an error occurred during the deletion process, pass it to the error handling middleware
    next(error);
  }
};

