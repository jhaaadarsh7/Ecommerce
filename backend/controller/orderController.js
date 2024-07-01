const Order = require("../models/orderModel");
const Product = require("../models/productModel");


// Create new Order
exports.newOrder = async (req, res, next) => {
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
};




// get Single Order
exports.getSingleOrder = async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!order) {
    return next("Order not found with this Id", 404);
  }

  res.status(200).json({
    success: true,
    order,
  });
};
// get logged in user  Orders
exports.myOrders = async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });

  res.status(200).json({
    success: true,
    orders,
  });
}; 

// get all Orders -- Admin
exports.getAllOrders = async (req, res, next) => {
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
};


// // update Order Status -- Admin
// exports.updateOrder = async (req, res, next) => {
//   const order = await Order.findById(req.params.id);

//   if (!order) {
//     return next("Order not found with this Id", 404);
//   }

//   if (order.orderStatus === "Delivered") {
//     return next(new ErrorHander("You have already delivered this order", 400));
//   }

//   if (req.body.status === "Shipped") {
//     order.orderItems.forEach(async (o) => {
//       await updateStock(o.product, o.quantity);
//     });
//   }
//   order.orderStatus = req.body.status;

//   if (req.body.status === "Delivered") {
//     order.deliveredAt = Date.now();
//   }

//   await order.save({ validateBeforeSave: false });
//   res.status(200).json({
//     success: true,
//   });
// };

// async function updateStock(id, quantity) {
//   const product = await Product.findById(id);

//   product.stock -= quantity;

//   await product.save({ validateBeforeSave: false });
// }

exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new Error("Order not found with this Id"), 404);
    }

    if (order.orderStatus === "Delivered") {
      return next(new Error("You have already delivered this order"), 400);
    }

    console.log("Request body status:", req.body.status); 

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
    next(error); // Pass the error to the error handling middleware
  }
};

async function updateStock(id, quantity) {
  try {
    const product = await Product.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    product.stock -= quantity;

    await product.save({ validateBeforeSave: false });
  } catch (error) {
    console.error("Error updating stock:", error.message);
    throw error; // Re-throw the error for handling in the parent function
  }
}



exports.deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next("Order not found with this Id", 404);
    }

    console.log(typeof order); // Log the type of order to verify it's an instance of Order model

    await order.deleteOne(); // Try using deleteOne() method instead of remove()

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
};
