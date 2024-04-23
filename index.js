// app.js

require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const customerProfileRouter = require("./routers/customerRouter/customerProfileRouter");

const app = express();
// eslint-disable-next-line
const PORT = process.env.PORT || 8080;
// eslint-disable-next-line
const database = process.env.MONGO_URI;

mongoose
  .connect(database)
  .then(() => console.log("database connected "))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(morgan("dev"));
app.use("/customer", customerProfileRouter);
// app.use("/products", productRoutes);
// app.use("/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
