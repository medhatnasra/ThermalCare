import React from "react";

const FeaturesPage = () => {
  const features = [
    "Catalogue de produits avec filtres intelligents",
    "Gestion du panier et commande securisee",
    "Compte client avec historique des commandes",
    "Gestion des favoris pour retrouver vos produits rapidement",
    "Tableau de bord administrateur et gestion des promotions",
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
        Fonctionnalites
      </h1>
      <p className="text-slate-600 mb-6">
        Decouvrez les principales fonctionnalites de notre plateforme pour une
        experience d'achat fluide et moderne.
      </p>
      <ul className="space-y-3">
        {features.map((feature) => (
          <li
            key={feature}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm"
          >
            {feature}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FeaturesPage;
