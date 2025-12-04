import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  Wallet,
  ArrowLeftRight,
  FileText,
} from "lucide-react";

interface SidebarProps {
  type: "admin" | "merchant";
}

const adminLinks = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/merchants", icon: Users, label: "Merchants" },
  { href: "/admin/transactions", icon: ArrowLeftRight, label: "Transactions" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

const merchantLinks = [
  { href: "/merchant", icon: LayoutDashboard, label: "Dashboard" },
  {
    href: "/merchant/transactions",
    icon: ArrowLeftRight,
    label: "Transactions",
  },
  { href: "/merchant/payment-links", icon: FileText, label: "Payment Links" },
  { href: "/merchant/payouts", icon: Wallet, label: "Payouts" },
  { href: "/merchant/settings", icon: Settings, label: "Settings" },
];

export function DashboardSidebar({ type }: SidebarProps) {
  const location = useLocation();
  const links = type === "admin" ? adminLinks : merchantLinks;

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">
            KodraPay
          </span>
          <span className="ml-auto rounded-md bg-sidebar-accent px-2 py-0.5 text-xs font-medium text-sidebar-primary">
            {type === "admin" ? "Admin" : "Merchant"}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-3">
          <Link
            to="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            Exit Dashboard
          </Link>
        </div>
      </div>
    </aside>
  );
}
