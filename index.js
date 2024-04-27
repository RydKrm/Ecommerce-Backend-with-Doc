// app.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const customerProfileRouter = require("./routers/customer/customerProfileRouter");
const { categoryCRUDRouter } = require("./routers/category/categoryCRUDRoute");
const { error_handler } = require("./error/error_handler");
const compression = require("compression");

const app = express();
// eslint-disable-next-line
const PORT = process.env.PORT || 8080;
// eslint-disable-next-line
const database = process.env.MONGO_URI;

mongoose
  .connect(database)
  .then(() => console.log("database connected "))
  .catch((err) => console.log(err));

app.use(
  compression({
    level: 6,
    threshold: 100 * 1000,
    filter: (req, res) => {
      if (req.headers["x-on-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  }),
);

// rate limit
// app.use(
// 	rateLimit({
// 		windowMs: 5000, // 5 secound
// 		max: 20, // Limit each IP to 20 requests per `window` (here, per 5 secound)
// 		standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
// 		legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// 		message: {
// 			code: 429,
// 			message: "Too many request.",
// 		},
// 	})
// );

app.get("/api", (req, res) => {
  res.send("welcome to consent-app-backend");
});

app.use(express.json());
app.use(morgan("dev"));
app.use("/api/customer", customerProfileRouter);
app.use("/api/category", categoryCRUDRouter);
// app.use("/products", productRoutes);
// app.use("/orders", orderRoutes);

// error handler
app.use(error_handler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
