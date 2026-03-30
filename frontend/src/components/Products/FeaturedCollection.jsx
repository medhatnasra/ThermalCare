import React from "react";
import { Link } from "react-router-dom";
import featured from "../../assets/featured.webp";
const FeaturedCollection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-green-50 rounded-3xl">
        {/* Left Content  */}
        <div className="lg:w-1/2 p-8 text-center lg:text-left">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Confort et Qualité
          </h2>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Produits conçus pour votre bien-être quotidien
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Découvrez des produits de haute qualité qui allient parfaitement
            efficacité et confort. Conçus pour vous aider à vous sentir bien
            chaque jour
          </p>
          <Link
            to="/collection/all"
            className="bg-black text-white px-6 py-3 rounded-lg text-lg"
          >
            Découvrir
          </Link>
        </div>
        {/* Right Content  */}

        <div className="lg:w-1/2">
          <img
            src={featured}
            alt=""
            className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl "
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
