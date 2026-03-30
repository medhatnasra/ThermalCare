import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 3);
    return orderDate.toLocaleDateString();
  };
  return (
    <div className="max-w-4xl mx-auto bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Merci pour votre commande
      </h1>
      {checkout && (
        <div className="p-6 rounded-lg border">
          <div className="flex justify-between mb-20">
            <div className="">
              <h2 className="text-xl font-semibold">
                Numéro de commande: {checkout._id}
              </h2>
              <p className="text-gray-500">
                Date de commande:{" "}
                {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* Livraison estimée  */}

            <div className="">
              <p className="text-emerald-700 text-sm">
                Livraison estimée:{" "}
                {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>
          {/* Articles commandés  */}
          <div className="mb-200">
            {checkout.checkoutItems.map((item) => (
              <div className="flex item-center mb-4 " key={item.productId}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div className="">
                  <h4 className="text-md font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.color} | {item.size}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md ">${item.price}</p>
                  <p className="text-sm text-gray-500"> {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-8">
            {/* Informations de paiement  */}
            <div className="">
              <h1 className="text-lg font-semibold mb-2">Paiement</h1>
              <div className="text-gray-600">Paiement à la livraison</div>
            </div>
            {/* Informations de livraison  */}

            <div className="">
              <h4 className="text-lg font-semibold mb-2">Livraison</h4>
              <p className="text-gray-600">
                {checkout.shippingAddress.address}
              </p>
              <p className="text-gray-600">
                {" "}
                {checkout.shippingAddress.city} ,{" "}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
