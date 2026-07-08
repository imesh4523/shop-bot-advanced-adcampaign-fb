import { r as reactExports, e as useToast, j as jsxRuntimeExports, S as ShoppingCart, p as User, B as Button, P as Package, C as Check } from "./index-Df-YFcp-.js";
import { u as useOrders } from "./use-orders-BlR3pqhj.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-DAOzN0W7.js";
import { I as Input } from "./input-DKOdDshq.js";
import { S as Skeleton } from "./skeleton-C2kofAKx.js";
import { B as Badge } from "./badge-ql7SWAUs.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog-Dk3jQxRM.js";
import { S as Search } from "./search-ZD1hWr3t.js";
import { C as Calendar } from "./calendar-6SCv3dqo.js";
import { E as Eye } from "./eye-CbWzUZTq.js";
import { C as Copy } from "./copy-Bgkv97L9.js";
import { f as format } from "./format-Fqx7OmaC.js";
import "./routes-l6ExvCuu.js";
import "./index-DwfS90rP.js";
import "./schema-Dryr8iey.js";
function OrdersPage() {
  const { data: orders, isLoading } = useOrders();
  const [search, setSearch] = reactExports.useState("");
  const { toast } = useToast();
  const [copiedId, setCopiedId] = reactExports.useState(null);
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      title: "Copied!",
      description: "Credentials copied to clipboard."
    });
    setTimeout(() => setCopiedId(null), 2e3);
  };
  const filteredOrders = orders?.filter(
    (order) => order.product?.name.toLowerCase().includes(search.toLowerCase()) || order.telegramUser?.username?.toLowerCase().includes(search.toLowerCase()) || order.telegramUser?.telegramId.includes(search)
  ) || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight text-white", children: "Orders" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 mt-1 font-medium", children: "History of all transactions." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full sm:w-64", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-white/30" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "search",
            placeholder: "Search orders...",
            className: "pl-9 glass-panel border-white/10 text-white placeholder:text-white/20",
            value: search,
            onChange: (e) => setSearch(e.target.value)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card border-0 rounded-3xl overflow-hidden shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-white/5 hover:bg-transparent", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px]", children: "Order ID" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px]", children: "Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px]", children: "Buyer" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px]", children: "Date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px]", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px]", children: "Amount" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px] text-right pr-8", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-white/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-12 bg-white/5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-32 bg-white/5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-24 bg-white/5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 bg-white/5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 bg-white/5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-16 bg-white/5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pr-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 ml-auto rounded-xl bg-white/5" }) })
      ] }, i)) : filteredOrders.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 7, className: "h-32 text-center text-white/20 font-medium", children: "No orders found." }) }) : filteredOrders.map((order) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-white/5 hover:bg-white/5 transition-all duration-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-mono text-[10px] text-white/30 tracking-tighter", children: [
          "#",
          order.id
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-purple-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShoppingCart, { className: "w-4 h-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-bold text-white tracking-tight", children: order.product?.name || "Deleted Product" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-white/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-4 h-4" }) }),
          order.telegramUser ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold text-white tracking-tight truncate", children: [
              "@",
              order.telegramUser.username || "No Username"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-white/20 font-black", children: [
              "ID: ",
              order.telegramUser.telegramId
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/20 italic text-xs", children: "Unknown User" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-white/40 text-[11px] font-bold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3 h-3 text-white/20" }),
          order.createdAt ? format(new Date(order.createdAt), "MMM d, HH:mm") : "-"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-500/10 text-green-400 border-green-500/20 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg", children: "Completed" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-black text-sm text-white", children: [
          "$",
          ((order.product?.price || 0) / 100).toFixed(2)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right pr-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "h-10 w-10 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "h-5 w-5" }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass-panel border-white/10 bg-background/95 backdrop-blur-3xl sm:max-w-md rounded-[2rem] p-8 shadow-4xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "flex items-center gap-3 text-2xl font-black text-white tracking-tighter", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-5 h-5" }) }),
              "Credentials"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 rounded-3xl glass-panel border-white/5 bg-white/[0.02] relative group min-h-[120px] flex items-center justify-center overflow-hidden", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "text-sm text-white/80 font-mono whitespace-pre-wrap break-all relative z-10 leading-relaxed text-center", children: order.credential?.content || "No content available" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    size: "icon",
                    variant: "ghost",
                    className: "absolute top-4 right-4 h-10 w-10 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100",
                    onClick: () => copyToClipboard(order.credential?.content || "", order.id),
                    children: copiedId === order.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-5 w-5 text-green-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-5 w-5 text-white/40" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-2 pt-2 border-t border-white/5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/20 font-black uppercase tracking-widest", children: "Product" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-white/60 font-bold", children: order.product?.name })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 text-right", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/20 font-black uppercase tracking-widest", children: "Buyer" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-white/60 font-bold", children: [
                    "@",
                    order.telegramUser?.username || "Unknown"
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] }) })
      ] }, order.id)) })
    ] }) })
  ] });
}
export {
  OrdersPage as default
};
