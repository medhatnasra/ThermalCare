import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearSelectedProduct,
  fetchProductDetails,
} from "../../redux/slices/productSlice";
import axios from "axios";
import {
  createProduct,
  updateProduct,
} from "../../redux/slices/adminProductSlice";

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

  const { id } = useParams();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products,
  );

  const [productData, setProductData] = useState({
    ...emptyProductData,
  });

  const [uploading, setUploading] = useState(false);

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
    setProductData((prevData) => ({ ...prevData, [name]: value }));
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

    if (id) {
      dispatch(updateProduct({ id, productData }));
    } else {
      dispatch(createProduct(productData));
    }

    navigate("/admin/products");
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
            required
          />
        </div>

        <div className="mb-6">
          <label className="block font-semibold mb-2">Prix promo</label>
          <input
            type="number"
            name="discountPrice"
            value={productData.discountPrice}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
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
            required
          />
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
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
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

        <div className="mb-6">
          <label className="block font-semibold mb-2">Genre</label>
          <select
            name="gender"
            value={productData.gender}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          >
            <option value="Unisexe">Unisexe</option>
            <option value="Men">Homme</option>
            <option value="Women">Femme</option>
          </select>
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
        <button
          className="w-full bg-green-400 text-white py-2 rounded-md hover:bg-green-600 transition-colors"
          type="submit"
        >
          {id ? "Mettre a jour le produit" : "Ajouter le produit"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
