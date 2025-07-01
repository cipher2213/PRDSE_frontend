"use client";

import { Navbar, Footer } from "@/components";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { FiCheckCircle } from 'react-icons/fi';
import { useSession } from "next-auth/react";

interface OrderDetails {
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  orderTime: string;
  userEmail: string;
  phoneNumber: string;
}

interface CartItem {
  name: string;
  quantity: number;
  price: number;
  img: string;
  description: string;
}

export default function OrderConfirmation() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.email) {
      router.push('/api/auth/signin');
      return;
    }

    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]') as CartItem[];
      if (!cart.length) {
        router.push('/menu-page');
        return;
      }

      const total = cart.reduce((sum: number, item: CartItem) => {
        return sum + (item.price * item.quantity);
      }, 0);

      const newOrder = {
        orderId: `ORD${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        items: cart,
        total: total,
        orderTime: new Date().toLocaleString(),
        userEmail: session.user.email,
        phoneNumber: localStorage.getItem('userPhone') || '',
      };

      // Save to order history
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      orderHistory.push(newOrder);
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

      setOrderDetails(newOrder);
      localStorage.setItem('cart', '[]');

      // ✅ 1. Send phone number to backend
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/phone`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          phone: localStorage.getItem('userPhone') || '',
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Phone number saved:', data);
        })
        .catch((err) => {
          console.error('Failed to save phone number:', err);
        });
    } catch (error) {
      console.error('Error processing order:', error);
      router.push('/menu-page');
    }
  }, [router, session]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <FiCheckCircle className="h-20 w-20 text-green-500" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-blue-gray-900">Order Confirmed!</h2>
              <p className="text-lg text-gray-600">Thank you for ordering at Paradise Cafe</p>
            </div>

            <div className="mb-8 bg-white rounded-lg shadow">
              <div className="p-8">
                <h6 className="mb-4 text-lg font-semibold text-blue-gray-900">Order ID: {orderDetails.orderId}</h6>
                <div className="bg-amber-50 p-6 rounded-lg mb-6 border border-amber-200">
                  <p className="text-amber-900 font-medium text-center">Please proceed to the counter to make your payment.</p>
                </div>
                <div className="mt-6 space-y-4">
                  <Link href="/order-history">
                    <button className="w-full px-6 py-3 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors">View Order History</button>
                  </Link>
                  <Link href="/menu-page">
                    <button className="w-full px-6 py-3 rounded border border-blue-500 text-blue-500 font-semibold hover:bg-blue-50 transition-colors">Order More</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </>
  );
} 