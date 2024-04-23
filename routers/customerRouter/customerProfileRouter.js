const express = require("express");
const {
  createCustomerController,
  loginCustomerController,
  getSingleCustomerController,
} = require("../../controllers/customerController/customerProfileController");
const { customerProtect } = require("../../middlewares/customerProject");

const customerProfileRouter = express.Router();

customerProfileRouter.post("/signup", createCustomerController);

customerProfileRouter.post("/login", loginCustomerController);

customerProfileRouter.get(
  "/getSingleCustomer/:userId",
  customerProtect,
  getSingleCustomerController
);

module.exports = customerProfileRouter;
