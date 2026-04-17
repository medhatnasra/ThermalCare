import React from "react";

const FaqPage = () => {
  const faqs = [
    {
      q: "Comment passer une commande ?",
      a: "Ajoutez vos produits au panier, validez votre adresse, puis confirmez le paiement.",
    },
    {
      q: "Quels sont les delais de livraison ?",
      a: "La livraison est generalement effectuee sous 24 a 72 heures selon la zone.",
    },
    {
      q: "Puis-je retourner un produit ?",
      a: "Oui, sous conditions. Contactez notre service client pour lancer la procedure de retour.",
    },
    {
      q: "Comment suivre ma commande ?",
      a: "Connectez-vous puis consultez la section Mes Commandes pour voir le statut en temps reel.",
    },
  ];

  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
        FAQ
      </h1>
      <div className="space-y-4">
        {faqs.map((item) => (
          <article
            key={item.q}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              {item.q}
            </h2>
            <p className="text-slate-700">{item.a}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default FaqPage;
