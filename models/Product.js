const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: [String],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  previousPrice: {
    type: Number,
    required: true,
  },
  sellingPrice: {
    type: Number,
    required: true,
  },
  buyingPrice: {
    type: Number,
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  stockQuantity: {
    type: Number,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming each user can only like a product once
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // Assuming each user can only like a product once
    },
  ],
  totalSelling: {
    type: Number,
    default: 0,
  },
  totalProductViews: {
    type: Number,
    default: 0,
  },
  totalReview: {
    type: Number,
    default: 0,
  },
  status: {
    type: Boolean,
    default: true,
  },

  // Other product-related information fields can be added here
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
