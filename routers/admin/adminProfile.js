const express = require("express");

const { register } = require("../../lib/profile/register");
const Admin = require("../../models/Admin");
const { login } = require("../../lib/profile/login");
const { auth } = require("../../auth/auth");
const { update } = require("../../lib/CRUD/update");
const { updatePassword } = require("../../lib/profile/updatePassword");
const { getUserProfile } = require("../../lib/profile/userProfile");

const adminProfileRouter = express.Router();

adminProfileRouter.post(
  "/register",
  register(Admin, ["email", "phone", "name", "password"], ["email"]),
);

adminProfileRouter.post("/login", login(Admin));

adminProfileRouter.patch(
  "/updateProfile",
  auth("admin"),
  update(Admin, { checker: ["email", "phone"], notUpdate: ["password"] }),
);

adminProfileRouter.patch(
  "/updatePassword",
  auth("admin"),
  updatePassword(Admin, "admin"),
);

adminProfileRouter.get(
  "/getProfile",
  auth("admin"),
  getUserProfile(Admin, "admin"),
);

module.exports = adminProfileRouter;
