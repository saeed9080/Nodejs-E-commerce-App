const express = require("express");
const {isAuth, isAdmin} = require("../middlewares/authMiddleware");
const { createCategoryController, getAllCategoryController, deleteCategoryController, updateCategoryController } = require("../controllers/categoryController");

// router object
const router = express.Router();

// routes
// create-category
router.post("/create-category", isAuth, isAdmin, createCategoryController);
// get-all-category
router.get("/get-all-category", getAllCategoryController);
// delete-category
router.delete("/delete-category/:id", isAuth, isAdmin, deleteCategoryController);
// update-category
router.put("/update-category/:id", isAuth, isAdmin, updateCategoryController);

// export
module.exports = router;