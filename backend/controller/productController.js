
const productModel = require("../models/productModel");
const ApiFeatures = require("../utils/apifeatures");
const ErrorHandler = require("../utils/errorhandler");


exports.createProduct = async (req, res, next) => {
    console.log(req.body)
    try { 
        // Validate input
        if (!req.body.name || !req.body.description || !req.body.price || !req.body.ratings || !req.body.category || !req.body.stock || !req.body.images) {
            return res.status(400).json({
                success: false,
                error: "Please provide all required fields (name, description, price, ratings, category, stock, images)"
            });
        }
        req.body.user = req.user.id; 
        const newProduct = await productModel.create(req.body);

        res.status(201).json({
            success: true,
            product: newProduct
        });
    } catch (error) {
        // Handle errors, e.g., validation errors or database errors
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};


exports.getAllProducts = async (req, res, next) => {
    try {
        
        const productCount = await productModel.countDocuments();

        const apiFeature = new ApiFeatures(productModel.find(), req.query)
            .search()
            .filter()


        const products = await apiFeature.query;
        const filteredProductsCount = products.length;

        res.status(200).json({
            success: true,
            products,
            productCount,
            filteredProductsCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};



//update porduct

exports.updateProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;

        // Find the product by ID
        let product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Update the product with the new data
        product = await productModel.findByIdAndUpdate(
            productId,
            req.body,
            {
                new: true,
                runValidators: true,
                useFindAndModify: false
            }
        );

        res.status(200).json({
            success: true,
            product: product
        });
    } catch (error) {
        // Handle errors, e.g., validation errors or database errors
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
};
// Get product details
exports.getProductDetails = async (req, res, next) => {
    console.log("herer");
    
    try {
        const productId = req.params.id;
        console.log(productId, "product")
        // Find the product by ID
       
        let product = await productModel.findById(productId);

        if (!product) {
            return next (new ErrorHandler("product not found" ,404));
        }

        res.status(200).json({
            success: true,
            product: product
        });
    } catch (error) {
        // Handle errors, e.g., validation errors or database errors
        console.error(error);
        res.status(500).json({
            success: false,
            error: error
        });
    }
};

//delete porduct

exports.deleteProduct = async (req, res, next) => {
    try {
        const productId = req.params.id;

        // Find the product by ID
      
        const result = await productModel.deleteOne({ _id: productId });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Attempt to remove the product
        let product = await productModel.findById(productId);

        if (removedProduct) {
            res.status(200).json({
                success: true,
                message: "Product deleted successfully!"
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Failed to delete the product"
            });
        }
    } catch (error) {
        // Handle errors, e.g., validation errors or database errors
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
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

  exports.getProductReviews =  async (req, res , next) =>{
    const product = await productModel.findById(req.query.id);

    if(!product){
        return next("product not found", 404);
    }
    res.status(200).json({
        success: true,
        reviews : product.reviews,
      });
  }

// //   delete review
// exports.deleteReviews =  async (req, res , next) =>{
//     const product = await productModel.findById(req.query.productid);

//     if (!product) {
//         return next("Product not found", 404);
//       }
    
//       const reviews = product.reviews.filter(
//         (rev) => rev.user.toString() === req.user._id.toString()      );
    
//       let avg = 0;
    
//       reviews.forEach((rev) => {
//         avg += rev.rating;
//       });
    
//       let ratings = 0;
    
//       if (reviews.length === 0) {
//         ratings = 0;
//       } else {
//         ratings = avg / reviews.length;
//       }
    
//       const numOfReviews = reviews.length;
    
//       await productModel.findByIdAndUpdate(
//         req.query.productId,
//         {
//           reviews,
//           ratings,
//           numOfReviews,
//         },
//         {
//           new: true,
//           runValidators: true,
//           useFindAndModify: false,
//         }
//       );
    
//       res.status(200).json({
//         success: true,
//       });
// }
exports.deleteReviews = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.query.productId);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
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
