const mongoose = require("mongoose");

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

module.exports = Rating;
