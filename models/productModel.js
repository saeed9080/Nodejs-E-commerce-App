const mongoose = require("mongoose");

// review schema
const reviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
    },
    rating: {
        type: Number,
        default: 0,
    },
    comment: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user is required"],
    }
}, { timestamps: true });

// product schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
    },
    description: {
        type: String,
        required: [true, "description is required"],
    },
    price: {
        type: Number,
        required: [true, "price is required"],
    },
    stock: {
        type: Number,
        required: [true, "stock is required"],
    },
    // quantity: {
    //     type: Number,
    //     required: [true, "quantity is required"],
    // },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    images: [
        {
            public_id: String,
            url: String
        }
    ],
    reviews: [reviewSchema],
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

// export
const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;