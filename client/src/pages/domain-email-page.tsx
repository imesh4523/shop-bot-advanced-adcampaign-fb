import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Globe,
  Save,
  Loader2,
  Play,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Shield,
  Mail,
  Key,
  Server,
  ExternalLink,
  Copy,
} from "lucide-react";

interface LogEntry {
  level: "info" | "ok" | "error" | "warn";
  msg: string;
}

interface DomainStatus {
  status: string;
  id?: string;
  records?: { type: string; name: string; value: string; status: string }[];
}

const useSetting = (key: string) =>
  useQuery<{ key: string; value: string }>({
    queryKey: [`/api/settings/${key}`],
  });

const saveSetting = async (key: string, value: string) => {
  const res = await apiRequest("POST", "/api/settings", { key, value });
  return res.json();
};

const LOG_COLORS: Record<string, string> = {
  info: "text-sky-400",
  ok:   "text-emerald-400",
  error: "text-red-400",
  warn: "text-amber-400",
};

const LOG_PREFIXES: Record<string, string> = {
  info:  "[INFO] ",
  ok:    "[OK]   ",
  error: "[ERR]  ",
  warn:  "[WARN] ",
};

export default function DomainEmailPage() {
  const { toast } = useToast();
  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Form state
  const [domain, setDomain] = useState("");
  const [cfZoneId, setCfZoneId] = useState("");
  const [cfApiToken, setCfApiToken] = useState("");
  const [resendApiKey, setResendApiKey] = useState("");
  const [emailSender, setEmailSender] = useState("");
  const [emailSenderName, setEmailSenderName] = useState("Shopeefy");
  const [isSaving, setIsSaving] = useState(false);

  // Configure state
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [configResult, setConfigResult] = useState<"success" | "error" | null>(null);

  // Test Email state
  const [testEmailRecipient, setTestEmailRecipient] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleSendTestEmail = async () => {
    if (!testEmailRecipient || !testEmailRecipient.includes("@")) {
      toast({ title: "Validation Error", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    setIsSendingTest(true);
    try {
      const res = await apiRequest("POST", "/api/admin/domain/test-email", { toEmail: testEmailRecipient.trim() });
      const data = await res.json();
      if (res.ok && data.success) {
        toast({ title: "✅ Test Email Sent", description: `Test email sent successfully to ${testEmailRecipient}. Check your inbox!` });
        setTestEmailRecipient("");
      } else {
        toast({ title: "Sending Failed", description: data.error || "Failed to send test email.", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSendingTest(false);
    }
  };

  // Settings from DB
  const { data: domainSetting } = useSetting("DOMAIN_NAME");
  const { data: cfZoneSetting } = useSetting("CLOUDFLARE_ZONE_ID");
  const { data: cfTokenSetting } = useSetting("CLOUDFLARE_API_TOKEN");
  const { data: resendKeySetting } = useSetting("RESEND_API_KEY");
  const { data: senderSetting } = useSetting("EMAIL_SENDER");
  const { data: senderNameSetting } = useSetting("EMAIL_SENDER_NAME");

  // Domain status
  const { data: domainStatus, refetch: refetchStatus } = useQuery<DomainStatus>({
    queryKey: ["/api/admin/domain/status"],
    refetchInterval: 30000,
  });

  // Populate form from DB on load
  useEffect(() => { if (domainSetting?.value)  setDomain(domainSetting.value); }, [domainSetting]);
  useEffect(() => { if (cfZoneSetting?.value)  setCfZoneId(cfZoneSetting.value); }, [cfZoneSetting]);
  useEffect(() => { if (cfTokenSetting?.value) setCfApiToken(cfTokenSetting.value); }, [cfTokenSetting]);
  useEffect(() => { if (resendKeySetting?.value) setResendApiKey(resendKeySetting.value); }, [resendKeySetting]);
  useEffect(() => { if (senderSetting?.value) setEmailSender(senderSetting.value); }, [senderSetting]);
  useEffect(() => { if (senderNameSetting?.value) setEmailSenderName(senderNameSetting.value); }, [senderNameSetting]);

  // Suggest sender address when domain is set and sender is empty/generic
  useEffect(() => {
    if (domain && (!emailSender || emailSender.includes("shopeefy.com"))) {
      setEmailSender(`noreply@${domain.trim()}`);
    }
  }, [domain]);

  // Auto-scroll console
  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await Promise.all([
        saveSetting("DOMAIN_NAME", domain.trim()),
        saveSetting("CLOUDFLARE_ZONE_ID", cfZoneId.trim()),
        saveSetting("CLOUDFLARE_API_TOKEN", cfApiToken.trim()),
        saveSetting("RESEND_API_KEY", resendApiKey.trim()),
        saveSetting("EMAIL_SENDER", emailSender.trim()),
        saveSetting("EMAIL_SENDER_NAME", emailSenderName.trim() || "Shopeefy"),
        saveSetting("EMAIL_SERVICE", "resend"),
      ]);
      queryClient.invalidateQueries({ queryKey: ["/api/settings/DOMAIN_NAME"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/CLOUDFLARE_ZONE_ID"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/CLOUDFLARE_API_TOKEN"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/RESEND_API_KEY"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/EMAIL_SENDER"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/EMAIL_SENDER_NAME"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/EMAIL_SERVICE"] });
      toast({ title: "Settings Saved", description: "Domain and email settings saved successfully." });
      refetchStatus();
    } catch (err: any) {
      toast({ title: "Save Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfigure = async () => {
    setIsConfiguring(true);
    setLogs([]);
    setConfigResult(null);

    setLogs([{ level: "info", msg: "Starting auto-configuration..." }]);

    try {
      const res = await apiRequest("POST", "/api/admin/domain/configure", {});
      const data = await res.json();

      if (data.logs && Array.isArray(data.logs)) {
        setLogs(data.logs);
      }

      if (data.success) {
        setConfigResult("success");
        toast({ title: "✅ Configuration Complete!", description: "DNS records added and Resend domain verified." });
        refetchStatus();
      } else {
        setConfigResult("error");
        if (data.error) {
          setLogs(prev => [...prev, { level: "error", msg: data.error }]);
        }
        toast({ title: "Configuration Failed", description: data.error || "Unknown error", variant: "destructive" });
      }
    } catch (err: any) {
      setLogs(prev => [...prev, { level: "error", msg: err.message }]);
      setConfigResult("error");
      toast({ title: "Request Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsConfiguring(false);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "verified") return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-black border border-emerald-500/20">
        <CheckCircle2 className="w-3 h-3" /> Verified
      </span>
    );
    if (status === "pending") return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-black border border-amber-500/20">
        <AlertTriangle className="w-3 h-3" /> Pending
      </span>
    );
    if (status === "not_added") return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-500/15 text-neutral-400 text-xs font-black border border-neutral-500/20">
        <Info className="w-3 h-3" /> Not Added
      </span>
    );
    if (status === "not_configured") return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-500/15 text-neutral-400 text-xs font-black border border-neutral-500/20">
        <Info className="w-3 h-3" /> Not Configured
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 text-xs font-black border border-sky-500/20">
        <Info className="w-3 h-3" /> {status}
      </span>
    );
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", duration: 1500 });
  };

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-purple-900/40">
          <Globe className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black tracking-tighter">Domain & Email Config</h1>
          <p className="text-sm text-white/40 font-semibold mt-0.5">
            Cloudflare DNS + Resend auto-setup — one click configuration
          </p>
        </div>
        {domainStatus && getStatusBadge(domainStatus.status)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Left: Config Form */}
        <div className="space-y-6">
          {/* Domain + Cloudflare */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center">
                <Globe className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <div className="font-black text-sm">Domain & Cloudflare</div>
                <div className="text-[10px] text-white/40 font-semibold uppercase tracking-widest">DNS auto-configuration</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Globe className="w-3 h-3" /> Domain Name
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={e => setDomain(e.target.value)}
                  placeholder="yourstore.com"
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-all"
                />
                <p className="text-[10px] text-white/30 pl-1">e.g. <code className="text-purple-400">shopeefy.com</code> — without https://</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Server className="w-3 h-3" /> Cloudflare Zone ID
                </label>
                <input
                  type="text"
                  value={cfZoneId}
                  onChange={e => setCfZoneId(e.target.value)}
                  placeholder="abc123def456..."
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-all"
                />
                <p className="text-[10px] text-white/30 pl-1">Cloudflare Dashboard → Domain → Overview → Zone ID</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                  <Key className="w-3 h-3" /> Cloudflare API Token
                </label>
                <input
                  type="password"
                  value={cfApiToken}
                  onChange={e => setCfApiToken(e.target.value)}
                  placeholder="••••••••••••••••••••••"
                  className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-all"
                />
                <a
                  href="https://dash.cloudflare.com/profile/api-tokens"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 pl-1 w-fit"
                >
                  <ExternalLink className="w-3 h-3" /> Create token with "Edit DNS" permission
                </a>
              </div>
            </div>
          </div>

          {/* Resend */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="font-black text-sm">Resend Email Service</div>
                <div className="text-[10px] text-white/40 font-semibold uppercase tracking-widest">Domain verification + sending</div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Key className="w-3 h-3" /> Resend API Key
              </label>
              <input
                type="password"
                value={resendApiKey}
                onChange={e => setResendApiKey(e.target.value)}
                placeholder="re_••••••••••••••••••••••"
                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-all"
              />
              <a
                href="https://resend.com/api-keys"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 pl-1 w-fit"
              >
                <ExternalLink className="w-3 h-3" /> Get your API key from Resend dashboard
              </a>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> Sender Display Name
              </label>
              <input
                type="text"
                value={emailSenderName}
                onChange={e => setEmailSenderName(e.target.value)}
                placeholder="Shopeefy"
                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-all"
              />
              <p className="text-[10px] text-white/30 pl-1">
                Name shown in inbox — e.g. <code className="text-purple-400">Shopeefy</code> → appears as <code className="text-purple-400">Shopeefy &lt;noreply@...&gt;</code>
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> Sender Email Address
              </label>
              <input
                type="text"
                value={emailSender}
                onChange={e => setEmailSender(e.target.value)}
                placeholder="noreply@yourdomain.com"
                className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-all"
              />
              <p className="text-[10px] text-white/30 pl-1">
                Customize sender email (e.g. <code className="text-purple-400">noreply@{domain || "yourdomain.com"}</code>)
              </p>
            </div>
          </div>

          {/* Save + Configure Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex-1 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Settings
            </button>
            <button
              onClick={handleConfigure}
              disabled={isConfiguring || !domain || !cfZoneId || !cfApiToken || !resendApiKey}
              className="flex-1 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-purple-900/30"
            >
              {isConfiguring ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Configuring...</>
              ) : (
                <><Play className="w-4 h-4" /> Auto Configure</>
              )}
            </button>
          </div>

          {/* Domain Status Panel */}
          {domainStatus && domainStatus.status !== "not_configured" && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-black text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-purple-400" />
                  Resend Domain Status
                </div>
                <button
                  onClick={() => refetchStatus()}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-white/40" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {getStatusBadge(domainStatus.status)}
                {domainStatus.id && (
                  <span className="text-[10px] font-mono text-white/30">ID: {domainStatus.id}</span>
                )}
              </div>

              {domainStatus.records && domainStatus.records.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[10px] font-black text-white/40 uppercase tracking-widest">DNS Records</div>
                  {domainStatus.records.map((rec, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-3 flex items-start justify-between gap-2">
                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black bg-white/10 px-1.5 py-0.5 rounded text-white/60 uppercase">{rec.type}</span>
                          <span className="text-xs font-mono text-white/70 truncate">{rec.name}</span>
                          {rec.status === "verified" ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="w-3 h-3 text-amber-400 flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-[9px] font-mono text-white/30 truncate">{rec.value}</div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(rec.value)}
                        className="flex-shrink-0 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                      >
                        <Copy className="w-3 h-3 text-white/40" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Send Test Email Panel */}
          {domainSetting?.value && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="font-black text-sm">Send Test Email</div>
                  <div className="text-[10px] text-white/40 font-semibold uppercase tracking-widest">Verify mail deliverability</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <input
                    type="email"
                    value={testEmailRecipient}
                    onChange={e => setTestEmailRecipient(e.target.value)}
                    placeholder="receiver@gmail.com"
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>
                <button
                  onClick={handleSendTestEmail}
                  disabled={isSendingTest || !testEmailRecipient}
                  className="w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-emerald-950/20"
                >
                  {isSendingTest ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    <><Mail className="w-4 h-4" /> Send Test Email</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Live Console */}
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/10 bg-[#0d0d14] overflow-hidden flex flex-col h-full min-h-[500px]">
            {/* Console Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <span className="text-[11px] font-black text-white/30 uppercase tracking-widest">Configuration Console</span>
              </div>
              {configResult === "success" && (
                <span className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Success
                </span>
              )}
              {configResult === "error" && (
                <span className="flex items-center gap-1.5 text-red-400 text-[10px] font-black">
                  <XCircle className="w-3.5 h-3.5" /> Failed
                </span>
              )}
              {isConfiguring && (
                <span className="flex items-center gap-1.5 text-sky-400 text-[10px] font-black">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Running...
                </span>
              )}
            </div>

            {/* Console Body */}
            <div className="flex-1 overflow-y-auto p-5 font-mono text-[11px] space-y-1 min-h-0">
              {logs.length === 0 ? (
                <div className="text-white/20 select-none">
                  <div>$ ready. Fill in your credentials and click <span className="text-purple-400">Auto Configure</span>.</div>
                  <div className="mt-2">This will:</div>
                  <div className="pl-4 text-white/15 space-y-0.5 mt-1">
                    <div>→ Add your domain to Resend</div>
                    <div>→ Fetch required DNS records (DKIM, SPF, DMARC)</div>
                    <div>→ Create those records in Cloudflare automatically</div>
                    <div>→ Trigger domain verification in Resend</div>
                  </div>
                </div>
              ) : (
                logs.map((entry, i) => (
                  <div key={i} className="flex gap-2 leading-relaxed">
                    <span className={`flex-shrink-0 ${LOG_COLORS[entry.level]} font-black`}>
                      {LOG_PREFIXES[entry.level]}
                    </span>
                    <span className={`${entry.level === "error" ? "text-red-300" : entry.level === "ok" ? "text-emerald-300" : entry.level === "warn" ? "text-amber-300" : "text-white/70"} break-all`}>
                      {entry.msg}
                    </span>
                  </div>
                ))
              )}
              {isConfiguring && (
                <div className="flex gap-2 animate-pulse">
                  <span className="text-sky-400 font-black">[....] </span>
                  <span className="text-white/40">Processing...</span>
                </div>
              )}
              <div ref={consoleEndRef} />
            </div>
          </div>

          {/* How-to Guide */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
            <div className="font-black text-sm text-white/70">📖 Setup Guide</div>
            <ol className="space-y-3 text-[11px] text-white/50 list-none">
              {[
                { step: "1", text: "Enter your domain name (e.g. shopeefy.com)" },
                { step: "2", text: "Go to Cloudflare → select domain → Overview → copy Zone ID" },
                { step: "3", text: "Create a Cloudflare API Token with 'Edit DNS records' permission" },
                { step: "4", text: "Get your Resend API key from resend.com/api-keys" },
                { step: "5", text: "Click Save Settings, then click Auto Configure" },
                { step: "6", text: "Wait for DNS propagation (up to 24h). Check Resend dashboard for verification." },
              ].map(item => (
                <li key={item.step} className="flex gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-600/20 border border-purple-500/20 flex items-center justify-center text-[9px] font-black text-purple-400">
                    {item.step}
                  </span>
                  <span className="pt-0.5">{item.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
