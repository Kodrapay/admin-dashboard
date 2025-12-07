import { API_BASE_URL } from "./api-client";

const SESSION_COOKIE_NAME = "kodrapay_admin_session";

export interface SessionData {
  sessionId: string;
  userId: string;
  email: string;
  role: string;
}

// Cookie helpers
export function setSessionCookie(sessionId: string, expiresInDays: number = 1): void {
  const date = new Date();
  date.setTime(date.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${SESSION_COOKIE_NAME}=${sessionId};${expires};path=/;SameSite=Strict`;
}

export function getSessionCookie(): string | null {
  const name = `${SESSION_COOKIE_NAME}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');

  for (let cookie of cookieArray) {
    cookie = cookie.trim();
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length);
    }
  }
  return null;
}

export function clearSessionCookie(): void {
  document.cookie = `${SESSION_COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

// Session validation
export async function validateSession(): Promise<SessionData | null> {
  const sessionId = getSessionCookie();

  if (!sessionId) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ session_id: sessionId }),
    });

    if (!response.ok) {
      clearSessionCookie();
      return null;
    }

    const data = await response.json();

    if (!data.valid) {
      clearSessionCookie();
      return null;
    }

    return {
      sessionId,
      userId: data.user_id,
      email: data.email,
      role: data.role,
    };
  } catch (error) {
    console.error("Session validation error:", error);
    clearSessionCookie();
    return null;
  }
}

// Logout function
export async function logout(): Promise<void> {
  const sessionId = getSessionCookie();

  if (sessionId) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  clearSessionCookie();
  // Also clear any localStorage tokens for backward compatibility
  localStorage.removeItem("authToken");
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const session = await validateSession();
  return session !== null;
}
