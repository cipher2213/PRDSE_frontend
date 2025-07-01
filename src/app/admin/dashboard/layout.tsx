"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import {
  FiHome,
  FiMenu,
  FiUsers,
  FiLogOut,
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
    { label: "Menu", icon: FiMenu, href: "/admin/dashboard/menu" },
    { label: "Users", icon: FiUsers, href: "/admin/dashboard/users" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h5 className="text-blue-gray-900 text-xl font-bold">
            Admin Panel
          </h5>
        </div>
        <ul className="mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <button
                    className={`flex items-center w-full px-4 py-2 text-left rounded transition-colors ${pathname === item.href ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
} 