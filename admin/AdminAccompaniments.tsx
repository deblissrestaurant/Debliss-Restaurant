import React, { useState, useEffect } from "react";
import { useAccompanimentStore } from "../stores/accompanimentStore";
import type { Accompaniment } from "../Interfaces/Interfaces";
import { BiEdit, BiTrash, BiPlus } from "react-icons/bi";
import AdminSideBar from "./AdminSideBar";

const AdminAccompaniments = () => {
  const {
    accompaniments,
    loading,
    error,
    fetchAccompaniments,
    createAccompaniment,
    updateAccompaniment,
    deleteAccompaniment,
    setError,
  } = useAccompanimentStore();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Accompaniment, "_id">>({
    name: "",
    price: 0,
    category: "soup",
    available: true,
  });

  const categories = ["soup", "sauce", "stew", "protein", "extra"];

  useEffect(() => {
    fetchAccompaniments();
  }, [fetchAccompaniments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || formData.price < 0) {
      setError("Please provide a valid name and price");
      return;
    }

    const success = editingId
      ? await updateAccompaniment(editingId, formData)
      : await createAccompaniment(formData);

    if (success) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({ name: "", price: 0, category: "soup", available: true });
    setIsCreating(false);
    setEditingId(null);
    setError(null);
  };

  const handleEdit = (accompaniment: Accompaniment) => {
    setFormData({
      name: accompaniment.name,
      price: accompaniment.price,
      category: accompaniment.category,
      available: accompaniment.available ?? true,
    });
    setEditingId(accompaniment._id || null);
    setIsCreating(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this accompaniment?")) {
      await deleteAccompaniment(id);
    }
  };

  const groupedAccompaniments = categories.reduce((acc, category) => {
    acc[category] = accompaniments.filter((item) => item.category === category);
    return acc;
  }, {} as Record<string, Accompaniment[]>);

  if (loading && accompaniments.length === 0) {
    return <div className="p-6">Loading accompaniments...</div>;
  }

  return (
    <div className="ml-65">
      <AdminSideBar />
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#ff1200]">
            Manage Accompaniments
          </h1>
          <button
            onClick={() => setIsCreating(true)}
            className="border border-[#ff1200] text-[#ff1200] px-4 py-2 rounded-lg hover:bg-[#ff1200] hover:text-[#ffffff] flex items-center gap-2"
          >
            <BiPlus /> Add Accompaniment
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Create/Edit Form */}
        {isCreating && (
          <div className="border-gray-600 border p-6 rounded-lg mb-6 bg-[#181c1f]">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Accompaniment" : "Add New Accompaniment"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#ff1200] mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Okro soup"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#ff1200] mb-1">
                    Price (₵)
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#ff1200] mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((category) => (
                      <option className="bg-[#222629]" key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.available}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          available: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    Available
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  disabled={loading}
                >
                  {loading ? "Saving..." : editingId ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Accompaniments List by Category */}
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category} className="bg-[#181c1f] border border-gray-600 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3  capitalize">
                {category} ({groupedAccompaniments[category]?.length || 0})
              </h3>

              {groupedAccompaniments[category]?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {groupedAccompaniments[category].map((accompaniment) => (
                    <div
                      key={accompaniment._id}
                      className="border border-gray-600 rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium ">
                            {accompaniment.name}
                          </h4>
                          <p className="text-gray-400 font-semibold">
                            ₵{accompaniment.price}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 mt-2 border border-[#990a00] rounded-full text-xs ${
                              accompaniment.available !== false
                                ? "text-[#ff1200]"
                                : "text-gray-300"
                            }`}
                          >
                            {accompaniment.available !== false
                              ? "Available"
                              : "Unavailable"}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(accompaniment)}
                            className="text-red-400 hover:text-red-600"
                            title="Edit"
                          >
                            <BiEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(accompaniment._id!)}
                            className="text-red-400 hover:text-red-600"
                            title="Delete"
                          >
                            <BiTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className=" italic">
                  No {category} accompaniments yet
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAccompaniments;
