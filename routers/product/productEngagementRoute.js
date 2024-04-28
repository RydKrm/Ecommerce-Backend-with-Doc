const express = require("express");
const { create } = require("../../lib/CRUD/create");
const { update } = require("../../lib/CRUD/update");
const { deleteData } = require("../../lib/CRUD/delete");
const { read } = require("../../lib/CRUD/read");
const { Comment } = require("../../models/Comment");
const { auth } = require("../../auth/auth");
const Rating = require("../../models/Rating");
const productEngagement = express.Router();

// * add like

// * delete like

//  add comment
productEngagement.post(
  "/createComment",
  auth("customer"),
  (req, res, next) => {
    const userId = req.customer._id;
    req.body["userId"] = userId;
    next();
  },
  create(Comment, ["userId", "productId", "comment"]),
);

//  get all comment of product
productEngagement.get(
  "/allCommentByProduct/:fieldId",
  read(Comment, {}, { fieldQuery: ["productId"] }),
);

//  get all comment of user
productEngagement.get(
  "/allCommentByUser/:fieldId",
  read(Comment, {}, { fieldQuery: ["userId"] }),
);

//  get single comment
productEngagement.get(
  "/getSingleComment/:fieldId",
  read(Comment, {}, { select: "comment createdAt userId" }),
);

//  delete comment
productEngagement.delete("/deleteComment/:fieldId", deleteData(Comment));

// update comment
productEngagement.patch("/updateComment/:fieldId", update(Comment));

// * add Ratting
productEngagement.post(
  "/rating/create",
  auth("customer"),
  (req, res, next) => {
    const userId = req.customer._id;
    req.body["userId"] = userId;
    next();
  },
  create(Rating, ["userId", "productId", "value", "description"]),
);

// Get a Single Rating
productEngagement.get("/rating/getSingle/:fieldId", read(Rating));

//  get all ratting by user
productEngagement.get(
  "/rating/getAllByUser/:fieldId",
  read(Rating, {}, { fieldQuery: "userId", pagination: true }),
);

// * get product ratting
productEngagement.get(
  "/rating/getAllByProduct/:fieldId",
  read(Rating, {}, { fieldQuery: "productId", pagination: true }),
);

// update rating
productEngagement.patch("/rating/update/:fieldId", update(Rating));

// * delete ratting
productEngagement.delete("/rating/delete/:fieldId", deleteData(Rating));

module.exports = productEngagement;
