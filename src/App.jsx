import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom"
import { useState, useEffect } from "react"

import Sidebar from "./components/Sidebar"

import Dashboard from "./pages/Dashboard"
import CustomerPage from "./pages/Customer_page"
import OrderPage from "./pages/Order_page"
import SettingsPage from "./pages/Setting_page"
import StockPage from "./pages/Stock_page"
import StaffPage from "./pages/Staff_page"
import AddStaffPage from "./pages/AddStaffPage"
import AddItemPage from "./pages/AddItemPage"
import LoginPage from "./pages/LoginPage"
import CreateOrderPage from "./pages/CreateOrderPage"
import ReportPage from "./pages/ReportPage"
import EditOrderPage from "./pages/EditOrderPage";
import PackingPage from "./pages/Packing_order";
import BillPrint from "./pages/InvoicePage";
import CompanySettingsPage from "./pages/CompanySettingsPage"
import LayoutSettingsPage from "./pages/LayoutSettingsPage"



// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute({ children }) {

  const token = localStorage.getItem("token")

  return token
    ? children
    : <Navigate to="/" />
}

// =====================================================
// LAYOUT
// =====================================================

function Layout() {

  const location = useLocation()

  const isLoginPage = location.pathname === "/"

  const [theme, setTheme] = useState("dark")

  useEffect(() => {

    const settings = JSON.parse(
      localStorage.getItem("layoutSettings") || "{}"
    )

    setTheme(settings.theme || "dark")

    const handleStorage = () => {

      const updated = JSON.parse(
        localStorage.getItem("layoutSettings") || "{}"
      )

      setTheme(updated.theme || "dark")
    }

    window.addEventListener("storage", handleStorage)

    return () =>
      window.removeEventListener(
        "storage",
        handleStorage
      )

  }, [])

  return (

    <div
      className={`min-h-screen flex transition-all duration-300 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >

      {!isLoginPage && <Sidebar />}

      <main
        className={`flex-1 overflow-auto ${
          !isLoginPage ? "ml-72" : ""
        }`}
      >

        <Routes>

          <Route
            path="/"
            element={<LoginPage />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stock"
            element={
              <ProtectedRoute>
                <StockPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff"
            element={
              <ProtectedRoute>
                <StaffPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/staff/add-staff"
            element={
              <ProtectedRoute>
                <AddStaffPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stock/add-item"
            element={
              <ProtectedRoute>
                <AddItemPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/createorder"
            element={
              <ProtectedRoute>
                <CreateOrderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editorder/:id"
            element={
              <ProtectedRoute>
                <EditOrderPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/packing/:orderId"
            element={
              <ProtectedRoute>
                <PackingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bill/:orderId"
            element={
              <ProtectedRoute>
                <BillPrint />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/company"
            element={
              <ProtectedRoute>
                <CompanySettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings/layout"
            element={
              <ProtectedRoute>
                <LayoutSettingsPage />
              </ProtectedRoute>
            }
          />

        </Routes>

      </main>

    </div>
  )
}
// =====================================================
// APP
// =====================================================

export default function App() {

  return (

    <BrowserRouter>

      <Layout />

    </BrowserRouter>

  )
}