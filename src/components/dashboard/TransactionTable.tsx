import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  id: string | number;
  reference: string | number;
  customer: string;
  email: string;
  amount: number;
  currency: string;
  status: "successful" | "pending" | "failed" | "payout";
  date: string;
  merchant?: string;
  type?: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  showMerchant?: boolean;
  showType?: boolean;
}

const statusStyles = {
  successful: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  payout: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-200 dark:border-blue-800",
};

export function TransactionTable({ transactions, showMerchant = false, showType = false }: TransactionTableProps) {
  const formatAmount = (amount: number, currency: string, locale: string = "en-NG") => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold">Reference</TableHead>
            <TableHead className="font-semibold">Customer</TableHead>
            {showMerchant && <TableHead className="font-semibold">Merchant</TableHead>}
            {showType && <TableHead className="font-semibold">Type</TableHead>}
            <TableHead className="font-semibold">Amount</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction, index) => (
            <TableRow
              key={transaction.id}
              className="cursor-pointer hover:bg-muted/30"
            >
              <TableCell className="font-mono text-sm">{transaction.reference}</TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{transaction.customer}</p>
                  <p className="text-sm text-muted-foreground">{transaction.email}</p>
                </div>
              </TableCell>
              {showMerchant && (
                <TableCell className="font-medium">{transaction.merchant}</TableCell>
              )}
              {showType && <TableCell className="capitalize text-muted-foreground text-sm">{transaction.type || "payment"}</TableCell>}
              <TableCell className="font-semibold">
                {formatAmount(transaction.amount, transaction.currency)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={cn("capitalize", statusStyles[transaction.status])}
                >
                  {transaction.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
