const orderModel = require("../models/orderModel");
const productModel = require("../models/productModel");
const stripe = require("../server");

// =================USER SECTION=================

// create order
const createOrderController = async (req, res) => {
    try {
        // get data from request body
        const {
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount,
            orderStatus
        } = req.body;
        // validation
        if (!shippingInfo ||!orderItems ||!paymentMethod ||!itemPrice ||!tax ||!shippingCharges ||!totalAmount ||!orderStatus) {
            return res.status(400).send({
                success: false,
                message: 'Please fill all the fields'
            });
        }
        // create order
        const newOrder = await orderModel.create({
            user: req.user._id,
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount,
            orderStatus
        });
        // update stock
        // get the stock from product then calculate using for loop
        for (let i = 0; i < orderItems.length; i++) {
            // find product by Id
            const product = await productModel.findById(orderItems[i].product);
            product.stock -= orderItems[i].quantity;
            await product.save();
        }
        // send response
        res.status(201).send({
            success: true,
            message: 'Order placed successfully',
            data: newOrder
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

// get all orders => my orders

const getMyOrdersController = async (req, res) => {
    try {
        // find orders by user id
        const orders = await orderModel.find({
            user: req.user._id
        });
        // validation
        if (!orders) {
            return res.status(404).send({
                success: false,
                message: 'No orders found'
            });
        }
        // send response
        res.status(200).send({
            success: true,
            message: 'Orders fetched successfully',
            totalOrders: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

// get single order => my single order

const getSingleOrderController = async (req, res) => {
    try {
        // find order by id
        const order = await orderModel.findById(req.params.id);
        // validation
        if (!order) {
            return res.status(404).send({
                success: false,
                message: 'No order found'
            });
        }
        // send response
        res.status(200).send({
            success: true,
            message: 'Order fetched successfully',
            order
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

// accept payments

const acceptPaymentsController = async (req, res) => {
    try {
        // get totalAmount
        const { totalAmount } = req.body;
        // validation
        if(!totalAmount) {
            return res.status(404).send({
                success: false,
                message: 'Total amount is required'
            });
        }
        // create payment intent
        // Note => isko hum response main direct use nehi kar sakty is k liye humko milti hai client id or us client id ka istemal kar k payment ko access kar sakty hai is k liye hum client_secret ka use kary gy destructure kar k {client_secret} iska matlab hai k is secret ki base per humary pass transactions rehy gi
        const {client_secret} = await stripe.paymentIntents.create({
            amount: Number(totalAmount) * 100, // by chance ager totalAmount string main ata hai to ye usko Number main convert kar dy ga
            currency: 'usd',
        });
        // send response
        res.status(200).send({
            success: true,
            message: 'Payment accepted successfully',
            client_secret
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

// ===================ADMIN SECTION====================

// get all orders

const getAllOrdersController = async (req, res) => {
    try {
        // find orders
        const orders = await orderModel.find({});
        // validation
        if (!orders) {
            return res.status(404).send({
                success: false,
                message: 'No orders found'
            });
        }
        // send response
        res.status(200).send({
            success: true,
            message: 'Orders fetched successfully',
            totalOrders: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

// change order status

const changeOrderStatusController = async (req, res) => {
    try {
        // find order by id
        const order = await orderModel.findById(req.params.id);
        // validation
        if (!order) {
            return res.status(404).send({
                success: false,
                message: 'No order found'
            });
        }
        // change order status
        if (order.orderStatus === 'processing'){
            order.orderStatus ='shipped';
        } else if (order.orderStatus === 'shipped'){
            order.orderStatus = 'delivered';
            // get current date
            order.deliveredAt = Date.now();
        } else {
            return res.status(401).send({
                success: false,
                message: 'order already delivered'
            });
        }
        // save order
        await order.save();
        // send response
        res.status(200).send({
            success: true,
            message: 'Order status changed successfully',
            order
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    createOrderController,
    getMyOrdersController,
    getSingleOrderController,
    acceptPaymentsController,
    getAllOrdersController,
    changeOrderStatusController,
}