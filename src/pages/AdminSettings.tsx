import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Shield, Bell, Server } from "lucide-react";

export default function AdminSettings() {
  return (
    <DashboardLayout type="admin" title="Settings">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Profile</p>
              <p className="text-lg font-semibold text-foreground">Admin details</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" defaultValue="Jane Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="admin@kodrapay.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" defaultValue="Super Admin" disabled />
          </div>
          <Button className="w-full md:w-auto">Save profile</Button>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-success/10 text-success flex items-center justify-center">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Notifications</p>
              <p className="text-lg font-semibold text-foreground">Alerts &amp; routing</p>
            </div>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <p className="font-medium text-foreground">Fraud alerts</p>
                <p className="text-sm text-muted-foreground">Notify when risk score exceeds threshold</p>
              </div>
              <Switch defaultChecked />
            </label>
            <label className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <p className="font-medium text-foreground">Large payouts</p>
                <p className="text-sm text-muted-foreground">Approval required for payouts above ₦5M</p>
              </div>
              <Switch />
            </label>
            <label className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <p className="font-medium text-foreground">Weekly digest</p>
                <p className="text-sm text-muted-foreground">Summary emailed every Monday</p>
              </div>
              <Switch defaultChecked />
            </label>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mt-2">
        <Card className="p-6 space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center">
              <Server className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Platform</p>
              <p className="text-lg font-semibold text-foreground">Maintenance window</p>
            </div>
          </div>
          <Textarea placeholder="Describe the maintenance window or change freeze." />
          <Button variant="outline">Share update</Button>
        </Card>

        <Card className="p-6 space-y-3 lg:col-span-2">
          <p className="text-sm font-semibold text-foreground">API keys</p>
          <p className="text-sm text-muted-foreground">
            Rotate credentials regularly. Use different keys for staging and production.
          </p>
          <Separator />
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
            <div>
              <p className="text-sm text-muted-foreground">Live secret</p>
              <p className="font-mono text-sm text-foreground">sk_live_••••••••••••••••</p>
            </div>
            <Button variant="outline" size="sm">Rotate</Button>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40">
            <div>
              <p className="text-sm text-muted-foreground">Staging secret</p>
              <p className="font-mono text-sm text-foreground">sk_test_98sd8237gs</p>
            </div>
            <Button variant="outline" size="sm">Copy</Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
