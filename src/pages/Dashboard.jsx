import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  getDashboard,
  getMonthlyRevenue,
} from "../services/api";

const COLORS = ["#8B5CF6", "#06B6D4", "#10B981", "#F59E0B"];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const dash = await getDashboard();
        const monthly = await getMonthlyRevenue();

        setData(dash);
        setMonthlyData(monthly);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-white p-10">
        Loading dashboard...
      </div>
    );
  }

  const categoryData =
    data?.category_data?.map((item) => ({
      name: item.category_name,
      value: item.value,
    })) || [];

  return (
    <div className="min-h-screen bg-[#0F172A] text-white p-8">

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <Card
          title="Revenue"
          value={`Rs. ${data?.revenue ?? 0}`}
          color="text-green-400"
        />

        <Card
          title="Orders"
          value={data?.orders ?? 0}
          color="text-cyan-400"
        />

        <Card
          title="Customers"
          value={data?.customers ?? 0}
          color="text-purple-400"
        />

        <Card
          title="Profit"
          value={`Rs. ${data?.profit ?? 0}`}
          color="text-yellow-400"
        />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

        {/* MONTHLY REVENUE */}
        <div className="xl:col-span-2 bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <h2 className="text-2xl font-bold mb-6">
            Monthly Revenue
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={monthlyData}>

              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8B5CF6"
                strokeWidth={4}
              />

            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* CATEGORY PIE */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <h2 className="text-2xl font-bold mb-6">
            Category Analysis
          </h2>

          <PieChart width={300} height={300}>
            <Pie
              data={categoryData}
              dataKey="value"
              outerRadius={100}
              label
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </div>
      </div>

      {/* ================= TABLE + ANALYTICS ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

        {/* RECENT ORDERS */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <h2 className="text-2xl font-bold mb-6">
            Recent Orders
          </h2>

          <table className="w-full">
            <thead className="text-slate-400">
              <tr>
                <th className="p-2">Order ID</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>

            <tbody>
              {data?.recent_orders?.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-slate-800"
                >
                  <td className="p-2">#{order.id}</td>
                  <td className="p-2">{order.customer}</td>
                  <td className="p-2 text-green-400">
                    Rs. {order.amount ?? 0}
                  </td>
                  <td className="p-2">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CUSTOMER ANALYTICS */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800">
          <h2 className="text-2xl font-bold mb-6">
            Customer Analytics
          </h2>

          <div className="space-y-6">

            <div className="flex justify-between">
              <span>Total Customers</span>
              <span className="text-yellow-400">
                {data?.customers}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Orders</span>
              <span className="text-cyan-400">
                {data?.orders}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Revenue</span>
              <span className="text-green-400">
                Rs. {data?.revenue ?? 0}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ================= LOW STOCK ================= */}
      <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-6">
        <h2 className="text-2xl font-bold text-red-400 mb-6">
          Low Stock Alerts
        </h2>

        <div className="space-y-4">
          {data?.low_stock_items?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between bg-black/20 p-4 rounded-xl"
            >
              <span>{item.name}</span>
              <span className="text-red-400 font-bold">
                {item.stock} left
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================= CARD ================= */
function Card({ title, value, color }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
      <p className="text-slate-400">{title}</p>
      <h2 className={`text-4xl font-black mt-4 ${color}`}>
        {value}
      </h2>
    </div>
  );
}