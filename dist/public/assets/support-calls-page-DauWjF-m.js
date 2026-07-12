import { d as useToast, r as reactExports, u as useQuery, ae as lookup, j as jsxRuntimeExports, N as motion, ak as Volume2, B as Button, af as Phone, L as LoaderCircle, U as Users, w as ShieldCheck } from "./index-AVTcAVZ5.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-BCjYNdxs.js";
import { I as Input } from "./input-DiCWhiOJ.js";
import { S as Search } from "./search-BP46ga0N.js";
function SupportCallsPage() {
  const { toast } = useToast();
  const [search, setSearch] = reactExports.useState("");
  const [dialId, setDialId] = reactExports.useState("");
  const [dialName, setDialName] = reactExports.useState("");
  const [onlineUsers, setOnlineUsers] = reactExports.useState(/* @__PURE__ */ new Map());
  const [pushPermission, setPushPermission] = reactExports.useState(
    typeof window !== "undefined" && window.Notification ? window.Notification.permission : "default"
  );
  const [diagnostics, setDiagnostics] = reactExports.useState(null);
  const fetchDiagnostics = async () => {
    if (typeof window === "undefined") return;
    const info = {
      supported: "serviceWorker" in navigator && "PushManager" in window,
      permission: window.Notification ? window.Notification.permission : "not supported",
      swRegistered: "checking...",
      subscriptionActive: "checking...",
      endpoint: "",
      error: ""
    };
    if (!info.supported) {
      info.swRegistered = "no support";
      info.subscriptionActive = "no support";
      setDiagnostics(info);
      return;
    }
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      info.swRegistered = regs.length > 0 ? `active (${regs.length} worker(s))` : "not registered";
      const readyReg = await navigator.serviceWorker.ready.catch(() => null);
      if (readyReg) {
        const sub = await readyReg.pushManager.getSubscription();
        if (sub) {
          info.subscriptionActive = "active";
          info.endpoint = sub.endpoint;
        } else {
          info.subscriptionActive = "inactive (no subscription)";
        }
      } else {
        info.subscriptionActive = "inactive (sw not ready)";
      }
    } catch (err) {
      info.error = err.message || String(err);
    }
    setDiagnostics(info);
  };
  const requestPushPermission = () => {
    if (typeof window === "undefined" || !window.Notification) return;
    window.Notification.requestPermission().then((permission) => {
      setPushPermission(permission);
      if (permission === "granted") {
        window.dispatchEvent(new CustomEvent("trigger-push-setup"));
        toast({
          title: "Permission Granted",
          description: "Attempting to register push notifications subscription..."
        });
        setTimeout(fetchDiagnostics, 2500);
      }
      fetchDiagnostics();
    }).catch((err) => {
      console.error(err);
      fetchDiagnostics();
    });
  };
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/telegram-users"]
  });
  reactExports.useEffect(() => {
    fetchDiagnostics();
    const socket = lookup();
    socket.emit("join-admin-calls");
    socket.emit("get-online-users");
    socket.on("online-users-list", (list) => {
      const newMap = /* @__PURE__ */ new Map();
      list.forEach((u) => newMap.set(u.telegramId, u.socketId));
      setOnlineUsers(newMap);
    });
    socket.on("user-online-status", (data) => {
      setOnlineUsers((prev) => {
        const next = new Map(prev);
        if (data.online && data.socketId) {
          next.set(data.telegramId, data.socketId);
        } else {
          next.delete(data.telegramId);
        }
        return next;
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  const initiateCall = (telegramId, name) => {
    if (!onlineUsers.has(telegramId)) {
      toast({
        title: "User Offline",
        description: `${name} is not online in the shop app right now.`,
        variant: "destructive"
      });
      return;
    }
    window.dispatchEvent(
      new CustomEvent("start-admin-call", {
        detail: { telegramId, name }
      })
    );
  };
  const handleManualDial = (e) => {
    e.preventDefault();
    if (!dialId.trim()) return;
    initiateCall(dialId.trim(), dialName.trim() || "Customer");
  };
  const filteredUsers = users.filter((user) => {
    const searchLower = search.toLowerCase();
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim().toLowerCase();
    const username = (user.username || "").toLowerCase();
    const tid = user.telegramId.toLowerCase();
    return !searchLower || fullName.includes(searchLower) || username.includes(searchLower) || tid.includes(searchLower);
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 p-6 max-w-6xl mx-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-black text-white tracking-tight uppercase", children: "Call Support Desk" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-sm tracking-wide lowercase", children: "Directly initiate zero-latency voice calls with online customers." })
    ] }),
    pushPermission !== "granted" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "w-5 h-5 text-amber-400 shrink-0 animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: "Push Notifications Disabled" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50", children: "You will not receive background alerts when customers start support voice calls." })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: requestPushPermission,
              className: "bg-amber-600 hover:bg-amber-500 text-black font-extrabold uppercase text-xs tracking-wider px-6 py-2 rounded-xl shrink-0",
              children: "Enable Notifications"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0f0a18]/45 border border-purple-500/10 shadow-2xl backdrop-blur-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "border-b border-white/5 pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-black text-white uppercase tracking-wider", children: "Manual Call Board" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-white/40", children: "Enter user credentials to dial directly" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleManualDial, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black uppercase text-white/50 tracking-wider", children: "Telegram ID / UUID" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                required: true,
                value: dialId,
                onChange: (e) => setDialId(e.target.value),
                placeholder: "e.g. 17262726 or google:1022...",
                className: "bg-black/45 border-white/5 text-white placeholder-white/20 rounded-xl"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[10px] font-black uppercase text-white/50 tracking-wider", children: "Customer Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: dialName,
                onChange: (e) => setDialName(e.target.value),
                placeholder: "e.g. Ruwan Perera",
                className: "bg-black/45 border-white/5 text-white placeholder-white/20 rounded-xl"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "submit",
              className: "w-full py-6 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4 animate-pulse" }),
                "Dial Call"
              ]
            }
          )
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0f0a18]/45 border border-purple-500/10 shadow-2xl backdrop-blur-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "border-b border-white/5 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base font-black text-white uppercase tracking-wider", children: "Users Directory" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-white/40", children: "Select an online user to connect a WebRTC call" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full md:w-64", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: search,
                onChange: (e) => setSearch(e.target.value),
                placeholder: "Search user...",
                className: "pl-10 bg-black/45 border-white/5 text-white placeholder-white/20 rounded-xl w-full"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6 p-0 max-h-[600px] overflow-y-auto", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-20 flex flex-col items-center justify-center text-white/30 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider", children: "Loading Directory..." })
        ] }) : filteredUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "py-20 flex flex-col items-center justify-center text-white/30 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-8 h-8" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-wider", children: "No users found" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-white/5", children: filteredUsers.map((user) => {
          const isOnline = onlineUsers.has(user.telegramId);
          const displayName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Guest";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-all", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-gradient-to-tr from-purple-800 to-indigo-700 border border-white/10 flex items-center justify-center font-bold text-white uppercase text-sm", children: displayName[0] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0f0a18] ${isOnline ? "bg-green-500 animate-pulse" : "bg-neutral-600"}` })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-sm text-white", children: displayName }),
                  user.username && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-white/30 font-mono", children: [
                    "@",
                    user.username
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-white/40 uppercase tracking-widest font-bold", children: [
                  "ID: ",
                  user.telegramId
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                disabled: !isOnline,
                onClick: () => initiateCall(user.telegramId, displayName),
                className: `px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${isOnline ? "bg-green-600/10 border-green-500/20 text-green-400 hover:bg-green-600 hover:text-white" : "bg-white/5 border-white/5 text-white/20 cursor-not-allowed"}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-3.5 h-3.5" }),
                  isOnline ? "Call" : "Offline"
                ]
              }
            )
          ] }, user.id);
        }) }) })
      ] }) })
    ] }),
    diagnostics && /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0f0a18]/45 border border-purple-500/10 shadow-2xl backdrop-blur-md mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-base font-black text-white uppercase tracking-wider flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-5 h-5 text-purple-400" }),
          "Push Notifications Diagnostics"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-xs text-white/40", children: "Debug status of the background notification service for this browser/PWA." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between p-3 rounded-xl bg-black/30 border border-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/50 font-bold uppercase tracking-wider", children: "Browser Supported:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: diagnostics.supported ? "text-green-400 font-bold" : "text-red-400 font-bold", children: diagnostics.supported ? "Yes" : "No" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between p-3 rounded-xl bg-black/30 border border-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/50 font-bold uppercase tracking-wider", children: "Permission:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold uppercase ${diagnostics.permission === "granted" ? "text-green-400" : diagnostics.permission === "denied" ? "text-red-400" : "text-amber-400"}`, children: diagnostics.permission })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between p-3 rounded-xl bg-black/30 border border-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/50 font-bold uppercase tracking-wider", children: "Service Worker:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-mono", children: diagnostics.swRegistered })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between p-3 rounded-xl bg-black/30 border border-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/50 font-bold uppercase tracking-wider", children: "APNs Subscription:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `font-bold ${diagnostics.subscriptionActive === "active" ? "text-green-400" : "text-amber-400"}`, children: diagnostics.subscriptionActive })
          ] })
        ] }),
        diagnostics.endpoint && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl bg-black/30 border border-white/5 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black uppercase text-white/50 tracking-wider", children: "Apple Push Endpoint URL:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono text-purple-300 break-all select-all", children: diagnostics.endpoint })
        ] }),
        diagnostics.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 rounded-xl bg-red-950/30 border border-red-500/20 text-red-400 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] font-black uppercase tracking-wider", children: "Error Encountered:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-mono break-all", children: diagnostics.error })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: fetchDiagnostics,
            className: "bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold text-xs uppercase tracking-wide px-4 py-2 rounded-xl border border-purple-500/10",
            children: "Refresh Status"
          }
        ) })
      ] })
    ] })
  ] });
}
export {
  SupportCallsPage as default
};
