// Admin Dashboard API Client Configuration
// All requests flow through the API Gateway
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const apiClient = {
  // Auth Service (Port 7001)
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    verify: `${API_BASE_URL}/auth/verify`,
    refresh: `${API_BASE_URL}/auth/refresh`,
  },

  // Admin Service (Port 7003)
  admin: {
    users: `${API_BASE_URL}/admin/users`,
    merchants: `${API_BASE_URL}/admin/merchants`,
    transactions: `${API_BASE_URL}/admin/transactions`,
    transactionsFraud: `${API_BASE_URL}/admin/transactions/fraud`,
    transactionApprove: (ref: string) => `${API_BASE_URL}/admin/transactions/${ref}/approve`,
    transactionDecline: (ref: string) => `${API_BASE_URL}/admin/transactions/${ref}/decline`,
    settlementTrigger: `${API_BASE_URL}/admin/settlements/trigger`,
    reports: `${API_BASE_URL}/admin/reports`,
  },

  // Transaction Service (Port 7004)
  transactions: {
    list: `${API_BASE_URL}/transactions`,
    get: (id: number) => `${API_BASE_URL}/transactions/${id}`,
    search: `${API_BASE_URL}/transactions/search`,
  },

  // Merchant Service (Port 7002)
  merchants: {
    list: `${API_BASE_URL}/merchants`,
    get: (id: number) => `${API_BASE_URL}/merchants/${id}`,
    profile: `${API_BASE_URL}/merchants/profile`,
    settings: `${API_BASE_URL}/merchants/settings`,
  },

  // Compliance Service (Port 7015)
  compliance: {
    kyc: `${API_BASE_URL}/compliance/kyc`,
    aml: `${API_BASE_URL}/compliance/aml`,
    reports: `${API_BASE_URL}/compliance/reports`,
  },

  // Fraud Service (Port 7012)
  fraud: {
    check: `${API_BASE_URL}/fraud/check`,
    rules: `${API_BASE_URL}/fraud/rules`,
    alerts: `${API_BASE_URL}/fraud/alerts`,
  },

  // Dispute Service (Port 7013)
  disputes: {
    list: `${API_BASE_URL}/disputes`,
    get: (id: number) => `${API_BASE_URL}/disputes/${id}`,
    resolve: `${API_BASE_URL}/disputes/resolve`,
  },

  // Settlement Service (Port 7008)
  settlement: {
    list: `${API_BASE_URL}/settlements`,
    get: (id: number) => `${API_BASE_URL}/settlements/${id}`,
    reconcile: `${API_BASE_URL}/settlement/reconcile`, // This line needs to be corrected
  },

  // Fee Service (Port 7017)
  fees: {
    list: `${API_BASE_URL}/fees`,
    calculate: `${API_BASE_URL}/fees/calculate`,
    rules: `${API_BASE_URL}/fees/rules`,
  },
};

export async function fetchFromAPI(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("authToken");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  // Gracefully handle endpoints that return no body
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    // Fallback to raw text if JSON parsing fails
    return text as unknown;
  }
}
