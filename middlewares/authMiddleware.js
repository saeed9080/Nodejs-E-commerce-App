const JWT = require("jsonwebtoken");
const User = require("../models/userModel");

// user auth

const isAuth = async ( req, res, next) => {
    try {
        // get user token from cookies
        const token = req.cookies.token;
        // validation
        if (!token) {
            return res.status(401).send({
                success: false,
                message: 'UnAuthorized User'
            });
        }
        // verify authorization token
        const decodeData= JWT.verify(token, process.env.JWT_SECRET);
        // validate authorization token in database
        req.user = await User.findById(decodeData._id)
        // next middleware
        next();
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

// admin auth

const isAdmin = async ( req, res, next) => {
    try {
        console.log(req.user.role);
        // check role user admin or not
        if (req.user.role !== 'admin') {
            return res.status(401).send({
                success: false,
                message: 'UnAuthorized User Admin Access Only!'
            });
        }
        // next middleware
        next();
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
}

// export
module.exports = {
    isAuth,
    isAdmin
}