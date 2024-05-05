const mongoose = require("mongoose");
const Product = require("./Product");

// Define schema for Order
const orderSchema = new mongoose.Schema({
  userId: {
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
const orderDetailSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    productId: {
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
  },
  { timestamps: true },
);

// Create models based on the defined schemas
const Order = mongoose.model("Order", orderSchema);
const OrderDetail = mongoose.model("OrderDetail", orderDetailSchema);

// Increasing the total review number

OrderDetail.schema.pre("save", async (next) => {
  try {
    const product = await Product.findById(this.productId);
    product.totalSelling += 1;
  } catch (error) {
    next(error);
  }
});

// Decrease the total review number
OrderDetail.schema.pre("remove", async (next) => {
  try {
    const product = await Product.findById(this.productId);
    if (product.totalSelling > 0) product.totalSelling -= 1;
  } catch (error) {
    next(error);
  }
});

module.exports = { Order, OrderDetail };
