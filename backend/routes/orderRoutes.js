const express = require("express");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/orders/my-orders
// @desc Get logged-in users orders
// @access Private

router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
      status: { $ne: "Cancelled" },
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/orders/:id/cancel
// @desc Cancel a pending order
// @access Private

router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order Not Found" });
    }

    if (String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (order.status !== "Pending") {
      return res.status(400).json({
        message: "Only pending orders can be cancelled",
      });
    }

    order.status = "Cancelled";
    order.isDelivered = false;
    order.deliveredAt = undefined;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route GET /api/orders/:id
// @desc Get order details by ID
// @access Private

router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );

    if (!order) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    // Return Full Order Details
    res.json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
