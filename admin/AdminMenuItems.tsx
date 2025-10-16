import { useState, useEffect } from "react";
import type { MenuItem } from "../Interfaces/Interfaces";
import AdminSideBar from "./AdminSideBar";
import AdminMenuItemCard from "../components/admin/AdminMenuItemCard";
import { useAdminStore } from "../stores/adminStore";
import { useRefreshMenuEffect } from "../hooks";
import { useAnimationStore } from "../stores/animationStore";
import { useAccompanimentStore } from "../stores/accompanimentStore";
import { uploadImageToCloudinary } from "../services/cloudinary";
import { apiUrl } from "../config/constants";

const AdminMenuItems = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAccompaniments, setSelectedAccompaniments] = useState<
    string[]
  >([]);
  const [editSelectedAccompaniments, setEditSelectedAccompaniments] = useState<
    string[]
  >([]);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useRefreshMenuEffect();
  const { refreshMenu } = useAdminStore();
  const { accompaniments, fetchAccompaniments } = useAccompanimentStore();

  // Fetch accompaniments on component mount
  useEffect(() => {
    fetchAccompaniments();
  }, [fetchAccompaniments]);

  const { addFilter, handleChangeEdit, handleChangeMenu, handleEditItem } =
    useAdminStore();

  // Use separate selectors to avoid creating new objects and infinite loops
  const formData = useAdminStore((state) => state.formData);
  const editItem = useAdminStore((state) => state.editItem);
  const menuItems = useAdminStore((state) => state.menuItems);
  const message = useAdminStore((state) => state.message);
  const categories = useAdminStore((state) => state.categories);
  const filter = useAdminStore((state) => state.filter);
  const uniqueCategories = useAdminStore((state) => state.uniqueCategories);
  const animation = useAnimationStore((state) => state.animation);

  // Handle accompaniment selection
  const handleAccompanimentToggle = (accompanimentId: string) => {
    setSelectedAccompaniments((prev) =>
      prev.includes(accompanimentId)
        ? prev.filter((id) => id !== accompanimentId)
        : [...prev, accompanimentId]
    );
  };

  // Handle edit accompaniment selection
  const handleEditAccompanimentToggle = (accompanimentId: string) => {
    setEditSelectedAccompaniments((prev) =>
      prev.includes(accompanimentId)
        ? prev.filter((id) => id !== accompanimentId)
        : [...prev, accompanimentId]
    );
  };

  // Update edit selections when editItem changes
  useEffect(() => {
    if (editItem && editItem.allowedAccompaniments) {
      setEditSelectedAccompaniments(editItem.allowedAccompaniments);
    } else {
      setEditSelectedAccompaniments([]);
    }
  }, [editItem]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Get form data from the store
    const { formData } = useAdminStore.getState();

    if (!formData.name || !formData.price || !formData.category) {
      useAdminStore.getState().setMessage("Please fill in all required fields");
      return;
    }

    try {
      setUploading(true);

      let imageUrl = "";

      // Upload image to Cloudinary if selected
      if (selectedImage) {
        try {
          imageUrl = await uploadImageToCloudinary(selectedImage);
        } catch (error) {
          useAdminStore
            .getState()
            .setMessage(
              error instanceof Error ? error.message : "Failed to upload image"
            );
          setUploading(false);
          return;
        }
      }

      // Get selected accompaniment IDs
      const allowedAccompaniments =
        selectedAccompaniments.length > 0 ? selectedAccompaniments : undefined;

      const response = await fetch(apiUrl("admin/create-menu-item"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          category: formData.category,
          imageUrl, // Send the Cloudinary URL
          allowedAccompaniments,
        }),
      });

      const result = await response.json();

      if (result.success) {
        useAdminStore.getState().setMessage("Menu item added successfully!");
        // Reset form and selections
        useAdminStore.setState({
          formData: { name: "", price: "", category: "", image: null },
        });
        setSelectedAccompaniments([]);
        setSelectedImage(null);
        setImagePreview(null);
        // Refresh menu
        await useAdminStore.getState().refreshMenu();
      } else {
        useAdminStore
          .getState()
          .setMessage(result.error || "Failed to add menu item");
      }
    } catch (error) {
      console.error("Error adding menu item:", error);
      useAdminStore.getState().setMessage("Error adding menu item");
    } finally {
      setUploading(false);
    }
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Image select triggered");
    const file = e.target.files?.[0];
    console.log("Selected file:", file);

    if (file) {
      console.log("File details:", {
        name: file.name,
        size: file.size,
        type: file.type,
      });

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log("Image preview created");
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected");
    }
  };

  // Custom update function for the new accompaniment structure
  const handleCustomUpdateItem = async () => {
    if (!editItem) return;

    try {
      setUploading(true);

      if (!editItem.name || !editItem.price || !editItem.category) {
        useAdminStore.getState().setMessage("Please fill all fields");
        setUploading(false);
        return;
      }

      let imageUrl = "";

      // Upload image to Cloudinary if a new image is selected
      if (selectedImage) {
        try {
          imageUrl = await uploadImageToCloudinary(selectedImage);
          console.log("Image uploaded for edit:", imageUrl);
        } catch (error) {
          useAdminStore
            .getState()
            .setMessage(
              error instanceof Error ? error.message : "Failed to upload image"
            );
          setUploading(false);
          return;
        }
      }

      // Get selected accompaniment IDs
      const allowedAccompaniments =
        editSelectedAccompaniments.length > 0
          ? editSelectedAccompaniments
          : undefined;

      const updateData: any = {
        name: editItem.name,
        price: parseFloat(editItem.price.toString()),
        category: editItem.category,
        allowedAccompaniments,
      };

      // Only add imageUrl if a new image was uploaded
      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      const res = await fetch(
        apiUrl(`admin/update-menu-item/${editItem._id}`),
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );

      const result = await res.json();
      if (result.success) {
        useAdminStore.getState().setMessage("Item updated successfully!");
        useAdminStore.getState().handleEditItem(null);
        setEditSelectedAccompaniments([]);
        setSelectedImage(null);
        setImagePreview(null);
        await useAdminStore.getState().refreshMenu();
      } else {
        useAdminStore.getState().setMessage(result.error || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      useAdminStore.getState().setMessage("Update failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="ml-65">
      <AdminSideBar />
      <div className="p-6">
        <h1 className="text-center text-4xl font-bold pb-6">Menu Items</h1>
        <div className="bg-[#181c1f] rounded-lg border border-gray-600 p-4 sm:p-6 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#ff1200]">
            Add New Menu Item
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChangeMenu}
                placeholder="Item Name"
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
              <input
                name="price"
                value={formData.price}
                onChange={handleChangeMenu}
                placeholder="Price"
                type="number"
                step="0.01"
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <input
                name="category"
                value={formData.category}
                onChange={handleChangeMenu}
                placeholder="Category"
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Item Image:
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageSelect}
                  className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#ff1200] file:text-white hover:file:bg-[#d81b00]"
                />
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                )}
                <p className="text-xs text-gray-400">
                  Maximum size: 5MB. Supported formats: JPEG, PNG, WebP. Images
                  will be automatically optimized.
                </p>
              </div>
            </div>

            {/* Individual Accompaniment Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Available Accompaniments:
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-600 rounded-lg p-3 bg-[#0e1113]">
                {accompaniments.length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {accompaniments.map((accompaniment) => (
                      <label
                        key={accompaniment._id}
                        className="flex items-center space-x-2 text-white"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAccompaniments.includes(
                            accompaniment._id!
                          )}
                          onChange={() =>
                            handleAccompanimentToggle(accompaniment._id!)
                          }
                          className="form-checkbox h-4 w-4 text-[#ff1200] bg-[#0e1113] border-gray-600 rounded focus:ring-[#ff1200]"
                        />
                        <span className="text-sm">
                          {accompaniment.name} - GH₵{accompaniment.price}
                          <span className="text-gray-400 ml-1">
                            ({accompaniment.category})
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">
                    No accompaniments available. Create some first.
                  </p>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Select specific accompaniments that can be added to this menu
                item.
              </p>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className={`w-full px-6 py-3 rounded-lg transition ${
                uploading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-[#ff1200] hover:bg-[#d81b00]"
              } text-white`}
            >
              {uploading ? "Uploading..." : "Add Item"}
            </button>
            {message && (
              <p className="text-[#ff1200] text-center font-medium">
                {message}
              </p>
            )}
          </form>
        </div>
        <div className="bg-[#181c1f] rounded-lg border border-gray-600 p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[#ff1200]">
            Current Menu Items
          </h2>
          <div className="mb-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 border border-gray-600 bg-[#0e1113] text-white rounded-lg cursor-pointer hover:bg-[#1a1f23] hover:shadow-md transition-all duration-200 shadow-sm"
            >
              Filter Categories
            </button>
            {isOpen && (
              <div className="mt-2 bg-[#0e1113] border border-gray-600 rounded-lg shadow-lg p-4 absolute z-10">
                {categories.map((category, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-1"
                  >
                    <span
                      className={`cursor-pointer text-gray-300 hover:text-[#ff1200] transition-colors ${
                        filter.includes(category)
                          ? "font-bold text-[#ff1200]"
                          : ""
                      }`}
                      onClick={() => addFilter(category)}
                    >
                      {category}
                    </span>
                    {filter.includes(category) && (
                      <span className="ml-2 text-[#ff1200]">✔</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {animation === "menu error" ? (
            <div className="h-[65vh] flex justify-center items-center gap-2">
              <div className="flex justify-center items-center flex-col gap-4">
                <p className="text-3xl text-gray-400">Error loading menu</p>
                <button
                  className="bg-[#ff1200] rounded-lg px-4 py-2 cursor-pointer"
                  onClick={refreshMenu}
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <div>
              {menuItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-400">No menu items found.</p>
                </div>
              ) : (
                <div className="space-y-12">
                  {uniqueCategories.map((category, i) => (
                    <div
                      className="bg-[#0e1113] rounded-xl border border-gray-600 shadow-sm p-6"
                      key={i}
                    >
                      <h3 className="text-xl font-bold border-b-2 border-b-[#ff1200] pb-2 mb-6 text-white">
                        {category.toUpperCase()}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {menuItems
                          .filter(
                            (item: MenuItem) => item.category === category
                          )
                          .map((item) => (
                            <AdminMenuItemCard item={item} key={item._id} />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {editItem && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-[#181c1f] border border-gray-600 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 text-[#ff1200]">
                Edit Menu Item
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Item Name:
                  </label>
                  <input
                    name="name"
                    value={editItem.name}
                    onChange={handleChangeEdit}
                    className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Price:
                  </label>
                  <input
                    name="price"
                    value={editItem.price}
                    type="number"
                    step="0.01"
                    onChange={handleChangeEdit}
                    className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Category:
                  </label>
                  <input
                    name="category"
                    value={editItem.category}
                    onChange={handleChangeEdit}
                    className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    New Image (optional):
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={handleImageSelect}
                      className="w-full p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#ff1200] file:text-white hover:file:bg-[#d81b00]"
                    />
                    {imagePreview && (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    {editItem.image && !imagePreview && (
                      <div className="relative">
                        <img
                          src={
                            typeof editItem.image === "string"
                              ? editItem.image
                              : URL.createObjectURL(editItem.image)
                          }
                          alt="Current image"
                          className="w-32 h-32 object-cover rounded-lg border border-gray-600"
                        />
                        <span className="text-xs text-gray-400 block mt-1">
                          Current image
                        </span>
                      </div>
                    )}
                    <p className="text-xs text-gray-400">
                      Maximum size: 5MB. Supported formats: JPEG, PNG, WebP.
                      Images will be automatically optimized.
                    </p>
                  </div>
                </div>

                {/* Edit Accompaniments Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Available Accompaniments:
                  </label>
                  <div className="max-h-40 overflow-y-auto border border-gray-600 rounded-lg p-3 bg-[#0e1113]">
                    {accompaniments.length > 0 ? (
                      <div className="grid grid-cols-1 gap-2">
                        {accompaniments.map((accompaniment) => (
                          <label
                            key={accompaniment._id}
                            className="flex items-center space-x-2 text-white"
                          >
                            <input
                              type="checkbox"
                              checked={editSelectedAccompaniments.includes(
                                accompaniment._id!
                              )}
                              onChange={() =>
                                handleEditAccompanimentToggle(
                                  accompaniment._id!
                                )
                              }
                              className="form-checkbox h-4 w-4 text-[#ff1200] bg-[#0e1113] border-gray-600 rounded focus:ring-[#ff1200]"
                            />
                            <span className="text-sm">
                              {accompaniment.name} - GH₵{accompaniment.price}
                              <span className="text-gray-400 ml-1">
                                ({accompaniment.category})
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">
                        No accompaniments available. Create some first.
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Select specific accompaniments that can be added to this
                    menu item.
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleCustomUpdateItem}
                    disabled={uploading}
                    className={`flex-1 py-3 rounded-lg transition ${
                      uploading
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-[#ff1200] hover:bg-[#d81b00]"
                    } text-white`}
                  >
                    {uploading ? "Updating..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => {
                      handleEditItem(null);
                      setEditSelectedAccompaniments([]);
                    }}
                    className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMenuItems;
