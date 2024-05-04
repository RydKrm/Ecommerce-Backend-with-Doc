const expressAsyncHandler = require("express-async-handler");

exports.login = (Model) => {
  return expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
  });
};
