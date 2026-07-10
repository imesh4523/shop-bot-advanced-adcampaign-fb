import { r as reactExports, u as useQuery, j as jsxRuntimeExports } from "./index-Vcy-ZHL0.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CDs4x6kP.js";
import { B as Badge } from "./badge-C8Hhn-HI.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-ClWiGK35.js";
import { I as Input } from "./input-Bkq0cUX8.js";
import { W as Wallet } from "./wallet-BpLehGkC.js";
import { S as Search } from "./search-CXqxb0vd.js";
import { C as Clock } from "./clock-D0gju99V.js";
import { C as CircleX } from "./circle-x-C0d560ej.js";
import { C as CircleCheck } from "./circle-check-CuokrKco.js";
import { f as format } from "./format-Fqx7OmaC.js";
function PaymentsPage() {
  const [search, setSearch] = reactExports.useState("");
  const { data: payments, isLoading } = useQuery({
    queryKey: ["/api/payments"]
  });
  const filteredPayments = payments?.filter((payment) => {
    const searchLower = search.toLowerCase();
    const username = payment.telegramUser?.username?.toLowerCase() || "";
    const telegramId = payment.telegramUser?.telegramId || "";
    const method = payment.paymentMethod?.toLowerCase() || "";
    return username.includes(searchLower) || telegramId.includes(searchLower) || method.includes(searchLower);
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8", children: "Loading payments..." });
  }
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-green-500/20 text-green-400 border-green-500/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-3 h-3 mr-1" }),
          " Completed"
        ] });
      case "failed":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500/20 text-red-400 border-red-500/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3 h-3 mr-1" }),
          " Failed"
        ] });
      case "expired":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-gray-500/20 text-gray-400 border-gray-500/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 mr-1" }),
          " Expired"
        ] });
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/20", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3 h-3 mr-1" }),
          " Pending"
        ] });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-4xl font-black text-white tracking-tighter", children: "Payments" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 mt-1 font-medium", children: "Manage and track user deposits" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel px-6 py-3 rounded-2xl flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { className: "w-5 h-5 text-purple-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-bold", children: "Payment Gateway" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Search by username, ID or method...",
          className: "glass-panel pl-12 h-14 rounded-2xl border-white/10 text-white placeholder:text-white/20",
          value: search,
          onChange: (e) => setSearch(e.target.value)
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xl font-bold text-white", children: "Transaction History" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-white/5 hover:bg-transparent", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold", children: "User" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold", children: "Amount" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold", children: "Method" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold", children: "Date" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: filteredPayments?.map((payment) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-white/5 hover:bg-white/5 transition-colors", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white font-bold", children: [
              "@",
              payment.telegramUser?.username || "Unknown"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-white/30 text-xs", children: [
              "ID: ",
              payment.telegramUser?.telegramId
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "text-white font-bold", children: [
            "$",
            (payment.amount / 100).toFixed(2)
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-white/10 text-white/60", children: payment.paymentMethod }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: getStatusBadge(payment.status) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-white/40 text-sm", children: format(new Date(payment.createdAt), "MMM d, HH:mm") })
        ] }, payment.id)) })
      ] }) })
    ] })
  ] });
}
export {
  PaymentsPage as default
};
