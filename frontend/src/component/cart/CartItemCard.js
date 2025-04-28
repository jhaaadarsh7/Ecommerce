import React from "react";
import "./cartItemCard.css";
import { Link } from "react-router-dom";

const CartItemCard = ({ item, deleteCartItems }) => {
  // Log the image URL for debugging
  console.log("Item image URL:", item.image);

  const imageUrl = item.image
    ? `/uploads/products/${item.image}` // Use the stored image filename
    : "/images/default-product.jpg"; // Fallback image if no image is available

  return (
    <div className="CartItemCard">
      {/* Check if image exists */}
      <img src={`http://127.0.0.1:8000${imageUrl}`} alt={item.name || "Product"} />
      <div>
        <Link to={`/product/${item.product}`}>{item.name}</Link>
        <span>{`Price: ₹${item.price}`}</span>
        <p onClick={() => deleteCartItems(item.product)}>Remove</p>
      </div>
    </div>
  );
};

export default CartItemCard;
