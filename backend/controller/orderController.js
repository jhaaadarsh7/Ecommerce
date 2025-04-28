const Order = require("../models/orderModel")
const Product = require("../models/productModel")

// Create new Order
exports.newOrder = async (req, res) => {
    try {
      const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      } = req.body;
  
      const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id,
      });
  
      res.status(201).json({
        success: true,
        order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Server Error",
      });
    }
  };
  
  // Get Single Order
  exports.getSingleOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
      );
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found with this Id",
        });
      }
  
      res.status(200).json({
        success: true,
        order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Server Error",
      });
    }
  };
  
  // Get logged in user's Orders
  exports.myOrders = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id });
  
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Server Error",
      });
    }
  };
  
  // Get all Orders -- Admin
  exports.getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find();
  
      let totalAmount = 0;
      orders.forEach((order) => {
        totalAmount += order.totalPrice;
      });
  
      res.status(200).json({
        success: true,
        totalAmount,
        orders,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Server Error",
      });
    }
  };
  
  // Update Order Status -- Admin
  exports.updateOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found with this Id",
        });
      }
  
      if (order.orderStatus === "Delivered") {
        return res.status(400).json({
          success: false,
          message: "You have already delivered this order",
        });
      }
  
      if (req.body.status === "Shipped") {
        order.orderItems.forEach(async (o) => {
          await updateStock(o.product, o.quantity);
        });
      }
      order.orderStatus = req.body.status;
  
      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
      }
  
      await order.save({ validateBeforeSave: false });
  
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Server Error",
      });
    }
  };
  
  // Update Stock
  async function updateStock(id, quantity) {
    try {
      const product = await Product.findById(id);
  
      product.Stock -= quantity;
  
      await product.save({ validateBeforeSave: false });
    } catch (error) {
      throw new Error(error.message || "Error updating stock");
    }
  }
  
  // Delete Order -- Admin
  exports.deleteOrder = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found with this Id",
        });
      }
  
      await order.deleteOne();
  
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message || "Server Error",
      });
    }
  };
  