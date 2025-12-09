import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, CreditCard, Lock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutFormProps {
  amount: number;
  currency: string;
  merchantName: string;
  description?: string;
}

export function CheckoutForm({
  amount,
  currency,
  merchantName,
  description,
}: CheckoutFormProps) {
  const [step, setStep] = useState<"details" | "payment" | "success">("details");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency,
    }).format(amount / 100);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="text-center py-8 animate-slide-up">
        <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
        <p className="text-muted-foreground mb-6">
          Your payment of {formatAmount(amount, currency)} has been processed.
        </p>
        <p className="text-sm text-muted-foreground">
          A receipt has been sent to {email}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Amount Display */}
      <div className="text-center pb-6 border-b border-border">
        <p className="text-sm text-muted-foreground mb-1">Pay {merchantName}</p>
        <p className="text-4xl font-bold text-foreground">{formatAmount(amount, currency)}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
      </div>

      {step === "details" && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
            />
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={() => setStep("payment")}
            disabled={!email}
          >
            Continue to Payment
          </Button>
        </div>
      )}

      {step === "payment" && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="card">Card Number</Label>
            <div className="relative">
              <Input
                id="card"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                className="h-12 pl-12"
              />
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                maxLength={5}
                className="h-12"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                maxLength={4}
                className="h-12"
              />
            </div>
          </div>

          <Button
            className="w-full"
            variant="hero"
            size="lg"
            onClick={handlePayment}
            disabled={!cardNumber || !expiry || !cvv || isProcessing}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Processing...
              </span>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Pay {formatAmount(amount, currency)}
              </>
            )}
          </Button>

          <button
            onClick={() => setStep("details")}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to details
          </button>
        </div>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 pt-4 border-t border-border">
        <Shield className="h-4 w-4 text-success" />
        <span className="text-xs text-muted-foreground">
          Secured by KodraPay • 256-bit SSL encryption
        </span>
      </div>
    </div>
  );
}
