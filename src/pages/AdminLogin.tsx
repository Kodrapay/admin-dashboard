import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      localStorage.setItem("authToken", "demo-admin-token");
      setIsSubmitting(false);
      toast({
        title: "Welcome back",
        description: "You are now signed in to the admin dashboard.",
      });
      navigate("/admin");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to site
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm uppercase text-muted-foreground tracking-wide">
                KodraPay
              </p>
              <h1 className="text-3xl font-bold text-foreground">
                Admin Portal
              </h1>
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            Securely manage merchants, transactions, compliance, and platform
            configuration from a single place. Use your admin credentials to
            continue.
          </p>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Real-time monitoring",
              "Role-based access",
              "Multi-factor auth",
              "Audit-ready logs",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border text-sm text-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-success" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <Card className="p-8 shadow-lg border-border bg-card">
          <div className="space-y-2 mb-6 text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground">
              Admin Login
            </h2>
            <p className="text-sm text-muted-foreground">
              Sign in with your admin account to access the dashboard.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@kodrapay.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                  className="border-border"
                />
                Remember this device
              </label>
              <a
                href="mailto:support@kodrapay.com"
                className="text-sm text-primary hover:underline"
              >
                Need help?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing you in..." : "Login"}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-6">
            By continuing, you agree to the security policies of the KodraPay
            admin console.
          </p>
        </Card>
      </div>
    </div>
  );
}
