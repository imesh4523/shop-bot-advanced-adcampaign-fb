import { c as createLucideIcon, d as useToast, r as reactExports, u as useQuery, f as useMutation, j as jsxRuntimeExports, U as Users, v as Mail, G as Globe, X, L as LoaderCircle, B as Button, x as Send, q as queryClient, i as apiRequest } from "./index-DgHeYH5Y.js";
import { C as Card, c as CardContent } from "./card-WifZe3mi.js";
import { I as Input } from "./input-Cxay2ZhT.js";
import { L as Label } from "./label-Cm50rPj9.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, f as DialogFooter } from "./dialog-DAy-gH1r.js";
import { S as Search } from "./search-CvsNR4xL.js";
import { P as Pen } from "./pen-BoIDXFFM.js";
import { W as Wallet } from "./wallet-0baIGZyj.js";
import { D as DollarSign } from "./dollar-sign-DfT7TTBO.js";
import { T as TrendingUp } from "./trending-up-B0hABnIN.js";
import { S as Save } from "./save-BMORAYIG.js";
const MessagesSquare = createLucideIcon("MessagesSquare", [
  ["path", { d: "M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z", key: "p1xzt8" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1", key: "1cx29u" }]
]);
const ShoppingBag = createLucideIcon("ShoppingBag", [
  ["path", { d: "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z", key: "hou9p0" }],
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M16 10a4 4 0 0 1-8 0", key: "1ltviw" }]
]);
function getUserType(telegramId) {
  if (telegramId.startsWith("email:"))
    return { label: "Email", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-3 h-3" }) };
  if (telegramId.startsWith("google:"))
    return { label: "Google", color: "bg-red-500/20 text-red-300 border-red-500/30", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3" }) };
  if (telegramId.startsWith("web_guest_"))
    return { label: "Guest", color: "bg-white/10 text-white/50 border-white/20", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-3 h-3" }) };
  return { label: "Telegram", color: "bg-purple-500/20 text-purple-300 border-purple-500/30", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessagesSquare, { className: "w-3 h-3" }) };
}
function getUserDisplayId(telegramId) {
  if (telegramId.startsWith("email:")) return telegramId.replace("email:", "");
  if (telegramId.startsWith("google:")) return telegramId.replace("google:", "");
  if (telegramId.startsWith("web_guest_")) return "Guest #" + telegramId.substring(10, 16).toUpperCase();
  return `@${telegramId}`;
}
function getInitials(user) {
  if (user.firstName) return user.firstName[0].toUpperCase();
  if (user.username) return user.username[0].toUpperCase();
  return "?";
}
function TelegramUsersPage() {
  const { toast } = useToast();
  const [editingUser, setEditingUser] = reactExports.useState(null);
  const [editBalances, setEditBalances] = reactExports.useState({ balance: 0, balanceLkr: 0, balanceUsdt: 0, balanceTrx: 0 });
  const [search, setSearch] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("all");
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/telegram-users"]
  });
  const mutation = useMutation({
    mutationFn: async ({ id, balances }) => {
      const res = await apiRequest("PATCH", `/api/telegram-users/${id}`, {
        balance: Math.round(balances.balance * 100),
        balanceLkr: Math.round(balances.balanceLkr * 100),
        balanceUsdt: Math.round(balances.balanceUsdt * 100),
        balanceTrx: Math.round(balances.balanceTrx * 1e5)
        // TRX stored in sun (1 TRX = 1,000,000 sun but let's keep cents-like precision)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/telegram-users"] });
      toast({ title: "✅ User Updated", description: "All balances have been updated successfully." });
      setEditingUser(null);
    },
    onError: () => {
      toast({ title: "❌ Update Failed", description: "Could not update user balances.", variant: "destructive" });
    }
  });
  const filteredUsers = reactExports.useMemo(() => {
    return users.filter((user) => {
      const searchLower = search.toLowerCase();
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim().toLowerCase();
      const username = (user.username || "").toLowerCase();
      const tid = user.telegramId.toLowerCase();
      const matchesSearch = !searchLower || fullName.includes(searchLower) || username.includes(searchLower) || tid.includes(searchLower);
      let matchesFilter = true;
      if (filter === "telegram") matchesFilter = !user.telegramId.startsWith("email:") && !user.telegramId.startsWith("google:") && !user.telegramId.startsWith("web_guest_");
      else if (filter === "email") matchesFilter = user.telegramId.startsWith("email:");
      else if (filter === "google") matchesFilter = user.telegramId.startsWith("google:");
      else if (filter === "guest") matchesFilter = user.telegramId.startsWith("web_guest_");
      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);
  const stats = reactExports.useMemo(() => ({
    total: users.length,
    telegram: users.filter((u) => !u.telegramId.startsWith("email:") && !u.telegramId.startsWith("google:") && !u.telegramId.startsWith("web_guest_")).length,
    email: users.filter((u) => u.telegramId.startsWith("email:")).length,
    google: users.filter((u) => u.telegramId.startsWith("google:")).length,
    guest: users.filter((u) => u.telegramId.startsWith("web_guest_")).length
  }), [users]);
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditBalances({
      balance: user.balance / 100,
      balanceLkr: (user.balanceLkr || 0) / 100,
      balanceUsdt: (user.balanceUsdt || 0) / 100,
      balanceTrx: (user.balanceTrx || 0) / 100
    });
  };
  const handleDM = (user) => {
    if (user.telegramId.startsWith("web_guest_") || user.telegramId.startsWith("email:") || user.telegramId.startsWith("google:")) {
      toast({ title: "Cannot DM", description: "Direct message is only available for Telegram users.", variant: "destructive" });
      return;
    }
    window.open(`https://t.me/${user.username || user.telegramId}`, "_blank");
  };
  const filterButtons = [
    { key: "all", label: "All", count: stats.total },
    { key: "telegram", label: "Telegram", count: stats.telegram },
    { key: "email", label: "Email", count: stats.email },
    { key: "google", label: "Google", count: stats.google },
    { key: "guest", label: "Guest", count: stats.guest }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl font-black tracking-tighter text-white drop-shadow-2xl", children: "Users" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 mt-1 font-medium", children: "Manage balances and view all registered users" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel px-6 py-2.5 rounded-full flex items-center gap-3 text-sm font-bold text-white shadow-lg border-white/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-purple-400" }),
        stats.total,
        " Total Users"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4", children: [
      { label: "Telegram", value: stats.telegram, color: "from-purple-600/30 to-purple-800/10", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(MessagesSquare, { className: "w-5 h-5 text-purple-400" }) },
      { label: "Email", value: stats.email, color: "from-blue-600/30 to-blue-800/10", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-5 h-5 text-blue-400" }) },
      { label: "Google", value: stats.google, color: "from-red-600/30 to-red-800/10", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-5 h-5 text-red-400" }) },
      { label: "Guest", value: stats.guest, color: "from-white/10 to-white/5", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-5 h-5 text-white/40" }) }
    ].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: `border-0 bg-gradient-to-br ${s.color} backdrop-blur-xl`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-4 pb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50 font-semibold uppercase tracking-wider", children: s.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-black text-white mt-1", children: s.value })
      ] }),
      s.icon
    ] }) }) }, s.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search by name, username or ID...",
            className: "glass-panel pl-12 h-12 rounded-2xl border-white/10 text-white placeholder:text-white/30",
            value: search,
            onChange: (e) => setSearch(e.target.value)
          }
        ),
        search && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setSearch(""), className: "absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: filterButtons.map((btn) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setFilter(btn.key),
          className: `px-4 py-2 rounded-xl text-sm font-semibold transition-all ${filter === btn.key ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30" : "glass-panel text-white/60 hover:text-white border-white/10"}`,
          children: [
            btn.label,
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-1 opacity-60", children: [
              "(",
              btn.count,
              ")"
            ] })
          ]
        },
        btn.key
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-10 h-10 animate-spin text-purple-400" }) }) : filteredUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card border-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-14 h-14 mx-auto mb-4 opacity-20 text-white" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 font-medium text-lg", children: search ? "No users match your search" : "No registered users yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/20 text-sm mt-1", children: "Users appear here when they interact with the shop or bot" })
    ] }) }) : filteredUsers.map((user) => {
      const type = getUserType(user.telegramId);
      const displayId = getUserDisplayId(user.telegramId);
      const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "Unknown User";
      const isTelegram = !user.telegramId.startsWith("email:") && !user.telegramId.startsWith("google:") && !user.telegramId.startsWith("web_guest_");
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card border-0 hover:border-white/10 transition-all duration-200 group", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "py-4 px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-lg", children: user.avatarUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: user.avatarUrl, className: "w-full h-full rounded-2xl object-cover", alt: "" }) : getInitials(user) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white text-base truncate", children: name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${type.color}`, children: [
              type.icon,
              " ",
              type.label
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/50 mt-0.5 truncate", children: displayId }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 mt-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-green-400 font-semibold", children: [
              "$",
              (user.balance / 100).toFixed(2),
              " USD"
            ] }),
            (user.balanceLkr || 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-yellow-400 font-semibold", children: [
              "Rs.",
              ((user.balanceLkr || 0) / 100).toFixed(2),
              " LKR"
            ] }),
            (user.balanceUsdt || 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-teal-400 font-semibold", children: [
              ((user.balanceUsdt || 0) / 100).toFixed(2),
              " USDT"
            ] }),
            (user.balanceTrx || 0) > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-orange-400 font-semibold", children: [
              ((user.balanceTrx || 0) / 100).toFixed(2),
              " TRX"
            ] }),
            user.balance === 0 && !user.balanceLkr && !user.balanceUsdt && !user.balanceTrx && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-white/20", children: "No balance" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 flex-shrink-0", children: [
          isTelegram && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => handleDM(user),
              variant: "ghost",
              size: "icon",
              className: "text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-all",
              title: "Send DM on Telegram",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => handleEdit(user),
              variant: "ghost",
              size: "icon",
              className: "text-purple-400 hover:text-purple-300 hover:bg-purple-500/10",
              title: "Edit Balances",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4" })
            }
          )
        ] })
      ] }) }) }, user.id);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editingUser !== null, onOpenChange: (open) => !open && setEditingUser(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass-card border-white/20 max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-white text-xl font-black flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-5 h-5 text-purple-400" }),
          "Edit Balances"
        ] }),
        editingUser && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/50 text-sm", children: [editingUser.firstName, editingUser.lastName].filter(Boolean).join(" ") || editingUser.username || getUserDisplayId(editingUser.telegramId) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-white/70 text-sm font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "w-4 h-4 text-green-400" }),
            " USD Balance"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold", children: "$" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: "0",
                step: "0.01",
                className: "glass-panel pl-8 h-12 rounded-xl border-white/10 text-white",
                value: editBalances.balance,
                onChange: (e) => setEditBalances((prev) => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-white/70 text-sm font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TrendingUp, { className: "w-4 h-4 text-yellow-400" }),
            " LKR Balance"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-xs", children: "Rs." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: "0",
                step: "0.01",
                className: "glass-panel pl-10 h-12 rounded-xl border-white/10 text-white",
                value: editBalances.balanceLkr,
                onChange: (e) => setEditBalances((prev) => ({ ...prev, balanceLkr: parseFloat(e.target.value) || 0 }))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-white/70 text-sm font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingBag, { className: "w-4 h-4 text-teal-400" }),
            " USDT Balance"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-xs", children: "₮" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: "0",
                step: "0.01",
                className: "glass-panel pl-8 h-12 rounded-xl border-white/10 text-white",
                value: editBalances.balanceUsdt,
                onChange: (e) => setEditBalances((prev) => ({ ...prev, balanceUsdt: parseFloat(e.target.value) || 0 }))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-white/70 text-sm font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-4 h-4 text-orange-400" }),
            " TRX Balance"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-xs", children: "TRX" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                min: "0",
                step: "0.01",
                className: "glass-panel pl-12 h-12 rounded-xl border-white/10 text-white",
                value: editBalances.balanceTrx,
                onChange: (e) => setEditBalances((prev) => ({ ...prev, balanceTrx: parseFloat(e.target.value) || 0 }))
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            onClick: () => setEditingUser(null),
            className: "text-white/60 hover:text-white",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => editingUser && mutation.mutate({ id: editingUser.id, balances: editBalances }),
            disabled: mutation.isPending,
            className: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-6 shadow-lg shadow-purple-500/20",
            children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
              " Saving..."
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-2" }),
              " Save Balances"
            ] })
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  TelegramUsersPage as default
};
