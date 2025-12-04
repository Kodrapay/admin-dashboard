import { ReactNode } from "react";
import { DashboardSidebar } from "./DashboardSidebar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "@/hooks/useNotifications";

interface DashboardLayoutProps {
  children: ReactNode;
  type: "admin" | "merchant";
  title: string;
}

export function DashboardLayout({ children, type, title }: DashboardLayoutProps) {
  const { data: notifications, isLoading } = useNotifications();

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar type={type} />
      
      <div className="pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-6">
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="w-64 pl-9 bg-secondary border-0"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications && notifications.length > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {notifications.length}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isLoading ? (
                  <DropdownMenuItem>Loading...</DropdownMenuItem>
                ) : notifications && notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id}>
                      <div className="flex flex-col">
                        <span className="font-semibold">{notification.subject}</span>
                        <span className="text-xs text-muted-foreground">{notification.message}</span>
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem>No new notifications</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">JD</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
