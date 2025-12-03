import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Merchant {
  id: string;
  name: string;
  email: string;
  businessName: string;
  status: "active" | "pending" | "suspended";
  totalVolume: number;
  currency: string;
  joinedDate: string;
}

interface MerchantTableProps {
  merchants: Merchant[];
}

const statusStyles = {
  active: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  suspended: "bg-destructive/10 text-destructive border-destructive/20",
};

export function MerchantTable({ merchants }: MerchantTableProps) {
  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Merchant</TableHead>
            <TableHead className="font-semibold">Business</TableHead>
            <TableHead className="font-semibold">Total Volume</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Joined</TableHead>
            <TableHead className="font-semibold w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {merchants.map((merchant, index) => (
            <TableRow
              key={merchant.id}
              className="animate-fade-in cursor-pointer hover:bg-muted/30"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {merchant.name.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium">{merchant.name}</p>
                    <p className="text-sm text-muted-foreground">{merchant.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-medium">{merchant.businessName}</TableCell>
              <TableCell className="font-semibold">
                {formatAmount(merchant.totalVolume, merchant.currency)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("capitalize", statusStyles[merchant.status])}
                >
                  {merchant.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{merchant.joinedDate}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
