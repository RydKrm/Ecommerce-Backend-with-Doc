const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Customer = require("../../models/Customer");
const jwt = require("jsonwebtoken");
const { negativeResponse, positiveResponse } = require("../../utils/response");
const { sendEmail } = require("../../nodeEmailer/nodeEmailer");
const { Comment } = require("../../models/Comment");
const { pagination } = require("../../pagination/pagination");
const Rating = require("../../models/Rating");

exports.createCustomerController = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  if (!name || !email || !password)
    return negativeResponse(res, "Name, email, phone is required");
  // console.log("form data ", req.body);
  //? checking for email already exists or not
  const emailChecker = await Customer.findOne({ email });
  if (emailChecker) return negativeResponse(res, "Email already exists");

  // ? create a new customer
  // ? password hashing is done in mongoose schema

  const customer = new Customer({ name, email, password, phone, address });
  await customer.save();

  positiveResponse(res, "Account created", { data: customer });
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
  console.log("first");

  positiveResponse(res, "Customer found", { customer });
});

exports.updatePassword = asyncHandler(async (req, res) => {
  const customerId = req.customer._id;
  let customer = await Customer.findById(customerId);

  if (!customer) return negativeResponse(res, "Customer did not find by _id");

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword)
    return negativeResponse(res, "old password, new password required ");

  const isValid = await bcrypt.compare(oldPassword, customer.password);
  if (!isValid) return negativeResponse(res, "Old password did not match");

  customer = await Customer.findByIdAndUpdate(customerId, {
    password: newPassword,
  });

  if (customer) positiveResponse(res, "Password updated");
  else negativeResponse(res, "Password not updated");
});

exports.forgetPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return negativeResponse(res, "Email is required");

  const customer = await Customer.findOne({ email });

  if (!customer) return negativeResponse(res, "Profile not found by email");

  const token = jwt.sign(
    { _id: customer._id, role: "customer" },
    // eslint-disable-next-line
    process.env.CUSTOMER_SECRET,
  );

  sendEmail("riyadkarimff6@gmail.com", token);

  positiveResponse(res, "An link sent to your email");
});

exports.updateForgetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  // eslint-disable-next-line
  const isValid = await jwt.verify(token, process.env.CUSTOMER_SECRET);

  if (!isValid) return negativeResponse(res, "Invalid link");

  const customerId = isValid._id;
  const role = isValid.role;

  const { password } = req.body;

  if (role === "customer") {
    const customer = await Customer.findByIdAndUpdate(customerId, { password });
    if (!customer) negativeResponse(res, "User not found");
    else positiveResponse(res, "Updated password");
  } else {
    positiveResponse(res, "Role did not match");
  }
});

exports.getAllComment = asyncHandler(async (req, res) => {
  const userId = req.customer._id;
  const data = await pagination(req, { userId }, Comment, {
    select: "comment createdAt",
    populate: { path: "productId", select: "name image sellingPrice" },
  });

  positiveResponse(res, "All Comment List", {
    totalDoc: data.total,
    list: data.data,
  });
});

exports.getAllRatting = asyncHandler(async (req, res) => {
  const userId = req.customer._id;

  const data = await pagination(req, { userId }, Rating, {
    select: "value image",
    populate: { path: "productId", select: "name image sellingPrice" },
  });

  positiveResponse(res, "All Comment List", {
    totalDoc: data.total,
    list: data.data,
  });
});
