const mongoose = require("mongoose");

// Define schema for Order
const orderSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  shippingAddress: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "shipped", "delivered"],
    required: true,
  },
});

// Define schema for OrderDetail
const orderDetailSchema = new mongoose.Schema({
  orderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

// Create models based on the defined schemas
const Order = mongoose.model("Order", orderSchema);
const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema);

module.exports = { Order, OrderDetail };
