const asyncHandler = require("express-async-handler");
const { positiveResponse, negativeResponse } = require("../../utils/response");

exports.deleteData = (Model) => {
  return asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const data = await Model.findByIdAndDelete(fieldId);
    if (data) positiveResponse(res, "Data deleted");
    else negativeResponse(res, "Data not found by _id");
  });
};
