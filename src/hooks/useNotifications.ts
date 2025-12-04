import { useQuery } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Notification {
  id: string;
  subject: string;
  message: string;
  created_at: string;
}

// TODO: Replace with actual implementation to get user ID from auth context
const getAdminUserId = (): string => {
  return "1"; 
};


const fetchNotifications = async (userId: string): Promise<Notification[]> => {
  if (!userId) {
    return [];
  }
  const response = await fetch(`${API_URL}/notifications/user/${userId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch notifications");
  }
  const data = await response.json();
  return data.notifications;
};

export const useNotifications = () => {
  const userId = getAdminUserId();
  return useQuery<Notification[], Error>({
    queryKey: ["notifications", userId],
    queryFn: () => fetchNotifications(userId),
    enabled: !!userId,
  });
};