import React from "react";

const AboutPage = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
        A propos de nous
      </h1>
      <p className="text-slate-600 mb-6">
        Thermal Care est une plateforme specialisee dans les produits de
        parapharmacie, de soin et de bien-etre. Notre mission est de proposer
        des produits fiables, accessibles et selectionnes avec exigence.
      </p>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-slate-700">
        <p>
          Nous collaborons avec des marques reconnues afin de garantir la
          qualite, la tracabilite et la securite de chaque produit.
        </p>
        <p>
          Notre engagement : offrir une experience client simple, un service
          reactif et une livraison rapide partout en Tunisie.
        </p>
      </div>
    </section>
  );
};

export default AboutPage;
