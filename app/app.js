const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());
const productRouter = require("../routes/product.route");
const orderRouter = require("../routes/order.route");
const userRouter = require("../routes/user.route");

app.use("/product", productRouter);
app.use("/order", orderRouter);
app.use("/user", userRouter);

module.exports = app;
