import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Mail,
  MapPin,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
} from "lucide-react";
import { API_BASE_URL, fetchFromAPI } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

type PendingMerchant = {
  id: number;
  name: string;
  email: string;
  business_name: string;
  country: string;
  kyc_status: string;
  status: string;
  created_at: string;
  total_volume?: number;
  transaction_count?: number;
};

type PendingApprovalsProps = {
  merchants: PendingMerchant[];
  onApprovalChange: () => void;
};

export function PendingApprovals({ merchants, onApprovalChange }: PendingApprovalsProps) {
  const [pendingMerchants, setPendingMerchants] = useState<PendingMerchant[]>([]);
  const [loading, setLoading] = useState<number | null>(null);
  const [viewingDocs, setViewingDocs] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const filtered = (merchants || []).filter(
      (m) =>
        m.kyc_status === "pending" ||
        m.kyc_status === "not_started" ||
        m.status === "pending" ||
        m.status === "inactive",
    );
    setPendingMerchants(filtered);
  }, [merchants]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleApprove = async (merchantId: number) => {
    setLoading(merchantId);
    try {
      await fetchFromAPI(`${API_BASE_URL}/admin/merchants/${merchantId}/approve`, {
        method: "POST",
      });
      setPendingMerchants((prev) => prev.filter((m) => m.id !== merchantId));
      onApprovalChange?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to approve merchant";
      console.error("Error approving merchant", error);
      toast({
        title: "Could not approve merchant",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleReject = async (merchantId: number) => {
    setLoading(merchantId);
    try {
      await fetchFromAPI(`${API_BASE_URL}/admin/merchants/${merchantId}/reject`, {
        method: "POST",
      });
      setPendingMerchants((prev) => prev.filter((m) => m.id !== merchantId));
      onApprovalChange?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to reject merchant";
      console.error("Error rejecting merchant", error);
      toast({
        title: "Could not reject merchant",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleViewDocs = (merchantId: number) => {
    setViewingDocs((current) => (current === merchantId ? null : merchantId));
  };

  if (pendingMerchants.length === 0) {
    return (
      <Card className="p-6 text-center">
        <CheckCircle className="h-12 w-12 text-success mx-auto mb-3 opacity-50" />
        <p className="text-muted-foreground">No pending approvals at this time</p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {pendingMerchants.map((merchant) => (
        <Card key={merchant.id} className="p-6 border-l-4 border-l-warning">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold truncate" title={merchant.business_name}>{merchant.business_name}</h3>
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 flex-shrink-0">
                  <Clock className="h-3 w-3 mr-1" />
                  Pending Review
                </Badge>
              </div>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate" title={merchant.name}>Contact: {merchant.name}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate" title={merchant.email}>{merchant.email}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{merchant.country}</span>
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <Clock className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">Submitted: {formatDate(merchant.created_at)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewDocs(merchant.id)}
                disabled={loading === merchant.id}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleApprove(merchant.id)}
                disabled={loading === merchant.id}
                className="bg-success hover:bg-success/90"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {loading === merchant.id ? "Processing..." : "Approve"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleReject(merchant.id)}
                disabled={loading === merchant.id}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>

          {viewingDocs === merchant.id && (
            <div className="mt-4 pt-4 border-t">
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Business Documents &amp; Information
                </h4>
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Business Name:</span>
                    <span className="font-medium">{merchant.business_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Registration Country:</span>
                    <span className="font-medium">{merchant.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact Person:</span>
                    <span className="font-medium">{merchant.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{merchant.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">KYC Status:</span>
                    <Badge variant="outline">{merchant.kyc_status}</Badge>
                  </div>
                  {merchant.total_volume && merchant.total_volume > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Test Transactions:</span>
                      <span className="font-medium">
                        {merchant.transaction_count} txns (₦{(merchant.total_volume / 100).toFixed(2)})
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-3 p-2 bg-background rounded border">
                  Note: In production, this would show uploaded KYC documents (Business Registration, Tax ID, Director IDs, etc.)
                </p>
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
