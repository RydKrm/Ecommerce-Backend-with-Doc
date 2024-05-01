const mongoose = require("mongoose");
const Product = require("./Product");

const rattingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  value: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  image: {
    type: [String],
  },
  description: {
    type: String,
  },
});

const Rating = mongoose.model("Rating", rattingSchema);

Rating.schema.pre("save", async (next) => {
  try {
    const product = await Product.findById(this.productId);
    product.totalReview += 1;
  } catch (error) {
    next(error);
  }
})

Rating.schema.pre("remove", async (next) => {
  try {
    const product = await Product.findById(this.productId);
    if (product.totalReview > 0)
      product.totalReview -= 1;
  } catch (error) {
    next(error);
  }
})

module.exports = Rating;
