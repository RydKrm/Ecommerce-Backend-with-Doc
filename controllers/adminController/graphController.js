const asyncHandler = require("express-async-handler");
// const moment = require("moment"); // Importing moment.js for date manipulation
const { OrderDetail } = require("../../models/Order");
const { positiveResponse } = require("../../utils/response");

exports.dailyProductSalesGraph = asyncHandler(async (req, res) => {
  const startDate = req.query.startDate; // Get the start date from request query
  const endDate = req.query.endDate; // Get the end date from request query

  // Construct the aggregation pipeline
  const graphData = await OrderDetail.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }, // Filter orders within the specified date range
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, // Group by date
          product: "$productId", // Group by product
        },
        totalQuantity: { $sum: "$quantity" }, // Calculate total quantity sold
      },
    },
    {
      $project: {
        date: "$_id.date", // Extracting date from _id
        product: "$_id.product", // Extracting product from _id
        totalQuantity: 1,
        _id: 0, // Exclude _id field from output
      },
    },
  ]);

  //   console.log("graph data ", graphData);

  // Construct data structure for graph
  const graphDataFormatted = {};
  graphData.forEach((item) => {
    const date = item.date;
    if (!graphDataFormatted[date]) {
      graphDataFormatted[date] = {};
    }
    graphDataFormatted[date][item.product] = item.totalQuantity;
  });

  // Sending the formatted data in response
  positiveResponse(res, "Daily product sales graph data", {
    graphDataFormatted,
  });
});

// day/month/year vs total amount of selling
exports.dailyTotalSalesGraph = asyncHandler(async (req, res) => {
  const startDate = req.query.startDate; // Get the start date from request query
  const endDate = req.query.endDate; // Get the end date from request query

  // Construct the aggregation pipeline
  const graphData = await OrderDetail.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) }, // Filter orders within the specified date range
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" }, // Extract year from createdAt
          month: { $month: "$createdAt" }, // Extract month from createdAt
          day: { $dayOfMonth: "$createdAt" }, // Extract day from createdAt
        },
        totalAmount: { $sum: { $multiply: ["$quantity", "$price"] } }, // Calculate total amount of sales
      },
    },
    {
      $project: {
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          },
        },
        totalAmount: 1,
        _id: 0, // Exclude _id field from output
      },
    },
    {
      $sort: { date: 1 }, // Sort by date in ascending order
    },
  ]);

  // Construct data structure for graph
  const graphDataFormatted = {};
  graphData.forEach((item) => {
    const date = item.date.toISOString().split("T")[0]; // Format date to "YYYY-MM-DD"
    graphDataFormatted[date] = item.totalAmount;
  });

  // Sending the formatted data in response
  positiveResponse(res, "Daily total sales graph data", { graphDataFormatted });
});
