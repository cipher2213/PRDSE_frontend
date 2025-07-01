'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

import { FiMenu, FiUsers, FiShoppingBag, FiBarChart } from "react-icons/fi";
import Link from "next/link";

interface DashboardStats {
  totalOrders: number;
  revenue: number;
  activeUsers: number;
  pendingOrders: number;
  visitorCount: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    revenue: 0,
    activeUsers: 0,
    pendingOrders: 0,
    visitorCount: 0
  });

  

  const fetchStats = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    // Fetch stats every 5 seconds for real-time updates
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/admin/signin');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiShoppingBag className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <h6 className="font-medium text-blue-gray-900 text-sm">
                    Total Orders
                  </h6>
                  <h5 className="text-blue-gray-900 text-xl font-bold">
                    {stats.totalOrders}
                  </h5>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiShoppingBag className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <h6 className="font-medium text-blue-gray-900 text-sm">
                    Pending Orders
                  </h6>
                  <h5 className="text-blue-gray-900 text-xl font-bold">
                    {stats.pendingOrders}
                  </h5>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiBarChart className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <h6 className="font-medium text-blue-gray-900 text-sm">
                    Revenue
                  </h6>
                  <h5 className="text-blue-gray-900 text-xl font-bold">
                    ₹{stats.revenue}
                  </h5>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUsers className="h-6 w-6 text-purple-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <h6 className="font-medium text-blue-gray-900 text-sm">
                    Active Users
                  </h6>
                  <h5 className="text-blue-gray-900 text-xl font-bold">
                    {stats.activeUsers}
                  </h5>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiBarChart className="h-6 w-6 text-indigo-500" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <h6 className="font-medium text-blue-gray-900 text-sm">
                    Total Visitors
                  </h6>
                  <h5 className="text-blue-gray-900 text-xl font-bold">
                    {stats.visitorCount}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Orders Management Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="flex flex-col items-center text-center p-6">
              <FiShoppingBag className="h-12 w-12 text-blue-500 mb-4" />
              <h5 className="text-blue-gray-900 text-xl font-bold mb-2">Orders Management</h5>
              <p className="text-gray-500 mb-4">View and manage customer orders</p>
              <Link href="/admin/dashboard/orders">
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">Manage Orders</button>
              </Link>
            </div>
          </div>

          {/* Menu Management Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="flex flex-col items-center text-center p-6">
              <FiMenu className="h-12 w-12 text-green-500 mb-4" />
              <h5 className="text-blue-gray-900 text-xl font-bold mb-2">Menu Management</h5>
              <p className="text-gray-500 mb-4">Add, edit, or remove menu items</p>
              <Link href="/admin/dashboard/menu">
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">Manage Menu</button>
              </Link>
            </div>
          </div>

          {/* User Management Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="flex flex-col items-center text-center p-6">
              <FiUsers className="h-12 w-12 text-purple-500 mb-4" />
              <h5 className="text-blue-gray-900 text-xl font-bold mb-2">User Management</h5>
              <p className="text-gray-500 mb-4">View and manage registered users</p>
              <Link href="/admin/dashboard/users">
                <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors">Manage Users</button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 