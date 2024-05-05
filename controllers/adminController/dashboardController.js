const asyncHandler = require("express-async-handler");
const Product = require("../../models/Product");
const { Order, OrderDetail } = require("../../models/Order");
const { Comment } = require("../../models/Comment");
const Customer = require("../../models/Customer");
const Rating = require("../../models/Rating");
const { positiveResponse } = require("../../utils/response");

// Dashboard 📺

// total number of product, order, comment, like, rating, total earning
exports.totalDashboardDocument = asyncHandler(async (req, res) => {
  const totalProduct = await Product.countDocuments();
  const totalOrder = await Order.countDocuments();
  const totalComment = await Comment.countDocuments();
  const totalCustomer = await Customer.countDocuments();
  const totalRating = await Rating.countDocuments();
  const totalIncome = await OrderDetail.aggregate([
    {
      $project: {
        income: { $multiply: ["$quantity", "$price"] },
      },
    },
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$income" },
      },
    },
  ]);
  positiveResponse(res, "Dashboard Data", {
    dashboardData: {
      totalProduct,
      totalOrder,
      totalComment,
      totalCustomer,
      totalRating,
      totalIncome: totalIncome[0].totalIncome,
    },
  });
});

exports.mostSellingProduct = asyncHandler(async (req, res) => {
  const list = await OrderDetail.aggregate([
    {
      $group: {
        _id: "$productId",
        totalQuantity: { $sum: "$quantity" }, // Corrected $sum expression
      },
    },
    {
      $sort: { totalQuantity: -1 }, // Sort by totalQuantity in descending order
    },
    {
      $limit: 10,
    },
  ]).exec();

  const productList = await Product.populate(list, {
    path: "_id",
    select: "name image sellingPrice ",
  });

  positiveResponse(res, "Top 10 selling products", { productList });
});

exports.topSellingProduct = asyncHandler(async (req, res) => {
  const { limit } = req.params;
  const productList = await Product.find()
    .sort({ totalSelling: -1 })
    .limit(limit)
    .select("name category sellingPrice rating image totalSelling");

  positiveResponse(res, "Top 10 selling product", { productList });
});

// most buying person
exports.topBuyingPerson = asyncHandler(async (req, res) => {
  const { limit } = req.params;
  const customerList = await Customer.find()
    .sort({ totalProductBuy: -1 })
    .limit(limit)
    .select("name phone totalProductBuy totalSpend");

  positiveResponse(res, `Top ${limit} most buying customer`, { customerList });
});
