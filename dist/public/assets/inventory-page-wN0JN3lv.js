import { d as useToast, r as reactExports, u as useQuery, f as useMutation, j as jsxRuntimeExports, B as Button, L as LoaderCircle, q as queryClient, i as apiRequest } from "./index-B1IFJGJd.js";
import { a as api, b as buildUrl } from "./routes-CuIIW9wP.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-CldHHcFb.js";
import { I as Input } from "./input-ux8ELx6L.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, f as DialogFooter } from "./dialog-DjO31fl-.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BRROf9Le.js";
import { T as Textarea } from "./textarea-aUZt1OoF.js";
import { B as Badge } from "./badge-B8r8EMju.js";
import { u as useForm, F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormMessage, t } from "./form-e0Vbx7ZM.js";
import { a as insertCredentialSchema } from "./schema-DTjBPKAW.js";
import { u as useProducts } from "./use-products-CkP7JOpa.js";
import { P as Plus } from "./plus-DbSKROfo.js";
import { K as Key } from "./key-BZ_FsAPz.js";
import { S as Search } from "./search--esd2yB_.js";
import { S as Server } from "./server-BrJ-n7fa.js";
import { P as Pen } from "./pen-G4QaNTTC.js";
import { T as Trash2 } from "./trash-2-BhonZ8pT.js";
import "./index-DwfS90rP.js";
import "./index-IXOTxK3N.js";
import "./index-wP_JWuWe.js";
import "./label-6aql36xz.js";
function InventoryPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const { data: products } = useProducts();
  const [selectedProductId, setSelectedProductId] = reactExports.useState("all");
  const { data: credentials, isLoading } = useQuery({
    queryKey: ["/api/all-credentials"],
    queryFn: async () => {
      const res = await fetch("/api/all-credentials");
      if (!res.ok) throw new Error("Failed to fetch credentials");
      return res.json();
    }
  });
  const form = useForm({
    resolver: t(insertCredentialSchema),
    defaultValues: {
      productId: 0,
      content: "",
      status: "available"
    }
  });
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const entries = data.content.split(/(?:\r?\n|^)\d+\s+/).map((entry) => entry.trim()).filter((entry) => entry.length > 0);
      if (entries.length > 1) {
        for (const entry of entries) {
          await apiRequest("POST", api.credentials.create.path, {
            ...data,
            content: entry
          });
        }
      } else {
        await apiRequest("POST", api.credentials.create.path, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/all-credentials"] });
      form.reset();
      toast({ title: "Credentials added successfully" });
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await apiRequest("DELETE", buildUrl(api.credentials.delete.path, { id }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/all-credentials"] });
      toast({ title: "Credential deleted" });
    }
  });
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      await apiRequest("PATCH", buildUrl(api.credentials.update.path, { id }), data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/all-credentials"] });
      toast({ title: "Credential updated successfully" });
    }
  });
  const filteredCredentials = credentials?.filter((cred) => {
    const product = products?.find((p) => p.id === cred.productId);
    const matchesSearch = cred.content.toLowerCase().includes(searchTerm.toLowerCase()) || product?.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProduct = selectedProductId === "all" || cred.productId === Number(selectedProductId);
    return matchesSearch && matchesProduct;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black text-white tracking-tighter drop-shadow-2xl", children: "Inventory" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-sm font-medium", children: "Manage account credentials and stock." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "h-11 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-lg transition-all duration-300 hover:scale-105 active:scale-95", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
          " Add Credentials"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass-panel border-white/10 bg-background/95 backdrop-blur-3xl sm:max-w-[500px] rounded-3xl p-8 shadow-4xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-2xl font-black text-white tracking-tighter flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-5 h-5 text-purple-400" }),
            "Add Stock"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit((data) => createMutation.mutate(data)), className: "space-y-6 pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormField,
              {
                control: form.control,
                name: "productId",
                render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Select Product" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: (val) => field.onChange(Number(val)), defaultValue: field.value.toString(), children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white focus:border-purple-500/50 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a product" }) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "glass-panel border-white/10 bg-background text-white rounded-xl", children: products?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id.toString(), children: p.name }, p.id)) })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              FormField,
              {
                control: form.control,
                name: "content",
                render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Account Details" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Textarea,
                    {
                      ...field,
                      placeholder: "Email: pass",
                      className: "glass-panel rounded-xl border-white/5 bg-white/[0.02] text-xs text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all font-mono min-h-[120px] py-3"
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: createMutation.isPending, className: "w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:opacity-90 font-black uppercase tracking-widest text-[9px] h-11 rounded-xl shadow-xl transition-all active:scale-95", children: [
              createMutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
              "Add to Inventory"
            ] }) })
          ] }) })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 group", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-purple-400 transition-colors" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search credentials...",
            className: "glass-panel pl-10 h-11 rounded-xl border-white/10 text-sm text-white placeholder:text-white/20 focus:border-purple-500/50 transition-all duration-500 shadow-xl",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedProductId, onValueChange: setSelectedProductId, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "w-full sm:w-[200px] glass-panel h-11 rounded-xl border-white/10 text-sm text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "All Products" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "glass-panel border-white/10 bg-[#0f0a1e] text-white rounded-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "all", children: "All Products" }),
          products?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id.toString(), children: p.name }, p.id))
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card border-0 rounded-2xl overflow-hidden shadow-2xl bg-white/[0.01] backdrop-blur-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-white/5 hover:bg-transparent", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px] pl-6 py-4", children: "Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px] py-4", children: "Credentials" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px] py-4", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px] text-right pr-6 py-4", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 4, className: "text-center py-12 text-white/20 text-xs", children: "Loading..." }) }) : filteredCredentials?.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 4, className: "h-48 text-center text-white/20 font-black text-sm uppercase tracking-tighter", children: "No stock found in inventory." }) }) : filteredCredentials?.map((cred) => {
        const product = products?.find((p) => p.id === cred.productId);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-white/5 hover:bg-white/[0.03] transition-all duration-300 group", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pl-6 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black text-white tracking-tight", children: product?.name || "Unknown" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-mono text-[10px] text-white/60 max-w-[300px] truncate", children: cred.content }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: `border-0 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${cred.status === "available" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`, children: cred.status }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right pr-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 rounded-lg text-white/20 hover:text-purple-400 hover:bg-purple-500/10 transition-colors",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "h-4 w-4" })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass-panel border-white/10 bg-background/95 backdrop-blur-3xl sm:max-w-[500px] rounded-3xl p-8 shadow-4xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-2xl font-black text-white tracking-tighter flex items-center gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-5 h-5 text-purple-400" }),
                  "Edit Stock"
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  EditCredentialForm,
                  {
                    credential: cred,
                    products: products || [],
                    onSuccess: () => {
                    },
                    mutation: updateMutation
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors",
                onClick: () => {
                  if (confirm("Delete this stock entry?")) {
                    deleteMutation.mutate(cred.id);
                  }
                },
                disabled: deleteMutation.isPending,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" })
              }
            )
          ] }) })
        ] }, cred.id);
      }) })
    ] }) })
  ] });
}
function EditCredentialForm({
  credential,
  products,
  mutation
}) {
  const form = useForm({
    resolver: t(insertCredentialSchema),
    defaultValues: {
      productId: credential.productId,
      content: credential.content,
      status: credential.status
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit((data) => mutation.mutate({ id: credential.id, data })), className: "space-y-6 pt-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormField,
      {
        control: form.control,
        name: "productId",
        render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Select Product" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: (val) => field.onChange(Number(val)), defaultValue: field.value.toString(), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white focus:border-purple-500/50 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select a product" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { className: "glass-panel border-white/10 bg-[#0f0a1e] text-white rounded-xl", children: products.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: p.id.toString(), children: p.name }, p.id)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      FormField,
      {
        control: form.control,
        name: "content",
        render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Account Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              ...field,
              placeholder: "Email: pass",
              className: "glass-panel rounded-xl border-white/5 bg-white/[0.02] text-xs text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all font-mono min-h-[120px] py-3"
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
        name: "status",
        render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Status" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white focus:border-purple-500/50 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select status" }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "glass-panel border-white/10 bg-[#0f0a1e] text-white rounded-xl", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "available", children: "Available" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "sold", children: "Sold" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, {})
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { type: "submit", disabled: mutation.isPending, className: "w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:opacity-90 font-black uppercase tracking-widest text-[9px] h-11 rounded-xl shadow-xl transition-all active:scale-95", children: [
      mutation.isPending && /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
      "Update Credential"
    ] }) })
  ] }) });
}
export {
  InventoryPage as default
};
