const mongoose = require("mongoose");

// category schema
const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: [true, "address is required"],
        },
        city: {
            type: String,
            required: [true, "city is required"],
        },
        country: {
            type: String,
            required: [true, "country is required"],
        },
    },
    orderItems: [
        {
            name: {
                type: String,
                required: [true, "name is required"],
            },
            price: {
                type: Number,
                required: [true, "price is required"],
            },
            quantity: {
                type: Number,
                required: [true, "quantity is required"],
            },
            image: {
                type: String,
                required: [true, "image is required"],
            },
            product: {  //connect to the product model id
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "product is required"],
            },
        },
    ],
    paymentMethod: {
        type: String,
        enum: ["cashOnDelivery", "debitOrCreditCard"],
        default: "cashOnDelivery",
    },
    user: { //connect to the user model id
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user is required"],
    },
    paidAt: Date,
    paymentInfo: {
        id: String,
        status: String,
    },
    itemPrice: {
        type: Number,
        required: [true, "item price is required"],
    },
    tax: {
        type: Number,
        required: [true, "tax is required"],
    },
    shippingCharges: {
        type: Number,
        required: [true, "shipping charges is required"],
    },
    totalAmount: {
        type: Number,
        required: [true, "total amount is required"],
    },
    orderStatus: {
        type: String,
        enum: ["processing", "shipped", "delivered",],
        default: "processing",
    },
    deliveredAt: Date,
}, { timestamps: true });

// export
const orderModel = mongoose.model("Order", orderSchema);
module.exports = orderModel;