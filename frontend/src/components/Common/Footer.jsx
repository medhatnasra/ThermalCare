import React from "react";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXFill } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { Link } from "react-router-dom";
import { FiPhoneCall } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
        <div className="">
          <h3 className="text-lg text-gray-800 mb-4">Infolettre</h3>
          <p className="text-gray-500 mb-4">
            Soyez le premier à découvrir nos produits, événements exclusifs et
            offres en ligne.
          </p>
          <p className="font-medium text-sm text-gray-600 mb-6">
            Inscrivez-vous et obtenez 10% de réduction sur votre première
            commande.
          </p>
          <form className="flex" action="">
            <input
              type="email"
              placeholder="Entrez votre e-mail"
              className="p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800 transition-all"
            >
              S'abonner
            </button>
          </form>
        </div>
        {/* Lien Boutique */}
        <div className="">
          <h3 className="text-lg text-gray-800 mb-4"> Boutique</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link
                to="/collection/all?category=Soins%20Visage"
                className="hover:text-black transition-colors"
              >
                Soins Visage
              </Link>
            </li>
            <li>
              <Link
                to="/collection/all?category=Soins%20Corps"
                className="hover:text-black transition-colors"
              >
                Soins Corps
              </Link>
            </li>
            <li>
              <Link
                to="/collection/all?category=Soins%20Cheveux"
                className="hover:text-black transition-colors"
              >
                Suppléments
              </Link>
            </li>
            <li>
              <Link
                to="/collection/all?collection=Soins%20Naturels"
                className="hover:text-black transition-colors"
              >
                Bien-être
              </Link>
            </li>
          </ul>
        </div>
        <div className="">
          <h3 className="text-lg text-gray-800 mb-4"> Assistance</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link
                to="/nous-contacter"
                className="hover:text-black transition-colors"
              >
                Nous Contacter
              </Link>
            </li>
            <li>
              <Link
                to="/a-propos"
                className="hover:text-black transition-colors"
              >
                À Propos de Nous{" "}
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-black transition-colors">
                FAQ{" "}
              </Link>
            </li>
            <li>
              <Link
                to="/fonctionnalites"
                className="hover:text-black transition-colors"
              >
                Fonctionnalités{" "}
              </Link>
            </li>
          </ul>
        </div>
        {/* Suivez-nous  */}
        <div className="">
          <h3 className="text-lg text-gray-800 mb-4">Suivez-nous</h3>
          <div className="flex items-center space-x-4 mb-6">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer "
              className="hover:text-gray-300"
            >
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer "
              className="hover:text-gray-300"
            >
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer "
              className="hover:text-gray-300"
            >
              <RiTwitterXFill className="h-4 w-4" />
            </a>
          </div>
          <p className="text-gray-500">Appelez-nous</p>
          <p>
            <FiPhoneCall className="inline-block mr-2" />
            +21699401318
          </p>
        </div>
      </div>
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-sm text-gray-500 tracking-tighter text-center">
          2026, Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
