const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { negativeResponse, positiveResponse } = require("../../utils/response");

exports.updatePassword = (Model, role) => {
  return asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const _id = req[role]._id;

    if (!oldPassword || !newPassword)
      return negativeResponse(res, "Old password and new password is required");

    const profile = await Model.findById({ _id });
    if (!profile) return negativeResponse(res, "User profile not found");

    const compare = await bcrypt.compare(oldPassword, profile.password);

    if (!compare) return negativeResponse(res, "Old password did not match");
    profile.password = newPassword;
    await profile.save();

    positiveResponse(res, "Password updated");
  });
};
