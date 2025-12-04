import { Link } from "react-router-dom";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Shield } from "lucide-react";

export default function Checkout() {
  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <header className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">KodraPay</span>
          </Link>
          <span className="text-sm text-muted-foreground">Secure Checkout</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8 animate-slide-up">
            <CheckoutForm
              amount={25000}
              currency="NGN"
              merchantName="TechStore NG"
              description="Premium Subscription - 1 Month"
            />
          </div>

          <div className="mt-6 p-4 bg-card rounded-xl border border-border">
            <p className="text-sm font-medium text-foreground mb-2">Test Card Details</p>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Card Number</p>
                <p className="font-mono">4084 0841 1111 1111</p>
              </div>
              <div>
                <p className="text-muted-foreground">Expiry</p>
                <p className="font-mono">12/28</p>
              </div>
              <div>
                <p className="text-muted-foreground">CVV</p>
                <p className="font-mono">408</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-4 border-t border-border bg-card">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Powered by{" "}
          <Link to="/" className="text-primary hover:underline">
            KodraPay
          </Link>
        </div>
      </footer>
    </div>
  );
}
