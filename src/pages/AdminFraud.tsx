import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL, apiClient, fetchFromAPI } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";

type FraudDecision = {
  decision: string;
  reasons?: string[];
  score?: number;
};

type SuspiciousTx = {
  id: number;
  reference: string;
  merchant_id: number;
  merchant_name?: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
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
  const [suspiciousTxns, setSuspiciousTxns] = useState<SuspiciousTx[]>([]);
  const [loadingSuspicious, setLoadingSuspicious] = useState(false);
  const [actionRef, setActionRef] = useState<string | null>(null);
  const [settleMerchantId, setSettleMerchantId] = useState("");
  const [settleLoading, setSettleLoading] = useState(false);

  useEffect(() => {
    setDecision(null);
    setLinkResult(null);
  }, [txRef]);

  useEffect(() => {
    const loadSuspicious = async () => {
      setLoadingSuspicious(true);
      try {
        const resp = await fetchFromAPI(`${apiClient.admin.transactionsFraud}?limit=20`);
        const list = Array.isArray(resp?.transactions) ? resp.transactions : Array.isArray(resp) ? resp : [];
        setSuspiciousTxns(
          list.map((tx: any) => ({
            id: tx.id,
            reference: tx.reference,
            merchant_id: tx.merchant_id,
            merchant_name: tx.merchant_name,
            amount: tx.amount,
            currency: tx.currency || "NGN",
            status: tx.status,
            created_at: tx.created_at,
          })),
        );
      } catch (err) {
        console.error("Failed to load suspicious transactions", err);
        setSuspiciousTxns([]);
      } finally {
        setLoadingSuspicious(false);
      }
    };
    loadSuspicious();
  }, []);

  const updateStatus = async (reference: string, nextStatus: "approve" | "decline") => {
    setActionRef(reference);
    try {
      const url =
        nextStatus === "approve"
          ? apiClient.admin.transactionApprove(reference)
          : apiClient.admin.transactionDecline(reference);
      await fetchFromAPI(url, { method: "POST" });
      // Optimistically update UI
      setSuspiciousTxns((prev) => prev.filter((tx) => tx.reference !== reference));
    } catch (err) {
      console.error("Failed to update transaction status", err);
    } finally {
      setActionRef(null);
    }
  };

  const triggerSettlement = async () => {
    const id = Number(settleMerchantId);
    if (!Number.isFinite(id) || id <= 0) return;
    setSettleLoading(true);
    try {
      await fetchFromAPI(apiClient.admin.settlementTrigger, {
        method: "POST",
        body: JSON.stringify({ merchant_id: id, currency: "NGN" }),
      });
      setSettleMerchantId("");
    } catch (err) {
      console.error("Failed to trigger settlement", err);
    } finally {
      setSettleLoading(false);
    }
  };

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

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Flagged Transactions</h2>
              <p className="text-sm text-muted-foreground">Status: pending_review (fraud flagged)</p>
            </div>
            <Badge variant="secondary">{loadingSuspicious ? "Loading..." : `${suspiciousTxns.length} items`}</Badge>
          </div>
          <div className="space-y-3">
            {suspiciousTxns.length === 0 && !loadingSuspicious && (
              <p className="text-sm text-muted-foreground">No pending_review transactions right now.</p>
            )}
            {suspiciousTxns.map((tx) => (
              <div key={tx.id} className="rounded border p-3 bg-muted/50 space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Ref: {tx.reference}</p>
                    <p className="text-xs text-muted-foreground">Merchant: {tx.merchant_name || tx.merchant_id}</p>
                  </div>
                  <Badge variant="outline">{tx.status}</Badge>
                </div>
                <p className="text-sm">
                  Amount: {new Intl.NumberFormat("en-NG", { style: "currency", currency: tx.currency }).format(tx.amount)}
                </p>
                <p className="text-xs text-muted-foreground">{new Date(tx.created_at).toLocaleString()}</p>
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => updateStatus(tx.reference, "approve")}
                    disabled={actionRef === tx.reference}
                  >
                    {actionRef === tx.reference ? "Approving..." : "Approve"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => updateStatus(tx.reference, "decline")}
                    disabled={actionRef === tx.reference}
                  >
                    {actionRef === tx.reference ? "Declining..." : "Decline"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Manual Settlement</h2>
            <Badge variant="secondary">Trigger</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Settle all pending balance for a merchant immediately.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Merchant ID"
              value={settleMerchantId}
              onChange={(e) => setSettleMerchantId(e.target.value)}
              type="number"
              min={1}
            />
            <Button onClick={triggerSettlement} disabled={!settleMerchantId || settleLoading}>
              {settleLoading ? "Settling..." : "Settle now"}
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
