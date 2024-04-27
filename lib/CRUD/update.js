const asyncHandler = require("express-async-handler");
const { positiveResponse, negativeResponse } = require("../../utils/response");

exports.update = (Model, checker = []) => {
  return asyncHandler(async (req, res) => {
    const bodyObject = req.body;

    if (Object.keys(bodyObject).length === 0)
      return negativeResponse(res, "All empty field not allowed");

    const { fieldId } = req.params;

    // Check if any object value already exists in the db or not
    if (checker.length > 0) {
      const checkerObject = {};
      for (let item of checker) {
        if (bodyObject[item]) {
          checkerObject[item] = bodyObject[item];
        }
      }
      if (Object.keys(checkerObject).length > 0) {
        const keys = Object.keys(checkerObject);
        const values = Object.values(checkerObject);
        const checkCount = await Model.countDocuments({
          $or: keys.map((key, index) => ({ [key]: values[index] })),
        });
        if (checkCount > 0) {
          return negativeResponse(
            res,
            `Field already exists by ${checker.join(" or ")}`,
          );
        }
      }
    }

    // Update field
    const data = await Model.findByIdAndUpdate(fieldId, bodyObject);
    if (data) positiveResponse(res, "Field updated");
    negativeResponse(res, "Data not found by _id");
  });
};
