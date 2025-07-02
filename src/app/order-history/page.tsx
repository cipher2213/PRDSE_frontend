"use client";

import { Navbar, Footer } from "@/components";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { FiClock, FiShoppingBag, FiPhone } from 'react-icons/fi';

interface OrderHistoryItem {
  orderId: string;
  items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  total: number;
  orderTime: string;
  userEmail: string;
  phoneNumber: string;
  status?: string;
}

export default function OrderHistory() {
  const [orders, setOrders] = useState<OrderHistoryItem[]>([]);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/api/auth/signin');
      return;
    }

    if (session?.user?.email) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/user/${session.user.email}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch(err => {
        console.error("Failed to fetch order history", err);
      });
    }
  }, [session, status, router]);

  if (status === "loading") {
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
          <div className="max-w-5xl mx-auto">
            <h2 className="mb-8 text-3xl font-bold text-blue-gray-900">Your Order History</h2>

            {orders.length === 0 ? (
              <div className="bg-white rounded-lg shadow text-center py-12">
                  <FiShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h5 className="mb-2 text-xl font-bold text-blue-gray-900">No Orders Yet</h5>
                <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                <button
                  className="px-6 py-3 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
                  type="button"
                    onClick={() => router.push('/menu-page')}
                  >
                    Browse Menu
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order, index) => (
                  <div key={index} className="overflow-hidden bg-white rounded-lg shadow">
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h6 className="text-lg font-semibold text-blue-gray-900">Order #{order.orderId}</h6>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <FiClock className="h-4 w-4" />
                            <span className="text-sm">{new Date(order.orderTime).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600 mt-1">
                            <FiPhone className="h-4 w-4" />
                            <span className="text-sm">{order.phoneNumber}</span>
                          </div>
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold 
                          ${order.status === 'completed' ? 'bg-green-100 text-green-800' : order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
                        </span>
                      </div>
                      <div className="border-t border-b border-gray-200 py-4 mb-4">
                        {order.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-blue-gray-900">{item.quantity}x</span>
                              <span className="text-blue-gray-900">{item.name}</span>
                            </div>
                            <span className="text-blue-gray-900">{item.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-blue-gray-900">Total</span>
                        <span className="text-lg font-bold text-blue-600">₹{order.total}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 
