"use client";

import Image from "next/image";
import { useState } from "react";
import { FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi'; // Install react-icons if not already installed
import toast from "react-hot-toast";

interface MenuItemCardProps {
  name: string;
  description: string;
  price: string;
  img: string;
  onAddToCart: (quantity: number) => void;
}

export function MenuItemCard({ name, description, price, img, onAddToCart }: MenuItemCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(quantity);
    toast.success(`${quantity} × ${name} added to cart`, {
      duration: 3000,
      position: "top-center",
    });
  };

  return (
    <div 
      className="border border-blue-gray-100 shadow-lg transform transition-all duration-300 hover:scale-105 rounded-xl bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-56 relative overflow-hidden rounded-t-xl">
        <Image
          src={img}
          alt={name}
          width={500}
          height={500}
          className="h-full w-full object-cover transform transition-transform duration-300 hover:scale-110"
        />
        <div className={`absolute inset-0 bg-black bg-opacity-40 transition-opacity duration-300 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-white text-lg font-semibold text-shadow">Click to Order</span>
        </div>
      </div>
      <div className="text-center p-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-lg text-blue-gray-900">{name}</span>
          <span className="font-bold text-lg text-blue-600">{price}</span>
        </div>
        <p className="text-gray-600 font-normal mb-4">{description}</p>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center justify-center gap-4 bg-gray-50 p-2 rounded-full">
            <button
              className="p-2 rounded-full hover:bg-blue-gray-50 text-blue-gray-900"
              type="button"
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
            >
              <FiMinus className="h-4 w-4" />
            </button>
            <span className="w-16 text-center font-medium">{quantity}</span>
            <button
              className="p-2 rounded-full hover:bg-blue-gray-50 text-blue-gray-900"
              type="button"
              onClick={() => setQuantity(q => q + 1)}
            >
              <FiPlus className="h-4 w-4" />
            </button>
          </div>
          <button
            className="flex items-center justify-center gap-2 rounded-full shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-1 bg-blue-500 text-white text-lg font-semibold px-6 py-3 w-full"
            type="button"
            onClick={handleAddToCart}
          >
            <FiShoppingCart className="h-5 w-5" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItemCard; 