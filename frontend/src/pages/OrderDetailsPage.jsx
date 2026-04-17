import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import {
  getOrderStatusBadgeClassName,
  getOrderStatusLabel,
} from "../utils/orderStatus";

const OrderDetailsPage = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">
        Details de la commande
      </h2>
      {!orderDetails ? (
        <p>Aucun détail de commande trouvé</p>
      ) : (
        <div className="p-4 sm:p-6 rounded-lg border">
          <div className="flex flx-col sm:flex-row justify-between mb-8">
            <div className="">
              <h3 className="text-lg md:text-xl font-semibold">
                ID commande : #{orderDetails._id}
              </h3>
              <p className="text-gray-300">
                {new Date(orderDetails.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div className=" flex flex-col items-start sm:items-end mt-4 sm:mt-0">
              <span
                className={`${getOrderStatusBadgeClassName(orderDetails.status)} px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                Commande : {getOrderStatusLabel(orderDetails.status)}
              </span>
              <span
                className={`${
                  orderDetails.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }px-4 py-2 rounded-full text-sm font-medium`}
              >
                Paiement : {orderDetails.isPaid ? "Payé" : "Non payé"}
              </span>
            </div>
          </div>
          {/* Customer, Payment, Shipping Info  */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8 ">
            <div className="">
              <h4 className="text-lg font-semibold mb-2 ">
                Informations de paiement
              </h4>
              <p className="">
                Méthode :{" "}
                {orderDetails.paymentMethod === "OnDelivery"
                  ? "Livraison"
                  : orderDetails.paymentMethod}{" "}
              </p>
              <p>Statut : {orderDetails.isPaid ? "Payé" : "Non payé"}</p>
            </div>
            <div className="">
              <h4 className="text-lg font-semibold mb-2 ">
                Informations de livraison
              </h4>
              <p className="">
                Méthode de livraison : {orderDetails.shippingMethod}{" "}
              </p>
              <p>
                Adresse :{" "}
                {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}{" "}
              </p>
            </div>
          </div>
          {/* Product List  */}
          <div className="overflow-x-auto ">
            <h4 className="text-lg font-semibold mb-4">Produits</h4>
            <table className="min-w-full text-gray-400 mb-4">
              <thead className="bg-ray-100">
                <tr>
                  <th className="py-2 px-4">Nom </th>
                  <th className="py-2 px-4">Prix unitaire </th>
                  <th className="py-2 px-4">Quantité </th>
                  <th className="py-2 px-4"> Total </th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems.map((items) => {
                  return (
                    <tr key={items.productId} className="border-b">
                      <td className="py-2 px-4 flex items-center">
                        <img
                          src={items.image}
                          alt={items.name}
                          className="w-12 h-1/2 object-cover mr-4"
                        />
                        <Link
                          to={`/product/${items.productId}`}
                          className="text-blue-500 hover:underline"
                        >
                          {items.name}
                        </Link>
                      </td>
                      <td className="py-2 px-4 ">DT{items.price}</td>
                      <td className="py-2 px-4 ">{items.quantity}</td>
                      <td className="py-2 px-4 ">
                        DT{items.price * items.quantity}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Link to="/my-orders" className="text-blue-500 hover:underline">
            Retour a mes commandes
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
