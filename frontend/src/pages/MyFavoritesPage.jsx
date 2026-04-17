import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductGrid from "../components/Products/ProductGrid";
import { fetchFavorites } from "../redux/slices/favoriteSlice";

const MyFavoritesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items, loading, error } = useSelector((state) => state.favorites);

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/my-favorites");
      return;
    }

    dispatch(fetchFavorites());
  }, [dispatch, navigate, user]);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl sm:text-3xl font-bold mb-6">Mes favoris</h2>
      {error && <p className="mb-4 text-red-600">Erreur : {error}</p>}
      {!loading && items.length === 0 ? (
        <p className="text-gray-500">Vous n'avez aucun produit en favoris.</p>
      ) : (
        <ProductGrid products={items} loading={loading} error={error} />
      )}
    </div>
  );
};

export default MyFavoritesPage;
