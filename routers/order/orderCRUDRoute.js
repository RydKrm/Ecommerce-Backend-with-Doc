const express = require("express");
const { auth } = require("../../auth/auth");
const orderCRUD = express.Router();

const order = require("../../controllers/orderController/orderCRUD");
const { update } = require("../../lib/CRUD/update");
const { OrderDetail, Order } = require("../../models/Order");
const { deleteData } = require("../../lib/CRUD/delete");

// 1. Add order
orderCRUD.post("/addOrder", auth("customer"), order.addOrder);

// Get order by _id
orderCRUD.get("/getOrderById/:fieldId", auth("customer"), order.getOrderById); // get single order

// get order by user
orderCRUD.get("/getOrderByUser", auth("customer"), order.getOrderByUser);

// 3. update status
orderCRUD.patch(
  "/updateStatus/:fieldId",
  auth("customer"),
  update(Order, { required: ["status"] }),
);

// 4. update shipping address
orderCRUD.patch(
  "/updateShippingAddress/:fieldId",
  auth("customer"),
  update(Order, { required: ["shippingAddress"] }),
);

// 5. cancel the order before shipping
orderCRUD.delete(
  "/cancelOrder/:fieldId",
  auth("customer"),
  deleteData(OrderDetail),
);

// 6. update the quantity
orderCRUD.patch(
  "/updateQuantity/:fieldId",
  auth("customer"),
  update(OrderDetail, { required: ["quantity"] }),
);

// Complete Order
// orderCRUD.patch("/completeOrder/:fieldId", order.completeOrder);
orderCRUD.patch(
  "/completeOrder/:fieldId",
  update(Order, {
    setData: {
      status: "delivered",
    },
  }),
);

module.exports = orderCRUD;
