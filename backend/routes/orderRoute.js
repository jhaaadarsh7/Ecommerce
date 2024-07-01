const express = require("express");
const router = express.Router();
const {newOrder, getSingleOrder, myOrders, getAllOrders, updateOrder, deleteOrder,} = require("../controller/orderController");

const {isAuthenticatedUser, authorizeRoles} = require("../middleWare/auth")

router.post("/order/new", isAuthenticatedUser , newOrder)
router.get("/order/:id" , isAuthenticatedUser,getSingleOrder)
router.get("/orders/me" , isAuthenticatedUser,myOrders)
router.get("/admin/orders/" , isAuthenticatedUser,authorizeRoles("admin"),getAllOrders)
router.put("/admin/order/:id" , isAuthenticatedUser,authorizeRoles("admin"),updateOrder)
router.delete("/admin/order/:id" , isAuthenticatedUser,authorizeRoles("admin"),deleteOrder)

module.exports = router;