import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  const handleAddtoCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        }),
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };
  return (
    <div>
      {cart.products.map((product, index) => {
        return (
          <div>
            <div
              key={index}
              className="flex items-start justify-between py-4 border-b"
            >
              <div className="flex items-start">
                {product.image?.url || product.images?.[0]?.url ? (
                  <img
                    src={product.image?.url || product.images?.[0]?.url}
                    alt={product.name}
                    className="w-20 h-24 object-cover mr-4 rounded "
                  />
                ) : (
                  <div className="w-20 h-24 bg-gray-200 mr-4 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-400">No image</span>
                  </div>
                )}
              </div>
              <div className="">
                <h3>{product.name}</h3>
                <p className="text-sm text-gray-500">
                  size : {product.size} | color : {product.color}
                </p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() =>
                      handleAddtoCart(
                        product.productId,
                        -1,
                        product.quantity,
                        product.size,
                        product.color,
                      )
                    }
                    className="border rounded px-2 py-1 text-xl font-medium"
                  >
                    -
                  </button>
                  <span className="mx-4">{product.quantity}</span>
                  <button
                    onClick={() =>
                      handleAddtoCart(
                        product.productId,
                        1,
                        product.quantity,
                        product.size,
                        product.color,
                      )
                    }
                    className="border rounded px-2 py-1 text-xl font-medium"
                  >
                    +
                  </button>
                </div>
              </div>
              <p>DT {product.price.toLocaleString()}</p>
              <button
                onClick={() =>
                  handleRemoveFromCart(
                    product.productId,
                    product.size,
                    product.color,
                  )
                }
              >
                <RiDeleteBin3Line className="h-6 w-6 mt-2 text-red-600" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartContents;
