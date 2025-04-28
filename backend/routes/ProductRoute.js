const express = require("express");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReviews,
  getAdminProducts,
} = require("../controller/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middleWare/auth");
const { uploadProductImages } = require("../utils/multer");

const router = express.Router();

// Use the middleware in your route
router.post("/admin/products/new", isAuthenticatedUser, authorizeRoles("admin"), uploadProductImages,createProduct);

// Admin routes
router.get("/admin/products", isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
router.put("/admin/products/:id", isAuthenticatedUser, authorizeRoles("admin"),uploadProductImages, updateProduct);
router.delete("/admin/products/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// Public routes
router.get("/products", getAllProducts);
router.get("/products/:id", getProductDetails);

// Reviews
router.put("/review", isAuthenticatedUser, createProductReview);
router.get("/reviews", getProductReviews);
router.delete("/reviews", isAuthenticatedUser, deleteReviews);

module.exports = router;
