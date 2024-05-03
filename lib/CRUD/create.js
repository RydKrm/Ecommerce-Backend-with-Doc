const asyncHandler = require("express-async-handler");
const { positiveResponse, negativeResponse } = require("../../utils/response");

exports.create = (Model, required = [], checker = []) => {
  return asyncHandler(async (req, res) => {
    // if (!(Model && typeof Model.create === "function")) {
    //   return negativeResponse(res, "Invalid model provided");
    // }
    // console.log("testing ", req.body);
    const bodyObject = req.body;

    for (let item of required) {
      if (!bodyObject[item]) {
        return negativeResponse(res, `${required} fields are required`);
      }
    }

    // Check if any object value already exists in the db or not
    if (checker.length > 0) {
      const checkerObject = {};
      for (let item of checker) {
        if (bodyObject[item]) {
          checkerObject[item] = bodyObject[item];
        }
      }
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

    // Create field
    const data = await Model.create(bodyObject);

    positiveResponse(res, `${Model.modelName} created`, { data });
  });
};
