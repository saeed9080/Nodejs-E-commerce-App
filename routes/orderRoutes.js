const express = require("express");
const { isAuth, isAdmin } = require("../middlewares/authMiddleware");
const { createOrderController, getMyOrdersController, getSingleOrderController, acceptPaymentsController, getAllOrdersController, changeOrderStatusController } = require("../controllers/orderController");

// router object
const router = express.Router();

// routes

//=================USER PART=====================

// create-order
router.post("/create-order", isAuth, createOrderController);
// get-all-order => my-orders 
router.get("/my-orders", isAuth, getMyOrdersController);
// get-single-order => my-single-order
router.get("/my-single-order/:id", isAuth, getSingleOrderController);
// accept-payments
router.post("/accept-payments", isAuth, acceptPaymentsController);

//=================ADMIN PART=====================
// get-all-orders
router.get("/admin/get-all-orders", isAuth, isAdmin, getAllOrdersController);
// change order status
router.put("/admin/order-status/:id", isAuth, isAdmin, changeOrderStatusController);

module.exports = router;