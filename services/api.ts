// Use environment variable for API URL in production, fallback to localhost for development
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const signup = (
  name: string,
  email: string,
  password: string,
  phone: string
) =>
  fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, phone }),
  }).then((res) => res.json());

// services/api.ts
export const login = async (identifier: string, password: string) => {
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    return await res.json(); // should return { success: true, token, user } or { error: "...", success: false }
  } catch (err) {
    console.error("Login failed:", err);
    return { success: false, error: "Network error" + err };
  }
};

// === MENU ===
export const fetchMenu = () =>
  fetch(`${API_BASE}/menu`).then((res) => res.json());

export const seedMenu = () =>
  fetch(`${API_BASE}/seed-menu`).then((res) => res.json());

export const createMenuItem = (data: unknown) =>
  fetch(`${API_BASE}/admin/create-menu-item`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const updateMenuItem = (id: string, data: unknown) =>
  fetch(`${API_BASE}/admin/update-menu-item/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const deleteMenuItem = (id: string) =>
  fetch(`${API_BASE}/admin/delete-menu-item/${id}`, {
    method: "DELETE",
  }).then((res) => res.json());

export const updatePrice = (id: string, price: number) =>
  fetch(`${API_BASE}/admin/update-price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, price }),
  }).then((res) => res.json());

// === AUTH ===

export const forgotPassword = (data: unknown) =>
  fetch(`${API_BASE}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const verifyResetCode = (data: unknown) =>
  fetch(`${API_BASE}/verify-reset-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const resetPassword = (data: unknown) =>
  fetch(`${API_BASE}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());

// === USER ORDERS ===
export const placeOrder = (data: unknown) =>
  fetch(`${API_BASE}/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const fetchOrders = (userId: string) =>
  fetch(`${API_BASE}/user-orders/${userId}`).then((res) => res.json());

export const fetchFinishedOrders = (userId: string, token?: string) =>
  fetch(`${API_BASE}/user-finished-orders/${userId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  }).then((res) => res.json());

export const markOrderAsFinished = (orderId: string) =>
  fetch(`${API_BASE}/user/mark-finished`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  }).then((res) => res.json());

// === ADMIN ===
export const fetchAdminOrders = () =>
  fetch(`${API_BASE}/admin/orders`).then((res) => res.json());

export const assignRider = (orderId: string, riderId: string) =>
  fetch(`${API_BASE}/admin/assign-rider`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, riderId }),
  }).then((res) => res.json());

export const updateOrderStatus = (
  orderId: string,
  statusKey: string,
  value: string
) =>
  fetch(`${API_BASE}/admin/order-status`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId, statusKey, value }),
  }).then((res) => res.json());

export const fetchAllRiders = () =>
  fetch(`${API_BASE}/admin/riders`).then((res) => res.json());

export const createAdminOrRider = (data: unknown) =>
  fetch(`${API_BASE}/admin/create-user`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then((res) => res.json());

export const fetchFinishedOrdersAdmin = () =>
  fetch(`${API_BASE}/admin/finished-orders`).then((res) => res.json());

export const deleteFinishedOrder = (orderId: string) =>
  fetch(`${API_BASE}/admin/finished-orders/${orderId}`, {
    method: "DELETE",
  }).then((res) => res.json());

export const fetchRiderFinishedDeliveriesAdmin = () =>
  fetch(`${API_BASE}/admin/rider-finished-deliveries`).then((res) =>
    res.json()
  );

export const fetchAdminMenuItems = () =>
  fetch(`${API_BASE}/menu`).then((res) => res.json());

// === RIDER ===

export const fetchRiderCurrentOrders = (riderId: string) =>
  fetch(`${API_BASE}/rider/current-orders/${riderId}`).then((res) =>
    res.json()
  );

export const fetchRiderFinishedOrders = (riderId: string) =>
  fetch(`${API_BASE}/rider/finished-orders/${riderId}`).then((res) =>
    res.json()
  );

export const confirmRiderDelivery = (orderId: string) =>
  fetch(`${API_BASE}/rider/confirm-delivery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  }).then((res) => res.json());
