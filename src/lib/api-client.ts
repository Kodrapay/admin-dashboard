// Admin Dashboard API Client Configuration
// Services are accessed directly on their individual ports, not through the gateway
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:7000";

// Service endpoints (accessed directly for now)
const SERVICES = {
  AUTH_SERVICE: "http://localhost:7001",
  ADMIN_SERVICE: "http://localhost:7003",
  MERCHANT_SERVICE: "http://localhost:7002",
  TRANSACTION_SERVICE: "http://localhost:7004",
  COMPLIANCE_SERVICE: "http://localhost:7015",
  FRAUD_SERVICE: "http://localhost:7012",
  DISPUTE_SERVICE: "http://localhost:7013",
  SETTLEMENT_SERVICE: "http://localhost:7008",
  FEE_SERVICE: "http://localhost:7017",
};

export const apiClient = {
  // Auth Service (Port 7001)
  auth: {
    login: `${SERVICES.AUTH_SERVICE}/auth/login`,
    register: `${SERVICES.AUTH_SERVICE}/auth/register`,
    verify: `${SERVICES.AUTH_SERVICE}/auth/verify`,
    refresh: `${SERVICES.AUTH_SERVICE}/auth/refresh`,
  },

  // Admin Service (Port 7003)
  admin: {
    users: `${SERVICES.ADMIN_SERVICE}/admin/users`,
    merchants: `${SERVICES.ADMIN_SERVICE}/admin/merchants`,
    transactions: `${SERVICES.ADMIN_SERVICE}/admin/transactions`,
    reports: `${SERVICES.ADMIN_SERVICE}/admin/reports`,
  },

  // Transaction Service (Port 7004)
  transactions: {
    list: `${SERVICES.TRANSACTION_SERVICE}/transactions`,
    get: (id: string) => `${SERVICES.TRANSACTION_SERVICE}/transactions/${id}`,
    search: `${SERVICES.TRANSACTION_SERVICE}/transactions/search`,
  },

  // Merchant Service (Port 7002)
  merchants: {
    list: `${SERVICES.MERCHANT_SERVICE}/merchants`,
    get: (id: string) => `${SERVICES.MERCHANT_SERVICE}/merchants/${id}`,
    profile: `${SERVICES.MERCHANT_SERVICE}/merchants/profile`,
    settings: `${SERVICES.MERCHANT_SERVICE}/merchants/settings`,
  },

  // Compliance Service (Port 7015)
  compliance: {
    kyc: `${SERVICES.COMPLIANCE_SERVICE}/compliance/kyc`,
    aml: `${SERVICES.COMPLIANCE_SERVICE}/compliance/aml`,
    reports: `${SERVICES.COMPLIANCE_SERVICE}/compliance/reports`,
  },

  // Fraud Service (Port 7012)
  fraud: {
    check: `${SERVICES.FRAUD_SERVICE}/fraud/check`,
    rules: `${SERVICES.FRAUD_SERVICE}/fraud/rules`,
    alerts: `${SERVICES.FRAUD_SERVICE}/fraud/alerts`,
  },

  // Dispute Service (Port 7013)
  disputes: {
    list: `${SERVICES.DISPUTE_SERVICE}/disputes`,
    get: (id: string) => `${SERVICES.DISPUTE_SERVICE}/disputes/${id}`,
    resolve: `${SERVICES.DISPUTE_SERVICE}/disputes/resolve`,
  },

  // Settlement Service (Port 7008)
  settlement: {
    list: `${SERVICES.SETTLEMENT_SERVICE}/settlements`,
    get: (id: string) => `${SERVICES.SETTLEMENT_SERVICE}/settlements/${id}`,
    reconcile: `${SERVICES.SETTLEMENT_SERVICE}/settlements/reconcile`,
  },

  // Fee Service (Port 7017)
  fees: {
    list: `${SERVICES.FEE_SERVICE}/fees`,
    calculate: `${SERVICES.FEE_SERVICE}/fees/calculate`,
    rules: `${SERVICES.FEE_SERVICE}/fees/rules`,
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

  return response.json();
}
