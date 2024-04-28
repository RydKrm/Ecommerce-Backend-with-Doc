const express = require("express");
const { create } = require("../../lib/CRUD/create");
const Product = require("../../models/Product");
const { update } = require("../../lib/CRUD/update");
const { deleteData } = require("../../lib/CRUD/delete");
const { read } = require("../../lib/CRUD/read");
const { updateToggle } = require("../../lib/CRUD/updateToggle");
const productCRUD = express.Router();

// create product
productCRUD.post(
  "/create",
  create(Product, [
    "name",
    "description",
    "previousPrice",
    "sellingPrice",
    "buyingPrice",
    "category",
    "stockQuantity",
  ]),
);

// update product
productCRUD.patch("/update/:fieldId", update(Product));

// * delete product
productCRUD.delete("/delete/:fieldId", deleteData(Product));

// * get single product
productCRUD.get("/getSingle/:fieldId", read(Product, {}));

// * get all product
productCRUD.get("/getAll", read(Product, {}));

// * get all true product
productCRUD.get("/getAllTrue", read(Product, { status: true }));

// * change status
productCRUD.patch("/updateStatus/:fieldId", updateToggle(Product, "status"));

// productCRUD.post("/create", Product.create);

module.exports = productCRUD;
