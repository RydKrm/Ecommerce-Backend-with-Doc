const express = require("express");
const cartRoute = express.Router();
const { auth } = require("../../auth/auth");
const Cart = require("../../models/Cart");
const { update } = require("../../lib/CRUD/update");
const { create } = require("../../lib/CRUD/create");
const { read } = require("../../lib/CRUD/read");
const { deleteData } = require("../../lib/CRUD/delete");

cartRoute.post(
  "/add",
  auth("customer"),
  (req, res, next) => {
    const userId = req.customer._id;
    req.body["userId"] = userId;
    next();
  },
  create(Cart, ["productId"]),
);

cartRoute.get(
  "/allProductByUser/",
  auth("customer"),
  (req, res, next) => {
    req.body["userId"] = req.customer._id;
    next();
  },
  read(Cart),
);
// update product quantity
cartRoute.patch("/update/:fieldId", update(Cart));

// delete product
cartRoute.delete("/delete/:fieldId", deleteData(Cart));

module.exports = cartRoute;
