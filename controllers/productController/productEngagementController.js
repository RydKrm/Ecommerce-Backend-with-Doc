const asyncHandler = require("express-async-handler");
const { negativeResponse, positiveResponse } = require("../../utils/response");
const Product = require("../../models/Product");
const { pagination } = require("../../pagination/pagination");
const { Comment } = require("../../models/Comment");

//@ add like
// @ route POST api/product/addLike/:fieldId
exports.addLike = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const userId = req.customer._id;
    const customer = await Product.findById(fieldId);
    const exists = customer.likes.includes(userId);
    if (exists) {
        customer.likes = customer.likes.filter(item => item !== userId);
        positiveResponse(res, "Like removed")
    } else {
        customer.likes.push(userId);
        positiveResponse(res, "Like added")
    }
    customer.save();
})

//@ update buying price  
//@ route PATCH api/product/updateBuyingPrice/:fieldId
exports.updateBuyingPrice = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const { buyingPrice } = req.body;
    const price = await Product.findByIdAndUpdate(fieldId, { buyingPrice });
    if (price) positiveResponse(res, "Price updated")
    else negativeResponse(res, "Product not found by _id");
})

/* 
 {
    createdAt:11/06/2024,
    text:"Nice"
}
*/
//@desc add comment
//@route POST api/product/addComment/:fieldId
exports.addComment = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const userId = req.customer._id;
    const { createdAt, text } = req.body;
    if (!createdAt || !text) return positiveResponse(res, "Text field required")

    await Comment.create({ productId: fieldId, userId, createdAt, text });
    positiveResponse(res, "Comment added")
})

//@desc get all comment
//@route GET api/product/allComment/:fieldId
exports.allComment = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const list = await pagination(req, { productId: fieldId }, Comment);
    positiveResponse(res, "Comment List", { list: list.data, totalDoc: list.total });
})

//@desc get single comment
//@route GET api/product/singleComment/:fieldId
exports.singleComment = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const comment = await Comment.findById(fieldId);
    if (comment) positiveResponse(res, "Comment found", { comment })
    else negativeResponse(res, "Comment not found")
})

//@desc delete comment
//@route DELETE api/product/deleteComment/:fieldId
exports.deleteComment = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const comment = await Comment.findByIdAndDelete(fieldId);
    if (comment) positiveResponse(res, "Comment deleted")
    else negativeResponse(res, "Comment not found")
})

// * increase totalSelling

//@desc increase totalProductView
//@route POST api/product/increaseView/:fieldId
exports.increaseView = asyncHandler(async (req, res) => {
    const { fieldId } = req.params;
    const product = await Product.findByIdAndUpdate(fieldId, { $inc: { totalProductView: 1 } });
    if (product) positiveResponse(res, "Product view increase")
    else negativeResponse(res, "Product not found")
}) 