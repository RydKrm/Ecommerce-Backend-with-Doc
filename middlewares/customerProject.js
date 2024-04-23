const asyncHandler = require("express-async-handler");
const { negativeResponse } = require("../common/response");
const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

exports.customerProtect = asyncHandler(async (req, res, next) => {
  // ? checking for empty field
  for (let key in req.body) {
    if (req.body[key].length === 0)
      return negativeResponse(res, "Empty field not allowed");
  }
  // ? Token verification
  if (!req.headers.authorization) {
    return negativeResponse(res, "Token not found");
  }
  // * Bearer token authorization
  if (req.headers.authorization.startsWith("Bearer")) {
    let token = req.headers.authorization.split(" ")[1];
    if (!token) return negativeResponse(res, "Token not correct format");

    try {
      // * Decode the token and check for validate
      // eslint-disable-next-line
      const decode = jwt.verify(token, process.env.CUSTOMER_SECRET);

      if (!decode._id) {
        return negativeResponse(res, "Not Authorized");
      }

      // * check if customer exist or not
      const customer = await Customer.findById(decode._id).select("-password");
      if (!customer) return negativeResponse(res, "Not Authorized");
      // * check if customer status is off not
      if (!customer.status) return negativeResponse(res, "Customer Status Off");

      req.user = customer;
    } catch (error) {
      return negativeResponse(res, "Not Authorized");
    }

    next();
  } else {
    return negativeResponse(res, "Bearer token not found");
  }
});
