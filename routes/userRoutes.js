const express = require("express");
const {registerController, loginController, getUserProfileController, logoutController, updateProfileController, updatePasswordController, updateProfilePicController, forgotPasswordController }= require("../controllers/userController");
const {isAuth} = require("../middlewares/authMiddleware");
const singleUpload = require("../middlewares/multer");
const { rateLimit } = require('express-rate-limit');

// rate limiter
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

// express router object
const router = express.Router();

// routes
// register
router.post("/register", limiter, registerController);
// login
router.post("/login", limiter, loginController);
// profile
router.get('/profile', isAuth, getUserProfileController);
// logout
router.get("/logout", isAuth, logoutController);
// update-profile
router.put("/update-profile",isAuth, updateProfileController);
// update-password
router.put("/update-password",isAuth, updatePasswordController);
// update-profile-pic
router.put("/update-profile-pic",isAuth, singleUpload, updateProfilePicController);
// forgot-password
router.post("/forgot-password", forgotPasswordController);

module.exports = router;