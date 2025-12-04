import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Shield,
  ArrowRight,
  CreditCard,
  BarChart3,
  Lock,
  Zap,
  Globe,
  Users,
  CheckCircle,
} from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Accept Payments",
    description:
      "Accept payments from customers worldwide with multiple payment methods.",
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description:
      "Track your transactions and revenue with powerful analytics dashboards.",
  },
  {
    icon: Lock,
    title: "Secure & Compliant",
    description:
      "PCI DSS compliant with advanced fraud protection and encryption.",
  },
  {
    icon: Zap,
    title: "Instant Settlement",
    description:
      "Get your money faster with instant settlement to your bank account.",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description: "Accept payments in multiple currencies and expand globally.",
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Invite team members and manage permissions with ease.",
  },
];

const stats = [
  { value: "₦50B+", label: "Processed Annually" },
  { value: "10K+", label: "Active Merchants" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "150+", label: "Countries Supported" },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "₦0",
    frequency: "/month",
    description: "Built for teams validating new products.",
    highlighted: false,
    features: [
      "No setup fees",
      "Dashboard access",
      "Email support",
      "Standard APIs",
    ],
  },
  {
    name: "Growth",
    price: "₦15,000",
    frequency: "/month",
    description: "Ideal for scaling companies that need reliability.",
    highlighted: true,
    features: [
      "Priority support",
      "Webhooks",
      "Dispute assistance",
      "Payout scheduling",
    ],
  },
  {
    name: "Enterprise",
    price: "Let's talk",
    frequency: "",
    description: "Custom solutions, advanced controls, and SLAs.",
    highlighted: false,
    features: [
      "Dedicated manager",
      "Custom routing",
      "Uptime SLAs",
      "Security reviews",
    ],
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">KodraPay</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <Link
              to="/checkout"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Demo Checkout
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/admin/login">
              <Button variant="ghost">Admin Login</Button>
            </Link>
            <Link to="/checkout">
              <Button variant="default">Demo Checkout</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-accent-foreground mb-6">
              <Zap className="h-4 w-4" />
              Payments infrastructure for Africa
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Accept Payments
              <span className="block text-primary">Seamlessly</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              KodraPay provides the fastest, most reliable way to accept payments
              online. Start accepting card payments, bank transfers, and mobile
              money in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/admin/login">
                <Button variant="hero" size="xl">
                  Admin Login
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/checkout">
                <Button variant="outline" size="xl">
                  View Demo Checkout
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="text-center animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <p className="text-3xl md:text-4xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to get paid
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From accepting your first payment to scaling globally, KodraPay has
              the tools you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl bg-card border border-border shadow-card hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Choose a plan that matches your team's stage. All plans include
              core payment APIs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`p-6 rounded-2xl border shadow-card ${plan.highlighted ? "gradient-primary text-primary-foreground" : "bg-card border-border"}`}
              >
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  {plan.highlighted && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-foreground/20">
                      Popular
                    </span>
                  )}
                </div>
                <p
                  className={`mt-2 text-sm ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                >
                  {plan.description}
                </p>
                <div className="mt-6 mb-6">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm ml-1 text-muted-foreground">
                    {plan.frequency}
                  </span>
                </div>
                <div className="space-y-2 mb-6">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle
                        className={`h-4 w-4 ${plan.highlighted ? "text-primary-foreground" : "text-primary"}`}
                      />
                      <span
                        className={
                          plan.highlighted
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <Link to={plan.highlighted ? "/admin/login" : "/checkout"}>
                  <Button
                    className="w-full"
                    variant={plan.highlighted ? "secondary" : "outline"}
                  >
                    {plan.highlighted ? "Start with Growth" : "Talk to sales"}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-2xl gradient-primary p-12 text-center shadow-glow">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to start accepting payments?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using KodraPay to grow their revenue.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/admin/login">
                <Button
                  size="lg"
                  className="bg-background text-foreground hover:bg-background/90"
                >
                  Admin Login
                </Button>
              </Link>
              <Link to="/checkout">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  Demo Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">KodraPay</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Documentation
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 KodraPay. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
