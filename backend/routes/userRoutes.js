const express = require("express");

const User = require("../models/User");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

// @route POST /api/users/register
// @desc Register a new user
// @access Public

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "User Already Exist" });

    const salt = bcrypt.genSaltSync(10);

    const hash = await bcrypt.hash(password, salt);

    const createdUser = await User.create({
      name: name,
      email: email,
      password: hash,
    });

    //JWT

    const payload = {
      user: {
        _id: createdUser._id,

        role: createdUser.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        // Send the User And Token in Response
        res.status(201).json({
          user: {
            _id: createdUser._id,
            name: createdUser.name,
            email: createdUser.email,
            role: createdUser.role,
          },
          token,
        });
      },
    );
  } catch (error) {
    console.log(error.message);

    res.status(500).send("Server Error");
  }
});

// @route POST /api/users/login
// @desc Authenticate User
// @access Public

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const payload = {
      user: {
        _id: user._id,

        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "40h" },
      (err, token) => {
        if (err) throw err;

        // Send the User And Token in Response
        res.status(201).json({
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          token,
        });
      },
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
});

// @route GET /api/users/profile
// @desc Get  logged-in user's profile (Protected Route)
// @access Private

router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

// @route PUT /api/users/profile/password
// @desc Change logged-in user's password
// @access Private

router.put("/profile/password", protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      message: "Veuillez remplir tous les champs requis.",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      message: "Le nouveau mot de passe doit contenir au moins 6 caractères.",
    });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable." });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Le mot de passe actuel est incorrect.",
      });
    }

    const salt = bcrypt.genSaltSync(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: "Mot de passe modifié avec succès." });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
