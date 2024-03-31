const express = require("express");
const { getAllProductsController, getSingleProductController, createProductController, updateProductController, updateProductImageController, deleteProductImageController, deleteProductController, reviewProductController, getTopProductsController } = require("../controllers/productController");
const {isAuth, isAdmin} = require("../middlewares/authMiddleware");
const singleUpload = require("../middlewares/multer");
 
// router object
const router = express.Router();

// routes
// get-all-products
router.get("/get-all-products", getAllProductsController);
// get-top-products
router.get("/get-top-products", getTopProductsController);
// get-single-product
router.get("/get-single-product/:id", getSingleProductController);
// create-product
router.post("/create-product", isAuth, isAdmin, singleUpload, createProductController);
// update-product
router.put("/update-product/:id", isAuth, isAdmin, updateProductController);
// update-product-image
router.put("/update-product-image/:id", isAuth, isAdmin, singleUpload, updateProductImageController);
// delete-product-image
router.delete("/delete-product-image/:id", isAuth, isAdmin, deleteProductImageController);
// delete-product
router.delete("/delete-product/:id", isAuth, isAdmin, deleteProductController);
// review-product
router.put("/review-product/:id/review", isAuth, reviewProductController);

module.exports = router;