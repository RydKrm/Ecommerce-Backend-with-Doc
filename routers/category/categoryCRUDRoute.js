const express = require("express");
const { positiveResponse } = require("../../utils/response");
const { create } = require("../../lib/CRUD/create");
const { Category } = require("../../models/Category");
const { read } = require("../../lib/CRUD/read");
const { deleteData } = require("../../lib/CRUD/delete");
const { update } = require("../../lib/CRUD/update");

const categoryCRUDRouter = express.Router();

categoryCRUDRouter.get("/", (req, res) => {
  console.log("Testing");
  positiveResponse(res, "Testing route");
});

categoryCRUDRouter.post(
  "/create",
  create(Category, ["name", "description"]),
);

// categoryCRUDRouter.get("/getAll", read(Category, {}, "name"));

categoryCRUDRouter.get("/getSingle/:fieldId", read(Category));

categoryCRUDRouter.get("/getTrue", read(Category, { status: true }));

categoryCRUDRouter.get(
  "/getAll",
  // prettier-ignore
  read(Category, {}, {
    pagination: true,
    select: "_id name description status",
  },
  ),
);

categoryCRUDRouter.delete("/delete/:fieldId", deleteData(Category));

categoryCRUDRouter.patch("/update/:fieldId", update(Category, ["name"]));

module.exports = { categoryCRUDRouter };
