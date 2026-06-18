import { useEffect, useMemo, useState } from "react"

import { useNavigate } from "react-router-dom"

import NepaliDate from "nepali-date-converter"

import PackingModal from "../components/scanner"

import {
  getOrders,
  deleteOrder
} from "../services/api"

import DeleteConfirmBox from "../components/DeleteConfirmBox"


export default function OrderPage() {

  const [showPendingOnly, setShowPendingOnly] = useState(false);

  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const [orders, setOrders] = useState([])

  const [search, setSearch] = useState("")

  const [selectedOrder, setSelectedOrder] = useState(null)

  const [deleteOrderId, setDeleteOrderId] = useState(null)

  const [filterType, setFilterType] = useState("today")

  const [startDate, setStartDate] = useState("")

  const [endDate, setEndDate] = useState("")

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  useEffect(() => {
    if (filterType !== "today") {
      setShowPendingOnly(false);
    }
  }, [filterType]);

  useEffect(() => {

    fetchAllOrders()

  }, [])

  async function fetchAllOrders() {

    try {

      setLoading(true)

      const data = await getOrders()

      setOrders(data)

    } catch (error) {

      console.log(error)

    } finally {

      setLoading(false)
    }
  }

  // =====================================================
  // DELETE ORDER
  // =====================================================

  async function confirmDelete() {
  try {
    setLoading(true)

    await deleteOrder(deleteOrderId)

    setOrders((prev) =>
      prev.filter((o) => o.id !== deleteOrderId)
    )

    setDeleteOrderId(null)

  } catch (error) {
    console.log(error)
  } finally {
    setLoading(false)
  }
}
  // =====================================================
  // GO TO PACKING PAGE
  // =====================================================

 const goToPacking = (order) => {
    navigate(`/packing/${order.id}`, {
      state: order, // send full order data
    });
  };
  // =====================================================
  // FILTERED ORDERS
  // =====================================================

  const filteredOrders = useMemo(() => {

    const now = new Date()

    return orders.filter((order) => {

      const customer =
        order.customer?.customer_name
          ?.toLowerCase()

      const matchesSearch =
        customer?.includes(
          search.toLowerCase()
        )

      const orderDate = new Date(
        order.order_date
      )
      // PENDING
      if (
        showPendingOnly &&
        order.status === "packed"
      ) {
        return false;
      }

      // TODAY
      if (filterType === "today") {

        return (
          matchesSearch &&
          orderDate.toDateString() ===
          now.toDateString()
        )
      }

      // YESTERDAY
      if (filterType === "yesterday") {

        const yesterday = new Date()

        yesterday.setDate(
          yesterday.getDate() - 1
        )

        return (
          matchesSearch &&
          orderDate.toDateString() ===
          yesterday.toDateString()
        )
      }

      // MONTH
      if (filterType === "month") {

        return (
          matchesSearch &&
          orderDate.getMonth() ===
          now.getMonth() &&
          orderDate.getFullYear() ===
          now.getFullYear()
        )
      }

      // YEAR
      if (filterType === "year") {

        return (
          matchesSearch &&
          orderDate.getFullYear() ===
          now.getFullYear()
        )
      }

      // CUSTOM DATE
      if (filterType === "custom") {

        if (!startDate || !endDate)
          return matchesSearch

        const start = new Date(startDate)

        const end = new Date(endDate)

        return (
          matchesSearch &&
          orderDate >= start &&
          orderDate <= end
        )
      }

      return matchesSearch
    })

  }, [
    orders,
    search,
    filterType,
    startDate,
    endDate,
    showPendingOnly
  ])

  // =====================================================
  // TOTAL AMOUNT
  // =====================================================

  const totalOrders = filteredOrders.length

  return (

    <div className="min-h-screen bg-black text-white p-6">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div>

          <p className="uppercase tracking-[6px] text-gray-500 text-sm">

            Logistics Dashboard

          </p>

          <h1 className="text-4xl lg:text-5xl font-black mt-2">

            Orders Management

          </h1>

        </div>

        <div className="flex gap-3 w-full lg:w-auto">

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search customer..."
            className="bg-zinc-950 border border-zinc-800 px-5 py-4 rounded-2xl outline-none focus:border-white transition w-full lg:w-80"
          />

          <button
            onClick={() => navigate("/createorder")}
            className="bg-white text-black px-6 py-4 rounded-2xl font-bold whitespace-nowrap"
          >

            Create Order

          </button>

        </div>
      </div>

      {/* FILTER TOOLBAR */}

<div className="flex flex-wrap items-center gap-3 mb-8">

  <select
    value={filterType}
    onChange={(e) =>
      setFilterType(e.target.value)
    }
    className="bg-zinc-950 border border-zinc-800 px-4 py-4 rounded-2xl outline-none"
  >
    <option value="today">
      Today
    </option>

    <option value="yesterday">
      Yesterday
    </option>

    <option value="month">
      This Month
    </option>

    <option value="year">
      This Year
    </option>

    <option value="custom">
      Custom Range
    </option>

  </select>

  {filterType === "today" && (
    <button
      onClick={() =>
        setShowPendingOnly(!showPendingOnly)
      }
      className={`px-4 py-4 rounded-2xl font-semibold transition ${
        showPendingOnly
          ? "bg-green-500 text-black"
          : "bg-zinc-950 border border-zinc-800"
      }`}
    >
      Pending Orders
    </button>
  )}

  {filterType === "custom" && (
    <>
      <input
        type="date"
        value={startDate}
        onChange={(e) =>
          setStartDate(e.target.value)
        }
        className="bg-zinc-950 border border-zinc-800 px-4 py-4 rounded-2xl"
      />

      <input
        type="date"
        value={endDate}
        onChange={(e) =>
          setEndDate(e.target.value)
        }
        className="bg-zinc-950 border border-zinc-800 px-4 py-4 rounded-2xl"
      />
    </>
  )}

  <div className="ml-auto bg-gradient-to-r from-blue-500 to-purple-500 px-5 py-4 rounded-2xl font-bold">

    Orders: {totalOrders}

  </div>

</div>

      {/* ===================================================== */}
      {/* TABLE */}
      {/* ===================================================== */}

      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden">

        {loading ? (

          <div className="p-10 text-center text-gray-400">

            Loading Orders...

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-zinc-900">

                <tr className="text-left text-gray-300">

                  <th className="p-5">ID</th>
                  <th className="p-5">Customer</th>
                  <th className="p-5">Amount</th>
                  <th className="p-5">Date</th>
                  <th className="p-5">Items</th>
                  <th className="p-5">Status</th>
                  <th className="p-5 text-center">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredOrders.map((order) => {

                  const nepaliDate =
                    new NepaliDate(
                      new Date(order.order_date)
                    ).format("YYYY-MM-DD")

                  return (

                    <tr
                      key={order.id}
                      className="border-t border-zinc-800 hover:bg-white/5 transition"
                    >

                      {/* ID */}

                      <td className="p-5 text-gray-400">

                        #{order.id}

                      </td>

                      {/* CUSTOMER */}

                      <td className="p-5 font-semibold">

                        {
                          order.customer
                            ?.customer_name
                        }

                      </td>

                      {/* AMOUNT */}

                      <td className="p-5">

                        <span className="bg-green-500/10 text-green-400 px-3 py-1 rounded-xl">

                          Rs. {
                            order.total_amount
                          }

                        </span>

                      </td>

                      {/* DATE */}

                      <td className="p-5 text-gray-400">

                        {nepaliDate}

                      </td>

                      {/* ITEMS */}

                      <td className="p-5">

                        {
                          order.items?.length
                        } items

                      </td>
                      <td className="p-5">
                        {order.status === "packed" ? (
                          <span className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-xl">
                            Packed
                          </span>
                        ) : (
                          <span className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-xl">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* ACTIONS */}

                      <td className="p-5">

                        <div className="flex justify-center gap-3">

                          {new Date(order.order_date).toDateString() ===
                            new Date().toDateString() &&
                            order.status !== "packed" && (
                              <button
                                onClick={() => goToPacking(order)}
                                className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-xl text-sm font-semibold transition"
                              >
                                Packing
                              </button>
                            )
                          }

                          <button
                            onClick={() => navigate(`/editorder/${order.id}`)}
                            className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl text-sm font-semibold transition">
                            Edit
                          </button>

                          <button
                            onClick={() => setDeleteOrderId(order.id)}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl text-sm font-semibold transition"
                          >
                            Delete
                          </button>

                          <button
                            onClick={() => navigate(`/bill/${order.id}`)}
                            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl text-sm font-semibold transition"
                          >
                            Bill
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                })}

              </tbody>

            </table>

          </div>

        )}

      </div>


      {/* ===================================================== */}
      {/* DELETE MODAL */}
      {/* ===================================================== */}

     {/* DELETE BOX COMPONENT (NO UI CHANGE) */}
      {deleteOrderId && (
        <DeleteConfirmBox
          onCancel={() => setDeleteOrderId(null)}
          onConfirm={confirmDelete}
          loading={loading}
        />
      )}
    </div>
  )
}