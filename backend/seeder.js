const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");

const products = require("./data/products");

dotenv.config();

// Connect to mongodb database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err.message));

// Function to seed Data

const seedData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // create Admin User
    const createdUser = await User.create({
      name: "admin",
      email: "admin@gmail.com",
      password: "123456789",
      role: "admin",
    });

    //    Assign ID to Products

    const userID = createdUser._id;

    const sampleProduct = products.map((product) => {
      return { ...product, user: userID };
    });

    // Insert the products in database

    await Product.insertMany(sampleProduct);

    console.log("Product data seeded successfully");
    process.exit();
  } catch (err) {
    console.log("error seeding the data:", err.message);
    console.error(err);
    process.exit(1);
  }
};

seedData();
