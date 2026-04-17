const express = require("express");

const Product = require("../models/Product");
const { protect, personnel } = require("../middleware/authMiddleware");

const router = express.Router();

const buildFilter = ({ search, onlyDiscounted }) => {
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { brand: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }

  if (onlyDiscounted === "true") {
    query.discountPrice = { $gt: 0 };
  }

  return query;
};

const roundMoney = (value) => Math.max(0, Number(value.toFixed(2)));

// @route GET /api/discounts/summary
// @desc Discount analytics for personnel/admin
// @access Private (personnel/admin)
router.get("/summary", protect, personnel, async (req, res) => {
  try {
    const products = await Product.find({}).select(
      "price discountPrice countInStock category name",
    );

    const totalProducts = products.length;

    const discountedProducts = products.filter(
      (product) => Number(product.discountPrice || 0) > 0,
    );

    const totalDiscountedProducts = discountedProducts.length;

    const estimatedRevenue = products.reduce((acc, product) => {
      const effectivePrice =
        Number(product.discountPrice || 0) > 0
          ? Number(product.discountPrice)
          : Number(product.price || 0);
      return acc + effectivePrice * Number(product.countInStock || 0);
    }, 0);

    const estimatedSavings = products.reduce((acc, product) => {
      const basePrice = Number(product.price || 0);
      const reducedPrice = Number(product.discountPrice || 0);
      if (reducedPrice <= 0 || reducedPrice >= basePrice) return acc;
      return (
        acc + (basePrice - reducedPrice) * Number(product.countInStock || 0)
      );
    }, 0);

    const byCategoryMap = {};

    products.forEach((product) => {
      const categoryName = product.category || "Other";
      if (!byCategoryMap[categoryName]) {
        byCategoryMap[categoryName] = {
          category: categoryName,
          total: 0,
          discounted: 0,
        };
      }

      byCategoryMap[categoryName].total += 1;
      if (Number(product.discountPrice || 0) > 0) {
        byCategoryMap[categoryName].discounted += 1;
      }
    });

    const byCategory = Object.values(byCategoryMap)
      .sort((a, b) => b.discounted - a.discounted)
      .slice(0, 8);

    res.json({
      totalProducts,
      totalDiscountedProducts,
      discountCoverage: totalProducts
        ? Number(((totalDiscountedProducts / totalProducts) * 100).toFixed(2))
        : 0,
      estimatedRevenue: roundMoney(estimatedRevenue),
      estimatedSavings: roundMoney(estimatedSavings),
      byCategory,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/discounts/products
// @desc Get products for discount management
// @access Private (personnel/admin)
router.get("/products", protect, personnel, async (req, res) => {
  try {
    const { search, onlyDiscounted, limit } = req.query;
    const query = buildFilter({ search, onlyDiscounted });

    const products = await Product.find(query)
      .sort({ updatedAt: -1 })
      .limit(Number(limit) || 100);

    res.json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PATCH /api/discounts/products/:id/apply
// @desc Apply percentage discount to one product
// @access Private (personnel/admin)
router.patch("/products/:id/apply", protect, personnel, async (req, res) => {
  try {
    const { percentage } = req.body;
    const discountPercentage = Number(percentage);

    if (
      !Number.isFinite(discountPercentage) ||
      discountPercentage <= 0 ||
      discountPercentage >= 100
    ) {
      return res
        .status(400)
        .json({ message: "percentage must be between 0 and 100" });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    const basePrice = Number(product.price || 0);
    const newDiscountPrice = roundMoney(
      basePrice * (1 - discountPercentage / 100),
    );

    product.discountPrice = newDiscountPrice;
    await product.save();

    res.json({
      message: "Discount applied successfully",
      product,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PATCH /api/discounts/products/:id/clear
// @desc Remove discount from a product
// @access Private (personnel/admin)
router.patch("/products/:id/clear", protect, personnel, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    product.discountPrice = 0;
    await product.save();

    res.json({
      message: "Discount removed successfully",
      product,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PATCH /api/discounts/bulk
// @desc Apply a discount by category/brand/collection
// @access Private (personnel/admin)
router.patch("/bulk", protect, personnel, async (req, res) => {
  try {
    const { field, value, percentage } = req.body;
    const allowedFields = ["category", "brand", "collections"];
    const discountPercentage = Number(percentage);

    if (!allowedFields.includes(field)) {
      return res.status(400).json({
        message: "field must be one of: category, brand, collections",
      });
    }

    if (!value || typeof value !== "string") {
      return res.status(400).json({ message: "value is required" });
    }

    if (
      !Number.isFinite(discountPercentage) ||
      discountPercentage <= 0 ||
      discountPercentage >= 100
    ) {
      return res
        .status(400)
        .json({ message: "percentage must be between 0 and 100" });
    }

    const products = await Product.find({ [field]: value });

    if (!products.length) {
      return res.status(404).json({
        message: "No products found for the selected filter",
      });
    }

    const updates = products.map((product) => {
      const basePrice = Number(product.price || 0);
      product.discountPrice = roundMoney(
        basePrice * (1 - discountPercentage / 100),
      );
      return product.save();
    });

    await Promise.all(updates);

    res.json({
      message: "Bulk discount applied successfully",
      affectedProducts: products.length,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
