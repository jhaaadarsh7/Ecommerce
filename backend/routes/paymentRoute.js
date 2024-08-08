const express = require("express");
const { isAuthenticatedUser } = require("../middleware/auth");
const { processPayment, sendSripeApiKey } = require("../controller/paymentController");
const router = express.Router();

router.post("/payment/process", isAuthenticatedUser, processPayment);
router.get("/stripeapikey",isAuthenticatedUser,sendSripeApiKey)
module.exports = router;
