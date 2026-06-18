import axios from "axios";


const BASE_URL = "http://192.168.1.37:8000/api";

export const getDashboard = async () => {
  const res = await axios.get(`${BASE_URL}/dashboard/`);
  return res.data;
};

export const getMonthlyRevenue = async () => {
  const res = await axios.get(`${BASE_URL}/monthly-revenue/`);
  return res.data;
};

// =====================================================
// 🔐 LOGIN
// =====================================================

export async function loginUser(data) {
const response = await fetch(
`${BASE_URL}/login/`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
}
)

return response.json()
}

// =====================================================
// 👤 CREATE USER
// =====================================================

export async function createUser(data) {
const response = await fetch(
`${BASE_URL}/create-user/`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
}
)

return response.json()
}

// =====================================================
// 👥 CUSTOMERS
// =====================================================

export async function getCustomers() {
const response = await fetch(
`${BASE_URL}/customers/`
)

return response.json()
}

export async function createCustomer(data) {
const response = await fetch(
`${BASE_URL}/customers/`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
}
)

return response.json()
}

export async function deleteCustomer(id) {

  const response = await fetch(
    `${BASE_URL}/customers/${id}/`,
    {
      method: "DELETE",
    }
  )

  return response
}

// =====================================================
// 📦 ITEMS
// =====================================================

export async function getItems() {
const response = await fetch(
`${BASE_URL}/items/`
)

return response.json()
}

export async function createItem(formData) {
  const response = await fetch(
    `${BASE_URL}/items/`,
    {
      method: "POST",
      body: formData,
    }
  )

  return response.json()
}

export async function updateItem(id, data) {
const response = await fetch(
`${BASE_URL}/items/${id}/`,
{
method: "PUT",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
}
)

return response.json()
}

export async function deleteItem(id) {
const response = await fetch(
`${BASE_URL}/items/${id}/`,
{
method: "DELETE",
}
)

return response
}

// =====================================================
// 👨‍💼 SALES PERSONS
// =====================================================

export async function getStaff() {
const response = await fetch(
`${BASE_URL}/sales-persons/`
)

return response.json()
}

export async function createStaff(data) {
const response = await fetch(
`${BASE_URL}/sales-persons/`,
{
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
}
)

return response.json()
}

export async function updateStaff(id, data) {
const response = await fetch(
`${BASE_URL}/sales-persons/${id}/`,
{
method: "PUT",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(data),
}
)

return response.json()
}

export async function deleteStaffApi(id) {
const response = await fetch(
`${BASE_URL}/sales-persons/${id}/`,
{
method: "DELETE",
}
)

return response
}

// =====================================================
// 📋 ORDERS
// =====================================================

// =====================================================
// 📋 ORDERS API (FIXED)
// =====================================================

export async function getOrders() {
  return request(`${BASE_URL}/orders/`)
}

export async function createOrder(data) {
  const response = await fetch(`${BASE_URL}/orders/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  const text = await response.text()

  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    parsed = text
  }

  if (!response.ok) {
    console.log("❌ STATUS:", response.status)
    console.log("❌ RAW RESPONSE:", text)
    console.log("❌ PARSED RESPONSE:", parsed)

    throw parsed
  }

  return parsed
}

export async function updateOrder(id, data) {
  return request(`${BASE_URL}/orders/${id}/`, {
    method: "PUT",
    body: data,
  })
}

export async function deleteOrder(id) {
  return request(`${BASE_URL}/orders/${id}/`, {
    method: "DELETE",
  })
}

export async function cancelOrder(id) {
  return request(`${BASE_URL}/orders/${id}/cancel_order/`, {
    method: "POST",
  })
}

// =====================================================
// 🔥 IMPORTANT FETCH WRAPPER (THIS FIXES YOUR 400 ISSUE VISIBILITY)
// =====================================================
async function request(url, options = {}) {
  const response = await fetch(url, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  let data = null

  try {
    data = await response.json()
  } catch (e) {
    data = null
  }

  // ❌ THIS IS THE KEY FIX (YOU WERE MISSING THIS)
  if (!response.ok) {
    console.error("❌ ORDER API ERROR:", {
      url,
      status: response.status,
      error: data,
    })

    throw {
      status: response.status,
      error: data,
    }
  }

  return data
}


export function downloadHashtagReport() {
  window.open(
    `${BASE_URL}/reports/hastag/`,
    "_blank"
  )
}

export async function getCategories() {
  const response = await fetch(
    `${BASE_URL}/categories/`
  )

  return response.json()
}

export async function createVariant(data) {
  const response = await fetch(
    `${BASE_URL}/variants/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  )

  return response.json()
}

export async function getVariants() {
  const res = await axios.get(
    `${BASE_URL}/variants/`
  )

  return res.data
}

export async function getOrderById(id) {
  return request(
    `${BASE_URL}/orders/${id}/`
  )
}


export async function markPacked(id) {
  const response = await fetch(
    `${BASE_URL}/orders/${id}/mark_packed/`,
    {
      method: "PATCH",
    }
  );

  return response.json();
}
export async function getOrderBill(id) {
  return request(`${BASE_URL}/orders/${id}/bill/`)
}