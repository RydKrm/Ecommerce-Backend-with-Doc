const asyncHandler = require("express-async-handler");
const { negativeResponse, positiveResponse } = require("../../utils/response");
const Cart = require("../../models/Cart");

//@desc add product
// @ route POST api/cart/addCart
//@access private
exports.addProduct = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.Customer._id;
  if (!productId || !quantity)
    return negativeResponse(res, "productId and quantity is required");

  await Cart.create({ productId, userId, quantity });
  positiveResponse(res, "Product added to the cart");
});

// @desc get all cart list
// @route api/cart/getAll/:userId
// @access private-customer
exports.getAll = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const list = await Cart.find({ userId });
  positiveResponse(res, "User all cart item", list);
});

//@desc update product quantity
// @route PATCH api/cart/updateQuantity/:cartId
// @access private
exports.updateQuantity = asyncHandler(async (req, res) => {
  const { cartId } = req.params;
  const quantity = req.body;
  const cart = await Cart.findByIdAndUpdate(cartId, { quantity });

  if (cart) positiveResponse(res, "Cart Item updated");
  else negativeResponse(res, "Cart item not found");
});

//@desc delete product
//@route api/cart/delete/:cartId
//@access private
exports.delete = asyncHandler(async (req, res) => {
  const { cartId } = req.params;
  const cart = await Cart.findByIdAndDelete(cartId);
  if (cart) positiveResponse(res, "Cart item deleted");
  else negativeResponse(res, "Cart item not found");
});
