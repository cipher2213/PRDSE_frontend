"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FiHome,
  FiMenu,
  FiUsers,
  FiLogOut,
  FiX,
  FiShoppingBag
} from "react-icons/fi";
import Link from "next/link";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
      router.push("/admin/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", icon: FiHome, href: "/admin/dashboard" },
    { label: "Orders", icon: FiShoppingBag, href: "/admin/dashboard/orders" },
    { label: "Menu", icon: FiMenu, href: "/admin/dashboard/menu" },
    { label: "Users", icon: FiUsers, href: "/admin/dashboard/users" },
  ];

  const Sidebar = (
    <div className="h-full flex flex-col w-64 bg-white shadow-lg z-40">
      <div className="p-4 border-b flex items-center justify-between">
        <h5 className="text-blue-gray-900 text-xl font-bold">Admin Panel</h5>
        {/* Close button for mobile */}
        <button
          className="lg:hidden p-2 rounded hover:bg-gray-100"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <FiX className="h-6 w-6" />
        </button>
      </div>
      <ul className="mt-2 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link href={item.href}>
                <button
                  className={`flex items-center w-full px-4 py-2 text-left rounded transition-colors ${pathname === item.href ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3"><Icon className="h-5 w-5" /></span>
                  {item.label}
                </button>
              </Link>
            </li>
          );
        })}
        <li>
          <button
            className="flex items-center w-full px-4 py-2 text-left rounded text-red-500 hover:bg-red-50 focus:bg-red-50 cursor-pointer mt-2"
            onClick={() => {
              router.push("/admin/signin");
            }}
          >
            <span className="mr-3"><FiLogOut className="h-5 w-5" /></span>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile top navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow flex items-center justify-between px-4 h-16">
        <button
          className="p-2 rounded hover:bg-gray-100"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <FiMenu className="h-6 w-6" />
        </button>
        <span className="text-lg font-bold">Admin Panel</span>
        <button
          className="p-2 rounded hover:bg-gray-100 text-red-500"
          onClick={() => router.push("/admin/signin")}
        >
          <FiLogOut className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar for desktop and mobile drawer */}
      {/* Desktop sidebar */}
      <div className="hidden lg:block h-screen sticky top-0">
        {Sidebar}
      </div>
      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30"
            onClick={() => setSidebarOpen(false)}
          ></div>
          {/* Drawer */}
          <div className="relative w-64 h-full bg-white shadow-lg animate-slide-in">
            {Sidebar}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto pt-16 lg:pt-0">
        {children}
      </div>
    </div>
  );
}
// Add slide-in animation for mobile drawer
// Add this to your global CSS if not present:
// @keyframes slide-in { from { transform: translateX(-100%); } to { transform: translateX(0); } }
// .animate-slide-in { animation: slide-in 0.2s ease-out; } 
