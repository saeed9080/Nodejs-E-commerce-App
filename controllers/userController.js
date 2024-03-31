const User = require("../models/userModel");
const getDataUri = require("../utils/features");
const cloudinary = require("cloudinary");

// for register
const registerController = async (req, res) => {
    const { name, email, password, address, city, country, phone, answer } = req.body;
    try {
        // validation
        if (!name || !email || !password || !address || !city || !country || !phone || !answer) {
            return res.status(400).send({
                success: false,
                message: 'Please fill all the fields'
            });
        }
        // check user already exist or not
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).send({
                success: false,
                message: 'User already exists'
            });
        }
        // create user
        const newUser = await User.create({
            name,
            email,
            password,
            address,
            city,
            country,
            phone,
            answer
        });
        res.status(200).send({
            success: true,
            message: 'User Created Successfully',
            newUser
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// for login

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validation
        if (!email || !password) {
            return res.status(400).send({
                success: false,
                message: 'Please fill all the fields'
            });
        }
        // user validation
        const existUser = await User.findOne({ email });
        if (!existUser) {
            return res.status(401).send({
                success: false,
                message: 'User Not Found'
            });
        } else {
            // check password
            const isMatch = await existUser.comparePassword(password);
            // validation password
            if (!isMatch) {
                return res.status(401).send({
                    success: false,
                    message: 'Invalid Credentials'
                });
            } else {
                // token
                const token = existUser.generateAuthToken();
                res.status(200).cookie("token", token, {
                    /* The `secure: true` option in the cookie configuration ensures that the cookie
                    will only be sent over HTTPS connections. This helps to enhance the security of
                    the application by preventing the cookie from being transmitted over unsecured
                    HTTP connections, reducing the risk of interception or tampering by malicious
                    actors. */
                    secure: true,
                    /* The `httpOnly: true` option in the cookie configuration ensures that the cookie
                    can only be accessed by the server and is not accessible through client-side
                    scripts. This helps to enhance the security of the application by preventing
                    potential cross-site scripting (XSS) attacks where malicious scripts attempt to
                    steal the cookie data. */
                    httpOnly: true,
                    expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
                }).send({
                    success: true,
                    message: 'Login Successfully',
                    token,
                    existUser,
                });
            }
        }
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// for Get User Profile
const getUserProfileController = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        // hide user password
        user.password = undefined;
        res.status(200).send({
            success: true,
            message: 'User Profile Fetched Successfully',
            user
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// for logout

const logoutController = async (req, res) => {
    try {
        res.status(200).cookie(
            "token", "", {
            secure: true,
            httpOnly: true,
            expires: new Date(Date.now()) // cookie will be removed after 10 seconds
        }
        ).send({
            success: true,
            message: 'Logout Successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// for update-profile

const updateProfileController = async (req, res) => {
    try {
        // find user by Id
        const user = await User.findById(req.user._id);
        // destructure update things
        const { name, email, address, city, country, phone } = req.body;
        // validation with update
        if (name) user.name = name;
        if (email) user.email = email;
        if (address) user.address = address;
        if (city) user.city = city;
        if (country) user.country = country;
        if (phone) user.phone = phone;
        // save the updated data to the database
        await user.save();
        res.status(200).send({
            success: true,
            message: 'User Profile Updated Successfully',
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// for update-password

const updatePasswordController = async (req, res) => {
    try {
        // find user by Id
        const user = await User.findById(req.user._id);
        // destructure update things
        const { oldPassword, newPassword } = req.body;
        // validation with update
        if (!oldPassword || !newPassword) {
            return res.status(400).send({
                success: false,
                message: 'Please fill all the fields'
            });
        }
        // check password
        const isMatch = await user.comparePassword(oldPassword);
        // validation password
        if (!isMatch) {
            return res.status(401).send({
                success: false,
                message: 'Invalid Old Password'
            });
        }
        // update password
        user.password = newPassword;
        // save the updated data to the database
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Password Updated Successfully',
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// update-profile-pic

const updateProfilePicController = async (req, res) => {
    try {
        // find user by Id
        const user = await User.findById(req.user._id);
        // file get from client photo
        // when user find then call getDataUri function in which i found file and i pass req.file as argument to getDataUri function after getting file i found URL of user profile pic and then i update the user profile pic with the help of cloudinary
        const file = getDataUri(req.file);
        // delete previous image
        await cloudinary.v2.uploader.destroy(user.profilePic.public_id);
        // update
        const cdb = await cloudinary.v2.uploader.upload(file.content);
        user.profilePic = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        };
        // save the updated data to the database
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Profile Picture Updated Successfully',
            user
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// forgot password

const forgotPasswordController = async (req, res) => {
    try {
        // get email, newPassword and answer from user
        const { email, newPassword, answer } = req.body;
        // validation
        if (!email ||!newPassword ||!answer) {
            return res.status(400).send({
                success: false,
                message: 'Please fill all the fields'
            });
        }
        // find user by email and answer
        const existUser = await User.findOne({ email, answer });
        // validation
        if (!existUser) {
            return res.status(401).send({
                success: false,
                message: 'invalid user or answer'
            });
        }
        // update password
        existUser.password = newPassword; // user k under jo password hai usko replace kar rehy hai newPassword sy
        // save the updated data to the database
        await existUser.save();
        // send response
        res.status(200).send({
            success: true,
            message: 'Password Reset Successfully',
            existUser
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: error.message
        });
    }
};

// export
module.exports = {
    registerController,
    loginController,
    getUserProfileController,
    logoutController,
    updateProfileController,
    updatePasswordController,
    updateProfilePicController,
    forgotPasswordController,
};