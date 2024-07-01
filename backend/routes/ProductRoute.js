const express = require("express");
const { createProduct, getAllProducts,updateProduct, deleteProduct ,getProductDetails, createProductReview, getProductReviews, deleteReviews} = require("../controller/productController");
const {isAuthenticatedUser, authorizeRoles } = require("../middleWare/auth")
const router = express.Router();



router.post("/admin/products/new",isAuthenticatedUser, authorizeRoles("admin"),createProduct);
router.get("/products",   getAllProducts);
router.put("admin/products/:id",isAuthenticatedUser, authorizeRoles("admin"),updateProduct);
router.delete("admin/products/:id",isAuthenticatedUser, authorizeRoles("admin"),deleteProduct);
router.get("/products/:id", getProductDetails);
router.put("/review", isAuthenticatedUser, createProductReview);
router.get("/reviews" , getProductReviews)
router.delete("/reviews" , isAuthenticatedUser , deleteReviews);

module.exports = router;