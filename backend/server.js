const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = express();
const UserRoutes = require("./routes/userRoutes");
const ProductRoutes = require("./routes/productRoutes");
const CartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const SubscribeRoutes = require("./routes/SubscribeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const orderAdminRoutes = require("./routes/adminOrderRoutes");
const discountRoutes = require("./routes/discountRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

app.use(express.json());

app.use(cors());

dotenv.config();

app.get("/", (req, res) => {
  res.send("WELCOME TO THERMAL CARE API");
});

app.listen(process.env.PORT, () => {
  console.log(`server is running on Port : ${process.env.PORT}`);
});

//API Routes

app.use("/api/users", UserRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/cart", CartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/", SubscribeRoutes);
app.use("/api/discounts", discountRoutes);
app.use("/api/favorites", favoriteRoutes);

// Admin Routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", orderAdminRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err.message));
