

import React, { Fragment, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import CheckOutSteps from "./CheckOutSteps.js";
import MetaData from "../layout/MetaData";
import "./ConfirmOrder.css";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { createOrder } from "../../actions/orderAction.js";
import { useAlert } from "react-alert";

const ConfirmOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  // Get orderInfo from sessionStorage
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo")) || {
    subtotal: 0,
    shippingCharges: 0,
    tax: 0,
    totalPrice: 0,
  };

  const { shippingInfo, cartItems } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.user);

  // Calculate subtotal, shipping, tax, and total price
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const shippingCharges = subtotal > 1000 ? 0 : 200;
  const tax = subtotal * 0.13;
  const totalPrice = subtotal + tax + shippingCharges;

  // Ensure cart has items before rendering
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Robust address formatting
  const address = shippingInfo
    ? [
        shippingInfo.address,
        shippingInfo.city,
        shippingInfo.state,
        shippingInfo.pinCode,
        shippingInfo.country,
      ]
        .filter(Boolean)
        .join(", ")
    : "Address not available";

  // Cash On Delivery handler
  const handleCOD = () => {
    try {
      const order = {
        shippingInfo,
        orderItems: cartItems,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shippingCharges,
        totalPrice: totalPrice,
        paymentInfo: {
          id: "COD_" + Date.now(),
          status: "Not Paid",
          method: "COD"
        },
      };

      dispatch(createOrder(order));
      alert.success("Order placed successfully");
      navigate("/success");
    } catch (error) {
      alert.error("Error placing COD order");
    }
  };

  // Handle online payment navigation
  const proceedToPayment = () => {
    const data = {
      subtotal,
      shippingCharges,
      tax,
      totalPrice,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate("/process/payment");
  };

  // Get product image URL
  const getImageUrl = (image) => {
    if (image && typeof image === "object") {
      if (image.url) return image.url;
      if (image.filename)
        return `http://127.0.0.1:8000/uploads/products/${image.filename}`;
    }

    if (typeof image === "string") {
      if (image.startsWith("http")) return image;
      return `http://127.0.0.1:8000/uploads/products/${image}`;
    }

    return "/images/default-product.jpg";
  };

  return (
    <Fragment>
      <MetaData title="Confirm Order" />
      <CheckOutSteps activeStep={1} />
      <div className="confirmOrderPage">
        <div>
          {/* Shipping Information */}
          <div className="confirmshippingArea">
            <Typography>Shipping Info</Typography>
            <div className="confirmshippingAreaBox">
              <div>
                <p>Name:</p>
                <span>{user?.name || "User Name"}</span>
              </div>
              <div>
                <p>Phone:</p>
                <span>{shippingInfo?.phoneNo || "Phone Number"}</span>
              </div>
              <div>
                <p>Address:</p>
                <span>{address}</span>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="confirmCartItems">
            <Typography>Your Cart Items:</Typography>
            <div className="confirmCartItemsContainer">
              {cartItems?.map((item) => (
                <div key={item.product}>
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    style={{ maxWidth: "100px", maxHeight: "100px", objectFit: "cover" }}
                  />
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                  <span>
                    {item.quantity} X ₹{item.price} =
                    <b>₹{item.price * item.quantity}</b>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="orderSummary">
            <Typography>Order Summary</Typography>
            <div>
              <div>
                <p>Subtotal:</p>
                <span>₹{subtotal}</span>
              </div>
              <div>
                <p>Shipping Charges:</p>
                <span>₹{shippingCharges}</span>
              </div>
              <div>
                <p>GST:</p>
                <span>₹{tax}</span>
              </div>
            </div>

            <div className="orderSummaryTotal">
              <p>
                <b>Total:</b>
              </p>
              <span>₹{totalPrice}</span>
            </div>

            {/* Payment Buttons */}
            <div className="paymentButtons">
              <button onClick={proceedToPayment} className="onlinePaymentBtn">
                Online Payment
              </button>
              <button onClick={handleCOD} className="codBtn">
                Cash On Delivery
              </button>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
