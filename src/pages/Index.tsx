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
import { ThemeToggle } from "@/components/ui/theme-toggle"; // Correctly import ThemeToggle

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
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-background/80 backdrop-blur-md shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900">
              <Shield className="h-5 w-5 text-gray-50" />
            </div>
            <span className="text-xl font-bold text-gray-900">KodraPay</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </a>
            <Link
              to="/checkout"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Demo Checkout
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/admin/login">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">Admin Login</Button>
            </Link>
            <Link to="/checkout">
              <Button variant="default" className="bg-gray-900 text-gray-50 hover:bg-gray-800">Demo Checkout</Button>
            </Link>
            <ThemeToggle /> {/* Add ThemeToggle here */}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gray-50">
        <div className="absolute inset-0 opacity-20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Zap className="h-4 w-4" />
              Payments infrastructure for Africa
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Accept Payments
              <span className="block text-primary">Seamlessly</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              KodraPay provides the fastest, most reliable way to accept payments
              online. Start accepting card payments, bank transfers, and mobile
              money in minutes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/admin/login">
                <Button size="xl" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30">
                  Admin Login
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link to="/checkout">
                <Button variant="outline" size="xl" className="border-gray-300 text-gray-700 hover:bg-gray-100 shadow-lg">
                  View Demo Checkout
                </Button>
              </Link>
            </div>
          </div>

          {/* Placeholder for Hero Image/Illustration */}
          <div className="mt-16 relative w-full max-w-5xl mx-auto aspect-[16/9] rounded-xl overflow-hidden shadow-xl border border-gray-200">
            <img
              src="/placeholder.svg" // Replace with a relevant image path
              alt="KodraPay dashboard preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h3 className="text-2xl font-bold">Intuitive Dashboard</h3>
              <p className="text-gray-200">
                Manage your payments, view analytics, and track your business
                performance with ease.
              </p>
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
                <p className="text-3xl md:text-4xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to get paid
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From accepting your first payment to scaling globally, KodraPay has
              the tools you need.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl bg-card border border-gray-200 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Simple, transparent pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose a plan that matches your team's stage. All plans include
              core payment APIs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-2xl border transition-all duration-300 ${plan.highlighted ? "border-primary bg-primary text-primary-foreground shadow-xl scale-[1.02]" : "bg-card border-gray-200 shadow-md hover:shadow-lg"}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-foreground text-primary px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    Most Popular
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                </div>
                <p
                  className={`mt-2 text-base ${plan.highlighted ? "text-primary-foreground/80" : "text-gray-600"}`}
                >
                  {plan.description}
                </p>
                <div className="mt-8 mb-8">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={`text-base ml-1 ${plan.highlighted ? "text-primary-foreground/80" : "text-gray-600"}`}>
                    {plan.frequency}
                  </span>
                </div>
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <CheckCircle
                        className={`h-5 w-5 shrink-0 ${plan.highlighted ? "text-primary-foreground" : "text-primary"}`}
                      />
                      <span
                        className={
                          plan.highlighted
                            ? "text-primary-foreground"
                            : "text-gray-700"
                        }
                      >
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
                <Link to={plan.highlighted ? "/admin/login" : "/checkout"}>
                  <Button
                    className={`w-full ${plan.highlighted ? "bg-primary-foreground text-primary hover:bg-primary-foreground/90" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
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
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto rounded-2xl bg-primary-foreground p-12 text-center shadow-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to start accepting payments?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses using KodraPay to grow their revenue.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/admin/login">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Admin Login
                </Button>
              </Link>
              <Link to="/checkout">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Demo Checkout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-900">
                <Shield className="h-4 w-4 text-gray-50" />
              </div>
              <span className="text-lg font-bold text-gray-900">KodraPay</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-900 transition-colors">
                Documentation
              </a>
            </div>
            <p className="text-sm text-gray-600">
              © 2024 KodraPay. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
