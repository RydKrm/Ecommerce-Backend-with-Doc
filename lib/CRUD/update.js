const asyncHandler = require("express-async-handler");
const { positiveResponse, negativeResponse } = require("../../utils/response");

exports.update = (Model, option = {}) => {
  return asyncHandler(async (req, res) => {
    let bodyObject = req.body;

    if (Object.keys(bodyObject).length === 0 && !option.setData)
      return negativeResponse(res, "All empty field not allowed");

    const { fieldId } = req.params;

    if (option.required) {
      for (let item of option.required) {
        if (!bodyObject[item]) {
          return negativeResponse(
            res,
            `${option.required} fields are required`,
          );
        }
      }

      for (let key in bodyObject) {
        if (!option.required.includes(key)) {
          return negativeResponse(res, "Extra field found");
        }
      }
    }

    // Check if any object value already exists in the db or not
    if (option.checker) {
      const checkerObject = {};
      for (let item of option.checker) {
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
            `Field already exists by ${option.checker.join(" or ")}`,
          );
        }
      }
    }

    if (option.setData) {
      bodyObject = option.setData;
    }

    // Update field
    const data = await Model.findByIdAndUpdate(fieldId, bodyObject);
    if (data) positiveResponse(res, "Field updated");
    else negativeResponse(res, "Data not found by _id");
  });
};
