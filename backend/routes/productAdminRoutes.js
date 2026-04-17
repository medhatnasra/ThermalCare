const express = require("express");

const Product = require("../models/Product");

const { protect, personnel } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/products
// @desc get all products
// @Access Private/Admin

router.get("/", protect, personnel, async (req, res) => {
  try {
    const products = await Product.find({});
    if (!products) {
      res.status(404).json({ message: "Products Not Found" });
    }
    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/admin/products
// @desc Create a new product
// @Access Private/Admin

router.post("/", protect, personnel, async (req, res) => {
  try {
    const product = await Product.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/admin/products/:id
// @desc Update a product
// @Access Private/Admin

router.put("/:id", protect, personnel, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route DELETE /api/admin/products/:id
// @desc Delete a product
// @Access Private/Admin

router.delete("/:id", protect, personnel, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    await product.deleteOne();
    res.json({ message: "Product Deleted Successfully", _id: req.params.id });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
