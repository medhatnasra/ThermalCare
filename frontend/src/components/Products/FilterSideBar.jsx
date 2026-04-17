import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { CATEGORY_OPTIONS } from "../../constants/productOptions";

const DEFAULT_MAX_PRICE = 500;

const FilterSideBar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "",
    color: "",
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: DEFAULT_MAX_PRICE,
  });

  const [filterOptions, setFilterOptions] = useState({
    brands: [],
    materials: [],
  });

  const [priceRange, setPriceRange] = useState([0, DEFAULT_MAX_PRICE]);

  const colors = [
    "Red",
    "Blue",
    "Black",
    "Green",
    "Yellow",
    "Gray",
    "White",
    "Pink",
  ];

  const categories = CATEGORY_OPTIONS;

  const materials = filterOptions.materials;
  const brands = filterOptions.brands;

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/products/filter-options",
        );
        setFilterOptions({
          brands: Array.isArray(data?.brands) ? data.brands : [],
          materials: Array.isArray(data?.materials) ? data.materials : [],
        });
      } catch (error) {
        console.error("Failed to load filter options", error);
      }
    };

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    setFilters({
      category: params.category || "",
      color: params.color || "",
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: Number(params.minPrice || 0),
      maxPrice: Number(params.maxPrice || DEFAULT_MAX_PRICE),
    });
    setPriceRange([0, Number(params.maxPrice || DEFAULT_MAX_PRICE)]);
  }, [searchParams]);

  const handleFilterChange = (e) => {
    const { name, value, checked, type } = e.target;

    const newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key] !== "" && newFilters[key] !== 0) {
        params.append(key, newFilters[key]);
      }
    });
    setSearchParams(params);
  };

  const handleColorSelect = (color) => {
    const nextColor = filters.color === color ? "" : color;
    const newFilters = { ...filters, color: nextColor };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const handlePriceChange = (e) => {
    const newPrice = Number(e.target.value);
    setPriceRange([0, newPrice]);
    const newFilters = { ...filters, minPrice: 0, maxPrice: newPrice };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      category: "",
      color: "",
      material: [],
      brand: [],
      minPrice: 0,
      maxPrice: DEFAULT_MAX_PRICE,
    };

    setFilters(resetFilters);
    setPriceRange([0, DEFAULT_MAX_PRICE]);
    setSearchParams(new URLSearchParams());
    navigate("?");
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-medium text-gray-800">Filtres</h3>
        <button
          type="button"
          onClick={clearFilters}
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Reinitialiser
        </button>
      </div>
      {/* Category Filter  */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">
          Categorie
        </label>
        <div className="flex items-center mb-1">
          <input
            type="radio"
            name="category"
            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
            value=""
            checked={filters.category === ""}
            onChange={handleFilterChange}
          />
          <span className="text-gray-700">Toutes</span>
        </div>
        {categories.map((category) => (
          <div className="flex items-center mb-1" key={category}>
            <input
              type="radio"
              name="category"
              className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              value={category}
              checked={filters.category === category}
              onChange={handleFilterChange}
            />
            <span className="text-gray-700">{category}</span>
          </div>
        ))}
      </div>
      {/* Color Section  */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Couleur</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              className={`w-8 h-8 rounded-full border cursor-pointer border-gray-300 transition hover:scale-105 ${
                filters.color === color ? "ring-2 ring-blue-500" : ""
              }`}
              style={{ backgroundColor: color.toLocaleLowerCase() }}
              onClick={() => handleColorSelect(color)}
              aria-label={`Couleur ${color}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Material Section  */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Matiere</label>
        {materials.length > 0 ? (
          materials.map((mat) => (
            <div className="flex items-center mb-1" key={mat}>
              <input
                type="checkbox"
                name="material"
                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                value={mat}
                checked={filters.material.includes(mat)}
                onChange={handleFilterChange}
              />
              <span className="text-gray-700">{mat}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Aucune matiere disponible</p>
        )}
      </div>

      {/* Brand Section  */}
      <div className="mb-6">
        <label className="block text-gray-600 font-medium mb-2">Marque</label>
        {brands.length > 0 ? (
          brands.map((brand) => (
            <div className="flex items-center mb-1" key={brand}>
              <input
                type="checkbox"
                name="brand"
                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300"
                value={brand}
                checked={filters.brand.includes(brand)}
                onChange={handleFilterChange}
              />
              <span className="text-gray-700">{brand}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Aucune marque disponible</p>
        )}
      </div>
      {/* Price Range Filter  */}

      <div className="mb-8">
        <label className="block text-gray-600 font-medium  mb-2">
          Prix max
        </label>

        <input
          type="range"
          name="pricerange"
          min={0}
          max={DEFAULT_MAX_PRICE}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full h-2  bg-gray-300 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-gray-600 mt-2 ">
          <span>0 DT</span>
          <span>DT{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSideBar;
