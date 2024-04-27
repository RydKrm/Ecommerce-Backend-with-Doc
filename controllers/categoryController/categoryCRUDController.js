const asyncHandler = require("express-async-handler");
const { Category } = require("../../models/Category");
const { negativeResponse, positiveResponse } = require("../../utils/response");
const { updateStatesById } = require("../../utils/updateStatusById");

//@desc add category
// @route POST api/category/create
// @access private
exports.create = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  // ? check does this category already exists or not

  if (!name || !description)
    return negativeResponse(res, "name and description field required");

  const check = await Category.find({ name });
  if (!check) return negativeResponse(res, "Category Already exists");

  await Category.create({ name, description });
  positiveResponse(res, "Category crated");
});

//@desc get all category
// @route GET api/category/getAll
// @access private-admin
exports.getAll = asyncHandler(async (req, res) => {
  const list = await Category.find();
  positiveResponse(res, "Category list", list);
});

//@desc get all true category
// @route GET api/category/getAllTrue
// @access private-admin
exports.getAllTrue = asyncHandler(async (req, res) => {
  const list = await Category.find({ status: true });
  positiveResponse(res, "Category list", list);
});

//@desc get single category
//@route GET api/category/getSingle/:categoryId
//@access private-admin
exports.getSingle = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const category = await Category.findById(categoryId);
  if (category) positiveResponse(res, "Category not found", category);
  else negativeResponse(res, "Category not found by _id");
});

// * get all category with product quantity

//@desc update category status
// @route PATCH api/category/updateStatus/:categoryId
// @access private-admin
exports.updateStatus = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  if (updateStatesById(Category, categoryId))
    positiveResponse(res, "Status updated");
  else negativeResponse(res, "Category not found by _id");
});

//@desc update category
//@route PATCH api/category/update/:categoryId
// @access private-admin
exports.update = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;
  if (!name && !description)
    return negativeResponse(res, "Name or description field required");
  const category = await Category.findByIdAndUpdate(categoryId, {
    name,
    category,
  });
  if (category) positiveResponse(res, "Category updated");
  negativeResponse(res, "category not found by _id");
});

// @desc delete category
// @route PATCH api/category/delete/:categoryId
// @access private-admin
exports.delete = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const category = await Category.findByIdAndDelete(categoryId);

  if (category) positiveResponse(res, "Category deleted");
  else negativeResponse(res, "Category not found");
});
