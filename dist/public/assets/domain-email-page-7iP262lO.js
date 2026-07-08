import { d as useToast, r as reactExports, u as useQuery, j as jsxRuntimeExports, G as Globe, s as Mail, L as LoaderCircle, p as Shield, h as apiRequest, q as queryClient } from "./index-CONiKOL0.js";
import { S as Server } from "./server-BcsuNCYc.js";
import { K as Key } from "./key-BZQQA_iE.js";
import { E as ExternalLink } from "./external-link-CjCbQbqq.js";
import { S as Save } from "./save--s25Gagh.js";
import { P as Play } from "./play-DERZAKPu.js";
import { R as RefreshCw } from "./refresh-cw-0F4Ohst7.js";
import { C as CircleCheck } from "./circle-check-U55DNemK.js";
import { T as TriangleAlert } from "./triangle-alert-4R5aL3oc.js";
import { C as Copy } from "./copy-GiC5Jezn.js";
import { C as CircleX } from "./circle-x-BC7xd3Cv.js";
import { I as Info } from "./info-D6b7XekY.js";
const useSetting = (key) => useQuery({
  queryKey: [`/api/settings/${key}`]
});
const saveSetting = async (key, value) => {
  const res = await apiRequest("POST", "/api/settings", { key, value });
  return res.json();
};
const LOG_COLORS = {
  info: "text-sky-400",
  ok: "text-emerald-400",
  error: "text-red-400",
  warn: "text-amber-400"
};
const LOG_PREFIXES = {
  info: "[INFO] ",
  ok: "[OK]   ",
  error: "[ERR]  ",
  warn: "[WARN] "
};
function DomainEmailPage() {
  const { toast } = useToast();
  const consoleEndRef = reactExports.useRef(null);
  const [domain, setDomain] = reactExports.useState("");
  const [cfZoneId, setCfZoneId] = reactExports.useState("");
  const [cfApiToken, setCfApiToken] = reactExports.useState("");
  const [resendApiKey, setResendApiKey] = reactExports.useState("");
  const [emailSender, setEmailSender] = reactExports.useState("");
  const [emailSenderName, setEmailSenderName] = reactExports.useState("Shopeefy");
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [logs, setLogs] = reactExports.useState([]);
  const [isConfiguring, setIsConfiguring] = reactExports.useState(false);
  const [configResult, setConfigResult] = reactExports.useState(null);
  const [testEmailRecipient, setTestEmailRecipient] = reactExports.useState("");
  const [isSendingTest, setIsSendingTest] = reactExports.useState(false);
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
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSendingTest(false);
    }
  };
  const { data: domainSetting } = useSetting("DOMAIN_NAME");
  const { data: cfZoneSetting } = useSetting("CLOUDFLARE_ZONE_ID");
  const { data: cfTokenSetting } = useSetting("CLOUDFLARE_API_TOKEN");
  const { data: resendKeySetting } = useSetting("RESEND_API_KEY");
  const { data: senderSetting } = useSetting("EMAIL_SENDER");
  const { data: senderNameSetting } = useSetting("EMAIL_SENDER_NAME");
  const { data: domainStatus, refetch: refetchStatus } = useQuery({
    queryKey: ["/api/admin/domain/status"],
    refetchInterval: 3e4
  });
  reactExports.useEffect(() => {
    if (domainSetting?.value) setDomain(domainSetting.value);
  }, [domainSetting]);
  reactExports.useEffect(() => {
    if (cfZoneSetting?.value) setCfZoneId(cfZoneSetting.value);
  }, [cfZoneSetting]);
  reactExports.useEffect(() => {
    if (cfTokenSetting?.value) setCfApiToken(cfTokenSetting.value);
  }, [cfTokenSetting]);
  reactExports.useEffect(() => {
    if (resendKeySetting?.value) setResendApiKey(resendKeySetting.value);
  }, [resendKeySetting]);
  reactExports.useEffect(() => {
    if (senderSetting?.value) setEmailSender(senderSetting.value);
  }, [senderSetting]);
  reactExports.useEffect(() => {
    if (senderNameSetting?.value) setEmailSenderName(senderNameSetting.value);
  }, [senderNameSetting]);
  reactExports.useEffect(() => {
    if (domain && (!emailSender || emailSender.includes("shopeefy.com"))) {
      setEmailSender(`noreply@${domain.trim()}`);
    }
  }, [domain]);
  reactExports.useEffect(() => {
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
        saveSetting("EMAIL_SERVICE", "resend")
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
    } catch (err) {
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
          setLogs((prev) => [...prev, { level: "error", msg: data.error }]);
        }
        toast({ title: "Configuration Failed", description: data.error || "Unknown error", variant: "destructive" });
      }
    } catch (err) {
      setLogs((prev) => [...prev, { level: "error", msg: err.message }]);
      setConfigResult("error");
      toast({ title: "Request Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsConfiguring(false);
    }
  };
  const getStatusBadge = (status) => {
    if (status === "verified") return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-black border border-emerald-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3" }),
      " Verified"
    ] });
    if (status === "pending") return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-black border border-amber-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3" }),
      " Pending"
    ] });
    if (status === "not_added") return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-500/15 text-neutral-400 text-xs font-black border border-neutral-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3 h-3" }),
      " Not Added"
    ] });
    if (status === "not_configured") return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-500/15 text-neutral-400 text-xs font-black border border-neutral-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3 h-3" }),
      " Not Configured"
    ] });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 text-xs font-black border border-sky-500/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-3 h-3" }),
      " ",
      status
    ] });
  };
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", duration: 1500 });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-2xl shadow-purple-900/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-7 h-7 text-white" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black tracking-tighter", children: "Domain & Email Config" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/40 font-semibold mt-0.5", children: "Cloudflare DNS + Resend auto-setup — one click configuration" })
      ] }),
      domainStatus && getStatusBadge(domainStatus.status)
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-5 h-5 text-orange-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-sm", children: "Domain & Cloudflare" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-white/40 font-semibold uppercase tracking-widest", children: "DNS auto-configuration" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3" }),
                " Domain Name"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: domain,
                  onChange: (e) => setDomain(e.target.value),
                  placeholder: "yourstore.com",
                  className: "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-all"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-white/30 pl-1", children: [
                "e.g. ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-purple-400", children: "shopeefy.com" }),
                " — without https://"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "w-3 h-3" }),
                " Cloudflare Zone ID"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: cfZoneId,
                  onChange: (e) => setCfZoneId(e.target.value),
                  placeholder: "abc123def456...",
                  className: "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-all"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/30 pl-1", children: "Cloudflare Dashboard → Domain → Overview → Zone ID" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-3 h-3" }),
                " Cloudflare API Token"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "password",
                  value: cfApiToken,
                  onChange: (e) => setCfApiToken(e.target.value),
                  placeholder: "••••••••••••••••••••••",
                  className: "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-all"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "a",
                {
                  href: "https://dash.cloudflare.com/profile/api-tokens",
                  target: "_blank",
                  rel: "noreferrer",
                  className: "text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 pl-1 w-fit",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" }),
                    ' Create token with "Edit DNS" permission'
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-5 h-5 text-purple-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-sm", children: "Resend Email Service" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-white/40 font-semibold uppercase tracking-widest", children: "Domain verification + sending" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-3 h-3" }),
              " Resend API Key"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "password",
                value: resendApiKey,
                onChange: (e) => setResendApiKey(e.target.value),
                placeholder: "re_••••••••••••••••••••••",
                className: "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-mono text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-all"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "a",
              {
                href: "https://resend.com/api-keys",
                target: "_blank",
                rel: "noreferrer",
                className: "text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 pl-1 w-fit",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-3 h-3" }),
                  " Get your API key from Resend dashboard"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3 h-3" }),
              " Sender Display Name"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: emailSenderName,
                onChange: (e) => setEmailSenderName(e.target.value),
                placeholder: "Shopeefy",
                className: "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-all"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-white/30 pl-1", children: [
              "Name shown in inbox — e.g. ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-purple-400", children: "Shopeefy" }),
              " → appears as ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-purple-400", children: "Shopeefy <noreply@...>" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3 h-3" }),
              " Sender Email Address"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                value: emailSender,
                onChange: (e) => setEmailSender(e.target.value),
                placeholder: "noreply@yourdomain.com",
                className: "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-purple-500 transition-all"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-white/30 pl-1", children: [
              "Customize sender email (e.g. ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("code", { className: "text-purple-400", children: [
                "noreply@",
                domain || "yourdomain.com"
              ] }),
              ")"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: handleSaveSettings,
              disabled: isSaving,
              className: "flex-1 h-12 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50",
              children: [
                isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }),
                "Save Settings"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleConfigure,
              disabled: isConfiguring || !domain || !cfZoneId || !cfApiToken || !resendApiKey,
              className: "flex-1 h-12 rounded-2xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-purple-900/30",
              children: isConfiguring ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
                " Configuring..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4" }),
                " Auto Configure"
              ] })
            }
          )
        ] }),
        domainStatus && domainStatus.status !== "not_configured" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-black text-sm flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-purple-400" }),
              "Resend Domain Status"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => refetchStatus(),
                className: "w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 text-white/40" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            getStatusBadge(domainStatus.status),
            domainStatus.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-white/30", children: [
              "ID: ",
              domainStatus.id
            ] })
          ] }),
          domainStatus.records && domainStatus.records.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black text-white/40 uppercase tracking-widest", children: "DNS Records" }),
            domainStatus.records.map((rec, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-white/5 rounded-xl p-3 flex items-start justify-between gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5 flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] font-black bg-white/10 px-1.5 py-0.5 rounded text-white/60 uppercase", children: rec.type }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-white/70 truncate", children: rec.name }),
                  rec.status === "verified" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 text-emerald-400 flex-shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-3 h-3 text-amber-400 flex-shrink-0" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] font-mono text-white/30 truncate", children: rec.value })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => copyToClipboard(rec.value),
                  className: "flex-shrink-0 w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3 h-3 text-white/40" })
                }
              )
            ] }, i))
          ] })
        ] }),
        domainSetting?.value && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-5 h-5 text-emerald-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-sm", children: "Send Test Email" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-white/40 font-semibold uppercase tracking-widest", children: "Verify mail deliverability" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "email",
                value: testEmailRecipient,
                onChange: (e) => setTestEmailRecipient(e.target.value),
                placeholder: "receiver@gmail.com",
                className: "w-full h-12 rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-semibold text-white placeholder:text-white/20 focus:outline-none focus:border-emerald-500 transition-all"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleSendTestEmail,
                disabled: isSendingTest || !testEmailRecipient,
                className: "w-full h-12 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-xl shadow-emerald-950/20",
                children: isSendingTest ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }),
                  " Sending..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-4 h-4" }),
                  " Send Test Email"
                ] })
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-white/10 bg-[#0d0d14] overflow-hidden flex flex-col h-full min-h-[500px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-red-500/60" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-yellow-500/60" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-green-500/60" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-black text-white/30 uppercase tracking-widest", children: "Configuration Console" })
            ] }),
            configResult === "success" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-emerald-400 text-[10px] font-black", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3.5 h-3.5" }),
              " Success"
            ] }),
            configResult === "error" && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-red-400 text-[10px] font-black", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5" }),
              " Failed"
            ] }),
            isConfiguring && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 text-sky-400 text-[10px] font-black", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }),
              " Running..."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-5 font-mono text-[11px] space-y-1 min-h-0", children: [
            logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-white/20 select-none", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                "$ ready. Fill in your credentials and click ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-purple-400", children: "Auto Configure" }),
                "."
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: "This will:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pl-4 text-white/15 space-y-0.5 mt-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "→ Add your domain to Resend" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "→ Fetch required DNS records (DKIM, SPF, DMARC)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "→ Create those records in Cloudflare automatically" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "→ Trigger domain verification in Resend" })
              ] })
            ] }) : logs.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 leading-relaxed", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `flex-shrink-0 ${LOG_COLORS[entry.level]} font-black`, children: LOG_PREFIXES[entry.level] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `${entry.level === "error" ? "text-red-300" : entry.level === "ok" ? "text-emerald-300" : entry.level === "warn" ? "text-amber-300" : "text-white/70"} break-all`, children: entry.msg })
            ] }, i)),
            isConfiguring && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 animate-pulse", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sky-400 font-black", children: "[....] " }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/40", children: "Processing..." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: consoleEndRef })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-black text-sm text-white/70", children: "📖 Setup Guide" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-3 text-[11px] text-white/50 list-none", children: [
            { step: "1", text: "Enter your domain name (e.g. shopeefy.com)" },
            { step: "2", text: "Go to Cloudflare → select domain → Overview → copy Zone ID" },
            { step: "3", text: "Create a Cloudflare API Token with 'Edit DNS records' permission" },
            { step: "4", text: "Get your Resend API key from resend.com/api-keys" },
            { step: "5", text: "Click Save Settings, then click Auto Configure" },
            { step: "6", text: "Wait for DNS propagation (up to 24h). Check Resend dashboard for verification." }
          ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink-0 w-5 h-5 rounded-full bg-purple-600/20 border border-purple-500/20 flex items-center justify-center text-[9px] font-black text-purple-400", children: item.step }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "pt-0.5", children: item.text })
          ] }, item.step)) })
        ] })
      ] })
    ] })
  ] });
}
export {
  DomainEmailPage as default
};
