const express = require("express");
const Order = require("../models/Order");
const { protect, personnel } = require("../middleware/authMiddleware");
const router = express.Router();

// @route GET /api/admin/orders
// @desc get All Orders
// Access Private/admin

router.get("/", protect, personnel, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email");

    if (!orders) {
      return res.status(404).json({ message: "Orders Not Found" });
    }
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/admin/orders/id
// @desc Update order status
// Access Private/admin

router.put("/:id", protect, personnel, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name");
    if (order) {
      const allowedStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];
      const nextStatus = req.body.status || order.status;

      if (!allowedStatuses.includes(nextStatus)) {
        return res.status(400).json({ message: "Invalid order status" });
      }

      order.status = nextStatus;
      order.isDelivered = nextStatus === "Delivered";
      order.deliveredAt =
        nextStatus === "Delivered"
          ? order.deliveredAt || Date.now()
          : undefined;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order Not Found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route PUT /api/admin/orders/id
// @desc Delete existing Order
// Access Private/admin

router.delete("/:id", protect, personnel, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      await order.deleteOne();
      res.json({ message: "Order Removed" });
    } else {
      res.status(404).json({ message: "Order Not Found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: " Server Error" });
  }
});
module.exports = router;
