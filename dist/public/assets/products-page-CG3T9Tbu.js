import { r as reactExports, d as useToast, f as useMutation, j as jsxRuntimeExports, B as Button, L as LoaderCircle, M as Megaphone, h as MessageSquare, q as queryClient, i as apiRequest, D as DropdownMenu, k as DropdownMenuTrigger, l as DropdownMenuContent, m as DropdownMenuLabel, n as DropdownMenuItem, o as DropdownMenuSeparator } from "./index-DDU_XZV-.js";
import { u as useProducts, a as useCreateProduct, b as useDeleteProduct } from "./use-products-efaKxUz2.js";
import { a as api, b as buildUrl } from "./routes-CuIIW9wP.js";
import { T as Table, a as TableHeader, b as TableRow, c as TableHead, d as TableBody, e as TableCell } from "./table-aO1A-hyP.js";
import { I as Input } from "./input-DGXMpx71.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter } from "./dialog-CE9M4yxZ.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-DXlBiZdF.js";
import { T as Textarea } from "./textarea-DXTZs5DY.js";
import { B as Badge } from "./badge-CGlCXptQ.js";
import { u as useForm, F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormMessage, t } from "./form-CSeCo9bg.js";
import { z } from "./index-DwfS90rP.js";
import { i as insertProductSchema } from "./schema-DTjBPKAW.js";
import { S as Skeleton } from "./skeleton-BiachW0D.js";
import { u as useSensors, a as useSensor, G as GripVertical, D as DndContext, c as closestCenter, S as SortableContext, v as verticalListSortingStrategy, b as arrayMove, s as sortableKeyboardCoordinates, K as KeyboardSensor, T as TouchSensor, M as MouseSensor, d as useSortable, C as CSS } from "./sortable.esm-Db4KNAD2.js";
import { P as Plus } from "./plus-BGyldTKp.js";
import { S as Server } from "./server-Deo6Vm6c.js";
import { E as Ellipsis, T as Trash } from "./trash-CwXvJt3L.js";
import { P as Pen } from "./pen-DaL8xCct.js";
import { C as Copy } from "./copy-B8bXaU7z.js";
import "./index-IXOTxK3N.js";
import "./index-BJ6qsqCF.js";
import "./label-Da918oeO.js";
const formatProductPrice = (priceInCents, currency) => {
  const amount = priceInCents / 100;
  if (currency === "LKR") return `Rs. ${amount.toFixed(2)}`;
  if (currency === "USDT") return `₮ ${amount.toFixed(2)}`;
  if (currency === "TRX") return `${amount.toFixed(2)} TRX`;
  if (currency === "INR") return `₹${amount.toFixed(2)}`;
  if (currency === "EUR") return `€${amount.toFixed(2)}`;
  return `$${amount.toFixed(2)}`;
};
const productFormSchema = insertProductSchema.extend({
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  currency: z.string().default("USD")
});
function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const [search, setSearch] = reactExports.useState("");
  const [isCreateOpen, setIsCreateOpen] = reactExports.useState(false);
  const [sortedProducts, setSortedProducts] = reactExports.useState([]);
  const { toast } = useToast();
  reactExports.useEffect(() => {
    if (products) setSortedProducts(products);
  }, [products]);
  const reorderMutation = useMutation({
    mutationFn: async (orderedIds) => {
      await apiRequest("POST", "/api/products/reorder", { orderedIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
      toast({ title: "✅ Order saved", description: "Product order updated successfully." });
    },
    onError: () => {
      toast({ title: "Failed to save order", variant: "destructive" });
      if (products) setSortedProducts(products);
    }
  });
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSortedProducts((prev) => {
      const oldIndex = prev.findIndex((p) => p.id === active.id);
      const newIndex = prev.findIndex((p) => p.id === over.id);
      const newOrder = arrayMove(prev, oldIndex, newIndex);
      reorderMutation.mutate(newOrder.map((p) => p.id));
      return newOrder;
    });
  }
  const [isCustomBroadcastOpen, setIsCustomBroadcastOpen] = reactExports.useState(false);
  const broadcastMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/broadcast/availability");
    },
    onSuccess: () => {
      toast({ title: "Availability broadcast sent to all users" });
    },
    onError: (error) => {
      toast({
        title: "Broadcast failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  const filteredProducts = (search ? sortedProducts.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.type.toLowerCase().includes(search.toLowerCase())
  ) : sortedProducts) || [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black text-white tracking-tighter drop-shadow-2xl", children: "Products" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-white/40 text-sm font-medium", children: [
          "Manage your cloud account inventory. ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-purple-400/60 inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "w-3 h-3 inline" }),
            "Drag rows to reorder."
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CreateProductDialog, { open: isCreateOpen, onOpenChange: setIsCreateOpen }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => {
              if (confirm("Send availability list to all bot users?")) {
                broadcastMutation.mutate();
              }
            },
            disabled: broadcastMutation.isPending,
            className: "h-11 px-6 rounded-xl border-white/10 bg-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2",
            children: [
              broadcastMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-4 w-4" }),
              "Broadcast Stock"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => setIsCustomBroadcastOpen(true),
            className: "h-11 px-6 rounded-xl border-white/10 bg-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-4 w-4" }),
              "Custom Broadcast"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CustomBroadcastDialog, { open: isCustomBroadcastOpen, onOpenChange: setIsCustomBroadcastOpen })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card border-0 rounded-2xl overflow-hidden shadow-2xl bg-white/[0.01] backdrop-blur-3xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DndContext, { sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-white/5 hover:bg-transparent", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "w-8 pl-4 py-4" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px] pl-2 py-4", children: "Product" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px] py-4", children: "Category" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px] py-4", children: "Price" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px] py-4", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-white/40 font-bold uppercase tracking-widest text-[10px] text-right pr-6 py-4", children: "Actions" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: isLoading ? Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-white/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pl-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-5 bg-white/5 rounded" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pl-2 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-10 w-40 bg-white/5 rounded-xl" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 bg-white/5 rounded-lg" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-12 bg-white/5 rounded-lg" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-5 w-20 bg-white/5 rounded-lg" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pr-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-8 ml-auto rounded-lg bg-white/5" }) })
      ] }, i)) : filteredProducts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(TableRow, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { colSpan: 6, className: "h-48 text-center text-white/20 font-black text-sm uppercase tracking-tighter", children: "No products found." }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SortableContext, { items: filteredProducts.map((p) => p.id), strategy: verticalListSortingStrategy, children: filteredProducts.map((product) => /* @__PURE__ */ jsxRuntimeExports.jsx(SortableProductRow, { product }, product.id)) }) })
    ] }) }) })
  ] });
}
function SortableProductRow({ product }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? "rgba(139,92,246,0.08)" : void 0,
    zIndex: isDragging ? 10 : void 0
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { ref: setNodeRef, style, className: "border-white/5 hover:bg-white/[0.03] transition-all duration-200 group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pl-4 py-4 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        ...attributes,
        ...listeners,
        className: "text-white/20 hover:text-purple-400 cursor-grab active:cursor-grabbing transition-colors p-1 rounded",
        title: "Drag to reorder",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "w-4 h-4" })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "pl-2 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform duration-300 shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "w-5 h-5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-black text-white tracking-tight leading-tight", children: product.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/30 font-medium truncate max-w-[200px] leading-tight", children: product.description })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "border-white/10 text-white/60 bg-white/5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest", children: product.type }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "font-black text-white text-base tracking-tighter", children: formatProductPrice(product.price, product.currency || "USD") }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status: product.status }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right pr-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ProductActions, { product }) })
  ] });
}
function StatusBadge({ status }) {
  if (status === "available") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-green-500/10 text-green-400 border-green-500/20 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest no-default-hover-elevate", children: "Available" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-white/5 text-white/30 border-white/5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest no-default-hover-elevate", children: "Sold" });
}
function ProductActions({ product }) {
  const { mutate: deleteProduct, isPending } = useDeleteProduct();
  const [isEditOpen, setIsEditOpen] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "ghost", className: "h-9 w-9 p-0 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Open menu" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Ellipsis, { className: "h-4 w-4" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "glass-panel border-white/10 bg-background/95 backdrop-blur-3xl rounded-xl p-1.5 shadow-4xl min-w-[160px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 px-2.5 py-1.5", children: "Management" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DropdownMenuItem,
          {
            onClick: () => setIsEditOpen(true),
            className: "rounded-lg px-2.5 py-2 text-xs font-bold text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5 text-blue-400" }),
              "Edit Product"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DropdownMenuItem,
          {
            onClick: () => navigator.clipboard.writeText(product.content),
            className: "rounded-lg px-2.5 py-2 text-xs font-bold text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5 text-purple-400" }),
              "Copy Info"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, { className: "bg-white/5 my-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          DropdownMenuItem,
          {
            className: "rounded-lg px-2.5 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer flex items-center gap-2",
            onClick: () => {
              if (confirm("Are you sure you want to delete this product?")) {
                deleteProduct(product.id);
              }
            },
            disabled: isPending,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "w-3.5 h-3.5" }),
              "Delete Product"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      EditProductDialog,
      {
        product,
        open: isEditOpen,
        onOpenChange: setIsEditOpen
      }
    )
  ] });
}
function EditProductDialog({
  product,
  open,
  onOpenChange
}) {
  const { toast } = useToast();
  const [customType, setCustomType] = reactExports.useState(
    ["AWS", "DigitalOcean", "Google Cloud", "Azure", "Linode", "ChatGPT", "Claude", "Gemini", "Cursor", "CapCut", "Other"].includes(product.type) ? "" : product.type
  );
  const form = useForm({
    resolver: t(productFormSchema),
    defaultValues: {
      name: product.name,
      type: ["AWS", "DigitalOcean", "Google Cloud", "Azure", "Linode", "ChatGPT", "Claude", "Gemini", "Cursor", "CapCut", "Other"].includes(product.type) ? product.type : "Custom",
      description: product.description || "",
      price: product.price / 100,
      currency: product.currency || "USD"
    }
  });
  const updateMutation = useMutation({
    mutationFn: async (values) => {
      const finalValues = {
        ...values,
        type: values.type === "Custom" ? customType : values.type,
        price: Math.round(values.price * 100)
      };
      await apiRequest("PUT", buildUrl(api.products.update.path, { id: product.id }), finalValues);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
      toast({ title: "Product updated successfully" });
      onOpenChange(false);
    }
  });
  const selectedType = form.watch("type");
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass-panel border-white/10 bg-background/95 backdrop-blur-3xl sm:max-w-[500px] rounded-3xl p-8 shadow-4xl animate-in fade-in zoom-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-2xl font-black text-white tracking-tighter flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-5 h-5" }) }),
        "Edit Product"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogDescription, { className: "text-white/40 font-medium text-sm", children: [
        "Update product details for ",
        product.name,
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit((data) => updateMutation.mutate(data)), className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          control: form.control,
          name: "name",
          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Product Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "AWS 10k Credits Account", className: "glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all shadow-inner", ...field }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-red-400 font-bold text-xs" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "type",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Provider" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white focus:border-purple-500/50 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select type" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "glass-panel border-white/10 bg-background text-white rounded-xl", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AWS", children: "AWS" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "DigitalOcean", children: "DigitalOcean" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Google Cloud", children: "Google Cloud" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Azure", children: "Azure" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Linode", children: "Linode" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ChatGPT", children: "ChatGPT" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Claude", children: "Claude" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Gemini", children: "Gemini" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cursor", children: "Cursor" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "CapCut", children: "CapCut" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Custom", children: "Custom (Enter below)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Other", children: "Other" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-red-400 font-bold text-xs" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "price",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Price" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", placeholder: "15.00", className: "glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all", ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-red-400 font-bold text-xs" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "currency",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Currency" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white focus:border-purple-500/50 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select currency" }) }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "glass-panel border-white/10 bg-background text-white rounded-xl", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "USD", children: "USD ($)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "LKR", children: "LKR (Rs)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "USDT", children: "USDT (₮)" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "TRX", children: "TRX (TRX)" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-red-400 font-bold text-xs" })
            ] })
          }
        )
      ] }),
      selectedType === "Custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "animate-in fade-in slide-in-from-top-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Custom Provider Type" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Enter custom type (e.g. Vultr, Oracle)",
            className: "glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white focus:border-purple-500/50 transition-all",
            value: customType,
            onChange: (e) => setCustomType(e.target.value)
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormField,
        {
          control: form.control,
          name: "description",
          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                placeholder: "Account details, limits, etc.",
                className: "glass-panel rounded-xl border-white/5 bg-white/[0.02] text-sm text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all min-h-[80px] py-3",
                ...field,
                value: field.value ?? ""
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-red-400 font-bold text-xs" })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-4 border-t border-white/5 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", onClick: () => onOpenChange(false), className: "h-11 px-6 rounded-xl text-white/40 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[9px]", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: updateMutation.isPending, className: "h-11 px-8 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:opacity-90 font-black uppercase tracking-widest text-[9px] shadow-xl transition-all active:scale-95", children: updateMutation.isPending ? "Updating..." : "Update Product" })
      ] })
    ] }) })
  ] }) });
}
function CustomBroadcastDialog({
  open,
  onOpenChange
}) {
  const { toast } = useToast();
  const [message, setMessage] = reactExports.useState("");
  const broadcastMutation = useMutation({
    mutationFn: async (content) => {
      await apiRequest("POST", "/api/broadcast/custom", { message: content });
    },
    onSuccess: () => {
      toast({ title: "Custom broadcast sent to all users" });
      setMessage("");
      onOpenChange(false);
    },
    onError: (error) => {
      toast({
        title: "Broadcast failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass-panel border-white/10 bg-background/95 backdrop-blur-3xl sm:max-w-[500px] rounded-3xl p-8 shadow-4xl animate-in fade-in zoom-in duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-2xl font-black text-white tracking-tighter flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-5 h-5" }) }),
        "Custom Broadcast"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-white/40 font-medium text-sm", children: "Send a custom message to all registered bot users." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Message Content" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Textarea,
          {
            placeholder: "Enter your message here... (Markdown supported)",
            className: "glass-panel rounded-xl border-white/5 bg-white/[0.02] text-sm text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all min-h-[150px] py-3",
            value: message,
            onChange: (e) => setMessage(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-4 border-t border-white/5 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", onClick: () => onOpenChange(false), className: "h-11 px-6 rounded-xl text-white/40 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[9px]", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => {
              if (!message.trim()) {
                toast({ title: "Error", description: "Message cannot be empty", variant: "destructive" });
                return;
              }
              broadcastMutation.mutate(message);
            },
            disabled: broadcastMutation.isPending,
            className: "h-11 px-8 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:opacity-90 font-black uppercase tracking-widest text-[9px] shadow-xl transition-all active:scale-95",
            children: broadcastMutation.isPending ? "Sending..." : "Send Broadcast"
          }
        )
      ] })
    ] })
  ] }) });
}
function CreateProductDialog({ open, onOpenChange }) {
  const { mutate: createProduct, isPending } = useCreateProduct();
  const [customType, setCustomType] = reactExports.useState("");
  const form = useForm({
    resolver: t(productFormSchema),
    defaultValues: {
      name: "",
      type: "AWS",
      description: "",
      price: 0,
      currency: "USD"
    }
  });
  const selectedType = form.watch("type");
  function onSubmit(values) {
    const finalValues = {
      ...values,
      type: values.type === "Custom" ? customType : values.type,
      price: Math.round(values.price * 100)
      // Convert Dollars to Cents for storage
    };
    if (values.type === "Custom" && !customType) {
      form.setError("type", { message: "Please enter a custom type" });
      return;
    }
    createProduct(finalValues, {
      onSuccess: () => {
        onOpenChange(false);
        form.reset();
        setCustomType("");
      }
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open, onOpenChange, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "h-11 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-lg transition-all duration-300 hover:scale-105 active:scale-95", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
      " Add"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass-panel border-white/10 bg-background/95 backdrop-blur-3xl sm:max-w-[500px] rounded-3xl p-8 shadow-4xl animate-in fade-in zoom-in duration-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-2xl font-black text-white tracking-tighter flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shadow-md", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-5 h-5" }) }),
          "Create Product"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-white/40 font-medium text-sm", children: "Add a new cloud account to your inventory." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "name",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Product Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "AWS 10k Credits Account", className: "glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all shadow-inner", ...field }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-red-400 font-bold text-xs" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "type",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Provider" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white focus:border-purple-500/50 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select type" }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "glass-panel border-white/10 bg-background text-white rounded-xl", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AWS", children: "AWS" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "DigitalOcean", children: "DigitalOcean" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Google Cloud", children: "Google Cloud" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Azure", children: "Azure" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Linode", children: "Linode" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ChatGPT", children: "ChatGPT" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Claude", children: "Claude" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Gemini", children: "Gemini" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Cursor", children: "Cursor" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "CapCut", children: "CapCut" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Custom", children: "Custom (Enter below)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "Other", children: "Other" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-red-400 font-bold text-xs" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "price",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Price" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "number", step: "0.01", placeholder: "15.00", className: "glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all", ...field }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-red-400 font-bold text-xs" })
              ] })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            FormField,
            {
              control: form.control,
              name: "currency",
              render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Currency" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { onValueChange: field.onChange, defaultValue: field.value, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white focus:border-purple-500/50 transition-all", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Select currency" }) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { className: "glass-panel border-white/10 bg-background text-white rounded-xl", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "USD", children: "USD ($)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "LKR", children: "LKR (Rs)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "USDT", children: "USDT (₮)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "TRX", children: "TRX (TRX)" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-red-400 font-bold text-xs" })
              ] })
            }
          )
        ] }),
        selectedType === "Custom" && /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "animate-in fade-in slide-in-from-top-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Custom Provider Type" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Enter custom type (e.g. Vultr, Oracle)",
              className: "glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white focus:border-purple-500/50 transition-all",
              value: customType,
              onChange: (e) => setCustomType(e.target.value)
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FormField,
          {
            control: form.control,
            name: "description",
            render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5", children: "Description" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  placeholder: "Account details, limits, etc.",
                  className: "glass-panel rounded-xl border-white/5 bg-white/[0.02] text-sm text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all min-h-[80px] py-3",
                  ...field,
                  value: field.value ?? ""
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-red-400 font-bold text-xs" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "pt-4 border-t border-white/5 gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "ghost", onClick: () => onOpenChange(false), className: "h-11 px-6 rounded-xl text-white/40 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[9px]", children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: isPending, className: "h-11 px-8 rounded-xl bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-[9px] shadow-xl", children: isPending ? "Adding..." : "Add Product" })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  ProductsPage as default
};
