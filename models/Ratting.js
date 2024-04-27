const mongoose = require("mongoose");

const rattingSchema = new mongoose.Schema({
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
  image: {
    type: [String],
  },
  description: {
    type: String,
  },
});

const Ratting = mongoose.model("Ratting", rattingSchema);

module.exports = Ratting;
