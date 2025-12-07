import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/lib/api-client";

type FraudDecision = {
  decision: string;
  reasons?: string[];
  score?: number;
};

export default function AdminFraud() {
  const [txRef, setTxRef] = useState("");
  const [fetchedAmount, setFetchedAmount] = useState("");
  const [fetchedCurrency, setFetchedCurrency] = useState("");
  const [fetchedCustomerId, setFetchedCustomerId] = useState("");
  const [fetchedOrigin, setFetchedOrigin] = useState("");
  const [fetchedPaymentMethod, setFetchedPaymentMethod] = useState("");
  const [decision, setDecision] = useState<FraudDecision | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // New state for fetching status
  const [linkUrl, setLinkUrl] = useState("");
  const [linkResult, setLinkResult] = useState<{ is_suspicious: boolean; reason?: string } | null>(null);

  useEffect(() => {
    setDecision(null);
    setLinkResult(null);
  }, [txRef]);

  const fetchTransactionDetails = async () => {
    setIsFetching(true);
    setDecision(null);
    try {
      const resp = await fetch(`${API_BASE_URL}/fraud/transactions/${txRef}`);
      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.message || `Error fetching transaction details: ${resp.statusText}`);
      }
      const data = await resp.json();
      setFetchedAmount(data.amount.toString());
      setFetchedCurrency(data.currency);
      setFetchedCustomerId(data.customer_id.toString());
      // Assuming origin is not directly available or needs to be derived/fetched separately.
      // For now, setting a placeholder or leaving empty.
      setFetchedOrigin(""); // This field was not in the TransactionResponse DTO, so leaving empty or setting a default.
      setFetchedPaymentMethod(data.payment_method);
    } catch (err) {
      console.error("Error fetching transaction details:", err);
      setDecision({ decision: "error", reasons: [(err as Error)?.message || "Unknown error"] });
      // Clear fetched data on error
      setFetchedAmount("");
      setFetchedCurrency("");
      setFetchedCustomerId("");
      setFetchedOrigin("");
      setFetchedPaymentMethod("");
    } finally {
      setIsFetching(false);
    }
  };

  const checkTransaction = async () => {
    setIsChecking(true);
    setDecision(null);
    try {
      const resp = await fetch(`${API_BASE_URL}/fraud/check-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_reference: txRef,
          amount: Number(fetchedAmount), // Use fetched amount
          currency: fetchedCurrency,     // Use fetched currency
          customer_id: fetchedCustomerId, // Use fetched customer ID
          origin: fetchedOrigin,         // Use fetched origin
          payment_method: fetchedPaymentMethod, // Use fetched payment method
        }),
      });
      const data = await resp.json();
      setDecision(data);
    } catch (err) {
      setDecision({ decision: "error", reasons: [(err as Error)?.message || "Unknown error"] });
    } finally {
      setIsChecking(false);
    }
  };

  const trackPaymentLink = async () => {
    setLinkResult(null);
    try {
      const resp = await fetch(`${API_BASE_URL}/fraud/track-payment-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: linkUrl }),
      });
      const data = await resp.json();
      setLinkResult(data);
    } catch (err) {
      setLinkResult({ is_suspicious: false, reason: (err as Error)?.message });
    }
  };

  return (
    <DashboardLayout type="admin" title="Fraud">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Check Transaction</h2>
          <div className="space-y-2">
            <Label htmlFor="txRef">Transaction reference</Label>
            <div className="flex space-x-2">
              <Input id="txRef" value={txRef} onChange={(e) => setTxRef(e.target.value)} placeholder="TXN_123 or PL_1_abc" />
              <Button onClick={fetchTransactionDetails} disabled={isFetching || !txRef}>
                {isFetching ? "Fetching..." : "Fetch Details"}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" value={fetchedAmount} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" value={fetchedCurrency} readOnly />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="customerId">Customer ID</Label>
              <Input id="customerId" value={fetchedCustomerId} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment method</Label>
              <Input id="paymentMethod" value={fetchedPaymentMethod} readOnly />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="origin">Origin (IP / UA)</Label>
            <Input id="origin" value={fetchedOrigin} readOnly />
          </div>
          <Button onClick={checkTransaction} disabled={isChecking || !txRef || !fetchedAmount}>
            {isChecking ? "Checking..." : "Run fraud check"}
          </Button>
          {decision && (
            <div className="p-3 rounded border bg-muted/50">
              <p className="font-semibold">Decision: {decision.decision}</p>
              {decision.score !== undefined && <p className="text-sm text-muted-foreground">Score: {decision.score}</p>}
              {decision.reasons && decision.reasons.length > 0 && (
                <ul className="text-sm text-muted-foreground mt-2 list-disc pl-4">
                  {decision.reasons.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Track Payment Link</h2>
          <div className="space-y-2">
            <Label htmlFor="linkUrl">Payment link URL</Label>
            <Textarea id="linkUrl" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="Paste the payment link URL here" />
          </div>
          <Button onClick={trackPaymentLink} disabled={!linkUrl}>
            Check link
          </Button>
          {linkResult && (
            <div className="p-3 rounded border bg-muted/50">
              <p className="font-semibold">
                Suspicious: {linkResult.is_suspicious ? "Yes" : "No"}
              </p>
              {linkResult.reason && <p className="text-sm text-muted-foreground mt-1">{linkResult.reason}</p>}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
