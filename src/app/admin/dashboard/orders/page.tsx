"use client";

import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  tableId: string;
  customerName: string;
  phoneNumber: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
  status: "pending" | "completed" | "cancelled";
  orderTime: string;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`);
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      toast.success("Order status updated");
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Polling for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 2000); // fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "completed":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "blue-gray";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-blue-gray-900 text-3xl font-bold">
          Orders Management
        </h3>
        <button
          className="p-2 rounded-full hover:bg-blue-100 text-blue-gray-700 transition-colors"
          onClick={fetchOrders}
          title="Refresh"
        >
          <FiRefreshCw className="h-4 w-4" />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h6 className="text-blue-gray-900 text-lg font-semibold mb-2">No orders found</h6>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order._id} className="overflow-hidden bg-white rounded-lg shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h6 className="text-blue-gray-900 text-lg font-semibold">Order #{order._id.slice(-6)}</h6>
                    <p className="text-gray-500 text-sm">{formatDate(order.orderTime)}</p>
                  </div>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-blue-gray-900 mb-1">Customer Details</p>
                    <p className="text-gray-500 text-sm">Name: {order.customerName}</p>
                    <p className="text-gray-500 text-sm">Phone: {order.phoneNumber}</p>
                    <p className="text-gray-500 text-sm">Table: {order.tableId}</p>
                  </div>

                  <div>
                    <p className="font-medium text-blue-gray-900 mb-1">Order Items</p>
                    {order.items.map((item, index) => (
                      <p key={index} className="text-gray-500 text-sm">
                        {item.quantity}x {item.name} - ₹{item.price * item.quantity}
                      </p>
                    ))}
                    <h6 className="text-blue-600 text-lg font-bold mt-2">Total: ₹{order.total}</h6>
                  </div>
                </div>

                {order.status === "pending" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-sm"
                      onClick={() => updateOrderStatus(order._id, "completed")}
                    >
                      Complete Order
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors text-sm border border-red-500"
                      onClick={() => updateOrderStatus(order._id, "cancelled")}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 