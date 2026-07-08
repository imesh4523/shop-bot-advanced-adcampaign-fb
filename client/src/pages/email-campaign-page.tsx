import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Send, 
  Users, 
  Loader2, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  FileText,
  DollarSign
} from "lucide-react";

interface TelegramUser {
  id: number;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  balance: number;
  createdAt: string;
}

interface Order {
  id: number;
  telegramUserId: number;
  status: string;
}

export default function EmailCampaignPage() {
  const { toast } = useToast();
  const [recipientType, setRecipientType] = useState<"single" | "all" | "purchased">("all");
  const [targetEmail, setTargetEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [showPreview, setShowPreview] = useState(true);

  // Queries to load users and orders to compute counts and list options
  const { data: users = [], isLoading: isUsersLoading } = useQuery<TelegramUser[]>({
    queryKey: ["/api/telegram-users"],
  });

  const { data: orders = [], isLoading: isOrdersLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
  });

  // Extract users who registered with emails
  const emailUsers = users.filter(u => u.telegramId.startsWith("email:"));
  const emailList = emailUsers.map(u => u.telegramId.substring(6));

  // Extract users who purchased accounts
  const purchasedUserIds = new Set(orders.map(o => o.telegramUserId).filter(Boolean));
  const emailUsersWithPurchases = emailUsers.filter(u => purchasedUserIds.has(u.id));

  // Form validations
  const isValid = subject.trim().length > 0 && customMessage.trim().length > 0 && (
    recipientType !== "single" || (targetEmail.includes("@") && targetEmail.trim().length > 0)
  );

  const mutation = useMutation({
    mutationFn: async (data: {
      recipientType: string;
      targetEmail?: string;
      subject: string;
      customMessage: string;
    }) => {
      const res = await apiRequest("POST", "/api/admin/email-campaign/send", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Campaign Sent Successfully!",
        description: `Successfully sent broadcast to ${data.count} of ${data.totalRecipients} recipients.`,
      });
      // Clear inputs except preview choice
      setSubject("");
      setCustomMessage("");
      setTargetEmail("");
    },
    onError: (err: any) => {
      toast({
        title: "Campaign Failed",
        description: err.message || "An error occurred while sending the campaign.",
        variant: "destructive",
      });
    }
  });

  const handleSend = () => {
    if (!isValid) return;
    mutation.mutate({
      recipientType,
      targetEmail: recipientType === "single" ? targetEmail : undefined,
      subject,
      customMessage
    });
  };

  return (
    <div className="space-y-10 animate-in pb-16">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-2xl">
          Email Campaigns
        </h1>
        <div className="glass-panel px-6 py-2.5 rounded-full flex items-center gap-3 text-sm font-bold text-white shadow-lg border-white/20">
          <Mail className="w-5 h-5 text-purple-400" />
          Send Announcements & Offers
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold text-white/50 uppercase tracking-wider">
              Total Email Users
            </CardTitle>
            <Users className="w-5 h-5 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-white tracking-tight">
              {isUsersLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : emailUsers.length}
            </div>
            <p className="text-xs text-white/40 mt-1">Users registered via OTP Email Auth</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold text-white/50 uppercase tracking-wider">
              Purchased Email Users
            </CardTitle>
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-white tracking-tight">
              {isUsersLoading || isOrdersLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : emailUsersWithPurchases.length}
            </div>
            <p className="text-xs text-white/40 mt-1">Email users with at least 1 purchase</p>
          </CardContent>
        </Card>

        <Card className="glass-card border-0 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-bold text-white/50 uppercase tracking-wider">
              Active Provider
            </CardTitle>
            <CheckCircle className="w-5 h-5 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-white tracking-tight capitalize">
              Dynamic Config
            </div>
            <p className="text-xs text-white/40 mt-1">Set in settings dashboard</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="glass-card border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
              <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
                <FileText className="w-6 h-6 text-purple-400" />
                Campaign Details
              </CardTitle>
              <CardDescription className="text-white/55">
                Compose custom message and select target recipients.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              
              {/* Recipient Target Type */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">Recipient Target</Label>
                <select
                  value={recipientType}
                  onChange={(e) => setRecipientType(e.target.value as any)}
                  className="w-full glass-panel border-white/10 bg-purple-950/20 text-white h-12 px-3 rounded-xl focus:border-purple-500/50 transition-all outline-none"
                >
                  <option value="all" className="bg-purple-950 text-white">All Email Users ({emailUsers.length} users)</option>
                  <option value="purchased" className="bg-purple-950 text-white">Users with Purchases only ({emailUsersWithPurchases.length} users)</option>
                  <option value="single" className="bg-purple-950 text-white">Single User (Specific email)</option>
                </select>
              </div>

              {/* Single User Email Input */}
              {recipientType === "single" && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-3">
                  <Label htmlFor="targetEmail" className="text-sm font-bold text-white/70 uppercase tracking-widest">
                    Target Email Address
                  </Label>
                  <Input
                    id="targetEmail"
                    type="email"
                    list="email-list"
                    placeholder="Enter or select email address..."
                    className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50"
                    value={targetEmail}
                    onChange={(e) => setTargetEmail(e.target.value)}
                  />
                  <datalist id="email-list">
                    {emailList.map((email) => (
                      <option key={email} value={email} />
                    ))}
                  </datalist>
                </div>
              )}

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-sm font-bold text-white/70 uppercase tracking-widest">
                  Email Subject
                </Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="Enter email subject line..."
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <Label htmlFor="customMessage" className="text-sm font-bold text-white/70 uppercase tracking-widest">
                  Message Body (HTML Supported)
                </Label>
                <Textarea
                  id="customMessage"
                  placeholder="Enter announcements, updates, new stock notifications, or HTML templates..."
                  className="glass-panel border-white/10 bg-purple-950/20 text-white min-h-[220px] rounded-xl focus:border-purple-500/50 transition-all"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                />
              </div>

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={!isValid || mutation.isPending}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Sending Emails...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Campaign
                  </>
                )}
              </Button>

            </CardContent>
          </Card>
        </div>

        {/* Live Template Preview Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="glass-card border-0 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl font-black tracking-tighter flex items-center gap-3">
                  <Eye className="w-5 h-5 text-purple-400" />
                  Live Preview
                </CardTitle>
                <CardDescription className="text-white/55">
                  Visual preview inside Shopeefy frame.
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="text-purple-400 hover:bg-purple-950/30"
              >
                {showPreview ? "Hide" : "Show"}
              </Button>
            </CardHeader>

            {showPreview && (
              <CardContent className="p-6 bg-slate-950 overflow-y-auto max-h-[500px]">
                <div style={{
                  fontFamily: "'Inter', sans-serif",
                  backgroundColor: "#0f172a",
                  color: "#f8fafc",
                  padding: "24px 16px",
                  borderRadius: "16px",
                  border: "1px solid #1e293b",
                  width: "100%",
                  boxSizing: "border-box"
                }}>
                  {/* Mock Header */}
                  <div style={{ textAlign: "center", marginBottom: "20px", borderBottom: "1px solid #334155", paddingBottom: "15px" }}>
                    <h1 style={{
                      background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)",
                      fontSize: "24px",
                      fontWeight: 800,
                      margin: 0,
                      color: "#a78bfa"
                    }}>Shopeefy</h1>
                    <p style={{ color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginTop: "3px", fontWeight: "bold" }}>
                      Important Announcement
                    </p>
                  </div>
                  
                  {/* Mock Content */}
                  <div 
                    style={{ color: "#e2e8f0", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px", minHeight: "100px", whiteSpace: "pre-wrap" }}
                    dangerouslySetInnerHTML={{ __html: customMessage || "Your campaign content details will preview here dynamically as you type..." }}
                  />
                  
                  {/* Mock Footer */}
                  <div style={{ textAlign: "center", borderTop: "1px solid #1e293b", paddingTop: "15px", marginTop: "20px" }}>
                    <p style={{ fontSize: "10px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>
                      You received this email because you are a registered user of Shopeefy.<br/>
                      Developer Credits: <span style={{ color: "#8b5cf6", fontWeight: "bold" }}>Rochana Imesh</span>
                    </p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}
