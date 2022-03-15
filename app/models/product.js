const mongoose = require("mongoose");
const Products = mongoose.model(
  "Products",
  new mongoose.Schema({
    name: String,
    description: String,
    price: String,
    size: String,
    anime: String,
    img: String,
  })
);
module.exports = Products;