const express = require("express");
const { positiveResponse } = require("../../utils/response");
const dashboard = require("../../controllers/adminController/dashboardController");
const {
  dailyProductSalesGraph,
  dailyTotalSalesGraph,
} = require("../../controllers/adminController/graphController");

const dashboardRouter = express.Router();

dashboardRouter.get("/test", async (req, res) => {
  console.log("Testing 2 admin profile route");
  positiveResponse(res, "Testing complete 2");
});

dashboardRouter.get("/dashboard", dashboard.totalDashboardDocument);

dashboardRouter.get("/topSellingProduct/:limit", dashboard.topSellingProduct);

dashboardRouter.get("/topBuyingPerson/:limit", dashboard.topBuyingPerson);

dashboardRouter.get("/dailyProductSellingGraph", dailyProductSalesGraph);

dashboardRouter.get("/dailyTotalSalesGraph", dailyTotalSalesGraph);

module.exports = dashboardRouter;
