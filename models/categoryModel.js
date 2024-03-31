const mongoose = require("mongoose");

// category schema
const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, "category is required"],
  },
}, { timestamps: true });

// export
const categoryModel = mongoose.model("Category", categorySchema);
module.exports = categoryModel;