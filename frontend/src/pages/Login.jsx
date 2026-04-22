import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import login from "../assets/login.jpg";

import { loginUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";
import { toast } from "sonner";

const toFrenchAuthError = (message) => {
  const normalized = (message || "").toLowerCase();

  if (normalized.includes("invalid") && normalized.includes("password")) {
    return "Mot de passe incorrect.";
  }
  if (normalized.includes("invalid") && normalized.includes("email")) {
    return "Adresse e-mail invalide.";
  }
  if (normalized.includes("user") && normalized.includes("not")) {
    return "Utilisateur introuvable.";
  }
  if (normalized.includes("already exists")) {
    return "Ce compte existe deja.";
  }
  if (normalized.includes("required")) {
    return "Veuillez remplir tous les champs requis.";
  }
  if (normalized.includes("server")) {
    return "Erreur serveur. Veuillez reessayer plus tard.";
  }

  return "Echec de la connexion. Veuillez reessayer.";
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  const getDashboardRouteByRole = (role) => {
    if (role === "admin") return "/admin";
    if (role === "personnel") return "/personnel";
    return "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password.trim()) {
      toast.error("Veuillez remplir tous les champs requis.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      toast.error("Veuillez saisir une adresse e-mail valide.");
      return;
    }

    if (password.trim().length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      await dispatch(
        loginUser({ email: normalizedEmail, password: password.trim() }),
      ).unwrap();
      toast.success("Connexion réussie.");
    } catch (error) {
      toast.error(toFrenchAuthError(error?.message));
    }
  };

  useEffect(() => {
    if (user) {
      const roleHome = getDashboardRouteByRole(user.role);
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : roleHome);
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : roleHome);
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);
  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center mb-6 ">
            <h2 className="text-xl font-medium">Thermal Care</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Bonjour!</h2>
          <p className="text-center mb-6">
            Entrez votre nom d'utilisateur et mot de passe pour vous connecter
          </p>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Entrez votre adresse e-mail"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              {" "}
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Entrez votre mot de passe"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black p-2 text-white rounded-lg font-semibold hover:text-gray-800 transition "
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          <p className="mt-6 text-center text-sm">
            Vous n'avez pas de compte ?
            <Link
              to={`/register?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500"
            >
              S'inscrire
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={login}
            alt="login "
            className="h-187.5 w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
