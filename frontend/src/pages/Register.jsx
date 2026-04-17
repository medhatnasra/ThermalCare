import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import register from "../assets/register.png";
import { registerUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";
import { toast } from "sonner";
const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();
    const normalizedConfirm = confirmPassword.trim();

    if (
      !normalizedName ||
      !normalizedEmail ||
      !normalizedPassword ||
      !normalizedConfirm
    ) {
      toast.error("Veuillez remplir tous les champs requis.");
      return;
    }

    if (normalizedName.length < 2) {
      toast.error("Le nom doit contenir au moins 2 caractères.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      toast.error("Veuillez saisir une adresse e-mail valide.");
      return;
    }

    if (normalizedPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    if (normalizedPassword !== normalizedConfirm) {
      toast.error("La confirmation du mot de passe ne correspond pas.");
      return;
    }

    try {
      await dispatch(
        registerUser({
          name: normalizedName,
          email: normalizedEmail,
          password: normalizedPassword,
        }),
      ).unwrap();
      toast.success("Inscription réussie. Bienvenue !");
    } catch (error) {
      toast.error(
        error?.message || "Échec de l'inscription. Veuillez réessayer.",
      );
    }
  };
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
            Entrez vos informations pour créer un compte
          </p>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Entrez votre nom"
            />
          </div>
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
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Confirmez votre mot de passe"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black p-2 text-white rounded-lg font-semibold hover:text-gray-800 transition "
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </button>
          <p className="mt-6 text-center text-sm">
            Vous avez déjà un compte ?
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            src={register}
            alt="login "
            className="h-[750px] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
