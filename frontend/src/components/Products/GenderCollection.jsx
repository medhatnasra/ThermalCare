import React from "react";
import mensCollectionImage from "../../assets/mens-collection.jpg";
import womensColloctionImage from "../../assets/womens-collection.jpg";
import { Link } from "react-router-dom";

const GenderCollection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        <div className="relative flex-1">
          <img
            src={womensColloctionImage}
            alt="Collection Femmes"
            className="w-full h-175 object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {" "}
              Collection Femmes
            </h1>
            <Link
              to="/collection/all?category=Femme"
              className="text-gray-900 underline"
            >
              Acheter maintenant
            </Link>
          </div>
        </div>
        <div className="relative flex-1">
          <img
            src={mensCollectionImage}
            alt="Collection Hommes"
            className="w-full h-175 object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-white p-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {" "}
              Collection Hommes
            </h1>
            <Link
              to="/collection/all?category=Homme"
              className="text-gray-900 underline"
            >
              Acheter maintenant
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollection;
