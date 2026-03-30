import React from "react";
import HeroImg from "../../assets/rabbit-hero.jpg";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative">
      <img
        src={HeroImg}
        alt=""
        className="w-full h-[400px] md:h-[600px] lg:h-[750ps] object-cover"
      />
      <div className="absolute inset-0 bg-black opacity-65 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
            Votre Santé <br /> Notre Priorité
          </h1>
          <p className="text-sm tracking-tighter md:text-lg mb-6">
            Découvrez nos produits de parapharmacie avec livraison rapide
            partout dans le monde.
          </p>
          <Link
            to="/collection/all"
            className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg  "
          >
            Découvrir
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
