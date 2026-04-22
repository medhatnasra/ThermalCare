import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "../../redux/slices/adminOrderSlice";
import {
  ORDER_STATUS_OPTIONS,
  getOrderStatusBadgeClassName,
  getOrderStatusLabel,
  getOrderStatusSelectValue,
  getPaymentMethodBadgeClassName,
  getPaymentMethodLabel,
} from "../../utils/orderStatus";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "personnel")) {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  const handleStatusChange = (orderID, status) => {
    dispatch(updateOrderStatus({ id: orderID, status }));
  };

  if (loading) return <p>Chargement ....</p>;
  if (error) return <p>Erreur {error}</p>;
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6"> Gestion des commandes</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-ms uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4 ">Numéro de commande </th>
              <th className="py-3 px-4 ">Client </th>
              <th className="py-3 px-4 ">Paiement</th>
              <th className="py-3 px-4 ">Prix total </th>
              <th className="py-3 px-4 ">Statut</th>
              <th className="py-3 px-4 ">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b cursor-pointer hover:bg-gray-50 "
                >
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id}
                  </td>
                  <td className="p-4">{order.user?.name}</td>
                  <td className="p-4">
                    <span
                      className={`${getPaymentMethodBadgeClassName(order.paymentMethod)} rounded-full px-3 py-1 text-xs font-semibold`}
                    >
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </span>
                  </td>
                  <td className="p-4">{order.totalPrice.toFixed(2)} DT</td>
                  <td className="p-4">
                    <span
                      className={`${getOrderStatusBadgeClassName(order.status)} rounded-full px-3 py-1 text-xs font-semibold`}
                    >
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={getOrderStatusSelectValue(order.status)}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                    >
                      {ORDER_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-500 ">
                  Aucune commande trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
