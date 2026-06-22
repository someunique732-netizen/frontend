import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LayoutSettingsPage() {
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [compactTables, setCompactTables] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [invoiceSize, setInvoiceSize] = useState("80mm");
  const [itemsPerPage, setItemsPerPage] = useState(50);

  useEffect(() => {
    const saved = localStorage.getItem("layoutSettings");
    if (saved) {
      const settings = JSON.parse(saved);
      setSidebarCollapsed(settings.sidebarCollapsed ?? false);
      setCompactTables(settings.compactTables ?? false);
      setAnimations(settings.animations ?? true);
      setInvoiceSize(settings.invoiceSize ?? "80mm");
      setItemsPerPage(settings.itemsPerPage ?? 50);
    }
  }, []);

  const saveSettings = () => {
    const settings = {
      sidebarCollapsed,
      compactTables,
      animations,
      invoiceSize,
      itemsPerPage,
    };
    localStorage.setItem("layoutSettings", JSON.stringify(settings));
    alert("Layout settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-8">

      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
        >
          <ArrowLeft size={22} />
        </button>

        <div>
          <h1 className="text-5xl font-bold">Layout Settings</h1>
          <p className="text-gray-400 mt-2">
            Customize how your dashboard is structured and arranged
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-5xl">

        {/* Sidebar Collapse */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Sidebar Collapse</h2>
              <p className="text-gray-400 mt-2">
                Makes the sidebar smaller by showing only icons.
              </p>
              <ul className="mt-4 text-sm text-gray-500 space-y-1">
                <li>• Saves screen space</li>
                <li>• Better for laptops</li>
                <li>• Shows more table data</li>
              </ul>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sidebarCollapsed}
                onChange={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-indigo-600 transition-all after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-7" />
            </label>
          </div>
        </div>

        {/* Compact Tables */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Compact Tables</h2>
              <p className="text-gray-400 mt-2">
                Reduce row height and fit more products on screen.
              </p>
              <ul className="mt-4 text-sm text-gray-500 space-y-1">
                <li>• Better stock management</li>
                <li>• Less scrolling</li>
                <li>• Faster browsing</li>
              </ul>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={compactTables}
                onChange={() => setCompactTables(!compactTables)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-indigo-600 transition-all after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-7" />
            </label>
          </div>
        </div>

        {/* Animations */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Enable Animations</h2>
              <p className="text-gray-400 mt-2">
                Controls hover effects and page transitions.
              </p>
              <ul className="mt-4 text-sm text-gray-500 space-y-1">
                <li>• Smooth user experience</li>
                <li>• Animated cards</li>
                <li>• Can be disabled for speed</li>
              </ul>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={animations}
                onChange={() => setAnimations(!animations)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:bg-indigo-600 transition-all after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:after:translate-x-7" />
            </label>
          </div>
        </div>

        {/* Invoice Paper Size */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold">Invoice Paper Size</h2>
          <p className="text-gray-400 mt-2">
            Select bill size used when printing invoices.
          </p>
          <select
            value={invoiceSize}
            onChange={(e) => setInvoiceSize(e.target.value)}
            className="mt-5 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full text-white"
          >
            <option value="58mm">58mm Receipt</option>
            <option value="80mm">80mm Receipt</option>
            <option value="A4">A4 Invoice</option>
          </select>
        </div>

        {/* Items Per Page */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
          <h2 className="text-2xl font-bold">Items Per Page</h2>
          <p className="text-gray-400 mt-2">
            Number of records shown in tables.
          </p>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="mt-5 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 w-full text-white"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          className="w-full py-5 rounded-3xl bg-indigo-600 hover:bg-indigo-700 text-lg font-bold transition"
        >
          Save Layout Settings
        </button>

      </div>
    </div>
  );
}
