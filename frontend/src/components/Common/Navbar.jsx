import React, { useState } from "react";
import { Link } from "react-router-dom";

import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
} from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);

  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;
  const handleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const handleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };
  return (
    <>
      <nav className="container mx-auto flex justify-between items-center px-4 py-6">
        <div>
          <Link to="/" className="font-medium">
            Thermal Care
          </Link>
        </div>

        <div className="hidden md:flex space-x-6">
          <Link
            to="/collection/all?gender=Men"
            className="text-gray-700 text-sm hover:text-black font-medium uppercase"
          >
            Homme
          </Link>
          <Link
            to="/collection/all?gender=Women"
            className="text-gray-700 text-sm hover:text-black font-medium uppercase"
          >
            Femme
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="block bg-black px-2 rounded text-sm text-white"
            >
              Admin
            </Link>
          )}
          <Link to="/profile">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>
          <button className="relative hover:text-black" onClick={handleDrawer}>
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 bg-[#ea2e0e] text-white text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>
          <button className="md:hidden" onClick={handleNavDrawer}>
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
          <SearchBar />
        </div>
      </nav>
      <CartDrawer openDrawer={openDrawer} handleDrawer={handleDrawer} />
      {/* Mobile Navigation */}

      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button>
            <IoMdClose
              className="h-6 w-6 text-gray-600"
              onClick={handleNavDrawer}
            />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4">
            <Link
              to="#"
              onClick={handleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Men
            </Link>
            <Link
              to="#"
              onClick={handleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Woman
            </Link>
            <Link
              to="#"
              onClick={handleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Top Wear
            </Link>
            <Link
              to="#"
              onClick={handleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
