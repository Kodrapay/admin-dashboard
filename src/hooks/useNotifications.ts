import { useQuery } from "@tanstack/react-query";
import { getSessionCookie, validateSession } from "@/lib/session";
import { API_BASE_URL } from "@/lib/api-client";

interface Notification {
  id: string;
  subject: string;
  message: string;
  created_at: string;
}

const fetchNotifications = async (): Promise<Notification[]> => {
  const session = await validateSession();
  const userId = session?.userId;

  if (!userId) {
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/notifications/user/${userId}`);
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error("Notifications fetch failed:", errorText || response.statusText);
      return [];
    }

    const data = await response.json();
    return data.notifications || [];
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return [];
  }
};

export const useNotifications = () => {
  const sessionId = getSessionCookie();
  return useQuery<Notification[], Error>({
    queryKey: ["notifications", sessionId],
    queryFn: fetchNotifications,
    enabled: Boolean(sessionId),
  });
};
