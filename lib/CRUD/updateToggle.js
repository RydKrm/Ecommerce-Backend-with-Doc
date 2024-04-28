const asyncHandler = require("express-async-handler");
const { positiveResponse, negativeResponse } = require("../../utils/response");

exports.updateToggle = (Model, field) => {
  return asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const data = await Model.findById(fieldId);
    if (data) {
      data[field] = !data[field];
      await data.save();
      positiveResponse(res, "Field Updated");
    } else negativeResponse(res, "Data not found by _id");
  });
};
