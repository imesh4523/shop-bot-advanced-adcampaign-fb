import { e as useToast, r as reactExports, u as useQuery, f as useMutation, j as jsxRuntimeExports, U as Users, L as LoaderCircle, B as Button, q as queryClient, i as apiRequest } from "./index-CayaK1o0.js";
import { C as Card, c as CardContent } from "./card-BXvILHCe.js";
import { I as Input } from "./input-C_wFzW9y.js";
import { L as Label } from "./label-DnqNvxNm.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-8H5ASrsx.js";
import { S as Search } from "./search-CNRtRCy4.js";
import { P as Pen } from "./pen-yIPaQRt0.js";
import { S as Save } from "./save-C85c3Qu-.js";
function TelegramUsersPage() {
  const { toast } = useToast();
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editBalance, setEditBalance] = reactExports.useState(0);
  const [search, setSearch] = reactExports.useState("");
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/telegram-users"]
  });
  const mutation = useMutation({
    mutationFn: async ({ id, balance }) => {
      const res = await apiRequest("PATCH", `/api/telegram-users/${id}`, {
        balance: Math.round(balance * 100)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/telegram-users"] });
      toast({
        title: "User Updated",
        description: "Telegram user balance has been updated."
      });
      setEditingId(null);
    }
  });
  const filteredUsers = users.filter((user) => {
    const searchLower = search.toLowerCase();
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
    const username = user.username?.toLowerCase() || "";
    const telegramId = user.telegramId.toLowerCase();
    return fullName.includes(searchLower) || username.includes(searchLower) || telegramId.includes(searchLower);
  });
  const handleEdit = (user) => {
    setEditingId(user.id);
    setEditBalance(user.balance / 100);
  };
  const handleSave = () => {
    if (editingId !== null) {
      mutation.mutate({ id: editingId, balance: editBalance });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10 animate-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl font-black tracking-tighter text-white drop-shadow-2xl", children: "Web & Shop Users" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel px-6 py-2.5 rounded-full flex items-center gap-3 text-sm font-bold text-white shadow-lg border-white/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-5 h-5 text-purple-400" }),
        users.length,
        " Users"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search users by email or ID...",
          className: "glass-panel pl-12 h-14 rounded-2xl border-white/10 text-white placeholder:text-white/20",
          value: search,
          onChange: (e) => setSearch(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-purple-400" }) }) : filteredUsers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card border-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-white/50", children: search ? "No users found matching your search" : "No registered users yet" }) }) }) : filteredUsers.map((user) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card border-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-bold text-white", children: [
          user.firstName || "",
          " ",
          user.lastName || ""
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/60", children: user.telegramId.startsWith("email:") ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Email: ",
          user.telegramId.replace("email:", "")
        ] }) : user.telegramId.startsWith("web_guest_") ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Guest ID: ",
          user.telegramId.substring(10, 18)
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Telegram ID: ",
          user.telegramId,
          " ",
          user.username && `(@${user.username})`
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/40", children: [
          "Balance: $",
          (user.balance / 100).toFixed(2)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: () => handleEdit(user),
          variant: "ghost",
          size: "icon",
          className: "text-purple-400",
          "data-testid": `button-edit-user-${user.id}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-5 h-5" })
        }
      )
    ] }) }) }, user.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: editingId !== null, onOpenChange: (open) => !open && setEditingId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass-card border-white/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-white", children: [
        "Edit Balance for ",
        editingId !== null && (() => {
          const u = users.find((x) => x.id === editingId);
          if (!u) return "";
          return u.telegramId.startsWith("email:") ? u.telegramId.replace("email:", "") : u.telegramId;
        })()
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70", children: "Balance ($)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              step: "0.01",
              value: editBalance,
              onChange: (e) => setEditBalance(parseFloat(e.target.value) || 0),
              className: "glass-panel border-white/10 bg-white/5 text-white",
              "data-testid": "input-user-balance"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 justify-end", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              onClick: () => setEditingId(null),
              className: "border-white/20 text-white",
              "data-testid": "button-cancel",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: handleSave,
              disabled: mutation.isPending,
              className: "bg-gradient-to-r from-purple-500 to-blue-600",
              "data-testid": "button-save-balance",
              children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" })
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}
export {
  TelegramUsersPage as default
};
