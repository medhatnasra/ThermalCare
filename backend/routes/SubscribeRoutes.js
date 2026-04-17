const express = require("express");
const router = express.Router();
const Subscriber = require("../models/Subscriber");

// @route POST /api/subscribe
// @desc Handle newsletter subscription
// @access Public

router.post("/subscribe", async (req, res) => {
  const { email } = req.body;
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();

  if (!normalizedEmail) {
    return res.status(400).json({ message: "L'email est obligatoire." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ message: "Email invalide." });
  }

  try {
    let subscriber = await Subscriber.findOne({ email: normalizedEmail });
    if (subscriber) {
      return res.status(400).json({ message: "Cet email est deja abonne." });
    }
    await Subscriber.create({ email: normalizedEmail });
    res.status(201).json({ message: "Abonnement effectue avec succes." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
