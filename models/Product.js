const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  categoryId: {
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
  ratings: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      value: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
      },
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
  // Other product-related information fields can be added here
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
