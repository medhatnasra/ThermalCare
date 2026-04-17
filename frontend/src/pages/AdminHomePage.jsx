import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAdminProducts } from "../redux/slices/adminProductSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const {
    products,
    loading: productLoading,
    error: productError,
  } = useSelector((state) => state.adminProducts);

  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const safeProducts = Array.isArray(products) ? products : [];
  const safeOrders = Array.isArray(orders) ? orders : [];

  const revenueValue = Number(totalSales || 0);
  const orderValue = Number(totalOrders || safeOrders.length || 0);
  const productValue = safeProducts.length;
  const avgOrderValue = orderValue ? revenueValue / orderValue : 0;

  const recentRevenueData = [...safeOrders]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(-7)
    .map((order, index) => ({
      label: `D${index + 1}`,
      value: Number(order.totalPrice || 0),
    }));

  const maxRevenuePoint = Math.max(
    ...recentRevenueData.map((item) => item.value),
    1,
  );

  const statusDistribution = safeOrders.reduce(
    (acc, order) => {
      const status = String(order.status || "").toLowerCase();
      if (status.includes("deliver")) acc.delivered += 1;
      else if (status.includes("ship")) acc.shipped += 1;
      else if (status.includes("process") || status.includes("paid")) {
        acc.processing += 1;
      } else if (status.includes("cancel") || status.includes("fail")) {
        acc.cancelled += 1;
      } else if (status.includes("pend")) acc.pending += 1;
      else acc.other += 1;
      return acc;
    },
    {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      other: 0,
    },
  );

  const statusSegments = [
    { key: "delivered", color: "#16a34a", value: statusDistribution.delivered },
    {
      key: "processing",
      color: "#f59e0b",
      value: statusDistribution.processing,
    },
    { key: "shipped", color: "#0ea5e9", value: statusDistribution.shipped },
    { key: "pending", color: "#6366f1", value: statusDistribution.pending },
    { key: "cancelled", color: "#dc2626", value: statusDistribution.cancelled },
    { key: "other", color: "#64748b", value: statusDistribution.other },
  ];

  const donutStops = [];
  let currentStop = 0;
  statusSegments.forEach((segment) => {
    const percent = orderValue ? (segment.value / orderValue) * 100 : 0;
    const nextStop = currentStop + percent;
    if (percent > 0) {
      donutStops.push(
        `${segment.color} ${currentStop.toFixed(2)}% ${nextStop.toFixed(2)}%`,
      );
    }
    currentStop = nextStop;
  });
  const donutStyle = {
    background: donutStops.length
      ? `conic-gradient(${donutStops.join(", ")})`
      : "conic-gradient(#e2e8f0 0 100%)",
  };

  const categoryMap = safeProducts.reduce((acc, product) => {
    const category = product.category || "Other";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxCategoryCount = Math.max(
    ...topCategories.map((item) => item.count),
    1,
  );

  const statusLabels = {
    delivered: "livrees",
    processing: "en cours",
    shipped: "expediees",
    pending: "en attente",
    cancelled: "annulees",
    other: "autres",
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-800 p-6 text-white shadow-lg">
        <p className="text-sm uppercase tracking-[0.25em] text-cyan-200">
          Centre de pilotage
        </p>
        <h1 className="mt-2 text-3xl font-semibold">
          Tableau de bord analytique
        </h1>
        <p className="mt-2 text-sm text-slate-200">
          Vue en temps reel du chiffre d'affaires, des commandes et du stock.
        </p>
      </div>
      {productLoading || ordersLoading ? (
        <p>Chargement...</p>
      ) : productError ? (
        <p className="text-red-500">
          Erreur lors du chargement des produits ! {productError}
        </p>
      ) : ordersError ? (
        <p className="text-red-500">
          Erreur lors du chargement des commandes ! {ordersError}
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
                  Chiffre d'affaires
                </p>
                <p className="mt-2 text-4xl font-semibold text-slate-900">
                  {revenueValue.toFixed(2)} TND
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Panier moyen : {avgOrderValue.toFixed(2)} TND
                </p>
              </div>
              <div className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                {recentRevenueData.length || 0} dernieres commandes
              </div>
            </div>

            <div className="mt-6">
              <div className="flex h-44 items-end gap-3">
                {(recentRevenueData.length
                  ? recentRevenueData
                  : [{ label: "D1", value: 0 }]
                ).map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-1 flex-col items-center gap-2"
                  >
                    <div className="w-full rounded-xl bg-slate-100 p-1">
                      <div
                        className="w-full rounded-lg bg-gradient-to-t from-cyan-500 to-emerald-400 transition-all duration-500"
                        style={{
                          height: `${Math.max(
                            12,
                            (item.value / maxRevenuePoint) * 160,
                          )}px`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
                Statut des commandes
              </p>
              <Link
                to="/admin/orders"
                className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
              >
                Gerer les commandes
              </Link>
            </div>

            <div className="mt-5 flex items-center gap-6">
              <div
                className="relative h-36 w-36 rounded-full"
                style={donutStyle}
              >
                <div className="absolute inset-[14px] grid place-items-center rounded-full bg-white text-center">
                  <p className="text-2xl font-semibold text-slate-900">
                    {orderValue}
                  </p>
                  <p className="text-xs text-slate-500">Total commandes</p>
                </div>
              </div>

              <div className="space-y-2">
                {statusSegments
                  .filter((segment) => segment.value > 0)
                  .slice(0, 4)
                  .map((segment) => (
                    <div
                      key={segment.key}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: segment.color }}
                      ></span>
                      <span className="capitalize text-slate-600">
                        {statusLabels[segment.key] || segment.key}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {segment.value}
                      </span>
                    </div>
                  ))}
                {orderValue === 0 && (
                  <p className="text-sm text-slate-500">
                    Aucune commande pour le moment.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-slate-500">
                  Product Mix
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {productValue} produits au total
                </p>
              </div>
              <Link
                to="/admin/products"
                className="text-sm font-semibold text-cyan-700 hover:text-cyan-800"
              >
                Gerer les produits
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topCategories.length > 0 ? (
                topCategories.map((category) => (
                  <div
                    key={category.name}
                    className="rounded-xl bg-slate-50 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {category.name}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {category.count}
                      </span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-slate-900"
                        style={{
                          width: `${Math.max(
                            8,
                            (category.count / maxCategoryCount) * 100,
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  Aucune categorie de produit disponible.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold mb-4 text-slate-900">
          Commandes recentes
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-600">
            <thead className="bg-slate-100 text-xs uppercase text-slate-600">
              <tr>
                <th className="py-3 px-4">ID commande</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Prix total</th>
                <th className="py-3 px-4">Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.slice(0, 8).map((order) => (
                  <tr
                    key={order._id}
                    className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer"
                  >
                    <td className="py-4 px-4 font-mono text-xs text-slate-500">
                      {String(order._id).slice(-10)}
                    </td>
                    <td className="py-4 px-4">
                      {order.user?.name || "Invite"}
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-900">
                      {Number(order.totalPrice || 0).toFixed(2)} TND
                    </td>
                    <td className="py-4 px-4">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    Aucune commande trouvee
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

export default AdminHomePage;
