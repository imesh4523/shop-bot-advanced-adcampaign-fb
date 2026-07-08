import { b as createLucideIcon, e as useToast, N as useQueryClient, r as reactExports, R as React, u as useQuery, ac as lookup, f as useMutation, j as jsxRuntimeExports, L as LoaderCircle, ag as Share2, B as Button, w as Send, U as Users } from "./index-DdkDM_rs.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-DsrUQpun.js";
import { I as Input } from "./input-Cp6zPxlx.js";
import { S as Sparkles } from "./sparkles-Du9VCBTS.js";
import { m as motion, A as AnimatePresence } from "./proxy-DyQzYFjJ.js";
import { A as Activity } from "./activity-CWSgxI2G.js";
import { P as Play } from "./play-Dsv2MWVx.js";
import { E as EyeOff } from "./eye-off-yzMGEvJQ.js";
import { E as Eye } from "./eye-fh2iyb5L.js";
import { C as Clock } from "./clock-DL_gGbdn.js";
import { C as CircleCheck } from "./circle-check-DRLNtYzA.js";
import { R as RefreshCw } from "./refresh-cw-BN2yeuHQ.js";
import { T as Trash2 } from "./trash-2-Djk7plZF.js";
const KeyRound = createLucideIcon("KeyRound", [
  [
    "path",
    {
      d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z",
      key: "1s6t7t"
    }
  ],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor", key: "w0ekpg" }]
]);
const Link2 = createLucideIcon("Link2", [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
]);
const Square = createLucideIcon("Square", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
]);
function ForwardPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showToken, setShowToken] = reactExports.useState(false);
  const [botToken, setBotToken] = reactExports.useState("");
  const [postLink, setPostLink] = reactExports.useState("");
  const [intervalVal, setIntervalVal] = reactExports.useState(1);
  const isInitializedRef = React.useRef(false);
  const { data: config, isLoading: isConfigLoading } = useQuery({
    queryKey: ["/api/forward/config"]
  });
  reactExports.useEffect(() => {
    if (config && !isInitializedRef.current) {
      setBotToken(config.botToken || "");
      setPostLink(config.postLink || "");
      setIntervalVal(config.interval || 1);
      isInitializedRef.current = true;
    }
  }, [config]);
  const { data: serverGroups = [], isLoading: isGroupsLoading } = useQuery({
    queryKey: ["/api/forward/groups"]
  });
  const [groups, setGroups] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (serverGroups) {
      setGroups(serverGroups);
    }
  }, [serverGroups]);
  reactExports.useEffect(() => {
    const socket = lookup();
    socket.on("tg_forward_stats", (updatedGroups) => {
      setGroups(updatedGroups);
      queryClient.setQueryData(["/api/forward/groups"], updatedGroups);
    });
    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
  const updateConfigMutation = useMutation({
    mutationFn: async (newConfig) => {
      const res = await fetch("/api/forward/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newConfig)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update configuration.");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/forward/config"], data);
      setBotToken(data.botToken || "");
      setPostLink(data.postLink || "");
      setIntervalVal(data.interval || 1);
      toast({
        title: "Configuration Saved",
        description: "Auto Forward configuration updated successfully."
      });
    },
    onError: (err) => {
      toast({
        title: "Error Saving Config",
        description: err.message,
        variant: "destructive"
      });
    }
  });
  const syncGroupsMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/forward/sync-groups", { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to sync groups.");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/forward/groups"] });
      toast({
        title: "Sync Completed",
        description: `Successfully detected ${data.count} group(s).`
      });
    },
    onError: (err) => {
      toast({
        title: "Sync Failed",
        description: err.message,
        variant: "destructive"
      });
    }
  });
  const clearCountersMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/forward/groups/clear", { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to clear counters.");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/forward/groups"] });
      toast({
        title: "Counters Reset",
        description: "All forward counters have been reset to zero."
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to Reset",
        description: err.message,
        variant: "destructive"
      });
    }
  });
  const toggleGroupMutation = useMutation({
    mutationFn: async (groupId) => {
      const res = await fetch(`/api/forward/groups/${groupId}/toggle`, {
        method: "POST"
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to toggle group status.");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/forward/groups"], data.groups);
      setGroups(data.groups);
      toast({
        title: "Status Updated",
        description: "Group forwarding status updated successfully."
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to Update",
        description: err.message,
        variant: "destructive"
      });
    }
  });
  const testForwardMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/forward/test", { method: "POST" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to test forward message.");
      }
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/forward/groups"] });
      if (data.errors && data.errors.length > 0) {
        toast({
          title: "Test Forward Partially Succeeded",
          description: `Forwarded to ${data.sentCount} of ${data.totalGroups} groups. Errors: ${data.errors.join(", ")}`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Test Forward Successful",
          description: `Successfully forwarded post to all ${data.sentCount} group(s).`
        });
      }
    },
    onError: (err) => {
      toast({
        title: "Test Forward Failed",
        description: err.message,
        variant: "destructive"
      });
    }
  });
  const handleSave = (e) => {
    e.preventDefault();
    if (!botToken.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid Telegram Bot Token.",
        variant: "destructive"
      });
      return;
    }
    if (!postLink.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a source post or channel link.",
        variant: "destructive"
      });
      return;
    }
    if (intervalVal < 1) {
      toast({
        title: "Validation Error",
        description: "Interval must be at least 1 minute.",
        variant: "destructive"
      });
      return;
    }
    updateConfigMutation.mutate({
      botToken,
      postLink,
      interval: intervalVal
    });
  };
  const toggleStatus = () => {
    if (!config?.botToken) {
      toast({
        title: "Not Configured",
        description: "Please configure and save the bot details first.",
        variant: "destructive"
      });
      return;
    }
    const newStatus = config.status === "running" ? "stopped" : "running";
    updateConfigMutation.mutate({ status: newStatus });
  };
  if (isConfigLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center min-h-[50vh] space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-12 h-12 animate-spin text-purple-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-sm animate-pulse", children: "Loading Auto Forward config..." })
    ] });
  }
  const isRunning = config?.status === "running";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 pb-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-6 h-6 text-purple-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-black text-white tracking-tight flex items-center gap-2", children: [
            "Auto Forward System",
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5 text-purple-400 animate-pulse" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-sm mt-1", children: "Automatically forward messages from a channel to groups using a dedicated bot" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            layout: true,
            className: `flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest border transition-all duration-500 backdrop-blur-md ${isRunning ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]" : "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: `w-4 h-4 ${isRunning ? "animate-spin" : "animate-pulse"}` }),
              isRunning ? "Live & Running" : "Stopped"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: toggleStatus,
            disabled: updateConfigMutation.isLoading,
            variant: isRunning ? "destructive" : "default",
            className: `rounded-2xl px-6 py-5 font-black text-sm transition-all duration-500 flex items-center gap-2 ${isRunning ? "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-900/20 hover:scale-105" : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-900/20 hover:scale-105"}`,
            children: updateConfigMutation.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : isRunning ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "w-4 h-4 fill-current" }),
              "Stop Forwarder"
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4 fill-current" }),
              "Start Forwarder"
            ] })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-12 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-5 space-y-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-panel border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent shadow-2xl rounded-[2rem] overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "p-8 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xl font-bold text-white flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-5 h-5 text-purple-400" }),
            "Forward Configurations"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Configure the forward bot credentials and delivery settings" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-8 pt-4 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSave, className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-black uppercase tracking-wider text-white/40 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "w-3.5 h-3.5 text-purple-400" }),
              "Forward Bot Token"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: showToken ? "text" : "password",
                  value: botToken,
                  onChange: (e) => setBotToken(e.target.value),
                  placeholder: "e.g. 123456:ABC-DEF1234ghIkl-zyx",
                  className: "bg-white/[0.02] border-white/10 rounded-2xl focus:border-purple-500/50 focus:ring-purple-500/20 text-white font-mono placeholder:text-white/20 py-6 pr-12"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowToken(!showToken),
                  className: "absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors",
                  children: showToken ? /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/30 italic", children: "* Enter a separate Bot Token dedicated for forwarding only." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-black uppercase tracking-wider text-white/40 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link2, { className: "w-3.5 h-3.5 text-purple-400" }),
              "Channel Post Link"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "text",
                value: postLink,
                onChange: (e) => setPostLink(e.target.value),
                placeholder: "e.g. https://t.me/c/123456789/123",
                className: "bg-white/[0.02] border-white/10 rounded-2xl focus:border-purple-500/50 focus:ring-purple-500/20 text-white font-mono placeholder:text-white/20 py-6"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/30 italic", children: "Both Public (t.me/username/123) and Private (t.me/c/12345/123) post links are supported." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-black uppercase tracking-wider text-white/40 flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-purple-400" }),
              "Forward Interval (Minutes)"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: 1,
                  value: intervalVal,
                  onChange: (e) => setIntervalVal(Math.max(1, parseInt(e.target.value, 10) || 1)),
                  className: "bg-white/[0.02] border-white/10 rounded-2xl focus:border-purple-500/50 focus:ring-purple-500/20 text-white font-mono py-6 w-32 text-center"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/50 text-sm font-semibold", children: "minutes" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/30 italic", children: "Example: Setting to 1 will forward the post once every minute continuously." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              disabled: updateConfigMutation.isLoading,
              className: "w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl py-6 font-black text-sm transition-all duration-300 flex items-center justify-center gap-2 hover:scale-[1.01]",
              children: [
                updateConfigMutation.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin text-purple-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-4 h-4 text-purple-400" }),
                "Save Configuration"
              ]
            }
          )
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-7 space-y-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-panel border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent shadow-2xl rounded-[2rem] overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "p-8 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xl font-bold text-white flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-purple-400" }),
              "Detected Groups"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "List and statistics of groups where the bot is added" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => testForwardMutation.mutate(),
                disabled: testForwardMutation.isLoading || !config?.botToken || groups.length === 0,
                variant: "outline",
                size: "sm",
                className: "rounded-xl border-white/10 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 border-amber-500/20 flex items-center gap-1.5 transition-all text-xs font-black py-4 px-3.5",
                children: [
                  testForwardMutation.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-3.5 h-3.5" }),
                  "Test Forward"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => syncGroupsMutation.mutate(),
                disabled: syncGroupsMutation.isLoading || !config?.botToken,
                variant: "outline",
                size: "sm",
                className: "rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white flex items-center gap-1.5 transition-all text-xs font-black py-4 px-3.5",
                children: [
                  syncGroupsMutation.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 text-purple-400" }),
                  "Sync Groups"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => {
                  if (confirm("Are you sure you want to reset all forward counters to zero?")) {
                    clearCountersMutation.mutate();
                  }
                },
                disabled: clearCountersMutation.isLoading || groups.length === 0,
                variant: "outline",
                size: "sm",
                className: "rounded-xl border-white/10 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border-rose-500/20 flex items-center gap-1.5 transition-all text-xs font-black py-4 px-3.5",
                children: [
                  clearCountersMutation.isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                  "Clear Counts"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-8 pt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: groups.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 10 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -10 },
            className: "flex flex-col items-center justify-center py-16 space-y-4 border border-dashed border-white/10 rounded-[2rem] bg-white/[0.01]",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-6 h-6 text-white/20" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-bold text-sm", children: "No groups detected yet" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/30 text-xs max-w-sm px-4", children: "Add the bot to your groups and click 'Sync Groups', or send a message to a group containing the bot." })
              ] })
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            className: "overflow-x-auto",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-white/5 text-left", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 text-xs font-black uppercase tracking-wider text-white/30", children: "Group Name" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 text-xs font-black uppercase tracking-wider text-white/30", children: "Group ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 text-xs font-black uppercase tracking-wider text-white/30 text-center", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 text-xs font-black uppercase tracking-wider text-white/30 text-center", children: "Forwards" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "pb-3 text-xs font-black uppercase tracking-wider text-white/30 text-right", children: "Last Sent" })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/5", children: groups.map((group, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.tr,
                {
                  initial: { opacity: 0, y: 5 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: idx * 0.05 },
                  className: "group/row hover:bg-white/[0.01] transition-colors",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 text-sm font-bold text-white pr-4", children: group.groupName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 text-xs font-mono text-white/30 pr-4", children: group.groupId }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 text-center pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        onClick: () => toggleGroupMutation.mutate(group.groupId),
                        disabled: toggleGroupMutation.isLoading,
                        variant: "outline",
                        size: "sm",
                        className: `rounded-xl text-[10px] font-black uppercase tracking-widest px-3.5 py-1.5 transition-all ${group.disabled ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"}`,
                        children: group.disabled ? "Restricted" : "Active"
                      }
                    ) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 text-center pr-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover/row:bg-purple-500/25 transition-all", children: group.sentCount }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "py-4 text-xs text-white/40 text-right font-mono", children: group.lastSentAt ? new Date(group.lastSentAt).toLocaleTimeString() : "-" })
                  ]
                },
                group.groupId
              )) })
            ] })
          }
        ) }) })
      ] }) })
    ] })
  ] });
}
export {
  ForwardPage as default
};
