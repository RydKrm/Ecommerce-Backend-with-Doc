exports.pagination_with_search = async (
  req,
  query,
  model,
  options = { populate: [""], select: "" },
  search = { query: "", fields: [""] }
) => {
  try {
    let page = 1;
    let limit = 10;
    let now;

    if (req.query.page) {
      page = parseInt(req.query.page);
    }
    if (req.query.limit) {
      limit = parseInt(req.query.limit);
    }
    now = page;
    const skip = (page - 1) * limit;
    const pagination = {};

    if (page > 1) {
      pagination.prev = now - 1;
    }

    const searchString = search.query;
    const searchFields = search.fields; // Add more fields as needed

    const searchQuery = {
      $or: searchFields.map((field) => ({
        [field]: { $regex: searchString, $options: "i" },
      })),
    };
    const searchResult = await model.find(searchQuery);

    if (searchResult.length === 0) {
      return { data: [], pagination };
    }

    const total = searchResult.length;
    if (total > page * limit) {
      pagination.next = now + 1;
    }

    const paginatedResult = searchResult.slice(skip, skip + limit);

    let dataQuery = model
      .find({
        _id: { $in: paginatedResult.map((result) => result._id) },
        ...query, // Include the additional query parameters here
      })
      .sort({ createdAt: -1 });

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

    return { data, pagination };
  } catch (error) {
    return next(new ErrorResponse(error.message));
  }
};
