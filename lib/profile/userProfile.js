const asyncHandler = require("express-async-handler");
const { positiveResponse } = require("../../utils/response");

exports.getUserProfile = (Model, role) => {
  return asyncHandler(async (req, res) => {
    const _id = req[role]._id;

    const profile = await Model.findById(_id).select("-password");

    positiveResponse(res, "User profile", { profileInfo: profile });
  });
};
