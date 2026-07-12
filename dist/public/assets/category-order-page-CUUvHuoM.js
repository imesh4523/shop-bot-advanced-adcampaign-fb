import { c as createLucideIcon, d as useToast, r as reactExports, u as useQuery, f as useMutation, j as jsxRuntimeExports, B as Button, L as LoaderCircle, q as queryClient, i as apiRequest } from "./index-DDU_XZV-.js";
import { I as Input } from "./input-DGXMpx71.js";
import { L as Label } from "./label-Da918oeO.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, f as DialogFooter } from "./dialog-CE9M4yxZ.js";
import { u as useSensors, a as useSensor, D as DndContext, c as closestCenter, S as SortableContext, v as verticalListSortingStrategy, s as sortableKeyboardCoordinates, K as KeyboardSensor, T as TouchSensor, M as MouseSensor, b as arrayMove, d as useSortable, C as CSS, G as GripVertical } from "./sortable.esm-Db4KNAD2.js";
import { P as Plus } from "./plus-BGyldTKp.js";
import { S as Save } from "./save-DHRbGkyx.js";
import { P as Pen } from "./pen-DaL8xCct.js";
import { T as Trash2 } from "./trash-2-3mfwPK5n.js";
const LayoutGrid = createLucideIcon("LayoutGrid", [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
]);
const DEFAULT_CATEGORIES = [
  { id: "all", label: "All", icon: "Package" },
  { id: "aws", label: "AWS", icon: "Aws" },
  { id: "digitalocean", label: "DO", icon: "Digitalocean" },
  { id: "azure", label: "Azure", icon: "Azure" },
  { id: "google", label: "GCP", icon: "Googlecloud" },
  { id: "vultr", label: "Vultr", icon: "Vultr" },
  { id: "hetzner", label: "Hetzner", icon: "Hetzner" },
  { id: "oracle", label: "Oracle", icon: "Database" },
  { id: "chatgpt", label: "ChatGPT", icon: "Openai" },
  { id: "claude", label: "Claude", icon: "Claude" },
  { id: "gemini", label: "Gemini", icon: "Googlegemini" },
  { id: "cursor", label: "Cursor", icon: "Cursor" },
  { id: "capcut", label: "CapCut", icon: "Capcut" }
];
const AVAILABLE_ICONS = [
  { id: "Package", name: "General Box (Package)" },
  { id: "Aws", name: "AWS Cloud" },
  { id: "Digitalocean", name: "DigitalOcean" },
  { id: "Azure", name: "Microsoft Azure" },
  { id: "Googlecloud", name: "Google Cloud" },
  { id: "Vultr", name: "Vultr" },
  { id: "Hetzner", name: "Hetzner" },
  { id: "Database", name: "Oracle / Database" },
  { id: "Openai", name: "ChatGPT" },
  { id: "Claude", name: "Claude AI" },
  { id: "Googlegemini", name: "Google Gemini" },
  { id: "Cursor", name: "Cursor AI" },
  { id: "Capcut", name: "CapCut" }
];
function SortableCategoryRow({
  category,
  onEdit,
  onDelete
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: category.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: setNodeRef,
      style,
      className: "flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:border-purple-500/30 transition-all duration-200",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ...attributes, ...listeners, className: "cursor-grab text-white/20 hover:text-white/40 active:cursor-grabbing", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GripVertical, { className: "w-5 h-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-white text-sm", children: category.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-white/30 uppercase tracking-widest font-black", children: [
              "ID: ",
              category.id
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/40 mt-0.5", children: [
            "Icon: ",
            category.icon
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "w-8 h-8 rounded-lg bg-neutral-900 text-purple-400 hover:text-purple-300 border border-white/5",
              onClick: () => onEdit(category),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-3.5 h-3.5" })
            }
          ),
          category.id !== "all" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "w-8 h-8 rounded-lg bg-neutral-900 text-red-400 hover:text-red-300 border border-white/5",
              onClick: () => onDelete(category.id),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" })
            }
          )
        ] })
      ]
    }
  );
}
function CategoryOrderPage() {
  const { toast } = useToast();
  const [categories, setCategories] = reactExports.useState([]);
  const [isDialogOpen, setIsDialogOpen] = reactExports.useState(false);
  const [editingCategory, setEditingCategory] = reactExports.useState(null);
  const [catId, setCatId] = reactExports.useState("");
  const [catLabel, setCatLabel] = reactExports.useState("");
  const [catIcon, setCatIcon] = reactExports.useState("Package");
  const { data: settingData, isLoading } = useQuery({
    queryKey: ["/api/settings/CATEGORY_ORDER"]
  });
  reactExports.useEffect(() => {
    if (settingData?.value) {
      try {
        const parsed = JSON.parse(settingData.value);
        if (Array.isArray(parsed)) {
          setCategories(parsed);
        } else {
          setCategories(DEFAULT_CATEGORIES);
        }
      } catch {
        setCategories(DEFAULT_CATEGORIES);
      }
    } else if (!isLoading) {
      setCategories(DEFAULT_CATEGORIES);
    }
  }, [settingData, isLoading]);
  const saveMutation = useMutation({
    mutationFn: async (updatedList) => {
      await apiRequest("POST", "/api/settings", {
        key: "CATEGORY_ORDER",
        value: JSON.stringify(updatedList)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/CATEGORY_ORDER"] });
      toast({ title: "✅ Order Saved", description: "Category customization has been saved." });
    },
    onError: () => {
      toast({ title: "❌ Save Failed", description: "Could not save custom category order.", variant: "destructive" });
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
    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    const newOrder = arrayMove(categories, oldIndex, newIndex);
    setCategories(newOrder);
    saveMutation.mutate(newOrder);
  }
  const handleOpenAdd = () => {
    setEditingCategory(null);
    setCatId("");
    setCatLabel("");
    setCatIcon("Package");
    setIsDialogOpen(true);
  };
  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setCatId(category.id);
    setCatLabel(category.label);
    setCatIcon(category.icon);
    setIsDialogOpen(true);
  };
  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this category? Products inside this category won't be deleted, but the tab filter chip will be removed.")) {
      const updated = categories.filter((c) => c.id !== id);
      setCategories(updated);
      saveMutation.mutate(updated);
    }
  };
  const handleSave = () => {
    if (!catId.trim() || !catLabel.trim()) {
      toast({ title: "Invalid Input", description: "Category ID and Label are required.", variant: "destructive" });
      return;
    }
    const cleanId = catId.trim().toLowerCase().replace(/\s+/g, "-");
    const newCatItem = {
      id: cleanId,
      label: catLabel.trim(),
      icon: catIcon
    };
    let updatedList = [];
    if (editingCategory) {
      updatedList = categories.map((c) => c.id === editingCategory.id ? newCatItem : c);
    } else {
      if (categories.some((c) => c.id === cleanId)) {
        toast({ title: "Duplicate ID", description: "A category with this ID already exists.", variant: "destructive" });
        return;
      }
      updatedList = [...categories, newCatItem];
    }
    setCategories(updatedList);
    saveMutation.mutate(updatedList);
    setIsDialogOpen(false);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-black text-white tracking-tighter drop-shadow-2xl flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "w-8 h-8 text-purple-400" }),
          "Category Customizer"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 text-sm font-medium", children: "Manage product filter tabs and reorder them using drag-and-drop." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleOpenAdd,
          className: "h-11 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
            " Add Category"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "glass-card border-0 p-6 rounded-3xl bg-white/[0.01] backdrop-blur-3xl space-y-4", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-10 h-10 animate-spin text-purple-400" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DndContext, { sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SortableContext, { items: categories.map((c) => c.id), strategy: verticalListSortingStrategy, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: categories.map((category) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      SortableCategoryRow,
      {
        category,
        onEdit: handleOpenEdit,
        onDelete: handleDelete
      },
      category.id
    )) }) }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass-card border-white/20 max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-white text-xl font-black", children: editingCategory ? "Edit Category" : "Add Category" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70 text-xs font-bold uppercase tracking-widest", children: "Category ID (Unique)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "e.g. aws, chatgpt, new-category",
              className: "glass-panel h-11 border-white/10 text-white",
              value: catId,
              onChange: (e) => setCatId(e.target.value),
              disabled: editingCategory !== null
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70 text-xs font-bold uppercase tracking-widest", children: "Display Label" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "e.g. AWS Cloud, ChatGPT, New Tag",
              className: "glass-panel h-11 border-white/10 text-white",
              value: catLabel,
              onChange: (e) => setCatLabel(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white/70 text-xs font-bold uppercase tracking-widest", children: "Category Icon" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              className: "w-full h-11 bg-neutral-900 border border-white/10 rounded-lg px-3 text-white text-sm focus:outline-none focus:border-purple-500/50",
              value: catIcon,
              onChange: (e) => setCatIcon(e.target.value),
              children: AVAILABLE_ICONS.map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: i.id, children: i.name }, i.id))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", onClick: () => setIsDialogOpen(false), className: "text-white/60 hover:text-white", children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: handleSave,
            className: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-6 shadow-lg shadow-purple-500/20",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4 mr-2" }),
              " Save Category"
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  CategoryOrderPage as default
};
