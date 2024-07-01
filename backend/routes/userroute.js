const express = require('express');
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUser, updateUserRole,  removeUser } = require("../controller/userController");
const router = express.Router();
const {isAuthenticatedUser , authorizeRoles} =require ("../middleWare/auth")
router.post("/register", registerUser);
router.post("/login" , loginUser );
router.get("/logout" , logout)
router.post("/password/forgot" , forgotPassword)
router.put("/password/reset/:token" , resetPassword)
router.get("/me" ,  isAuthenticatedUser, getUserDetails )
router.put("/password/update" , isAuthenticatedUser, updatePassword)
router.put("/me/update" , isAuthenticatedUser, updateProfile)
router.get("/admin/users", isAuthenticatedUser,authorizeRoles("admin"),getAllUser);
router.get("/admin/user/:id", isAuthenticatedUser,authorizeRoles("admin"),getSingleUser);
router.put("/admin/user/:id", isAuthenticatedUser,authorizeRoles("admin"),updateUserRole);
router.delete("/admin/user/:userId", isAuthenticatedUser,authorizeRoles("admin"),removeUser);

module.exports = router;
