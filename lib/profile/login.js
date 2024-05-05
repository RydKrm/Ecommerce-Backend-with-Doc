const expressAsyncHandler = require("express-async-handler");
const { negativeResponse, positiveResponse } = require("../../utils/response");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.login = (Model) => {
  return expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      return negativeResponse(res, "Email and password required");

    const profile = await Model.findOne({ email });
    if (!profile) return negativeResponse(res, "Invalid email or password");

    //  check for status off or not
    if (!profile.status) return negativeResponse(res, "User status is off");

    //  check for password validate
    const isValid = await bcrypt.compare(password, profile.password);
    if (!isValid) return negativeResponse(res, "Invalid email or password");

    //  generate JWT Token
    const token = jwt.sign(
      { _id: profile._id, role: profile.role },
      // eslint-disable-next-line
      process.env.CUSTOMER_SECRET,
    );

    //  response back with with token
    positiveResponse(res, "Logged in successfully", {
      token,
      _id: profile._id,
    });
  });
};
