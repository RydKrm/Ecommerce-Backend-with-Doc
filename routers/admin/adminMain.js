const express = require("express");
const adminProfileRouter = require("./adminProfile");
const dashboardRouter = require("./adminDashboard");
const { auth } = require("../../auth/auth");
// const { auth } = require("../../auth/auth");

const adminRouter = express();

adminRouter.use("/", auth("admin"), adminProfileRouter, dashboardRouter);

module.exports = adminRouter;
