import React from "react";
import { FaPercent, FaSignOutAlt, FaStore } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";

const PersonnelSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/" className="text-2xl font-medium">
          Thermal Care
        </Link>
      </div>

      <h2 className="text-xl font-medium mb-6 text-center">Espace personnel</h2>

      <nav className="flex flex-col space-y-2">
        <NavLink
          to="/personnel/discounts"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-2"
              : "text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-2"
          }
        >
          <FaPercent />
          <span>Gestion des reductions</span>
        </NavLink>

        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-2"
              : "text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center gap-2"
          }
        >
          <FaStore />
          <span>Boutique</span>
        </NavLink>
      </nav>

      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
        >
          <FaSignOutAlt />
          <span>Deconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default PersonnelSidebar;
