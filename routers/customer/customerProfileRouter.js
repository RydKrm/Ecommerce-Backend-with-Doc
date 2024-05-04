const express = require("express");
const { auth } = require("../../auth/auth");
const {
  createCustomerController,
  loginCustomerController,
  getSingleCustomerController,
  updatePassword,
  forgetPassword,
  getAllComment,
  getAllRatting,
} = require("../../controllers/customerController/customerProfileController");
const { customerProtect } = require("../../middlewares/customerProject");
const { update } = require("../../lib/CRUD/update");
const Customer = require("../../models/Customer");
const { read } = require("../../lib/CRUD/read");

const customerProfileRouter = express.Router();

customerProfileRouter.post("/signup", createCustomerController);

customerProfileRouter.post("/login", loginCustomerController);

customerProfileRouter.get(
  "/getSingleCustomer/:userId",
  customerProtect,
  getSingleCustomerController,
);

// update profile
customerProfileRouter.patch(
  "/updateProfile",
  auth("customer"),
  async (req, res, next) => {
    const fieldId = req.customer._id;
    req.params["fieldId"] = fieldId;
    next();
  },
  update(Customer, {
    checker: ["email", "phone"],
    notUpdate: ["password"],
  }),
);

// view profile
customerProfileRouter.get(
  "/profile",
  auth("customer"),
  read(Customer, { select: ["-password"] }),
);

// edit password
customerProfileRouter.patch(
  "/updatePassword",
  auth("customer"),
  updatePassword,
);
// forget password
customerProfileRouter.post("/forgetPassword", forgetPassword);

// see all comment
customerProfileRouter.get("/getAllComment", auth("customer"), getAllComment);

// see all ratting
customerProfileRouter.get("/getAllRating", auth("customer"), getAllRatting);

module.exports = customerProfileRouter;
