const productModel = require("../models/productModel");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorhandler");
const Product = require("../models/productModel"); // Ensure this line is added
const path = require('path');
const mongoose = require("mongoose");
const fs = require('fs');

// Create Product -- Admin
exports.createProduct = async (req, res, next) => {
  let images = [];

  if (req.files) {
    req.files.forEach(file => {
      images.push({
        path: file.path,
        filename: file.filename,
      });
    });
  }

  if (images.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please upload product images.",
    });
  }

  req.body.images = images;
  req.body.user = req.user.id;

  try {
    const product = await Product.create(req.body);
    return res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    next(error);  // You can add additional error handling here
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const productCount = await productModel.countDocuments();

    const apiFeature = new ApiFeatures(productModel.find(), req.query)
      .search()
      .filter()
      

    const products = await apiFeature.query;

    res.status(200).json({
      success: true,
      products,
   
     
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAdminProducts = async (req, res, next) => {
  try {
    const products = await productModel.find(); // Corrected to use 'productModel'

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
};

//update porduct
exports.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id.trim().substring(0, 24);
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID format"
      });
    }

    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      // Optional: Clean up old images
      product.images.forEach((image) => {
        const filePath = path.join(__dirname, "..", "uploads", "products", image.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

      // Standardize image data
      req.body.images = req.files.map((file) => ({
        path: `/uploads/products/${file.filename}`,
        filename: file.filename
      }));
    }

    // Update product
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId, 
      req.body, 
      { 
        new: true, 
        runValidators: true,
        context: 'query'
      }
    );

    res.status(200).json({
      success: true,
      product: updatedProduct
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Product update failed",
      error: error.message
    });
  }
};
// Get product details
exports.getProductDetails = async (req, res, next) => {
  

  try {
    const productId = req.params.id;
    // Find the product by ID

    let product = await productModel.findById(productId);

    if (!product) {
      return next(new ErrorHandler("product not found", 404));
    }

    res.status(200).json({
      success: true,
      product: product,
    });
  } catch (error) {
    // Handle errors, e.g., validation errors or database errors
    console.error(error);
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};



// Delete product
exports.deleteProduct = async (req, res, next) => {
 try {
   // Clean product ID
   const productId = req.params.id.trim().replace(/\n/g, '');

   // Find the product by ID
   const product = await productModel.findById(productId);

   if (!product) {
     return res.status(404).json({
       success: false,
       message: "Product not found",
     });
   }

   // Delete product images from the uploads folder
   product.images.forEach((image) => {
    const filePath = path.join(__dirname, "..", "uploads", "products", image.filename);
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    } catch (err) {
        console.error("Error deleting file:", filePath, err);
    }
});

   // Delete the product from the database
   await productModel.deleteOne({ _id: productId });

   res.status(200).json({
     success: true,
     message: "Product deleted successfully!",
   });
 } catch (error) {
   console.error(error);
   res.status(500).json({
     success: false,
     error: "Internal Server Error",
   });
 }
};



//create new review or update the review
exports.createProductReview = async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await productModel.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
};

//Get all reviews

exports.getProductReviews = async (req, res, next) => {
  const product = await productModel.findById(req.query.id);

  if (!product) {
    return next("product not found", 404);
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
};


exports.deleteReviews = async (req, res, next) => {
  try {
    const product = await productModel.findById(req.query.productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const reviews = product.reviews.filter(
      (rev) => rev.user.toString() !== req.user._id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await productModel.findByIdAndUpdate(
      req.query.productId,
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
