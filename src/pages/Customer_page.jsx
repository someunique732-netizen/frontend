import { useEffect, useState } from "react";
import { getCustomers } from "../services/api";

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredCustomers = customers.filter((customer) =>
    customer.customer_name?.toLowerCase().includes(search.toLowerCase())
  );

  const totalCustomers = customers.length;

  const activeCustomers = customers.filter(
    (c) => c.status === "Active"
  ).length;

  const pendingCustomers = customers.filter(
    (c) => c.status === "Pending"
  ).length;

  return (
    <div className="min-h-screen bg-[#0B1220] text-white p-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">

        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage customer records
          </p>
        </div>

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-sm w-64 outline-none focus:border-purple-500"
          />

          <button className="bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-xl text-sm font-medium transition">
            Add
          </button>

        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        <Stat title="Total" value={totalCustomers} />
        <Stat title="Active" value={activeCustomers} color="text-green-400" />
        <Stat title="Pending" value={pendingCustomers} color="text-yellow-400" />

      </div>

      {/* TABLE */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">

        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Loading customers...
          </div>
        ) : (
          <table className="w-full text-sm">

            {/* HEADER */}
            <thead className="bg-white/5 text-gray-300">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Municipality</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-t border-white/5 hover:bg-white/5 transition"
                >

                  <td className="p-3 font-medium">
                    {customer.customer_name}
                  </td>

                  <td className="p-3 text-gray-300">
                    {customer.phone1}
                  </td>

                  <td className="p-3 text-gray-300">
                    {customer.municipality}
                  </td>

                  <td className="p-3 text-gray-300">
                    {customer.address}
                  </td>

                  <td className="p-3">
                    <span className={`text-xs px-2 py-1 rounded-md ${
                      customer.status === "Active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {customer.status || "Active"}
                    </span>
                  </td>

                  <td className="p-3">
                    <div className="flex gap-2">

                      <button className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-md hover:bg-blue-500/30">
                        View
                      </button>

                      <button className="text-xs px-3 py-1 bg-orange-500/20 text-orange-400 rounded-md hover:bg-orange-500/30">
                        Edit
                      </button>

                      <button className="text-xs px-3 py-1 bg-red-500/20 text-red-400 rounded-md hover:bg-red-500/30">
                        Delete
                      </button>

                    </div>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}
      </div>
    </div>
  );
}

/* ================= SMALL CARD ================= */
function Stat({ title, value, color = "text-white" }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <p className="text-gray-400 text-xs">{title}</p>
      <h2 className={`text-2xl font-bold mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );
}