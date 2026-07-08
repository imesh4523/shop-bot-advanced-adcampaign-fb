import { e as useToast, r as reactExports, u as useQuery, f as useMutation, j as jsxRuntimeExports, v as Mail, U as Users, L as LoaderCircle, B as Button, x as Send, i as apiRequest } from "./index-ClfWNFIh.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, d as CardDescription } from "./card-gFf3Eq8V.js";
import { I as Input } from "./input-BD4KoEjj.js";
import { T as Textarea } from "./textarea-Dlhxk4Iw.js";
import { L as Label } from "./label-ChxtGFPf.js";
import { D as DollarSign } from "./dollar-sign-Dl1tcSwp.js";
import { C as CircleCheckBig } from "./circle-check-big-DdYtC90d.js";
import { F as FileText } from "./file-text-BVtjIX-c.js";
import { E as Eye } from "./eye-CSpdOur_.js";
function EmailCampaignPage() {
  const { toast } = useToast();
  const [recipientType, setRecipientType] = reactExports.useState("all");
  const [targetEmail, setTargetEmail] = reactExports.useState("");
  const [subject, setSubject] = reactExports.useState("");
  const [customMessage, setCustomMessage] = reactExports.useState("");
  const [showPreview, setShowPreview] = reactExports.useState(true);
  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ["/api/telegram-users"]
  });
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ["/api/orders"]
  });
  const emailUsers = users.filter((u) => u.telegramId.startsWith("email:"));
  const emailList = emailUsers.map((u) => u.telegramId.substring(6));
  const purchasedUserIds = new Set(orders.map((o) => o.telegramUserId).filter(Boolean));
  const emailUsersWithPurchases = emailUsers.filter((u) => purchasedUserIds.has(u.id));
  const isValid = subject.trim().length > 0 && customMessage.trim().length > 0 && (recipientType !== "single" || targetEmail.includes("@") && targetEmail.trim().length > 0);
  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/admin/email-campaign/send", data);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Campaign Sent Successfully!",
        description: `Successfully sent broadcast to ${data.count} of ${data.totalRecipients} recipients.`
      });
      setSubject("");
      setCustomMessage("");
      setTargetEmail("");
    },
    onError: (err) => {
      toast({
        title: "Campaign Failed",
        description: err.message || "An error occurred while sending the campaign.",
        variant: "destructive"
      });
    }
  });
  const handleSend = () => {
    if (!isValid) return;
    mutation.mutate({
      recipientType,
      targetEmail: recipientType === "single" ? targetEmail : void 0,
      subject,
      customMessage
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10 animate-in pb-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl font-black tracking-tighter text-white drop-shadow-2xl", children: "Email Campaigns" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel px-6 py-2.5 rounded-full flex items-center gap-3 text-sm font-bold text-white shadow-lg border-white/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-5 h-5 text-purple-400" }),
        "Send Announcements & Offers"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 relative overflow-hidden group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-white/50 uppercase tracking-wider", children: "Total Email Users" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-purple-400" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl font-black text-white tracking-tight", children: isUsersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin" }) : emailUsers.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40 mt-1", children: "Users registered via OTP Email Auth" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 relative overflow-hidden group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-white/50 uppercase tracking-wider", children: "Purchased Email Users" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-5 h-5 text-emerald-400" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-4xl font-black text-white tracking-tight", children: isUsersLoading || isOrdersLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin" }) : emailUsersWithPurchases.length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40 mt-1", children: "Email users with at least 1 purchase" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 relative overflow-hidden group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between pb-2 space-y-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-sm font-bold text-white/50 uppercase tracking-wider", children: "Active Provider" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 text-blue-400" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-black text-white tracking-tight capitalize", children: "Dynamic Config" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40 mt-1", children: "Set in settings dashboard" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-7 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-2xl font-black tracking-tighter flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-6 h-6 text-purple-400" }),
            "Campaign Details"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/55", children: "Compose custom message and select target recipients." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Recipient Target" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                value: recipientType,
                onChange: (e) => setRecipientType(e.target.value),
                className: "w-full glass-panel border-white/10 bg-purple-950/20 text-white h-12 px-3 rounded-xl focus:border-purple-500/50 transition-all outline-none",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: "all", className: "bg-purple-950 text-white", children: [
                    "All Email Users (",
                    emailUsers.length,
                    " users)"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: "purchased", className: "bg-purple-950 text-white", children: [
                    "Users with Purchases only (",
                    emailUsersWithPurchases.length,
                    " users)"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "single", className: "bg-purple-950 text-white", children: "Single User (Specific email)" })
                ]
              }
            )
          ] }),
          recipientType === "single" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 animate-in fade-in slide-in-from-top-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "targetEmail", className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Target Email Address" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "targetEmail",
                type: "email",
                list: "email-list",
                placeholder: "Enter or select email address...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50",
                value: targetEmail,
                onChange: (e) => setTargetEmail(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("datalist", { id: "email-list", children: emailList.map((email) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: email }, email)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "subject", className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Email Subject" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "subject",
                type: "text",
                placeholder: "Enter email subject line...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50",
                value: subject,
                onChange: (e) => setSubject(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "customMessage", className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Message Body (HTML Supported)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "customMessage",
                placeholder: "Enter announcements, updates, new stock notifications, or HTML templates...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white min-h-[220px] rounded-xl focus:border-purple-500/50 transition-all",
                value: customMessage,
                onChange: (e) => setCustomMessage(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSend,
              disabled: !isValid || mutation.isPending,
              className: "w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold",
              children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin mr-2" }),
                "Sending Emails..."
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-5 h-5 mr-2" }),
                "Send Campaign"
              ] })
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-5 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10 flex flex-row items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xl font-black tracking-tighter flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-5 h-5 text-purple-400" }),
              "Live Preview"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/55", children: "Visual preview inside Shopeefy frame." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              onClick: () => setShowPreview(!showPreview),
              className: "text-purple-400 hover:bg-purple-950/30",
              children: showPreview ? "Hide" : "Show"
            }
          )
        ] }),
        showPreview && /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6 bg-slate-950 overflow-y-auto max-h-[500px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: {
          fontFamily: "'Inter', sans-serif",
          backgroundColor: "#0f172a",
          color: "#f8fafc",
          padding: "24px 16px",
          borderRadius: "16px",
          border: "1px solid #1e293b",
          width: "100%",
          boxSizing: "border-box"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { textAlign: "center", marginBottom: "20px", borderBottom: "1px solid #334155", paddingBottom: "15px" }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: {
              background: "linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)",
              fontSize: "24px",
              fontWeight: 800,
              margin: 0,
              color: "#a78bfa"
            }, children: "Shopeefy" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "#94a3b8", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", marginTop: "3px", fontWeight: "bold" }, children: "Important Announcement" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: { color: "#e2e8f0", fontSize: "14px", lineHeight: "1.6", marginBottom: "20px", minHeight: "100px", whiteSpace: "pre-wrap" },
              dangerouslySetInnerHTML: { __html: customMessage || "Your campaign content details will preview here dynamically as you type..." }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { textAlign: "center", borderTop: "1px solid #1e293b", paddingTop: "15px", marginTop: "20px" }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { style: { fontSize: "10px", color: "#64748b", margin: 0, lineHeight: "1.4" }, children: [
            "You received this email because you are a registered user of Shopeefy.",
            /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
            "Developer Credits: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#8b5cf6", fontWeight: "bold" }, children: "Rochana Imesh" })
          ] }) })
        ] }) })
      ] }) })
    ] })
  ] });
}
export {
  EmailCampaignPage as default
};
