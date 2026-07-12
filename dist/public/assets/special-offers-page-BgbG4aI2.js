import { u as useQuery, r as reactExports, d as useToast, f as useMutation, j as jsxRuntimeExports, B as Button, L as LoaderCircle, T as Tag, M as Megaphone, D as DropdownMenu, k as DropdownMenuTrigger, l as DropdownMenuContent, n as DropdownMenuItem, q as queryClient, i as apiRequest } from "./index-DDU_XZV-.js";
import { c as insertSpecialOfferSchema } from "./schema-DTjBPKAW.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-aO1A-hyP.js";
import { I as Input } from "./input-DGXMpx71.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter, a as DialogTrigger } from "./dialog-CE9M4yxZ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DXlBiZdF.js";
import { T as Textarea } from "./textarea-DXTZs5DY.js";
import { B as Badge } from "./badge-CGlCXptQ.js";
import { u as useForm, t, F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormMessage } from "./form-CSeCo9bg.js";
import { z } from "./index-DwfS90rP.js";
import { u as useProducts } from "./use-products-efaKxUz2.js";
import { E as Ellipsis, T as Trash } from "./trash-CwXvJt3L.js";
import { P as Plus } from "./plus-BGyldTKp.js";
import "./index-IXOTxK3N.js";
import "./index-BJ6qsqCF.js";
import "./label-Da918oeO.js";
import "./routes-CuIIW9wP.js";
const formatProductPrice = (priceInCents, currency) => {
  const amount = priceInCents / 100;
  if (currency === "LKR") return `${amount.toFixed(0)} LKR`;
  if (currency === "INR") return `₹${amount.toFixed(2)}`;
  if (currency === "EUR") return `€${amount.toFixed(2)}`;
  return `$${amount.toFixed(2)}`;
};
const specialOfferFormSchema = insertSpecialOfferSchema.extend({
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  bundleQuantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  durationHours: z.string().optional().nullable()
});
function SpecialOffersPage() {
  const { data: offers, isLoading } = useQuery({
    queryKey: ["/api/special-offers"]
  });
  const [isCreateOpen, setIsCreateOpen] = reactExports.useState(false);
  const [editingOffer, setEditingOffer] = reactExports.useState(null);
  const [deletingOffer, setDeletingOffer] = reactExports.useState(null);
  const { toast } = useToast();
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await apiRequest("DELETE", `/api/special-offers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/special-offers"] });
      toast({ title: "Special offer deleted successfully" });
      setDeletingOffer(null);
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  const broadcastMutation = useMutation({
    mutationFn: async (id) => {
      const res = await apiRequest("POST", `/api/special-offers/${id}/broadcast`);
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Broadcast Successful",
        description: `Offer sent to ${data.count} users/channels.`
      });
    },
    onError: (error) => {
      toast({
        title: "Broadcast Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black text-white tracking-tighter drop-shadow-2xl", children: "Special Offers" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-sm font-medium", children: "Manage bundle deals and discounts." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CreateOfferDialog, { open: isCreateOpen, onOpenChange: setIsCreateOpen })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditOfferDialog,
      {
        offer: editingOffer,
        onOpenChange: (open) => !open && setEditingOffer(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: deletingOffer !== null, onOpenChange: (open) => !open && setDeletingOffer(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass-panel border-white/10 bg-[#0f0a1e]/90 backdrop-blur-3xl sm:max-w-[400px] rounded-3xl p-8 shadow-4xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-black text-white tracking-tighter", children: "Confirm Deletion" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-white/40 font-medium text-sm", children: "Are you sure you want to delete this special offer? This action cannot be undone." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "mt-6 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setDeletingOffer(null), className: "h-10 px-6 rounded-xl text-white/40 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[9px]", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            disabled: deleteMutation.isPending,
            onClick: () => deletingOffer && deleteMutation.mutate(deletingOffer),
            className: "h-10 px-6 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black uppercase tracking-widest text-[9px] shadow-xl",
            children: deleteMutation.isPending ? "Deleting..." : "Delete Now"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card border-0 rounded-2xl overflow-hidden shadow-2xl bg-white/[0.01] backdrop-blur-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-white/5 hover:bg-transparent", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px] pl-6 py-4", children: "Offer Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px] py-4", children: "Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px] py-4", children: "Bundle Qty" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px] py-4", children: "Bundle Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px] py-4", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px] text-right pr-6 py-4", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { className: "border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "animate-spin text-white/20 mx-auto" }) }) }, i)) : offers?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "h-48 text-center text-white/20 font-black text-sm uppercase tracking-tighter", children: "No special offers found." }) }) : offers?.map((offer) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-white/5 hover:bg-white/[0.03] transition-all duration-300 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pl-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center text-yellow-400 group-hover:scale-105 transition-transform duration-300 shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black text-white tracking-tight leading-tight", children: offer.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/30 font-medium truncate max-w-[200px] leading-tight", children: offer.description })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-white/60 text-xs font-bold", children: offer.product?.name || "Unknown Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "font-black text-white text-sm tracking-tighter", children: [
          offer.bundleQuantity,
          " pcs"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-black text-white text-base tracking-tighter", children: formatProductPrice(offer.price, offer.product?.currency || "USD") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `border-0 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest w-fit ${offer.status === "active" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`, children: offer.status }),
          offer.expiresAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-white/30 font-bold whitespace-nowrap", children: [
            "Exp: ",
            new Date(offer.expiresAt).toLocaleString()
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right pr-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: `h-9 px-3 rounded-xl transition-all flex items-center gap-2 ${broadcastMutation.isPending && broadcastMutation.variables === offer.id ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "text-yellow-400/50 hover:text-yellow-400 hover:bg-yellow-400/10"}`,
              onClick: () => broadcastMutation.mutate(offer.id),
              disabled: broadcastMutation.isPending,
              title: "Broadcast to Telegram",
              children: broadcastMutation.isPending && broadcastMutation.variables === offer.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase tracking-widest animate-pulse", children: "Sending..." })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-4 w-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-black uppercase tracking-widest", children: "Broadcast" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", className: "h-9 w-9 p-0 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "h-4 w-4" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "glass-panel border-white/10 bg-[#0f0a1e]/90 backdrop-blur-3xl rounded-xl p-1.5 shadow-4xl min-w-[160px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                DropdownMenuItem,
                {
                  className: "rounded-lg px-2.5 py-2 text-xs font-bold text-white hover:bg-white/5 cursor-pointer flex items-center gap-2",
                  onSelect: () => setEditingOffer(offer),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-3.5 h-3.5" }),
                    "Edit Offer"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                DropdownMenuItem,
                {
                  className: "rounded-lg px-2.5 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer flex items-center gap-2",
                  onSelect: () => setDeletingOffer(offer.id),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "w-3.5 h-3.5" }),
                    "Delete Offer"
                  ]
                }
              )
            ] })
          ] })
        ] }) })
      ] }, offer.id)) })
    ] }) })
  ] });
}
function CreateOfferDialog({ open, onOpenChange }) {
  const { data: products } = useProducts();
  const { toast } = useToast();
  const form = useForm({
    resolver: t(specialOfferFormSchema),
    defaultValues: {
      name: "",
      productId: 0,
      description: "",
      bundleQuantity: 1,
      price: 0,
      status: "active",
      durationHours: ""
    }
  });
  const createMutation = useMutation({
    mutationFn: async (values) => {
      const finalValues = {
        ...values,
        price: Math.round(values.price * 100),
        expiresAt: values.durationHours ? new Date(Date.now() + parseFloat(values.durationHours) * 60 * 60 * 1e3).toISOString() : null
      };
      const { durationHours, ...apiData } = finalValues;
      await apiRequest("POST", "/api/special-offers", apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/special-offers"] });
      toast({ title: "Special offer created successfully" });
      onOpenChange(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to create offer",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "h-11 px-6 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-black text-xs uppercase tracking-widest shadow-lg transition-all duration-300 hover:scale-105 active:scale-95", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
      " Add Offer"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass-panel border-white/5 bg-[#0b0718]/95 backdrop-blur-3xl sm:max-w-[380px] rounded-2xl p-4 shadow-4xl animate-in fade-in zoom-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "mb-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-lg font-black text-white tracking-tighter flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-white shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }) }),
        "New Offer"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit((data) => createMutation.mutate(data)), className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "name",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[8px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Offer Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Offer Name", className: "glass-panel h-8 rounded-lg border-white/5 bg-white/[0.02] text-xs text-white", ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "productId",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[8px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Product" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: (v) => field.onChange(parseInt(v)), defaultValue: field.value.toString(), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "glass-panel h-8 rounded-lg border-white/5 bg-white/[0.02] text-xs text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Product" }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "glass-panel border-white/10 bg-[#0f0a1e] text-white rounded-xl", children: products?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id.toString(), children: p.name }, p.id)) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "status",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[8px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Status" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "glass-panel h-8 rounded-lg border-white/5 bg-white/[0.02] text-xs text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "glass-panel border-white/10 bg-[#0f0a1e] text-white rounded-xl", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inactive", children: "Inactive" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "bundleQuantity",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[8px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Bundle Quantity" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", placeholder: "Qty", className: "glass-panel h-8 rounded-lg border-white/5 bg-white/[0.02] text-xs text-white", ...field }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "price",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[8px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Bundle Price ($)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", placeholder: "8.00", className: "glass-panel h-8 rounded-lg border-white/5 bg-white/[0.02] text-xs text-white", ...field }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "durationHours",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[8px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Duration (Hours - Optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  step: "0.5",
                  placeholder: "Hours...",
                  className: "glass-panel h-8 rounded-lg border-white/5 bg-white/[0.02] text-xs text-white focus:border-purple-500/50",
                  value: field.value || "",
                  onChange: field.onChange
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "description",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[8px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Description (Optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { placeholder: "Details...", className: "glass-panel rounded-lg border-white/5 bg-white/[0.02] text-xs text-white min-h-[50px] resize-none", ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2 border-t border-white/5 gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", onClick: () => onOpenChange(false), className: "h-8 px-3 rounded-lg text-white/40 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[8px]", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: createMutation.isPending, className: "h-8 px-5 rounded-lg bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-[8px] shadow-sm", children: createMutation.isPending ? "Creating..." : "Create Offer" })
        ] })
      ] }) })
    ] })
  ] });
}
function EditOfferDialog({ offer, onOpenChange }) {
  const { data: products } = useProducts();
  const { toast } = useToast();
  const form = useForm({
    resolver: t(specialOfferFormSchema),
    defaultValues: {
      name: "",
      productId: 0,
      description: "",
      bundleQuantity: 1,
      price: 0,
      status: "active",
      durationHours: ""
    }
  });
  const [lastOfferId, setLastOfferId] = reactExports.useState(null);
  if (offer && offer.id !== lastOfferId) {
    setLastOfferId(offer.id);
    form.reset({
      name: offer.name,
      productId: offer.productId,
      description: offer.description || "",
      bundleQuantity: offer.bundleQuantity,
      price: offer.price / 100,
      status: offer.status,
      durationHours: ""
    });
  }
  const updateMutation = useMutation({
    mutationFn: async (values) => {
      if (!offer) return;
      const finalValues = {
        ...values,
        price: Math.round(values.price * 100),
        expiresAt: values.durationHours ? new Date(Date.now() + parseFloat(values.durationHours) * 60 * 60 * 1e3).toISOString() : offer.expiresAt
      };
      const { durationHours, ...apiData } = finalValues;
      await apiRequest("PATCH", `/api/special-offers/${offer.id}`, apiData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/special-offers"] });
      toast({ title: "Special offer updated successfully" });
      onOpenChange(false);
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: offer !== null, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass-panel border-white/5 bg-[#0b0718]/95 backdrop-blur-3xl sm:max-w-[380px] rounded-2xl p-4 shadow-4xl animate-in fade-in zoom-in duration-300 text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-xl font-black text-white tracking-tighter flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "w-4 h-4" }) }),
        "Edit Special Offer"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-white/40 font-medium text-xs", children: "Update the details of this bundle deal." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit((data) => updateMutation.mutate(data)), className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          control: form.control,
          name: "name",
          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[8px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Offer Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "glass-panel h-9 rounded-lg border-white/5 bg-white/[0.02] text-xs text-white focus:border-purple-500/50", ...field }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "productId",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[8px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Product" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: (v) => field.onChange(parseInt(v)), value: field.value.toString(), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "glass-panel h-9 rounded-lg border-white/5 bg-white/[0.02] text-xs text-white focus:border-purple-500/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select Product" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "glass-panel border-white/10 bg-[#0f0a1e] text-white rounded-xl", children: products?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id.toString(), children: p.name }, p.id)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "status",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[8px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Status" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, value: field.value, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "glass-panel h-9 rounded-lg border-white/5 bg-white/[0.02] text-xs text-white focus:border-purple-500/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Status" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "glass-panel border-white/10 bg-[#0f0a1e] text-white rounded-xl", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "active", children: "Active" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "inactive", children: "Inactive" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "bundleQuantity",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[8px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Bundle Quantity" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", className: "glass-panel h-9 rounded-lg border-white/5 bg-white/[0.02] text-xs text-white focus:border-purple-500/50", ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "price",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[8px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Bundle Price ($)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", className: "glass-panel h-9 rounded-lg border-white/5 bg-white/[0.02] text-xs text-white focus:border-purple-500/50", ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
            ] })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          control: form.control,
          name: "durationHours",
          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[8px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Extend Duration (Hours - Optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "0.5",
                placeholder: "Add hours...",
                className: "glass-panel h-9 rounded-lg border-white/5 bg-white/[0.02] text-xs text-white focus:border-purple-500/50",
                value: field.value || "",
                onChange: field.onChange
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          control: form.control,
          name: "description",
          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[8px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Description (Optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                placeholder: "Info...",
                className: "glass-panel min-h-[50px] rounded-lg border-white/5 bg-white/[0.02] text-xs text-white focus:border-purple-500/50 resize-none",
                ...field
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-2 border-t border-white/5 gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", onClick: () => onOpenChange(false), className: "h-8 px-3 rounded-lg text-white/40 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[8px]", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: updateMutation.isPending, className: "h-8 px-5 rounded-lg bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-[8px] shadow-sm", children: updateMutation.isPending ? "Saving..." : "Save Changes" })
      ] })
    ] }) })
  ] }) });
}
export {
  SpecialOffersPage as default
};
