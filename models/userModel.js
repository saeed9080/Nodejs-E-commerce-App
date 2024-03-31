const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// userSchema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email already exists"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [6, "password must be at least 6 characters"],
  },
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
  phone: {
    type: String,
    required: [true, "phone number is required"],
    minlength: [10, "phone number must be at least 10 characters"],
    maxlength: [11, "phone number must be at most 10 characters"],
  },
  profilePic:{
    // public_id and url provided by cloudinary
    public_id:{
      type: String,
    },
    url:{
      type:String
    }
  },
  answer: {
    type: String,
    required: [true, "answer is required"],
  },
  role: {
    type: String,
    default:"user"
  }
}, { timestamps: true });

// functions for hashing
// hash function
userSchema.pre("save", async function (next) {
  /* The code `if (!this.isModified("password")) { next(); }` is a check in the Mongoose middleware
  function that runs before saving a user document. */
  /* The code `!this.isModified("password")` is a check in the Mongoose middleware function that
  runs before saving a user document. It checks if the "password" field has been modified before
  saving the document. If the password field has not been modified, it means that the password
  has not been changed during the current operation, so the function skips the hashing process
  for the password and moves on to the next middleware function or operation. This check helps
  to avoid unnecessarily rehashing the password when it has not been changed, optimizing the
  performance of the application. */
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// compare password function for decrypt hash password
// we create functions in models(userSchema) with the help of methods
userSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

// JWT Token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  return token;
};

const User = mongoose.model("User", userSchema);
module.exports = User;