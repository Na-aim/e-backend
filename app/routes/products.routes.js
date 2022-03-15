const express = require("express");
const Product = require("../models/product");
const authJwt = require("../middleware/authJwt");
const getProduct = require("../middleware/aquireProduct");
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  app.post("/products", authJwt.verifyToken, async (req, res) => {
    const product = await Product({
      name: req.body.name,
      anime: req.body.anime,
      description: req.body.description,
      price: req.body.price,
      img: req.body.img,
      created_by: req.userId,
    });
  
    try {
      const newProduct = await product.save();
      res.status(201).json(newProduct);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  app.get("/products", async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  app.get("/:id", getProduct, (req, res) => {
    res.send(res.product);
  });
  app.patch("/:id", [getProduct, authJwt.verifyToken], async (req, res) => {
    if (res.product.created_by != req.userId) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    if (req.body.name != null) {
      res.product.name = req.body.name;
    }
    if (req.body.description != null) {
      res.product.description = req.body.description;
    }
    if (req.body.price != null) {
      res.product.price = req.body.price;
    }
    if (req.body.img != null) {
      res.product.imgl = req.body.img;
    }
    try {
      const updatedProduct = await res.product.save();
      res.json(updatedProduct);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  // Deleting One
  app.delete("/:id", [getProduct, authJwt.verifyToken], async (req, res) => {
    try {
      if (res.product.created_by != req.userId) {
        return res.status(401).send({ message: "Unauthorized!" });
      }
      await res.product.remove();
      res.json({ message: "Deleted product" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
};

