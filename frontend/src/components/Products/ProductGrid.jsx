import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  clearFavorites,
  fetchFavorites,
  toggleFavorite,
} from "../../redux/slices/favoriteSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const ProductGrid = ({ products, loading, error }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: favorites, loading: favoriteLoading } = useSelector(
    (state) => state.favorites,
  );

  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites());
    } else {
      dispatch(clearFavorites());
    }
  }, [dispatch, user]);

  const handleFavoriteClick = async (event, productId) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      toast.error("Veuillez vous connecter pour ajouter aux favoris.");
      return;
    }

    try {
      const response = await dispatch(toggleFavorite(productId)).unwrap();
      toast.success(
        response.isFavorite
          ? "Produit ajoute aux favoris"
          : "Produit retire des favoris",
      );
    } catch (favError) {
      toast.error(
        favError?.message || "Impossible de mettre a jour les favoris.",
      );
    }
  };

  if (loading) {
    return <p>Loading ...</p>;
  }

  if (error) {
    return <p>Error : {error}</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((prod, index) => {
        const key = prod._id || index;
        const href = prod._id ? `/product/${prod._id}` : "#";
        const isFavorite = favorites.some(
          (item) => item._id?.toString() === prod._id?.toString(),
        );

        return (
          <Link key={key} to={href} className="block">
            <div className="bg-white p-4 rounded-lg relative">
              {prod._id && (
                <button
                  onClick={(event) => handleFavoriteClick(event, prod._id)}
                  disabled={favoriteLoading}
                  className="absolute top-6 right-6 z-10 rounded-full bg-white/90 p-2 shadow hover:bg-white"
                >
                  {isFavorite ? (
                    <FaHeart className="text-rose-600" />
                  ) : (
                    <FaRegHeart className="text-gray-700" />
                  )}
                </button>
              )}
              <div className="w-full h-96 mb-4">
                <img
                  src={prod.images?.[0]?.url}
                  alt={prod.name}
                  className="w-full h-full object-cover rounded-lg "
                />
              </div>
              <h3 className="text-sm mb-2">{prod.name}</h3>
              <p className="text-gray-400 font-medium text-sm tracking-tighter">
                DT {prod.price}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
