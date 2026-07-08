import { c as createLucideIcon, e as useToast, r as reactExports, u as useQuery, f as useMutation, j as jsxRuntimeExports, L as LoaderCircle, ae as Database, v as ShieldCheck, B as Button, q as queryClient, i as apiRequest } from "./index-CFDXjY-0.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-GN8nG667.js";
import { I as Input } from "./input-m8g0nMhD.js";
import { L as Label } from "./label-B8IjHx0W.js";
import { S as Save } from "./save-DCI2xOYt.js";
import { P as Play } from "./play-CVrDIIXD.js";
import { C as Clock } from "./clock-93faIsJn.js";
import { H as History } from "./history-C7pn81Xr.js";
import { f as format } from "./format-Fqx7OmaC.js";
const Terminal = createLucideIcon("Terminal", [
  ["polyline", { points: "4 17 10 11 4 5", key: "akl6gq" }],
  ["line", { x1: "12", x2: "20", y1: "19", y2: "19", key: "q2wloq" }]
]);
function BackupPage() {
  const { toast } = useToast();
  const consoleEndRef = reactExports.useRef(null);
  const [formData, setFormData] = reactExports.useState({
    dbUrl: "",
    botToken: "",
    chatId: "",
    frequency: 3
  });
  const { data: config, isLoading: isConfigLoading } = useQuery({
    queryKey: ["/api/backups/config"]
  });
  const { data: logs, isLoading: isLogsLoading } = useQuery({
    queryKey: ["/api/backups/logs"],
    refetchInterval: 5e3
    // Refresh logs every 5 seconds
  });
  reactExports.useEffect(() => {
    if (config) {
      setFormData({
        dbUrl: config.dbUrl,
        botToken: config.botToken,
        chatId: config.chatId,
        frequency: config.frequency
      });
    }
  }, [config]);
  reactExports.useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);
  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/backups/config", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/backups/config"] });
      toast({
        title: "Configuration Saved",
        description: "Your database backup settings have been updated."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  const triggerMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/backups/trigger");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Backup Triggered",
        description: "The backup process has started in the background. Check console for status."
      });
    },
    onError: (error) => {
      toast({
        title: "Backup Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  if (isConfigLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-purple-400" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10 animate-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl font-black tracking-tighter text-white drop-shadow-2xl", children: "DB Backup" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 mt-2 font-medium", children: "Automated PostgreSQL 17 Backup System" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel px-6 py-2.5 rounded-full flex items-center gap-3 text-sm font-bold text-white shadow-lg border-white/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-5 h-5 text-purple-400" }),
        "Status: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: config?.isActive ? "text-green-400" : "text-yellow-400", children: config?.isActive ? "Active" : "Inactive" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 overflow-hidden h-fit", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "bg-gradient-to-r from-purple-500/20 to-blue-500/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-2xl font-bold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-6 h-6 text-purple-400" }),
            "Backup Configuration"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/60", children: "Configure where to fetch the dump and where to send it via Telegram." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-6 space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/50 uppercase tracking-widest", children: "PostgreSQL Connection URL" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "postgresql://user:pass@host:port/dbname",
                className: "glass-panel border-white/10 bg-white/5 text-white h-12 rounded-xl",
                value: formData.dbUrl,
                onChange: (e) => setFormData({ ...formData, dbUrl: e.target.value })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40", children: "The URL of the database you want to backup." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/50 uppercase tracking-widest", children: "Telegram Bot Token" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "password",
                  placeholder: "Bot Token",
                  className: "glass-panel border-white/10 bg-white/5 text-white h-12 rounded-xl",
                  value: formData.botToken,
                  onChange: (e) => setFormData({ ...formData, botToken: e.target.value })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/50 uppercase tracking-widest", children: "Chat ID / User ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Chat ID",
                  className: "glass-panel border-white/10 bg-white/5 text-white h-12 rounded-xl",
                  value: formData.chatId,
                  onChange: (e) => setFormData({ ...formData, chatId: e.target.value })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/50 uppercase tracking-widest", children: "Backup Frequency (Hours)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "1",
                  max: "24",
                  className: "glass-panel border-white/10 bg-white/5 text-white h-12 rounded-xl w-32",
                  value: formData.frequency,
                  onChange: (e) => setFormData({ ...formData, frequency: parseInt(e.target.value) })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-white/60", children: [
                "Automatically runs every ",
                formData.frequency,
                " hours."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 flex gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => updateMutation.mutate(formData),
                disabled: updateMutation.isPending,
                className: "flex-1 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: [
                  updateMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5 mr-2" }),
                  "Save Configuration"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => triggerMutation.mutate(),
                disabled: triggerMutation.isPending || !config,
                variant: "outline",
                className: "h-12 px-6 rounded-xl border-white/20 hover:bg-white/5 font-bold text-white",
                children: [
                  triggerMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-5 h-5 mr-2 text-green-400" }),
                  "Run Now"
                ]
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "relative glass-panel border-0 overflow-hidden flex flex-col h-[600px] group/console shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-10 opacity-30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "bg-white/5 backdrop-blur-3xl border-b border-white/10 shrink-0 py-4 relative z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 button-red h-3 rounded-full bg-[#FF5F56] shadow-[0_0_10px_rgba(255,95,86,0.3)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 button-yellow h-3 rounded-full bg-[#FFBD2E] shadow-[0_0_10px_rgba(255,189,46,0.2)]" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 button-green h-3 rounded-full bg-[#27C93F] shadow-[0_0_10px_rgba(39,201,63,0.3)]" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-white/10 mx-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-sm font-black flex items-center gap-2 text-white/90 uppercase tracking-[0.2em]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-4 h-4 text-purple-400" }),
              "Live Console"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-2 py-0.5 rounded bg-green-500/20 text-[10px] font-bold text-green-400 border border-green-500/30", children: "LIVE" }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0 flex-1 bg-[#050510]/95 font-mono text-[13px] overflow-hidden flex flex-col relative z-20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none opacity-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-2.5 custom-scrollbar relative", children: [
            !logs || logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col items-center justify-center text-white/20 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "italic font-medium animate-pulse", children: "Establishing terminal connection..." })
            ] }) : logs.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 group animate-in slide-in-from-left-2 duration-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/20 shrink-0 select-none font-medium", children: format(new Date(log.createdAt), "HH:mm:ss") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `
                        flex items-center gap-2 font-medium leading-relaxed
                        ${log.status === "success" ? "text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.3)]" : ""}
                        ${log.status === "error" ? "text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.3)]" : ""}
                        ${log.status === "starting" ? "text-blue-400" : ""}
                        ${log.status === "info" ? "text-white/80" : ""}
                      `, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 opacity-50", children: log.status === "success" ? "✔" : log.status === "error" ? "✖" : "›" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  log.message,
                  log.fileSize && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/50 border border-white/5", children: [
                    (log.fileSize / 1024 / 1024).toFixed(2),
                    " MB"
                  ] })
                ] })
              ] }) })
            ] }, log.id)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: consoleEndRef })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-white/5 border-t border-white/10 shrink-0 flex justify-between items-center text-[10px] text-white/40 font-bold uppercase tracking-[0.15em] px-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 group/stat", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-blue-400 group-hover/stat:scale-110 transition-transform" }),
                "SCHED: ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/70", children: [
                  config?.frequency || 0,
                  "H"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 group/stat", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "w-3.5 h-3.5 text-purple-400 group-hover/stat:scale-110 transition-transform" }),
                "LAST: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/70", children: config?.lastBackup ? format(new Date(config.lastBackup), "MMM d, HH:mm") : "NEVER" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" }),
              "SECURE CHANNEL"
            ] })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card border-0 bg-blue-500/10 border-blue-500/20 p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-500/20 p-3 rounded-xl h-fit", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-6 h-6 text-blue-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-white", children: "Cloud Shooping Security Protocol" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/60 text-sm leading-relaxed", children: [
          "Backups are generated on-server using ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "pg_dump" }),
          " v17. Files are temporarily stored in ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: "~/pg_backups" }),
          "and uploaded to your Telegram bot via the Bot API. After successful upload, the local file is deleted to save space. The backup includes the full database structure and data in custom format (",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { children: ".dump" }),
          ")."
        ] })
      ] })
    ] }) })
  ] });
}
export {
  BackupPage as default
};
