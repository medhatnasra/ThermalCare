import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  clearSelectedProduct,
  fetchProductDetails,
} from "../../redux/slices/productSlice";
import axios from "axios";
import {
  createProduct,
  updateProduct,
} from "../../redux/slices/adminProductSlice";
import { CATEGORY_OPTIONS } from "../../constants/productOptions";

const emptyProductData = {
  name: "",
  description: "",
  price: 0,
  discountPrice: 0,
  countInStock: 0,
  sku: "",
  category: "",
  brand: "",
  sizes: [],
  colors: [],
  collections: "",
  material: "",
  gender: "Unisexe",
  images: [],
};

const EditProductPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products,
  );

  const [productData, setProductData] = useState({
    ...emptyProductData,
  });
  const [formErrors, setFormErrors] = useState({});

  const [uploading, setUploading] = useState(false);
  const routeBase = location.pathname.startsWith("/personnel")
    ? "/personnel/products"
    : "/admin/products";

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    } else {
      dispatch(clearSelectedProduct());
      setProductData({ ...emptyProductData });
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && selectedProduct) {
      setProductData(selectedProduct);
    }

    if (!id) {
      setProductData({ ...emptyProductData });
    }
  }, [id, selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["price", "discountPrice", "countInStock"].includes(name)) {
      const numericValue = Number(value);
      if (value !== "" && numericValue < 0) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          [name]: "La valeur ne peut pas etre negative.",
        }));
      } else {
        setFormErrors((prevErrors) => {
          const nextErrors = { ...prevErrors };
          delete nextErrors[name];
          return nextErrors;
        });
      }
    }

    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validateForm = () => {
    const errors = {};

    if (Number(productData.price) < 0) {
      errors.price = "Le prix ne peut pas etre negatif.";
    }
    if (Number(productData.discountPrice) < 0) {
      errors.discountPrice = "Le prix promo ne peut pas etre negatif.";
    }
    if (Number(productData.countInStock) < 0) {
      errors.countInStock = "Le stock ne peut pas etre negatif.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `http://localhost:5000/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (err) {
      console.log(err);
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (id) {
      dispatch(updateProduct({ id, productData }));
    } else {
      dispatch(createProduct(productData));
    }

    navigate(routeBase);
  };

  if (loading) return <p>Loading ...</p>;
  if (error) return <p>Error : {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md  ">
      <h2 className="text-3xl font-bold mb-6">
        {id ? "Modifier le produit" : "Ajouter un produit"}
      </h2>
      <form onSubmit={handleSubmit}>
        {/* Name  */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Nom du produit</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        {/* Description  */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            className="w-full border border-gray-300 rounded-md p-2"
            required
            rows={4}
            onChange={handleChange}
          />
        </div>
        {/* Price  */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Prix</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            min="0"
            required
          />
          {formErrors.price && (
            <p className="mt-1 text-sm text-red-600">{formErrors.price}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Prix promo</label>
          <input
            type="number"
            name="discountPrice"
            value={productData.discountPrice}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            min="0"
          />
          {formErrors.discountPrice && (
            <p className="mt-1 text-sm text-red-600">
              {formErrors.discountPrice}
            </p>
          )}
        </div>
        {/* Count In Stock  */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            min="0"
            required
          />
          {formErrors.countInStock && (
            <p className="mt-1 text-sm text-red-600">
              {formErrors.countInStock}
            </p>
          )}
        </div>

        {/* SKU  */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Categorie</label>
          <select
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Selectionner une categorie</option>
            {CATEGORY_OPTIONS.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
            {productData.category &&
            !CATEGORY_OPTIONS.includes(productData.category) ? (
              <option value={productData.category}>
                {productData.category}
              </option>
            ) : null}
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Collection</label>
          <input
            type="text"
            name="collections"
            value={productData.collections}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Marque</label>
          <input
            type="text"
            name="brand"
            value={productData.brand}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Materiau</label>
          <input
            type="text"
            name="material"
            value={productData.material}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Sizes  */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Tailles (separees par des virgules)
          </label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((size) => size.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Color  */}

        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Couleurs (separees par des virgules)
          </label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((color) => color.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* Image Upload  */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Importer une image</label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p>Telechargement de l'image...</p>}
          <div className="flex gap-4 mt-4 ">
            {productData.images.map((image, index) => (
              <div key={index} className="">
                <img
                  src={image.url}
                  alt=""
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex items-center gap-3">
          <button
            className="bg-green-500 text-white px-4 py-1.5 text-sm rounded-md hover:bg-green-600 transition-colors"
            type="submit"
          >
            {id ? "Mettre a jour le produit" : "Ajouter le produit"}
          </button>
          <button
            className="bg-gray-200 text-gray-800 px-4 py-1.5 text-sm rounded-md hover:bg-gray-300 transition-colors"
            type="button"
            onClick={() => navigate(routeBase)}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
