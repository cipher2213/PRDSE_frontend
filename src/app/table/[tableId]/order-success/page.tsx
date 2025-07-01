"use client";

import { useParams, useRouter } from "next/navigation";
import { FiCheckCircle, FiPhone, FiUser } from 'react-icons/fi';
import { useEffect, useState } from 'react';

interface OrderDetails {
  customerName: string;
  phoneNumber: string;
  tableId: string;
  orderTime: string;
}

export default function OrderSuccess() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.tableId;
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  useEffect(() => {
    // In a real application, you would fetch this from your backend
    // For now, we'll simulate it with localStorage
    const lastOrder = localStorage.getItem(`table_${tableId}_last_order`);
    if (lastOrder) {
      setOrderDetails(JSON.parse(lastOrder));
    }
  }, [tableId]);

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow">
        <div className="text-center p-8">
          <FiCheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h3 className="mb-4 text-2xl font-bold text-blue-gray-900">Order Placed Successfully!</h3>
          {orderDetails && (
            <div className="mb-6 text-left bg-blue-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FiUser className="text-blue-gray-500" />
                <span className="text-blue-gray-900">Name: {orderDetails.customerName}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <FiPhone className="text-blue-gray-500" />
                <span className="text-blue-gray-900">Phone: {orderDetails.phoneNumber}</span>
              </div>
            </div>
          )}
          <p className="mb-8 text-gray-600">
            Your order has been received and will be prepared shortly.<br />
            Please wait at Table {tableId}.
          </p>
          <button
            className="px-6 py-3 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
            onClick={() => router.push(`/table/${tableId}`)}
          >
            Order More Items
          </button>
        </div>
      </div>
    </div>
  );
} 
