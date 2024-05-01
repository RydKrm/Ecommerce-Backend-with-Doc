const mongoose = require("mongoose");
const { replySchema } = require("./Replay");
const Product = require("./Product");
const Customer = require("./Customer");

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  replies: [replySchema],
});

const Comment = mongoose.model("Comment", commentSchema);

// Middleware to increment the total comment when a new comment is added
Comment.schema.pre('save', async (next) => {
  try {
    const product = await Product.findById(this.productId);
    product.totalComment += 1;
    await product.save();

    // increment total number oof comment of customer
    const customer = await Customer.findById(this.userId);
    customer.totalComment += 1;
    await customer.save();

    next();
  } catch (error) {
    next(error)
  }
})

// Middleware to decrement totalReview when a comment is deleted
Comment.schema.pre('remove', { document: true }, async function (next) {
  try {
    const product = await Product.findById(this.productId);
    if (product.totalReview > 0) {
      product.totalReview -= 1;
      await product.save();
    }

    //  decrement comment number of customer when the comment is deleted

    const customer = await Customer.findById(this.userId);
    if (customer.totalComment > 0) {
      customer.totalComment -= 1;
      await customer.save();
    }
    next();
  } catch (error) {
    next(error);
  }
})

module.exports = { Comment, commentSchema };