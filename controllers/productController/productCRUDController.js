const asyncHandler = require("express-async-handler");
const { negativeResponse, positiveResponse } = require("../../utils/response");
const Product = require("../../models/Product");
const { pagination } = require("../../pagination/pagination");
const { updateStatesById } = require("../../utils/updateStatusById");
const upload = require("../../utils/multer");

// @desc create product
// @route POST api/product/create
exports.create = asyncHandler(async (req, res) => {
  // Destructure form fields from req.body
  const {
    name,
    description,
    previousPrice,
    sellingPrice,
    buyingPrice,
    category,
    stockQuantity,
  } = req.body;

  console.log("Testing ", req.body);

  // Check if required fields are present in the form data
  if (
    !name ||
    !description ||
    !previousPrice ||
    !sellingPrice ||
    !buyingPrice ||
    !stockQuantity ||
    !category
  ) {
    return negativeResponse(res, "All fields are required");
  }

  try {
    // Handle file upload
    upload.single("image")(req, res, async function (err) {
      if (err) {
        return negativeResponse(res, "Error uploading image");
      }

      // If image is uploaded successfully, create the product
      const image = req.file ? req.file.filename : null;
      const product = await Product.create({
        name,
        image,
        description,
        sellingPrice,
        previousPrice,
        buyingPrice,
        category,
        stockQuantity,
      });

      // Send positive response
      positiveResponse(res, "Product created", { product });
    });
  } catch (error) {
    console.error(error);
    return negativeResponse(res, "Error creating product");
  }
});

// @desc update product
// @route PATCH api/product/update/:fieldId
exports.update = asyncHandler(async (req, res) => {
  const { fieldId } = req.params;
  const {
    name,
    description,
    previousPrice,
    sellingPrice,
    buyingPrice,
    category,
    stockQuantity,
  } = req.body;

  const product = await Product.findByIdAndUpdate(fieldId, {
    name,
    description,
    sellingPrice,
    previousPrice,
    buyingPrice,
    category,
    stockQuantity,
  });

  if (!product) return negativeResponse(res, "Product not found by _id");

  positiveResponse(res, "Product updated", { product });
});

// @desc delete product
// @route DELETE api/product/delete/:fieldId
exports.delete = asyncHandler(async (req, res) => {
  const { fieldId } = req.params;
  const product = await Product.findByIdAndDelete(fieldId);
  if (!product) negativeResponse(res, "product not found by _id");
  else positiveResponse(res, "Product Deleted");
});

// @desc get single product
// @route GET api/product/getSingle/:fieldId
exports.getSingle = asyncHandler(async (req, res) => {
  const { fieldId } = req.params;
  const product = await Product.findById(fieldId).populate({
    path: "category",
    select: "name",
  });
  if (product) positiveResponse(res, "product found", product);
  else negativeResponse(res, "Product not found");
});

// @desc update status
// @route PATCH api/product/updateStatus
exports.updateStatus = asyncHandler(async (req, res) => {
  const { fieldId } = req.params;
  if (updateStatesById(Product, fieldId)) {
    positiveResponse(res, "Product status updated");
  } else negativeResponse(res, "Product not found by _id");
});

// @desc get all product
// @route GET api/product/getAll/:fieldId
// view Product by price-high-low, price-low-high, by category,
// most selling, most liked, most review, price range
/**
 * price=high / price = low
 * category = mobile
 * mostSelling = true
 * mostLiked = true
 * rating = high / rating = low
 * priceLow = 120 and priceHigh = 2000
 */
exports.getAll = asyncHandler(async (req, res) => {
  const {
    price,
    category,
    mostSelling,
    mostLike,
    rating,
    priceHigh,
    priceLow,
  } = req.query;

  const query = {};
  const sort = {};

  if (price && price === "low") sort["sellingPrice"] = 1;
  else if (price && price === "high") sort["sellingPrice"] = -1;

  // mostSelling
  if (mostSelling && mostSelling === "high") sort["totalSelling"] = -1;
  else if (mostSelling && mostSelling === "low") sort["totalSelling"] = 1;

  // mostLiked
  if (mostLike && mostLike === "high") sort["mostLike"] = -1;
  else if (mostLike && mostLike === "low") sort["mostLike"] = 1;

  // Rating
  if (rating && rating === "high") sort["rating"] = -1;
  else if (rating && rating === "low") sort["rating"] = 1;

  // Category
  if (category) {
    query["category"] = category;
  }

  // Price low range to high range
  if (priceLow && priceHigh) {
    query["price"] = { $gte: priceLow, $lte: priceHigh };
  }

  const products = await pagination(req, query, Product, {
    sort,
    query,
    populate: { path: "category", select: "name" },
  });

  positiveResponse(res, "Product list", {
    list: products.data,
    totalDoc: products.total,
  });
});
