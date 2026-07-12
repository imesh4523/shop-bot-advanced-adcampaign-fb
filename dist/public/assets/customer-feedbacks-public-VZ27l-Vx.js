import { c as createLucideIcon, u as useQuery, r as reactExports, j as jsxRuntimeExports, as as Link, h as MessageSquare } from "./index-ARQpEXVI.js";
import { D as Dialog, b as DialogContent } from "./dialog-D2vl3yjH.js";
import { C as Card, c as CardContent } from "./card-BYn2Oapx.js";
import { S as Skeleton } from "./skeleton-B0W1KNGN.js";
import { E as Eye } from "./eye-DMo-L00w.js";
import { Z as ZoomIn } from "./zoom-in-DZDN30JT.js";
const ArrowLeft = createLucideIcon("ArrowLeft", [
  ["path", { d: "m12 19-7-7 7-7", key: "1l729n" }],
  ["path", { d: "M19 12H5", key: "x3x0zl" }]
]);
function CustomerFeedbacksPublic() {
  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ["/api/feedbacks"]
  });
  const [selectedImage, setSelectedImage] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#06040a] text-white relative overflow-hidden pb-16", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-40 w-full border-b border-white/5 bg-[#06040a]/80 backdrop-blur-md", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-6xl mx-auto px-4 h-20 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { href: "/", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { className: "inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Back to Shop" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-5 h-5 text-purple-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-black tracking-wider text-sm uppercase text-purple-400", children: "Customer Proofs" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "max-w-4xl mx-auto text-center px-4 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl md:text-6xl font-black tracking-tight leading-none bg-gradient-to-r from-white via-white to-purple-400 bg-clip-text text-transparent mb-6", children: [
        "Customer Feedbacks ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
        " & Success Proofs"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-lg max-w-xl mx-auto font-medium", children: "See live screenshots and proof records uploaded directly showing successful customer transactions and deliveries." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "max-w-6xl mx-auto px-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "bg-white/[0.02] border-white/5 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "w-full h-80 rounded-none bg-white/5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-3/4 bg-white/5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-1/2 bg-white/5" })
      ] })
    ] }) }, i)) }) : feedbacks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 bg-white/[0.01] border border-white/5 rounded-3xl p-8 max-w-lg mx-auto backdrop-blur-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-12 h-12 text-white/20 mx-auto mb-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-2", children: "No Feedbacks Yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-sm", children: "We haven't uploaded any transaction proofs or customer feedback screenshots yet. Check back later!" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6", children: feedbacks.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      Card,
      {
        className: "group relative bg-[#0f0a1a] border border-white/5 overflow-hidden hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/5 transition-all duration-500 rounded-3xl",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-0 flex flex-col h-full", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => setSelectedImage(item.imageUrl),
              className: "relative w-full aspect-[4/5] overflow-hidden cursor-zoom-in",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: item.imageUrl,
                    alt: item.title || "Customer Proof",
                    className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
                    loading: "lazy"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 transform scale-90 group-hover:scale-100 transition-transform duration-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ZoomIn, { className: "w-6 h-6 text-white" }) }) })
              ]
            }
          ),
          item.title && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 border-t border-white/5 mt-auto", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-white text-base leading-snug truncate", children: item.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1", children: new Date(item.createdAt).toLocaleDateString(void 0, {
              year: "numeric",
              month: "short",
              day: "numeric"
            }) })
          ] })
        ] })
      },
      item.id
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!selectedImage, onOpenChange: (open) => !open && setSelectedImage(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-w-4xl p-0 bg-black/90 border-white/10 overflow-hidden flex items-center justify-center rounded-3xl", children: selectedImage && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: selectedImage,
        alt: "Full Resolution Proof",
        className: "max-h-[85vh] w-auto object-contain mx-auto"
      }
    ) }) })
  ] });
}
export {
  CustomerFeedbacksPublic as default
};
