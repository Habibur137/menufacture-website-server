const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(cors());
const productRouter = require("../routes/product.route");

app.use("/product", productRouter);

module.exports = app;
