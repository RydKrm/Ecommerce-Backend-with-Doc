const mongoose = require("mongoose");

// Define schema for Payment
const paymentSchema = new mongoose.Schema({
  orderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
});

// Create model based on the defined schema
const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
