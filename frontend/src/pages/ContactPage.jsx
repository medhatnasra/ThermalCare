import React from "react";

const ContactPage = () => {
  return (
    <section className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
        Nous contacter
      </h1>
      <p className="text-slate-600 mb-8">
        Notre equipe est a votre disposition pour toute question sur les
        produits, les commandes, la livraison ou les retours.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Coordonnees</h2>
          <p className="mb-2 text-slate-700">Email : contact@thermalcare.tn</p>
          <p className="mb-2 text-slate-700">Telephone : +216 53 225 369</p>
          <p className="text-slate-700">Adresse : Tunis, Tunisie</p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Horaires</h2>
          <p className="mb-2 text-slate-700">
            Lundi - Vendredi : 08:30 - 18:00
          </p>
          <p className="mb-2 text-slate-700">Samedi : 09:00 - 14:00</p>
          <p className="text-slate-700">Dimanche : Ferme</p>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
