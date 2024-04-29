const asyncHandler = require("express-async-handler");
const { positiveResponse, negativeResponse } = require("../../utils/response");
const { pagination } = require("../../pagination/pagination");

exports.read = (Model, option = {}) => {
  return asyncHandler(async (req, res) => {
    const query = option.query || {};
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

    if (option.fieldQuery) {
      const { fieldId } = req.params;
      const fieldKey = option.fieldQuery;
      const fQuery = {
        [fieldKey]: fieldId,
      };
      const list = await Model.find(fQuery)
        .select(option.select)
        .populate(option.populate);
      return positiveResponse(res, "Data list by field", { list });
    }

    if (option.dynamicQuery) {
      const dQuery = {};
      for (let item of option.dynamicQuery) {
        if (req.body[item]) {
          dQuery[item] = req.body[item];
        } else {
          return negativeResponse(
            res,
            `${option.dynamicQuery} field is required`,
          );
        }
      }
      const list = await Model.find(dQuery)
        .select(option.select)
        .populate(option.populate);
      return positiveResponse(res, "Data list", { list });
    }

    const { fieldId } = req.params;
    // For find by _id
    if (!fieldId) {
      console.log("populate ", option.populate);
      const data = await Model.find(query)
        .select(option.select)
        .populate(option.populate);

      return positiveResponse(res, "Data found ", { data });
    } else {
      // For query parameter
      const data = await Model.findById(fieldId)
        .select(option.select)
        .populate(option.populate);
      if (!data) return negativeResponse(res, "Data not found");
      else positiveResponse(res, "Data found", { data });
    }
  });
};
