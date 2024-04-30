const asyncHandler = require("express-async-handler");
const { negativeResponse, positiveResponse } = require("../../utils/response");
const { Order, OrderDetail } = require("../../models/Order");

exports.addOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, orderList, orderDate } = req.body;
  if (!shippingAddress || !orderList || !orderDate)
    return negativeResponse(res, "Shipping Address and order list is required");

  const totalAmount = orderList.reduce(
    (total, item) => item.quantity * item.price + total,
    0,
  );
  const userId = req.customer._id;

  const order = await Order.create({
    userId,
    shippingAddress,
    totalAmount,
    orderDate,
  });

  if (!order) return negativeResponse(res, "Order not created");

  const newOrderList = orderList.map((item) => ({
    ...item,
    orderId: order._id,
  }));

  const list = await OrderDetail.insertMany(newOrderList);

  if (list) positiveResponse(res, "Order is created");
  else negativeResponse(res, "Order not created");
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const { fieldId } = req.params;
  const order = await Order.findById(req.params.fieldId);
  const orderList = await OrderDetail.find({ orderId: fieldId })
    .select("-_id -orderId")
    .populate({
      path: "productId",
      select: "name -_id image",
    });

  const newOrderList = [];
  for (let item of orderList) {
    newOrderList.push({
      name: item.productId.name,
      image: item.productId.image,
      quantity: item.quantity,
      price: item.price,
      status: order.status,
    });
  }

  const orderDetails = {
    Date: order.orderDate,
    totalAmount: order.totalAmount,
    shippingAddress: order.shippingAddress,
    orderList: newOrderList,
  };

  positiveResponse(res, "Order list", orderDetails);
});

exports.getOrderByUser = asyncHandler(async (req, res) => {
  const userId = req.customer._id;
  const query = { ...req.body, userId };
  const orderList = await Order.find(query).select("_id orderDate status");

  const orderDetailsList = [];

  for (let order of orderList) {
    const orderContainer = await OrderDetail.find({ orderId: order._id })
      .select("-_id -orderId")
      .populate({
        path: "productId",
        select: "name image",
      });

    for (let item of orderContainer) {
      orderDetailsList.push({
        _id: item.productId._id,
        name: item.productId.name,
        image: item.productId.image,
        quantity: item.quantity,
        price: item.price,
        status: order.status,
        orderDate: order.orderDate,
      });
    }
  }

  positiveResponse(res, "Order list of user", { orderList: orderDetailsList });
});

exports.getOrderByProduct = asyncHandler(async (req, res) => {
  const { fieldId } = req.params;
  const orderList = await OrderDetail.find({ productId: fieldId }).populate({
    path: "orderId",
  });

  const orderDetailsList = [];

  for (let order of orderList) {
    const orderContainer = await OrderDetail.find({ orderId: order._id })
      .select("-_id -orderId")
      .populate({
        path: "productId",
        select: "name image",
      });

    for (let item of orderContainer) {
      orderDetailsList.push({
        _id: item.productId._id,
        name: item.productId.name,
        image: item.productId.image,
        quantity: item.quantity,
        price: item.price,
        status: order.status,
        orderDate: order.orderDate,
      });
    }
  }

  positiveResponse(res, "Order list of user", { orderList: orderDetailsList });
});

exports.completeOrder = asyncHandler(async (req, res) => {
  const { fieldId } = req.params;

  const order = await Order.findByIdAndUpdate(fieldId, { status: "delivered" });

  if (order) positiveResponse(res, "Order Completed");
  else negativeResponse(res, "Order data not found");
});
