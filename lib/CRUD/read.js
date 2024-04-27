const asyncHandler = require("express-async-handler");
const { positiveResponse, negativeResponse } = require("../../utils/response");
const { pagination } = require("../../pagination/pagination");

exports.read = (Model, query = {}, option = {}) => {
  return asyncHandler(async (req, res) => {
    // for pagination read
    if (option.pagination) {
      const list = await pagination(req, query, Model, {
        select: option.select,
        populate: option.populate,
      });
      return positiveResponse(res, "Item list", {
        list: list.data,
        totalDoc: list.total,
      });
    }

    const { fieldId } = req.params;
    // For find by _id
    if (!fieldId) {
      const data = await Model.find(query)
        .select(option.select)
        .populate(option.populate);

      return positiveResponse(res, "Data found", { data });
    } else {
      // For query parameter
      const data = await Model.findById(fieldId)
        .select(option.select)
        .populate(option.pagination);
      if (data.length === 0) return negativeResponse(res, "Data not found");
      else positiveResponse(res, "Data found", { data });
    }
  });
};
