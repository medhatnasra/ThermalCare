import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const Hero = () => {
  const [products, setProducts] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchHeroProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products?collection=all&limit=12",
        );
        setProducts(response.data || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHeroProducts();
  }, []);

  const carouselProducts = useMemo(() => {
    const promo = products.filter(
      (product) => Number(product.discountPrice || 0) > 0,
    );
    const source = promo.length > 0 ? promo : products;
    return source.slice(0, 5);
  }, [products]);

  useEffect(() => {
    if (carouselProducts.length <= 1) return undefined;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselProducts.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [carouselProducts]);

  const activeProduct =
    carouselProducts[activeIndex] || carouselProducts[0] || null;

  return (
    <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/15 bg-white/5 p-7 md:p-10 text-white backdrop-blur-sm">
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-200 font-semibold">
              Parapharmacie premium
            </p>
            <h1 className="mt-3 text-4xl md:text-6xl font-semibold leading-tight">
              Votre sante,
              <br /> notre exigence quotidienne
            </h1>
            <p className="mt-4 max-w-xl text-sm md:text-base text-slate-200">
              Découvrez une selection professionnelle de soins, testée pour
              garantir efficacite, confiance et résultats visibles.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#promo-produits"
                className="rounded-lg bg-rose-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Voir les promotions
              </a>
              <Link
                to="/collection/all"
                className="rounded-lg border border-white/60 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
              >
                Explorer les produits
              </Link>
            </div>

            <div className="mt-6 rounded-xl border border-cyan-300/20 bg-cyan-400/10 p-4 text-sm text-cyan-100">
              Les promotions changent automatiquement selon les produits en
              stock.
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-900 shadow-xl">
            {activeProduct ? (
              <>
                <img
                  src={activeProduct.images?.[0]?.url}
                  alt={activeProduct.images?.[0]?.altText || activeProduct.name}
                  className="h-[420px] w-full object-cover md:h-[520px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent"></div>

                <div className="absolute left-5 right-5 bottom-5 rounded-2xl border border-white/20 bg-white/10 p-5 text-white backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">
                    Carrousel promotions
                  </p>
                  <h3 className="mt-2 text-xl md:text-2xl font-semibold line-clamp-2">
                    {activeProduct.name}
                  </h3>

                  <div className="mt-3 flex items-center gap-2">
                    {Number(activeProduct.discountPrice || 0) > 0 ? (
                      <>
                        <span className="text-lg font-semibold text-rose-300">
                          {Number(activeProduct.discountPrice).toFixed(2)} TND
                        </span>
                        <span className="text-sm line-through text-slate-300">
                          {Number(activeProduct.price || 0).toFixed(2)} TND
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-semibold text-cyan-200">
                        {Number(activeProduct.price || 0).toFixed(2)} TND
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/product/${activeProduct._id}`}
                    className="mt-4 inline-flex rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100"
                  >
                    Voir le produit
                  </Link>
                </div>

                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
                  {carouselProducts.map((item, index) => (
                    <button
                      key={item._id || index}
                      onClick={() => setActiveIndex(index)}
                      className={`h-2.5 rounded-full transition-all ${
                        activeIndex === index
                          ? "w-8 bg-white"
                          : "w-2.5 bg-white/50 hover:bg-white/80"
                      }`}
                    ></button>
                  ))}
                </div>
              </>
            ) : (
              <div className="grid h-[420px] place-items-center text-slate-300 md:h-[520px]">
                Chargement des produits...
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
