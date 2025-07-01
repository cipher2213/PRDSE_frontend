"use client";

import { Navbar, Footer } from "@/components";
import { MenuItemCard } from "@/components/menu-item-card";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';



const VALID_TABLES = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

export default function TableMenu() {
  const params = useParams();
  const router = useRouter();
  const tableId = params.tableId as string;
  const [cart, setCart] = useState<any[]>([]);
  const [isValidTable, setIsValidTable] = useState(false);
  const [menuData, setMenuData] = useState<{ [category: string]: any[] }>({});

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/all`);
        const data = await res.json();
  
        if (data.success) {
          const grouped: { [key: string]: any[] } = {};
          data.items.forEach((item: any) => {
            const cat = item.category || "others";
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(item);
          });
          setMenuData(grouped);
        } else {
          toast.error("Failed to fetch menu");
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
        toast.error("Error loading menu");
      }
    };
  
    fetchMenu();
  }, []);
  
  useEffect(() => {
    // Validate table number
    if (!VALID_TABLES.includes(tableId)) {
      toast.error('Invalid table number');
      router.push('/');
      return;
    }
    setIsValidTable(true);

    // Load cart for this table
    const savedCart = localStorage.getItem(`table_${tableId}_cart`);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [tableId, router]);

  const handleAddToCart = (item: any, quantity: number) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.name === item.name);
      let newCart;

      if (existingItemIndex > -1) {
        newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
      } else {
        newCart = [...prevCart, { ...item, quantity }];
      }

      localStorage.setItem(`table_${tableId}_cart`, JSON.stringify(newCart));
      toast.success('Item added to cart');
      return newCart;
    });
  };

  if (!isValidTable) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="pt-32 pb-20 px-8">
        <div className="container mx-auto">
          <div className="mb-8 bg-blue-gray-50 rounded-lg shadow">
            <div className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="mb-2 text-2xl font-bold text-blue-gray-900">Table {tableId}</h3>
                  <p className="text-lg text-gray-600">Welcome! Ready to order?</p>
                </div>
                {cart.length > 0 && (
                  <button
                    className="flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
                    onClick={() => router.push(`/table/${tableId}/cart`)}
                  >
                    <span>View Cart</span>
                    <span className="bg-white text-blue-500 px-2 py-1 rounded-full text-sm">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {Object.entries(menuData).map(([category, items]) => (
            <div key={category} className="mb-12">
              <h4 className="mb-8 border-b-2 border-gray-300 pb-2 capitalize text-2xl font-bold text-blue-gray-900">
                {category.replace(/_/g, " ")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item, index) => (
                  <MenuItemCard
                    key={index}
                    {...item}
                    price={`₹${item.price}`} 
                    onAddToCart={(quantity) => handleAddToCart(item, quantity)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </>
  );
} 
