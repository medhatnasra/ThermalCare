import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  applyBulkDiscount,
  applyProductDiscount,
  clearProductDiscount,
  fetchDiscountProducts,
  fetchDiscountSummary,
} from "../redux/slices/personnelDiscountSlice";

const PersonnelDiscountPage = () => {
  const dispatch = useDispatch();
  const {
    summary,
    products,
    loadingSummary,
    loadingProducts,
    loadingAction,
    error,
  } = useSelector((state) => state.personnelDiscount);

  const [search, setSearch] = useState("");
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [bulkField, setBulkField] = useState("category");
  const [bulkValue, setBulkValue] = useState("");
  const [bulkPercentage, setBulkPercentage] = useState(15);
  const [rowDiscounts, setRowDiscounts] = useState({});

  useEffect(() => {
    dispatch(fetchDiscountSummary());
    dispatch(fetchDiscountProducts());
  }, [dispatch]);

  const filteredData = useMemo(
    () =>
      products.filter((product) => {
        if (!search) return true;
        const key =
          `${product.name} ${product.sku} ${product.category} ${product.brand}`.toLowerCase();
        return key.includes(search.toLowerCase());
      }),
    [products, search],
  );

  const bulkFieldValues = useMemo(() => {
    const values = products
      .map((product) => String(product?.[bulkField] || "").trim())
      .filter((value) => value.length > 0);

    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }, [products, bulkField]);

  const categoryChartMax = Math.max(
    ...(summary.byCategory || []).map((item) => item.discounted),
    1,
  );

  const handleRefresh = () => {
    dispatch(fetchDiscountSummary());
    dispatch(fetchDiscountProducts({ search: "", onlyDiscounted }));
  };

  const handleFilter = () => {
    dispatch(fetchDiscountProducts({ search, onlyDiscounted }));
  };

  const handleApplyDiscount = (productId) => {
    const percentage = Number(rowDiscounts[productId] || 0);
    if (!percentage || percentage <= 0 || percentage >= 100) {
      window.alert("Le pourcentage doit etre entre 1 et 99.");
      return;
    }
    dispatch(applyProductDiscount({ productId, percentage }));
  };

  const handleClearDiscount = (productId) => {
    dispatch(clearProductDiscount(productId));
  };

  const handleBulkDiscount = (e) => {
    e.preventDefault();
    if (!bulkValue.trim()) {
      window.alert("Selectionnez une valeur de filtre.");
      return;
    }

    if (bulkPercentage <= 0 || bulkPercentage >= 100) {
      window.alert("Le pourcentage doit etre entre 1 et 99.");
      return;
    }

    dispatch(
      applyBulkDiscount({
        field: bulkField,
        value: bulkValue.trim(),
        percentage: Number(bulkPercentage),
      }),
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-linear-to-r from-emerald-900 via-cyan-800 to-slate-800 p-6 text-white shadow-lg">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">
          Personnel
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          Gestion professionnelle des reductions
        </h1>
        <p className="mt-2 text-sm text-slate-200">
          Pilotez les remises produit en temps reel avec une vue metier claire.
        </p>
      </div>

      {(loadingSummary || loadingProducts) && (
        <p className="text-slate-600">Chargement des donnees...</p>
      )}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs uppercase text-slate-500">Produits</p>
              <p className="text-2xl font-semibold text-slate-900 mt-1">
                {summary.totalProducts}
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4">
              <p className="text-xs uppercase text-emerald-700">
                Produits en promo
              </p>
              <p className="text-2xl font-semibold text-emerald-900 mt-1">
                {summary.totalDiscountedProducts}
              </p>
            </div>
            <div className="rounded-xl bg-cyan-50 p-4">
              <p className="text-xs uppercase text-cyan-700">
                Couverture promo
              </p>
              <p className="text-2xl font-semibold text-cyan-900 mt-1">
                {summary.discountCoverage}%
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <p className="text-xs uppercase text-amber-700">
                Economies estimees
              </p>
              <p className="text-2xl font-semibold text-amber-900 mt-1">
                {Number(summary.estimatedSavings || 0).toFixed(2)} DT
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium uppercase tracking-wider text-slate-500 mb-3">
              Promotions par categorie
            </p>
            <div className="space-y-3">
              {(summary.byCategory || []).length > 0 ? (
                summary.byCategory.map((item) => (
                  <div
                    key={item.category}
                    className="rounded-xl bg-slate-50 p-3"
                  >
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-700 font-medium">
                        {item.category}
                      </span>
                      <span className="text-slate-900 font-semibold">
                        {item.discounted}/{item.total}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-emerald-500 to-cyan-500"
                        style={{
                          width: `${Math.max(8, (item.discounted / categoryChartMax) * 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  Aucune categorie disponible.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wider text-slate-500 mb-4">
            Remise de masse
          </p>

          <form className="space-y-4" onSubmit={handleBulkDiscount}>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Type de filtre
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 p-2"
                value={bulkField}
                onChange={(e) => {
                  setBulkField(e.target.value);
                  setBulkValue("");
                }}
              >
                <option value="category">Categorie</option>
                <option value="brand">Marque</option>
                <option value="collections">Collection</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Valeur
              </label>
              <select
                value={bulkValue}
                onChange={(e) => setBulkValue(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2"
                disabled={bulkFieldValues.length === 0}
              >
                <option value="">
                  {bulkFieldValues.length === 0
                    ? "Aucune valeur disponible"
                    : "Selectionner une valeur"}
                </option>
                {bulkFieldValues.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">
                Pourcentage (%)
              </label>
              <input
                type="number"
                min="1"
                max="99"
                value={bulkPercentage}
                onChange={(e) => setBulkPercentage(e.target.value)}
                className="w-full rounded-lg border border-slate-300 p-2"
              />
            </div>
            <button
              type="submit"
              disabled={loadingAction}
              className="w-full rounded-lg bg-slate-900 text-white py-2.5 font-semibold hover:bg-slate-800 disabled:opacity-50"
            >
              Appliquer la remise de masse
            </button>
          </form>

          <button
            onClick={handleRefresh}
            className="mt-3 w-full rounded-lg border border-slate-300 py-2.5 font-semibold text-slate-700 hover:bg-slate-100"
          >
            Rafraichir les donnees
          </button>

        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-end gap-3 md:justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Produits et remises
            </h2>
            <p className="text-sm text-slate-500">
              Ajustez les remises par produit.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, SKU, categorie..."
              className="rounded-lg border border-slate-300 p-2 min-w-64"
            />
            <label className="flex items-center gap-2 text-sm text-slate-700 px-2">
              <input
                type="checkbox"
                checked={onlyDiscounted}
                onChange={(e) => setOnlyDiscounted(e.target.checked)}
              />
              Uniquement en promo
            </label>
            <button
              onClick={handleFilter}
              className="rounded-lg bg-cyan-700 text-white px-4 py-2 font-semibold hover:bg-cyan-800"
            >
              Filtrer
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-600 uppercase text-xs">
              <tr>
                <th className="px-3 py-3">Produit</th>
                <th className="px-3 py-3">Categorie</th>
                <th className="px-3 py-3">Prix</th>
                <th className="px-3 py-3">Prix promo</th>
                <th className="px-3 py-3">Remise</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((product) => {
                  const basePrice = Number(product.price || 0);
                  const discountedPrice = Number(product.discountPrice || 0);
                  const discountPercent =
                    discountedPrice > 0 && discountedPrice < basePrice
                      ? (
                          ((basePrice - discountedPrice) / basePrice) *
                          100
                        ).toFixed(1)
                      : "0.0";

                  return (
                    <tr
                      key={product._id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-3 py-3">
                        <p className="font-medium text-slate-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-slate-500">{product.sku}</p>
                      </td>
                      <td className="px-3 py-3 text-slate-700">
                        {product.category}
                      </td>
                      <td className="px-3 py-3 text-slate-900 font-semibold">
                        {basePrice.toFixed(2)} DT
                      </td>
                      <td className="px-3 py-3 text-emerald-700 font-semibold">
                        {discountedPrice > 0
                          ? `${discountedPrice.toFixed(2)} DT`
                          : "-"}
                      </td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                          {discountPercent}%
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={rowDiscounts[product._id] || ""}
                            onChange={(e) =>
                              setRowDiscounts((prev) => ({
                                ...prev,
                                [product._id]: e.target.value,
                              }))
                            }
                            placeholder="%"
                            className="w-20 rounded-lg border border-slate-300 p-1.5"
                          />
                          <button
                            onClick={() => handleApplyDiscount(product._id)}
                            disabled={loadingAction}
                            className="rounded-md bg-slate-900 px-3 py-1.5 text-white hover:bg-slate-800 disabled:opacity-50"
                          >
                            Appliquer
                          </button>
                          <button
                            onClick={() => handleClearDiscount(product._id)}
                            disabled={loadingAction}
                            className="rounded-md border border-slate-300 px-3 py-1.5 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                          >
                            Retirer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-500">
                    Aucun produit trouve.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PersonnelDiscountPage;

