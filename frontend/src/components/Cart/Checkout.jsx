import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [CheckoutId, setCheckoutId] = useState(null);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // ensure cart is Loaded before proceeding

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (cart && cart.products.length > 0) {
      try {
        // Fetch product details for items missing images
        const checkoutItemsPromises = cart.products.map(async (product) => {
          let imageUrl = product.image || product.images?.[0]?.url;

          // If image is missing, fetch product details from backend
          if (!imageUrl) {
            try {
              const response = await axios.get(
                `http://localhost:5000/api/products/${product.productId}`,
              );
              imageUrl = response.data.images?.[0]?.url || "";
            } catch (fetchError) {
              console.warn(
                `Failed to fetch image for product ${product.name}:`,
                fetchError,
              );
            }
          }

          return {
            productId: product.productId,
            name: product.name || "Unnamed Product",
            image: imageUrl || "", // Image URL (required by backend)
            price: Number(product.price) || 0,
            quantity: product.quantity || 1,
            size: product.size,
            color: product.color,
          };
        });

        const checkoutItems = await Promise.all(checkoutItemsPromises);

        // Validate that all items have images
        const missingImages = checkoutItems.filter((item) => !item.image);
        if (missingImages.length > 0) {
          console.error("Some products are missing images:", missingImages);
          alert(
            "Some products are missing images. Please refresh and try again.",
          );
          return;
        }

        console.log("Checkout Items:", checkoutItems); // Debug log

        const res = await dispatch(
          createCheckout({
            checkoutItems,
            shippingAddress,
            paymentMethod: "OnDelivery",
            totalPrice: cart.totalPrice,
          }),
        );
        if (res.payload && res.payload._id) {
          setCheckoutId(res.payload._id);
        }
      } catch (error) {
        console.error("Error preparing checkout:", error);
      }
    }
  };

  const handPaymentSuccess = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/checkout/${CheckoutId}/pay`,
        { paymentStatus: "paid" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      if (response.status === 200) {
        await handleFinalizeCheckout(CheckoutId);
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  const handleFinalizeCheckout = async (CheckoutId) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/checkout/${CheckoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      navigate("/order-confirmation");
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) return <p>Chargement du panier...</p>;
  if (error) return <p> Erreur : {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0)
    return <p>Votre panier est vide</p>;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Left Section  */}

      <div className="bg-white rounded-lg p-6 ">
        <h2 className="text-2xl uppercase mb-6">Commande</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Coordonnées</h3>
          <div className="mb-4">
            <label className="block text-gray-700">E-mail</label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="w-full p-2 border rounded"
              disabled
            />
          </div>
          <h3 className="text-lg mb-4"> Livraison</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="">
              <label className="block text-gray-700 ">Prénom</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={shippingAddress.firstName}
                required
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
              />
            </div>
            <div className="">
              <label className="block text-gray-700 ">Nom</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={shippingAddress.lastName}
                required
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">
              {" "}
              Adress
            </label>

            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border  "
              required
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4 ">
            <div className="">
              <label className="block text-gray-700 ">Ville</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={shippingAddress.city}
                required
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
              />
            </div>
            <div className="">
              <label className="block text-gray-700 ">Code postal</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={shippingAddress.postalCode}
                required
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">
              {" "}
              Pays
            </label>

            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-2 border  "
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="" className="block text-gray-700">
              {" "}
              Téléphone
            </label>

            <input
              type="text"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 border"
              required
            />
          </div>
          <div className="mt-6">
            {!CheckoutId ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded"
              >
                Continuer vers le paiement
              </button>
            ) : (
              <button
                onClick={() => handPaymentSuccess()}
                className="w-full bg-black text-white py-3 rounded"
              >
                Continuer vers le paiement
              </button>
            )}
          </div>
        </form>
      </div>
      {/* Right Section  */}
      <div className="bg-gray-50 rounded-lg">
        <h3 className="text-lg mb-4">Résumé de la commande</h3>

        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-2 border-b"
            >
              <div className="flex items-start">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-24 object-cover mr-4"
                  />
                ) : (
                  <div className="w-20 h-24 bg-gray-200 mr-4 flex items-center justify-center">
                    <span className="text-xs text-gray-400">No image</span>
                  </div>
                )}
                <div className="">
                  <h3 className="text-md"> {product.name}</h3>
                  <div className="text-gray-500"> Taille : {product.size} </div>
                  <div className="text-gray-500">
                    {" "}
                    Couleur : {product.color}{" "}
                  </div>
                </div>
              </div>
              <p className="text-xl">
                {" "}
                TND{Number(product.price)?.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Sous-total</p>
          <p>TND{cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Livraison</p>
          <p>Gratuit</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Total</p>
          <p>TND{cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

