import { useQuery } from "@tanstack/react-query";
import { getSessionCookie, validateSession } from "@/lib/session";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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

  const response = await fetch(`${API_URL}/notifications/user/${userId}`);
  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(errorText || "Failed to fetch notifications");
  }

  const data = await response.json();
  return data.notifications;
};

export const useNotifications = () => {
  const sessionId = getSessionCookie();
  return useQuery<Notification[], Error>({
    queryKey: ["notifications", sessionId],
    queryFn: fetchNotifications,
    enabled: Boolean(sessionId),
  });
};
