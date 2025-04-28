const User = require ("../models/usermodel");
const bcrypt = require('bcryptjs');
const ErrorHandler = require("../utils/errorhandler");
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto");
const sendToken = require("../utils/jwtToken")
const { uploadUserAvatar } = require("../utils/multer");
const path = require("path");
const fs = require("fs");

exports.registerUser = async (req, res, next) => {
  uploadUserAvatar(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    try {
      const { name, email, password } = req.body;

      // Validate the required fields
      if (!name || !email || !password || !req.file) {
        return res.status(400).json({ success: false, message: "All fields are required" });
      }

      // Get the file path for the uploaded avatar
      const avatarPath = `/uploads/avatars/${req.file.filename}`;

      // Create a new user in the database with local file path details
      const user = await User.create({
        name,
        email,
        password,
        avatar: {
          url: avatarPath,  // Local file path for avatar
          public_id: req.file.filename  // Use the filename as the public_id
        }
      });

      // Send token or success response
      sendToken(user, 201, res);
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // checking if user has given both email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please Enter Email & Password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Send token if login is successful
    sendToken(user, 200, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
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
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
    const message = `Your password reset token is ttemp :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email, please ignore it.`;

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
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//Reset password

exports.resetPassword = async (req, res, next) => {
  try {
    // creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset Password Token is invalid or has expired",
      });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password does not match",
      });
    }

    // Don't hash the password here - let the pre-save middleware handle it
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save(); // This will trigger the pre-save middleware

    sendToken(user, 200, res);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


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
// update User password

exports.updatePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validate input fields
    if (!oldPassword || !newPassword || !confirmPassword) {
      return next(new ErrorHandler("Please provide all required fields", 400));
    }

    // Find user by ID and include password in the query
    const user = await User.findById(req.user.id).select("+password");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    // Check if old password matches the hashed password
    const isPasswordMatched = await user.comparePassword(oldPassword);
    if (!isPasswordMatched) {
      return next(new ErrorHandler("Old password is incorrect", 400));
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return next(new ErrorHandler("New password and confirm password do not match", 400));
    }

    // Update the user's password
    user.password = newPassword;
    await user.save();

    // Send token after successful password update
    sendToken(user, 200, res);
  } catch (error) {
    console.error("Error in updatePassword:", error);
    next(error);
  }
};


//Update user profile
exports.updateProfile = async (req, res, next) => {
  try {
    uploadUserAvatar(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

      const newUserData = {
        name: req.body.name || undefined,
        email: req.body.email || undefined,
      };

      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (req.file) {
        console.log("New file uploaded:", req.file);

        // If avatar exists, delete it
        if (user.avatar && user.avatar.public_id) {
          const oldAvatarPath = path.join(
            __dirname,
            "..",
            "uploads",
            "avatars",
            user.avatar.public_id
          );

          if (fs.existsSync(oldAvatarPath)) {
            fs.unlinkSync(oldAvatarPath);
            console.log(`Old avatar deleted: ${oldAvatarPath}`);
          }
        }

        // Add new avatar data to newUserData
        newUserData.avatar = {
          public_id: req.file.filename,
          url: `/uploads/avatars/${req.file.filename}`,
        };
      } else {
        console.log("No new file uploaded.");
      }

      const updatedUser = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });

      if (!updatedUser) {
        return res.status(500).json({ success: false, message: "Failed to update user" });
      }

      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      });
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
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
    const userId = req.params.userId; 
    // Find the user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      // If no user was found with the given ID, return an error response
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Delete the user's avatar if it exists
    const filePath = path.join(
      __dirname,
      "..",
      "uploads",
      "avatars",
      user.avatar.public_id
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Now delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    // If the user was successfully deleted, send a success response
    res.status(200).json({ success: true, message: 'User deleted successfully', deletedUser });
  } catch (error) {
    // If an error occurred during the deletion process, pass it to the error handling middleware
    next(error);
  }
};

