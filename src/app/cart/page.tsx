"use client";

import { Navbar, Footer } from "@/components";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiPhone } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import toast from 'react-hot-toast';

interface CartItem {
  name: string;
  price: number;
  quantity: number;
  img: string;
  description: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    const total = cart.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    setCartTotal(total);
  }, [cart]);

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart(prev => {
      const updated = [...prev];
      updated[index].quantity = newQuantity;
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckout = () => {
    if (!session) {
      toast.error('Please sign in to continue');
      return;
    }
    setShowPhoneDialog(true);
  };

  const validatePhoneNumber = (number: string) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!number) {
      return "Phone number is required";
    }
    if (!phoneRegex.test(number)) {
      return "Please enter a valid 10-digit Indian phone number";
    }
    return "";
  };

  const handlePhoneSubmit = () => {
    const error = validatePhoneNumber(phoneNumber);
    if (error) {
      setPhoneError(error);
      return;
    }

    // Save phone number with order details
    localStorage.setItem('userPhone', phoneNumber);
    setShowPhoneDialog(false);
    router.push('/order-confirmation');
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-32">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/menu-page">
            <button
              className="flex items-center gap-2 px-4 py-2 text-blue-gray-700 hover:bg-blue-gray-50 rounded transition-colors border border-blue-gray-100"
              type="button"
            >
              <FiArrowLeft className="h-4 w-4" /> Back to Menu
            </button>
          </Link>
          <h2 className="text-4xl font-bold text-blue-gray-900">
            Your Cart
          </h2>
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <h4 className="mb-4 text-2xl font-bold text-blue-gray-900">Your cart is empty</h4>
            <Link href="/menu-page">
              <button className="px-6 py-3 rounded bg-blue-500 text-white text-lg font-semibold hover:bg-blue-600 transition-colors">
                Browse Menu
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cart.map((item, index) => (
                <div key={index} className="mb-4 overflow-hidden bg-white rounded-lg shadow">
                  <div className="flex gap-4 p-4">
                    <div className="w-24 h-24 relative rounded-xl overflow-hidden">
                      <Image
                        src={item.img}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h6 className="text-lg font-semibold text-blue-gray-900">{item.name}</h6>
                          <p className="text-sm text-gray-500 font-normal">{item.description}</p>
                        </div>
                        <h6 className="text-lg font-semibold text-blue-gray-900">₹{item.price}</h6>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 rounded-full hover:bg-blue-100 text-blue-gray-700 transition-colors"
                            type="button"
                            onClick={() => updateQuantity(index, item.quantity - 1)}
                          >
                            <FiMinus className="h-4 w-4" />
                          </button>
                          <span className="w-12 text-center inline-block">{item.quantity}</span>
                          <button
                            className="p-2 rounded-full hover:bg-blue-100 text-blue-gray-700 transition-colors"
                            type="button"
                            onClick={() => updateQuantity(index, item.quantity + 1)}
                          >
                            <FiPlus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                          type="button"
                          onClick={() => removeItem(index)}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white rounded-lg shadow p-6">
                <h5 className="mb-4 text-xl font-bold text-blue-gray-900">Order Summary</h5>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-blue-gray-900">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span className="text-blue-gray-900">₹0</span>
                  </div>
                  <div className="border-t border-blue-gray-50 my-4"></div>
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-blue-600">₹{cartTotal}</span>
                  </div>
                </div>
                <button
                  className="mt-6 w-full px-6 py-3 rounded bg-blue-500 text-white text-lg font-semibold hover:bg-blue-600 transition-colors"
                  type="button"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showPhoneDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto overflow-hidden">
            <div className="px-6 py-4 border-b font-bold text-lg">Enter Your Phone Number</div>
            <div className="overflow-y-auto max-h-[400px] px-6 py-4">
              <div className="space-y-4">
                <p className="text-gray-500 text-sm">Please enter your phone number for order confirmation</p>
                <div className="relative">
                  <div className="flex items-center border rounded px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400">
                    <FiPhone className="mr-2 text-gray-400" />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="flex-1 outline-none bg-transparent"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setPhoneError("");
                      }}
                    />
                  </div>
                  {phoneError && (
                    <div className="text-red-500 text-xs mt-1">{phoneError}</div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                type="button"
                onClick={() => setShowPhoneDialog(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                type="button"
                onClick={handlePhoneSubmit}
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 