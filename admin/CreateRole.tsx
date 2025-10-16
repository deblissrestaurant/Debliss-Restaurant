import { useEffect, useState } from "react";
import { useAdminStore } from "../stores/adminStore";
import AdminSideBar from "./AdminSideBar";

const CreateRole = () => {
  const { handleCreateUser } = useAdminStore();
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });
  const [newRider, setNewRider] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });

  const handleCreateAdmin = async () => {
    const adminWithRole = { ...newAdmin, role: "admin" };
    await handleCreateUser(adminWithRole);
    // Clear form after successful creation if needed
    // setNewAdmin({ name: "", email: "", password: "", phone: "", role: "" });
  };

  const handleCreateRiderSubmit = async () => {
    const riderWithRole = { ...newRider, role: "rider" };
    await handleCreateUser(riderWithRole);
    // Clear form after successful creation if needed
    // setNewRider({ name: "", email: "", password: "", phone: "", role: "" });
  };

  useEffect(() => {
    console.log(newAdmin);
    console.log(newRider);
  }, [newAdmin, newRider]);

  return (
    <div className="ml-65">
      <AdminSideBar />
      <div className="p-6 h-screen flex flex-col">
        <h1 className="text-center text-4xl font-bold pb-6">Create New Role</h1>
        <div className="flex gap-4 flex-col flex-1">
          <div className="bg-[#181c1f] rounded-lg border border-gray-600 p-4 sm:p-6 mb-6 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#ff1200]">
              Create New Admin
            </h2>
            <div className="flex flex-col gap-4">
              <input
                name="name"
                placeholder="Name"
                value={newAdmin.name}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, name: e.target.value })
                }
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={newAdmin.phone}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, phone: e.target.value })
                }
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
              <button
                onClick={handleCreateAdmin}
                className="bg-[#ff1200] text-white px-6 py-3 rounded-lg hover:bg-[#d81b00] transition"
              >
                Create Admin
              </button>
            </div>
          </div>
          <div className="bg-[#181c1f] rounded-lg border border-gray-600 p-4 sm:p-6 mb-6 flex-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[#ff1200]">
              Create New Rider
            </h2>
            <div className="flex flex-col gap-4">
              <input
                name="name"
                placeholder="Name"
                value={newRider.name}
                onChange={(e) =>
                  setNewRider({ ...newRider, name: e.target.value })
                }
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={newRider.email}
                onChange={(e) =>
                  setNewRider({ ...newRider, email: e.target.value })
                }
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={newRider.password}
                onChange={(e) =>
                  setNewRider({ ...newRider, password: e.target.value })
                }
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={newRider.phone}
                onChange={(e) =>
                  setNewRider({ ...newRider, phone: e.target.value })
                }
                className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:border-[#ff1200] bg-[#0e1113] text-white placeholder-gray-400"
              />
              <button
                onClick={handleCreateRiderSubmit}
                className="bg-[#ff1200] text-white px-6 py-3 rounded-lg hover:bg-[#d81b00] transition"
              >
                Create Rider
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRole;
