const express = require("express");

const Favorite = require("../models/Favorite");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/favorites
// @desc Get current user's favorite products
// @access Private
router.get("/", protect, async (req, res) => {
  try {
    const favorite = await Favorite.findOne({ user: req.user._id }).populate(
      "products",
    );

    if (!favorite) {
      return res.json([]);
    }

    res.json(favorite.products);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route POST /api/favorites/:productId
// @desc Toggle product in favorites
// @access Private
router.post("/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    let favorite = await Favorite.findOne({ user: req.user._id });

    if (!favorite) {
      favorite = await Favorite.create({
        user: req.user._id,
        products: [productId],
      });
    } else {
      const index = favorite.products.findIndex(
        (id) => id.toString() === productId,
      );

      if (index > -1) {
        favorite.products.splice(index, 1);
      } else {
        favorite.products.push(productId);
      }

      await favorite.save();
    }

    await favorite.populate("products");

    const isFavorite = favorite.products.some(
      (item) => item._id.toString() === productId,
    );

    res.json({
      favorites: favorite.products,
      isFavorite,
      message: isFavorite
        ? "Produit ajoute aux favoris"
        : "Produit retire des favoris",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route DELETE /api/favorites/:productId
// @desc Remove product from favorites
// @access Private
router.delete("/:productId", protect, async (req, res) => {
  try {
    const { productId } = req.params;

    const favorite = await Favorite.findOne({ user: req.user._id });

    if (!favorite) {
      return res.json([]);
    }

    favorite.products = favorite.products.filter(
      (id) => id.toString() !== productId,
    );
    await favorite.save();

    await favorite.populate("products");
    res.json(favorite.products);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
