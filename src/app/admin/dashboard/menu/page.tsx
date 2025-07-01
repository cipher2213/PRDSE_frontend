"use client";

import { useState, useEffect, useRef } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiUpload } from "react-icons/fi";
import Image from "next/image";
import toast from "react-hot-toast";

interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  img: string;
}

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    img: "",
  });

  const categories = [
    "PARADISE SPECIAL SHAKE",
    "MAGGIE",
    "BURGER",
    "FRIES",
    "SANDWICH",
    "PASTA",
    "RICE",
    "SALAD",
    "PASSION",
    "JAMUN SHOT",
    "COMBO",
    "ICE CREAM",
    "BROWNIE",
    "COLD COFFEE",
    "HOT COFFEE",
    "THICK",
    "COLD DRINKS",
    "CHINESE NOODLES",
    "MANCHURIAN",
    "PAV BHAJI",
    "SNACKS",
    "RICE",
    "MOCKTAIL",
    "SUNDAE",
    "MOMOS",
    "FRIED MOMOS",
    "PIZZA",
    "CHAT-BHANDAR"
  ];

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/all`);
      const data = await res.json();
      if (data.success) {
        setMenuItems(data.items);
      } else {
        toast.error("Failed to fetch menu items");
      }
    } catch (err) {
      console.error("Error fetching menu:", err);
      toast.error("Error loading menu items");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage =async (
    file: File,
    name: string,
    description: string,
    price: number,
    category: string
  ): Promise<any> =>  {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price.toString());
    formData.append("category", category);
    formData.append("image", file); 

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/add`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Menu item added successfully");
        setShowAddDialog(false);
        fetchMenuItems();
        setFormData({ name: "", description: "", price: "", category: "", img: "" });
        setSelectedImage(null);
        setImagePreview("");
        return data;
      } else {
        toast.error(data.message || "Failed to add menu item");
        return null;
      }
    } catch (err) {
      console.error("Error adding menu item:", err);
      toast.error("Error adding menu item");
      return null;
    }
  };

  const handleAddItem = async () => {
    try {
      const price = parseFloat(formData.price);
      if (isNaN(price)) {
        toast.error("Please enter a valid price");
        return;
      }

      if (!selectedImage) {
        toast.error("Please select an image");
        return;
      }

      // Upload image first
      const uploadResponse = await uploadImage(
        selectedImage,
        formData.name,
        formData.description,
        price,
        formData.category
      );
      // If uploadResponse contains the image URL, use it. Otherwise, fallback to formData.img
      const imageUrl = uploadResponse?.imageUrl || uploadResponse?.img || formData.img;
      if (!imageUrl) {
        toast.error("Failed to get uploaded image URL");
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          price,
          img: imageUrl,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Menu item added successfully");
        setShowAddDialog(false);
        fetchMenuItems();
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          img: "",
        });
        setSelectedImage(null);
        setImagePreview("");
      } else {
        toast.error(data.message || "Failed to add menu item");
      }
    } catch (err) {
      console.error("Error adding menu item:", err);
      toast.error("Error adding menu item");
    }
  };

  const handleEditItem = async () => {
    if (!selectedItem) return;

    try {
      const price = parseFloat(formData.price);
      if (isNaN(price)) {
        toast.error("Please enter a valid price");
        return;
      }

      const updateData = new FormData();
    updateData.append("name", formData.name);
    updateData.append("description", formData.description);
    updateData.append("price", price.toString());
    updateData.append("category", formData.category);
    if (selectedImage) {
      updateData.append("image", selectedImage);
    }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/update/${selectedItem._id}`, {
        method: "PUT",
        body: updateData,
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Menu item updated successfully");
        setShowEditDialog(false);
        fetchMenuItems();
        setSelectedImage(null);
        setImagePreview("");
      } else {
        toast.error(data.message || "Failed to update menu item");
      }
    } catch (err) {
      console.error("Error updating menu item:", err);
      toast.error("Error updating menu item");
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/delete/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Menu item deleted successfully");
        fetchMenuItems();
      } else {
        toast.error(data.message || "Failed to delete menu item");
      }
    } catch (err) {
      console.error("Error deleting menu item:", err);
      toast.error("Error deleting menu item");
    }
  };

  const openEditDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
      img: item.img,
    });
    setShowEditDialog(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-2 sm:px-6 lg:px-8">
      <h3 className="text-2xl sm:text-3xl font-bold text-blue-gray-900 mb-6 text-center sm:text-left">Menu Management</h3>
      <button
        className="flex items-center gap-2 px-4 py-2 mb-4 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
        onClick={() => setShowAddDialog(true)}
      >
        <FiPlus className="h-5 w-5" />
        Add Item
      </button>
      {loading ? (
        <div className="text-center py-12">Loading menu items...</div>
      ) : menuItems.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">No menu items found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <div key={item._id} className="bg-white rounded-lg shadow p-4 flex flex-col">
              <div className="h-48 relative">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h5 className="text-blue-gray-900 text-lg font-bold">{item.name}</h5>
                    <p className="text-gray-500 text-sm capitalize">{item.category.replace(/_/g, " ")}</p>
                  </div>
                  <h6 className="text-blue-gray-900 text-base font-semibold">₹{item.price}</h6>
                </div>
                <p className="text-gray-500 mb-4">{item.description}</p>
                <div className="flex justify-end gap-2">
                  <button
                    className="p-2 rounded-full hover:bg-blue-100 text-blue-gray-700 transition-colors"
                    onClick={() => openEditDialog(item)}
                    title="Edit"
                  >
                    <FiEdit2 className="h-4 w-4" />
                  </button>
                  <button
                    className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
                    onClick={() => handleDeleteItem(item._id)}
                    title="Delete"
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Item Modal */}
      {(showAddDialog || showEditDialog) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto overflow-hidden">
            <div className="px-6 py-4 border-b font-bold text-lg">
              {showAddDialog ? "Add New Menu Item" : "Edit Menu Item"}
            </div>
            <div className="overflow-y-auto max-h-[600px] px-6 py-4">
              <form className="space-y-4" onSubmit={e => e.preventDefault()}>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Name</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Description</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Price</label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-1">Category</label>
                  <select
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Image Upload Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FiUpload className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="relative w-full h-48 mt-4">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                      <button
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview("");
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t bg-gray-50">
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                onClick={() => {
                  if (showAddDialog) {
                    setShowAddDialog(false);
                  } else {
                    setShowEditDialog(false);
                  }
                  setSelectedImage(null);
                  setImagePreview("");
                }}
                type="button"
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded text-white transition-colors ${showAddDialog ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}
                onClick={showAddDialog ? handleAddItem : handleEditItem}
                type="button"
              >
                {showAddDialog ? "Add Item" : "Update Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
