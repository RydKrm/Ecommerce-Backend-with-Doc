const expressAsyncHandler = require("express-async-handler");

exports.pagination = expressAsyncHandler(
  async (req, query, model, options = {}) => {
    let now;
    let page = 1,
      limit = 10;
    const total = await model.countDocuments(query);
    //check there is page in query
    if (req.query.page) {
      page = parseInt(req.query.page);
    }
    //check there is limit in query
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }
    //set now
    now = page;
    //set skip
    const skip = (page - 1) * limit;
    const pagination = {};
    if (page > 1) {
      pagination.prev = now - 1;
    }
    if (total > page * limit) {
      pagination.next = now + 1;
    }

    let dataQuery = model
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (options.populate) {
      if (typeof options.populate === "string") {
        dataQuery = dataQuery.populate(options.populate);
      } else if (Array.isArray(options.populate)) {
        options.populate.forEach((populate) => {
          dataQuery = dataQuery.populate(populate);
        });
      }
    }

    if (options.select) {
      dataQuery = dataQuery.select(options.select);
    }

    const data = await dataQuery.exec();

    return {
      data,
      pagination,
      total,
    };
  },
);
