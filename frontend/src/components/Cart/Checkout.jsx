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
  const [paymentMethod, setPaymentMethod] = useState("OnDelivery");
  const [paymentError, setPaymentError] = useState("");
  const [cardDetails, setCardDetails] = useState({
    cardHolder: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

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

  const validateCardDetails = () => {
    if (paymentMethod !== "Card") return true;

    const normalizedCardNumber = cardDetails.cardNumber.replace(/\s+/g, "");
    const expiryRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
    const cvvRegex = /^\d{3}$/;

    if (!cardDetails.cardHolder.trim()) {
      setPaymentError("Veuillez saisir le nom du titulaire de la carte.");
      return false;
    }
    if (!/^\d{13,19}$/.test(normalizedCardNumber)) {
      setPaymentError("Le numero de carte est invalide.");
      return false;
    }
    if (!expiryRegex.test(cardDetails.expiryDate.trim())) {
      setPaymentError("La date d'expiration doit etre au format MM/AA.");
      return false;
    }

    const [, monthStr, yearStr] = cardDetails.expiryDate
      .trim()
      .match(expiryRegex);
    const month = Number(monthStr);
    const year = Number(yearStr);
    const minYear = 26;
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (year < minYear) {
      setPaymentError("L'annee d'expiration doit etre 2026 ou plus.");
      return false;
    }

    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      setPaymentError("La carte est expiree.");
      return false;
    }

    if (!cvvRegex.test(cardDetails.cvv.trim())) {
      setPaymentError("Le code CVV doit contenir exactement 3 chiffres.");
      return false;
    }

    setPaymentError("");
    return true;
  };

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    setPaymentError("");

    if (!validateCardDetails()) return;

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
            name: product.name || "Produit sans nom",
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
          console.error("Des produits n'ont pas d'image :", missingImages);
          alert(
            "Certaines images de produits sont manquantes. Veuillez rafraichir la page et reessayer.",
          );
          return;
        }

        const res = await dispatch(
          createCheckout({
            checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice: cart.totalPrice,
          }),
        );

        if (!res.payload?._id) {
          setPaymentError(
            "Impossible de creer la commande. Veuillez reessayer.",
          );
          return;
        }

        const checkoutId = res.payload._id;

        if (paymentMethod === "Card") {
          await handlePaymentSuccess(checkoutId);
          return;
        }

        await handleFinalizeCheckout(checkoutId);
      } catch (error) {
        console.error("Erreur lors de la preparation du checkout :", error);
        setPaymentError("Une erreur est survenue. Veuillez reessayer.");
      }
    }
  };

  const handlePaymentSuccess = async (checkoutId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: {
            cardHolder: cardDetails.cardHolder,
            cardNumberLast4: cardDetails.cardNumber
              .replace(/\s+/g, "")
              .slice(-4),
            expiryDate: cardDetails.expiryDate,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        },
      );
      if (response.status === 200) {
        await handleFinalizeCheckout(checkoutId);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentError("Le paiement par carte a echoue. Veuillez reessayer.");
    }
  };

  const handleFinalizeCheckout = async (CheckoutId) => {
    try {
      await axios.post(
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

  const formattedCardNumber = cardDetails.cardNumber
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();
  const cardHolderPreview = cardDetails.cardHolder.trim() || "NOM DU TITULAIRE";
  const cardExpiryPreview = cardDetails.expiryDate || "MM/AA";

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

          <h3 className="text-lg mb-3">Paiement</h3>
          <div className="mb-4 space-y-3">
            <label
              className={`flex items-center justify-between gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                paymentMethod === "OnDelivery"
                  ? "border-black bg-gray-100"
                  : "border-gray-300 bg-white"
              }`}
            >
              <span className="text-gray-800 font-medium">
                Paiement a la livraison
              </span>
              <input
                type="radio"
                name="paymentMethod"
                value="OnDelivery"
                checked={paymentMethod === "OnDelivery"}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setPaymentError("");
                }}
              />
            </label>
            <label
              className={`flex items-center justify-between gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                paymentMethod === "CashDesk"
                  ? "border-black bg-gray-100"
                  : "border-gray-300 bg-white"
              }`}
            >
              <span className="text-gray-800 font-medium">
                Payer par caisse
              </span>
              <input
                type="radio"
                name="paymentMethod"
                value="CashDesk"
                checked={paymentMethod === "CashDesk"}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setPaymentError("");
                }}
              />
            </label>
            <label
              className={`flex items-center justify-between gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                paymentMethod === "Card"
                  ? "border-black bg-gray-100"
                  : "border-gray-300 bg-white"
              }`}
            >
              <span className="text-gray-800 font-medium">Payer par carte</span>
              <input
                type="radio"
                name="paymentMethod"
                value="Card"
                checked={paymentMethod === "Card"}
                onChange={(e) => {
                  setPaymentMethod(e.target.value);
                  setPaymentError("");
                }}
              />
            </label>
          </div>

          {paymentMethod === "Card" && (
            <div className="mb-4 rounded-xl border border-gray-200 p-4 bg-white shadow-sm">
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-md border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-bold text-blue-700">
                  VISA
                </span>
                <span className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1 text-sm font-semibold text-gray-800">
                  <span className="relative inline-flex h-4 w-7 items-center">
                    <span className="absolute left-0 h-4 w-4 rounded-full bg-red-500" />
                    <span className="absolute left-2 h-4 w-4 rounded-full bg-yellow-400 opacity-90" />
                  </span>
                  Mastercard
                </span>
              </div>

              <div className="mb-4 rounded-xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-700 p-4 text-white shadow-lg">
                <div className="mb-6 flex items-center justify-between">
                  <span className="inline-flex h-7 w-10 rounded-md bg-yellow-200/80" />
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-200">
                    Carte bancaire
                  </span>
                </div>
                <p className="mb-4 text-lg tracking-[0.2em]">
                  {formattedCardNumber || "0000 0000 0000 0000"}
                </p>
                <div className="flex items-end justify-between">
                  <p className="text-xs uppercase text-slate-300">
                    {cardHolderPreview}
                  </p>
                  <p className="text-sm text-slate-100">{cardExpiryPreview}</p>
                </div>
              </div>

              <h4 className="font-semibold mb-3 text-gray-800">
                Informations de carte
              </h4>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Nom du titulaire
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-black focus:outline-none"
                  value={cardDetails.cardHolder}
                  onChange={(e) =>
                    setCardDetails((prev) => ({
                      ...prev,
                      cardHolder: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="mb-3">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Numero de carte
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-black focus:outline-none"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.cardNumber}
                  onChange={(e) =>
                    setCardDetails((prev) => ({
                      ...prev,
                      cardNumber: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 16)
                        .replace(/(.{4})/g, "$1 ")
                        .trim(),
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Expiration (MM/AA)
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-black focus:outline-none"
                    placeholder="MM/AA"
                    value={cardDetails.expiryDate}
                    onChange={(e) =>
                      setCardDetails((prev) => {
                        const rawValue = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4);
                        const formattedValue =
                          rawValue.length > 2
                            ? `${rawValue.slice(0, 2)}/${rawValue.slice(2)}`
                            : rawValue;
                        return {
                          ...prev,
                          expiryDate: formattedValue,
                        };
                      })
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    CVV
                  </label>
                  <input
                    type="password"
                    className="w-full rounded-lg border border-gray-300 p-2.5 focus:border-black focus:outline-none"
                    placeholder="123"
                    value={cardDetails.cvv}
                    inputMode="numeric"
                    onChange={(e) =>
                      setCardDetails((prev) => ({
                        ...prev,
                        cvv: e.target.value.replace(/\D/g, "").slice(0, 3),
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {paymentError && (
            <p className="mb-4 text-sm text-red-600">{paymentError}</p>
          )}

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded"
            >
              Confirmer et continuer
            </button>
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
                DT{Number(product.price)?.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Sous-total</p>
          <p>DT{cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Livraison</p>
          <p>Gratuit</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>Total</p>
          <p>DT{cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
