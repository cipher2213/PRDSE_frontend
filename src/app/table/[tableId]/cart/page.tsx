"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiPhone, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useSession } from "next-auth/react";

const VALID_TABLES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default function TableCart() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.tableId as string;
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    // Validate table number
    if (!VALID_TABLES.includes(tableId)) {
      toast.error('Invalid table number');
      router.push('/');
      return;
    }

    const savedCart = localStorage.getItem(`table_${tableId}_cart`);
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
      calculateTotal(parsedCart);
    }
  }, [tableId, router]);

  const calculateTotal = (cartItems: any[]) => {
    const sum = cartItems.reduce((total, item) => {
      // Handle both string and number price types
      const price = typeof item.price === 'string' 
        ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
        : item.price;
      return total + (price * item.quantity);
    }, 0);
    setTotal(sum);
  };

  const updateQuantity = (index: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    setCart(newCart);
    localStorage.setItem(`table_${tableId}_cart`, JSON.stringify(newCart));
    calculateTotal(newCart);
  };

  const removeItem = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem(`table_${tableId}_cart`, JSON.stringify(newCart));
    calculateTotal(newCart);
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

  const validateName = (name: string) => {
    if (!name.trim()) {
      return "Name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long";
    }
    return "";
  };

  const handlePlaceOrder = async () => {
    // Validate name
    const nameValidationError = validateName(customerName);
    if (nameValidationError) {
      setNameError(nameValidationError);
      return;
    }

    // Validate phone number
    const phoneValidationError = validatePhoneNumber(phoneNumber);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      return;
    }

    // Create optimized order object with minimal data
    const order = {
      tableId,
      customerName: customerName.trim(),
      phoneNumber: phoneNumber.trim(),
      userEmail: session?.user?.email || "", 
      items: cart.map(item => ({
        name: item.name,
        price: typeof item.price === 'string' 
          ? parseFloat(item.price.replace(/[^0-9.]/g, ''))
          : item.price,
        quantity: item.quantity
      })),
      total,
      orderTime: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/place`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(order)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        toast.success('Order placed successfully!');
        localStorage.removeItem(`table_${tableId}_cart`);
        setShowConfirmDialog(false);
        router.push(`/table/${tableId}/order-success`);
      } else {
        toast.error(data.message || 'Failed to place order');
      }
    } catch (err) {
      console.error('Order placement error:', err);
      toast.error("Server error. Please try again later.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-32">
      <h2 className="mb-8 text-3xl font-bold text-blue-gray-900">Your Order - Table {tableId}</h2>

      {cart.length === 0 ? (
        <div className="text-center py-12">
          <h5 className="mb-4">Your cart is empty</h5>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => router.push(`/table/${tableId}`)}
          >
            View Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center gap-4 mb-4">
                <div className="flex-grow">
                  <h6>{item.name}</h6>
                  <p>{item.price} x {item.quantity}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="text-sm"
                    onClick={() => updateQuantity(index, item.quantity - 1)}
                  >
                    <FiMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="text-sm"
                    onClick={() => updateQuantity(index, item.quantity + 1)}
                  >
                    <FiPlus />
                  </button>
                  <button
                    className="text-red-500 text-sm"
                    onClick={() => removeItem(index)}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit">
            <h5 className="mb-4">Order Summary</h5>
            <div className="space-y-3">
              <div className="flex justify-between">
                <p className="text-gray-500">Subtotal</p>
                <p>₹{total}</p>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex justify-between">
                <h6>Total</h6>
                <h6 className="text-blue-500">
                  ₹{total}
                </h6>
              </div>
            </div>
            <button
              className="w-full bg-blue-500 text-white py-2 mt-6"
              onClick={() => setShowConfirmDialog(true)}
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      <div className={`fixed inset-0 bg-black bg-opacity-50 ${showConfirmDialog ? '' : 'hidden'}`}>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center h-full">
            <div className="bg-white p-8 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Complete Your Order</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      setNameError("");
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {nameError && (
                    <p className="text-xs text-red-500 mt-1">{nameError}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setPhoneError("");
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {phoneError && (
                    <p className="text-xs text-red-500 mt-1">{phoneError}</p>
                  )}
                </div>

                <p className="text-sm text-gray-500">
                  Please provide your details for order confirmation
                </p>
              </div>
              <div className="mt-4 space-x-2">
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={handlePlaceOrder}
                >
                  Confirm Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
