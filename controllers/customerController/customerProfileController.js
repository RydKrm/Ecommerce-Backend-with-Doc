const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Customer = require("../../models/Customer");
const jwt = require("jsonwebtoken");
const { negativeResponse, positiveResponse } = require("../../utils/response");

exports.createCustomerController = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password)
    return negativeResponse(res, "Name, email, phone is required");
  console.log("form data ", req.body);
  //? checking for email already exists or not
  const emailChecker = await Customer.findOne({ email });
  if (emailChecker) return negativeResponse(res, "Email already exists");

  // ? create a new customer
  // ? password hashing is done in mongoose schema

  const customer = new Customer({ name, email, password, phone, address });
  await customer.save();

  positiveResponse(res, "Account created");
});

exports.loginCustomerController = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // return res.json(req.body);
  //  check for email exists or not
  if (!email || !password) {
    return negativeResponse(res, "Email and password is required");
  }

  //   find user profile
  const customer = await Customer.findOne({ email });
  if (!customer) return negativeResponse(res, "Invalid email or password");

  //  check for status off or not
  if (!customer.status) return negativeResponse(res, "User status is off");

  //  check for password validate
  const isValid = await bcrypt.compare(password, customer.password);
  if (!isValid) return negativeResponse(res, "Invalid email or password");

  //  generate JWT Token

  const token = jwt.sign(
    { _id: customer._id, role: "customer" },
    // eslint-disable-next-line
    process.env.CUSTOMER_SECRET,
  );

  //  response back with with token
  positiveResponse(res, "Logged in successfully", {
    token,
    userId: customer._id,
  });
});

exports.getSingleCustomerController = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const customer = await Customer.findById(userId).select("-password");
  if (!customer) return negativeResponse(res, "User not found");

  positiveResponse(res, "Customer found", { customer });
});
