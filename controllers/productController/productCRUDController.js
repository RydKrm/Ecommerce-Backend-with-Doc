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
  const product = await Product.findById(fieldId);
  if (product) positiveResponse(res, "product found", product);
  else negativeResponse(res, "Product not found");
});

// @desc get all product
// @route GET api/product/getAll/:fieldId
exports.getAll = asyncHandler(async (req, res) => {
  const list = await pagination(req, {}, Product);
  positiveResponse(res, "Product list", {
    list: list.data,
    totalDoc: list.total,
  });
});

// @desc update status
// @route PATCH api/product/updateStatus
exports.updateStatus = asyncHandler(async (req, res) => {
  const { fieldId } = req.params;
  if (updateStatesById(Product, fieldId)) {
    positiveResponse(res, "Product status updated");
  } else negativeResponse(res, "Product not found by _id");
});
