const productModel = require("../models/productModel");
const getDataUri = require("../utils/features");
const cloudinary = require("cloudinary");

// get all products
const getAllProductsController = async (req, res) => {
    const {
        keyword,
        category
    } = req.query;
    try {
        // find all products
        const products = await productModel.find({
            $or: [
                {
                    /* It is searching for documents where the `name` field matches a specified `keyword`
                    using a case-insensitive regular expression. */
                    name: {
                        /* The above code is using a regular expression to match a pattern in a string. The
                        pattern being matched is "keyword ? keyword : """, with the options set to
                        case-insensitive. */
                        $regex: keyword ? keyword : "",
                        $options: "i"
                    },
                },
                {
                    /* The above code is a JavaScript ternary operator that checks if the variable `category`
                    is truthy. If `category` is truthy, it assigns its value to the variable `category`,
                    otherwise it assigns `undefined` to `category`. */
                    category: category ? category : undefined
                }
            ]
        }).populate("category");
        // validation
        if (!products || products.length === 0) {
            return res.status(404).send({
                success: false,
                message: "Product not found"
            });
        } else {
            return res.status(200).send({
                success: true,
                message: "All products fetched successfully",
                totalProducts: products.length,
                products
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

//get top products

const getTopProductsController = async (req, res) => {
    try {
        // find all products
        const products = await productModel.find({}).sort({
            rating: -1
        }).limit(3);
        // validation
        if (!products || products.length === 0) {
            return res.status(404).send({
                success: false,
                message: "No products found"
            });
        } else {
            return res.status(200).send({
                success: true,
                message: "Top 3 products fetched successfully",
                totalProducts: products.length,
                products
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// get single product

const getSingleProductController = async (req, res) => {
    try {
        // find single product id
        const product = await productModel.findById(req.params.id);
        // validation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "No product found"
            });
        } else {
            return res.status(200).send({
                success: true,
                message: "Single product fetched successfully",
                product
            });
        }
    } catch (error) {
        // Object Id Error
        if (error.kind === "ObjectId") {
            return res.status(404).send({
                success: false,
                message: "Invalid Id"
            });
        }
        res.status(500).send({
            success: false,
            message: "Server Error"
        });
    }
};

// create product

const createProductController = async (req, res) => {
    try {
        // create product
        const {
            name,
            description,
            price,
            stock,
            category
        } = req.body;
        // validation
        if (!name || !description || !price || !stock) {
            return res.status(400).send({
                success: false,
                message: "Please fill all the fields"
            });
        } else {
            // file get from client photo
            const file = getDataUri(req.file);
            // file validation
            if (!req.file) {
                return res.status(400).send({
                    success: false,
                    message: "Please upload an image"
                });
            }
            // update
            const cdb = await cloudinary.v2.uploader.upload(file.content);
            const image = {
                public_id: cdb.public_id,
                url: cdb.secure_url
            };
            // create product
            await productModel.create({
                name,
                description,
                price,
                stock,
                category,
                images: [image]
            });
            return res.status(201).send({
                success: true,
                message: "Product created successfully",
            });
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// update product

const updateProductController = async (req, res) => {
    try {
        // find product
        const product = await productModel.findById(req.params.id);
        // validation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found"
            });
        }
        // update
        const {
            name,
            description,
            price,
            stock,
            category
        } = req.body;
        // validation conditional vise
        if (name) product.name = name;
        if (description) product.description = description;
        if (price) product.price = price;
        if (stock) product.stock = stock;
        if (category) product.category = category;
        // save the updated data to the database
        await product.save();
        return res.status(200).send({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        // Object Id Error
        if (error.kind === "ObjectId") {
            return res.status(404).send({
                success: false,
                message: "Invalid Id"
            });
        }
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// update product image

const updateProductImageController = async (req, res) => {
    try {
        // find product
        const product = await productModel.findById(req.params.id);
        // validation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found"
            });
        }
        // file get from client photo
        const file = getDataUri(req.file);
        // file validation
        if (!req.file) {
            return res.status(400).send({
                success: false,
                message: "Please upload an image"
            });
        }
        // update
        const cdb = await cloudinary.v2.uploader.upload(file.content);
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        };
        // array k under kuch b store karwana hai to hum push method ka istemal karty hai to push method k through hum jo b latest image mil rehi hai usko store karwa rahy hain
        product.images.push(image);
        // save the updated data to the database
        await product.save();
        return res.status(200).send({
            success: true,
            message: "Product image updated successfully",
            product
        });
    } catch (error) {
        // Object Id Error
        if (error.kind === "ObjectId") {
            return res.status(404).send({
                success: false,
                message: "Invalid Id"
            });
        }
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// delete product image

const deleteProductImageController = async (req, res) => {
    try {
        // find product
        let product = await productModel.findById(req.params.id);
        // validation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found"
            });
        }
        // find image id
        const imageId = req.query.id;
        // validation
        if (!imageId) {
            return res.status(400).send({
                success: false,
                message: "Please provide image id"
            });
        }
        // create a variable for image object to find index
        let isExist = -1;
        // use forEach loop
        product.images.forEach((item, index) => {
            if (item._id.toString() === imageId.toString()) {
                isExist = index
            }
        });
        // validation again
        if (isExist < 0) {
            return res.status(404).send({
                success: false,
                message: "Image not found"
            });
        }
        // delete product image
        await cloudinary.v2.uploader.destroy(product.images[isExist].public_id);
        product.images.splice(isExist, 1);
        await product.save();
        return res.status(200).send({
            success: true,
            message: "Image has been removed",
            product
        });
    } catch (error) {
        // Object Id Error
        if (error.kind === "ObjectId") {
            return res.status(404).send({
                success: false,
                message: "Invalid Id"
            });
        }
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

// delete product

const deleteProductController = async (req, res) => {
    try {
        // find product
        const product = await productModel.findById(req.params.id);
        // validation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found"
            });
        }
        // find and delete image cloudinary using for loop
        for (let index = 0; index < product.images.length; index++) {
            await cloudinary.v2.uploader.destroy(product.images[index].public_id);
        }
        // delete product
        await product.deleteOne();
        return res.status(200).send({
            success: true,
            message: "Product deleted successfully",
            product
        });
    } catch (error) {
        // Object Id Error
        if (error.kind === "ObjectId") {
            return res.status(404).send({
                success: false,
                message: "Invalid Id"
            });
        }
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// review product

const reviewProductController = async (req, res) => {
    try {
        // create review
        const {
            rating,
            comment
        } = req.body;
        // validation
        if (!rating || !comment) {
            return res.status(400).send({
                success: false,
                message: "Please fill all the fields"
            });
        }
        // find product
        const product = await productModel.findById(req.params.id);
        // validation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: "Product not found"
            });
        }
        // check previous review
        const isExistReview = product.reviews.find(r => r.user.toString() === req.user._id.toString());
        // validation
        if (isExistReview) {
            return res.status(400).send({
                success: false,
                message: "You have already reviewed this product"
            });
        }
        // create review object
        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        };
        // update
        product.reviews.push(review);
        // rating
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
        // save the updated data to the database
        await product.save();
        return res.status(200).send({
            success: true,
            message: "Product reviewed successfully",
            product
        });
    } catch (error) {
        // Object Id Error
        if (error.kind === "ObjectId") {
            return res.status(404).send({
                success: false,
                message: "Invalid Id"
            });
        }
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllProductsController,
    getSingleProductController,
    createProductController,
    updateProductController,
    updateProductImageController,
    deleteProductImageController,
    deleteProductController,
    reviewProductController,
    getTopProductsController,
};