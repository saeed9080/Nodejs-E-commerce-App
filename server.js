const express = require("express");
const colors = require('colors');
const cors = require('cors');
const dotenv = require('dotenv');
const port = process.env.PORT || 5000;
const morgan = require("morgan"); // work like middleware and middleware work like next function means not execute next function until middleware not executed
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cloudinary = require("cloudinary");
const Stripe = require("stripe");
const helmet = require("helmet"); // use to security
const mongoSanitize = require('express-mongo-sanitize'); // use to secure mongodb

// dotenv config
dotenv.config();

// database connection
connectDB();

// stripe configuration
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// export stripe
module.exports = stripe;

// cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// rest object
const app = express();

// middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(morgan("dev"));
app.use(express.json());
app.use(cors()); // for cross origin request
app.use(cookieParser());

// routes
app.use("/api/v1", require('./routes/testRoutes'));
app.use("/api/v1/user", require('./routes/userRoutes'));
app.use("/api/v1/product", require('./routes/productRoutes'));
app.use("/api/v1/category", require('./routes/categoryRoutes'));
app.use("/api/v1/order", require('./routes/orderRoutes'));

app.get("/", (req, res) => {
    return res.status(200).send("<h2>Welcome To Node Server</h2>");
}); 

// Listen
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`.yellow.bold);
});
