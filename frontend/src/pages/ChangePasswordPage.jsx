import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { currentPassword, newPassword, confirmPassword } = formData;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs requis.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "Le nouveau mot de passe doit contenir au moins 6 caractères.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("La confirmation du mot de passe ne correspond pas.");
      return;
    }

    try {
      setUpdatingPassword(true);
      const response = await axios.put(
        `http://localhost:5000/api/users/profile/password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );

      toast.success(
        response.data.message || "Mot de passe modifié avec succès.",
      );
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      navigate("/profile");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Impossible de modifier le mot de passe. Veuillez réessayer.",
      );
    } finally {
      setUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-md">
        <div className="mb-6">
          <p className="text-sm text-gray-500">Compte</p>
          <h1 className="text-2xl font-bold text-gray-900">
            Modifier le mot de passe
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Choisissez un nouveau mot de passe pour votre compte.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Mot de passe actuel
            </label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  currentPassword: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-black focus:outline-none"
              placeholder="Entrez votre mot de passe actuel"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  newPassword: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-black focus:outline-none"
              placeholder="Nouveau mot de passe"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-black focus:outline-none"
              placeholder="Confirmez le nouveau mot de passe"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={updatingPassword}
              className="flex-1 rounded-lg bg-black px-4 py-3 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updatingPassword
                ? "Modification..."
                : "Modifier le mot de passe"}
            </button>
            <Link
              to="/profile"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-3 text-gray-700 transition hover:bg-gray-100"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
