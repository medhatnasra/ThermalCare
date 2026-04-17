import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const PromoProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPromoProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:5000/api/products?collection=all&limit=20",
        );
        setProducts(response.data || []);
      } catch (err) {
        setError("Impossible de charger les promotions pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    fetchPromoProducts();
  }, []);

  const promoProducts = useMemo(() => {
    return products
      .filter((product) => Number(product.discountPrice || 0) > 0)
      .sort((a, b) => {
        const aRate = Number(a.discountPrice) / Number(a.price || 1);
        const bRate = Number(b.discountPrice) / Number(b.price || 1);
        return aRate - bRate;
      })
      .slice(0, 8);
  }, [products]);

  return (
    <section id="promo-produits" className="py-16 px-4 lg:px-0 bg-slate-50">
      <div className="container mx-auto">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-rose-700 font-semibold">
              Offres en vedette
            </p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold text-slate-900">
              Produits en promotion
            </h2>
            <p className="mt-2 text-slate-600 max-w-2xl">
              Commencez votre visite avec les meilleures reductions du moment,
              selectionnees pour la peau, les cheveux et le bien-etre quotidien.
            </p>
          </div>

          <Link
            to="/collection/all"
            className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Voir toutes les categories
          </Link>
        </div>

        {loading && (
          <p className="text-slate-600">Chargement des promotions...</p>
        )}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && promoProducts.length === 0 && (
          <p className="text-slate-600">
            Aucun produit en promotion pour le moment.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {promoProducts.map((product) => {
            const basePrice = Number(product.price || 0);
            const discountedPrice = Number(product.discountPrice || 0);
            const discountPercent = Math.round(
              ((basePrice - discountedPrice) / basePrice) * 100,
            );

            return (
              <article
                key={product._id}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <Link to={`/product/${product._id}`} className="block">
                  <div className="relative">
                    <img
                      src={product.images?.[0]?.url}
                      alt={product.images?.[0]?.altText || product.name}
                      className="h-64 w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white">
                      -{discountPercent}%
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {product.category}
                    </p>
                    <h3 className="mt-1 line-clamp-2 text-base font-semibold text-slate-900">
                      {product.name}
                    </h3>
                    <div className="mt-3 flex items-center gap-2">
                      <p className="text-lg font-semibold text-rose-700">
                        {discountedPrice.toFixed(2)} DT
                      </p>
                      <p className="text-sm text-slate-500 line-through">
                        {basePrice.toFixed(2)} DT
                      </p>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PromoProducts;

