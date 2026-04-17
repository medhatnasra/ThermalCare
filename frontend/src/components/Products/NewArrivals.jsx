import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(true);

  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/products/new-arrivals`,
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchNewArrivals();
  }, []);

  const scroll = (direction) => {
    const scrollAmout = direction === "left" ? -300 : 300;

    scrollRef.current.scrollBy({ left: scrollAmout, behaviour: "smooth" });
  };

  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const LeftScroll = container.scrollLeft;
      const rightScrollable =
        container.scrollWidth > LeftScroll + container.clientWidth;
      setCanScrollLeft(LeftScroll > 0);
      setCanScrollRight(rightScrollable);
    }
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;

    const walk = x - startX;

    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  }, [newArrivals]);
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto text-center mg-10 relative">
        <h2 className="text-3xl font-bold mg-4">Découvrez Nos Nouveautés</h2>
        <p className="text-lg mb-8 text-gray-800">
          Explorez nos derniers produits de parapharmacie, fraîchement ajoutés
          pour prendre soin de votre santé et bien-être.
        </p>

        {/* Scroll Buttons  */}

        <div className="absolute right-0 bottom-[-30px] flex space-x-2 ">
          <button
            className={`p-2 rounded border ${
              canScrollLeft
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`p-2 rounded border ${
              canScrollRight
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
        {/* Scrollable Content  */}

        <div
          className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {newArrivals.map((product) => (
            <div
              key={product._id}
              className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative"
            >
              <img
                src={product.images[0]?.url}
                alt={product.images[0]?.altText}
                className="w-full h-[500px] object-cover rounded-lg"
                draggable="false"
              />
              <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md text-white p-4 rounded-b-lg">
                <Link to={`/product/${product._id}`} className="block">
                  <h4 className="font-medium">{product.name} </h4>
                  <p className="mt-1"> ${product.price}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;

