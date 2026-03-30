import React from "react";
import {
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaStore,
  FaUser,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/slices/cartSlice";
import { logout } from "../../redux/slices/authSlice";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  };
  return (
    <div className="p-6 ">
      <div className="mb-6">
        <Link to="/admin" className="text-2xl font-medium">
          Thermal Care
        </Link>
      </div>
      <h2 className="text-xl font-medium mb-6 text-center">
        Tableau de bord administrateur
      </h2>
      <nav className="" flex flex-col space-y-2>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center"
              : "text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center"
          }
        >
          <FaUser /> <span> Utilisateurs</span>
        </NavLink>
        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center"
              : "text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center"
          }
        >
          <FaBoxOpen /> <span> Produits</span>
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center"
              : "text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center"
          }
        >
          <FaStore /> <span> Boutique</span>
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center"
              : "text-gray-300 hover:bg-gray-700 text-white py-3 px-4 rounded flex items-center"
          }
        >
          <FaClipboardList /> <span> Commandes</span>
        </NavLink>
      </nav>
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center"
        >
          <FaSignOutAlt />
          <span>Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
