const categoryModel = require("../models/categoryModel");
const productModel = require("../models/productModel");

// create category
const createCategoryController = async (req, res) => {
    try {
        // category destructure from req.body
        const { category } = req.body;
        // validation
        if (!category) {
            return res.status(400).send({
                success: false,
                message: "category is required",
            });
        }
        // create category
        const newCategory = await categoryModel.create({ category });
        if (newCategory) {
            return res.status(201).send({
                success: true,
                message: `${category} category created successfully`,
                category: newCategory,
            });
        } else {
            return res.status(500).send({
                success: false,
                message: "category could not be created",
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// get all category

const getAllCategoryController = async (req, res) => {
    try {
        // find all categories
        const categories = await categoryModel.find({});
        // validation
        if (categories) {
            return res.status(200).send({
                success: true,
                message: "categories fetched successfully",
                totalCategories: categories.length,
                categories,
            });
        } else {
            return res.status(500).send({
                success: false,
                message: "categories could not be fetched",
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// delete category

const deleteCategoryController = async (req, res) => {
    try {
        // get category id
        const id = req.params.id;
        // find category by id
        const category = await categoryModel.findById(id);
        // validation
        if (!category) {
            return res.status(404).send({
                success: false,
                message: "category not found",
            });
        }
        // find product with this category id
        const products = await productModel.find({ category: category._id });
        // update product category using for loop
        for (let i = 0; i < products.length; i++) {
            const product = products[i];
            product.category = undefined; // is say category k sath product k jor ko effectively remove kiya jata hai
            await product.save();
        }
        // delete the category from db
        await category.deleteOne(); //After disassociating(جور، تنظیم، انجمن) all products, it proceeds to delete the category from the database.
        // send response
        return res.status(200).send({
            success: true,
            message: "category deleted successfully",
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message,
        });
    }
};

// update category

const updateCategoryController = async (req, res) => {
    try {
       // get category id
       const id = req.params.id;
       // find category by id
       const category = await categoryModel.findById(id);
       // validation
       if (!category) {
           return res.status(404).send({
               success: false,
               message: "category not found",
           });
       }
       // get new category
       const { updatedCategory } = req.body;
       // find product with this category id
       const products = await productModel.find({ category: category._id });
       // update product category using for loop
       for (let i = 0; i < products.length; i++) {
           const product = products[i];
           product.category = updatedCategory;
           await product.save();
       }
       // update the category in db
       // it checks if updatedCategory exists. If it does, it updates the category object with the new category value. This step ensures that if the request contains a new category value, it will update the category in the database.
       // the if (updatedCategory) check ensures that if there's a new category value provided in the request, it gets updated in the database. If not, it skips this step and proceeds with saving the category without any changes.
       if(updatedCategory) category.category = updatedCategory;
       // save the category in db
       await category.save();
       // send response
       return res.status(200).send({
           success: true,
           message: "category updated successfully",
       });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message,
        });
    }
};

// export
module.exports = {
  createCategoryController,
  getAllCategoryController,
  deleteCategoryController,
  updateCategoryController,
};