import React from 'react';
import { Link } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';

const ProductCard = ({ product }) => {
    const Options = {
        edit: false,
        color: 'rgba(20, 20 ,20,0.1)',
        activeColor: 'tomato',
        size: window.innerWidth < 600 ? 20 : 25,
        value: product.ratings || 0, // Default to 0 if no ratings provided
        isHalf: true,
    };

    // Access the 4th image (index 3 in the array)
    const imageUrl = product.images?.[0]?.filename
        ? `/uploads/products/${product.images[0].filename}` // Access 4th image
        : '';

    // Log to ensure the URL is correct
    console.log("4th Image URL:", imageUrl);

    return (
        <Link className="productCard" to={`/product/${product._id}`}>
            {imageUrl && (
                <img
                    src={`http://127.0.0.1:8000${imageUrl}`} // Use the backend base URL
                    alt={product.name}
                />
            )}
            <p>{product.name}</p>
            <div>
                <ReactStars {...Options} /> <span>({product.numOfReviews} Reviews)</span>
            </div>
            <span>{`₹${product.price}`}</span>
        </Link>
    );
};

export default ProductCard;
