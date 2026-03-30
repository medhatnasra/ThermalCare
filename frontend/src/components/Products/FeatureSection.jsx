import React from "react";
import {
  HiArrowPathRoundedSquare,
  HiOutlineCreditCard,
  HiShoppingBag,
} from "react-icons/hi2";

const FeatureSection = () => {
  return (
    <section className="py-16 bg-white px-4">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-7 text-center">
        {/* Feature 1  */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4">
            <HiShoppingBag className="text-xl" />
          </div>
          <h4 className="tracking-tigher mb-2">
            LIVRAISON INTERNATIONALE GRATUITE
          </h4>
          <p className="text-gray-600 text-sm ">
            Sur toutes les commandes de plus de 100 TND
          </p>
          {/* Feature 2 */}
        </div>
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4">
            <HiArrowPathRoundedSquare className="text-xl" />
          </div>
          <h4 className="tracking-tigher mb-2">RETOUR SOUS 45 JOURS</h4>
          <p className="text-gray-600 text-sm ">Garantie de remboursement</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full mb-4">
            <HiOutlineCreditCard className="text-xl" />
          </div>
          <h4 className="tracking-tigher mb-2">PAIEMENT SÉCURISÉ</h4>
          <p className="text-gray-600 text-sm ">
            Processus de paiement 100% sécurisé
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
