import React, { useEffect, useState } from "react";

import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products,
  );

  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  const handleQuantity = (action) => {
    if (action === "plus") {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => prev - 1);
    }
  };
  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url || null);
    } else {
      setMainImage(null);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error(
        "Veuillez sélectionner une taille et une couleur avant d'ajouter au panier.",
        {
          duration: 1000,
        },
      );
      return;
    }
    setIsButtonDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      }),
    ).then(() => {
      toast
        .success("Produit ajouté au panier!", {
          duration: 1000,
        })
        .finally(() => {
          setIsButtonDisabled(false);
        });
    });
  };
  if (loading) {
    return <p>Chargement...</p>;
  }
  if (error) {
    return <p>Erreur : {error}</p>;
  }
  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <div className="flex flex-col md:flex-row">
            {/* Left thum */}

            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images?.map((image, index) => {
                const thumb = image?.url || "";
                return (
                  <img
                    src={thumb || undefined}
                    alt={image?.altText || "Product thumbnail"}
                    key={index}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                      mainImage === thumb ? "border-black" : "border-gray-300"
                    }`}
                    onClick={() => {
                      if (thumb) setMainImage(thumb);
                    }}
                  />
                );
              })}
            </div>
            <div className="md:w-1/2">
              <div className="mb-4">
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt="Main Product"
                    className="w-full h-auto object-cover rounded-lg"
                  />
                ) : null}
              </div>
            </div>
            {/* Mobile thum */}

            <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
              {selectedProduct.images?.map((image, index) => {
                const thumb = image?.url || "";
                return (
                  <img
                    src={thumb || undefined}
                    alt={image?.altText || "Product thumbnail"}
                    key={index}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                      mainImage === thumb ? "border-black" : "border-gray-300"
                    }`}
                    onClick={() => {
                      if (thumb) setMainImage(thumb);
                    }}
                  />
                );
              })}
            </div>
            {/* Right Side  */}

            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {selectedProduct.name}
              </h1>

              <p className="text-lg text-gray-600 mb-1 line-through">
                {selectedProduct.originalPrice &&
                  `${selectedProduct.originalPrice}`}
              </p>
              <p className="text-xl text-gray-500 mb-2">
                $ {selectedProduct.price}
              </p>
              <p className="text-gray-600 mb-4">
                {selectedProduct.description}
              </p>
              <div className="mb-4 ">
                <p className="text-gray-700 ">Couleur : </p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full border cursor-pointer ${
                        selectedColor === color
                          ? "border-4 border-black"
                          : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        filter: "brightness(0.5)",
                      }}
                      onClick={() => setSelectedColor(color)}
                    ></button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <p className="text-gray-700"> Taille : </p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      className={`px-4 py-2 rounded border ${
                        selectedSize === size ? "bg-black text-white" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <p className="text-gray-700">Quantité : </p>

                <div className="flex items-center space-x-4 mt-2">
                  <button
                    onClick={() => handleQuantity("minus")}
                    className="px-2 py-1 bg-gray-400 rounded text-lg"
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>

                  <button
                    className="px-2 py-1 bg-gray-400 rounded text-lg"
                    onClick={() => handleQuantity("plus")}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                  isButtonDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-900"
                }`}
                onClick={handleAddToCart}
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Ajout en cours..." : "AJOUTER AU PANIER"}
              </button>
              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4"> Caractéristiques : </h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    <tr>
                      <td className="py-1">Marque</td>
                      <td className="py-1">{selectedProduct.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Matière</td>
                      <td className="py-1">{selectedProduct.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="mt-20">
            <h2 className="text-2xl text-center font-medium mb-4">
              Vous aimerez aussi
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
