import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  DndContext, closestCenter, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors, type DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus, Edit2, Trash2, GripVertical, Save, Loader2, Package, Database, Key, LayoutGrid
} from "lucide-react";

interface CategoryItem {
  id: string;
  label: string;
  icon: string;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 'all', label: 'All', icon: 'Package' },
  { id: 'aws', label: 'AWS', icon: 'Aws' },
  { id: 'digitalocean', label: 'DO', icon: 'Digitalocean' },
  { id: 'azure', label: 'Azure', icon: 'Azure' },
  { id: 'google', label: 'GCP', icon: 'Googlecloud' },
  { id: 'vultr', label: 'Vultr', icon: 'Vultr' },
  { id: 'hetzner', label: 'Hetzner', icon: 'Hetzner' },
  { id: 'oracle', label: 'Oracle', icon: 'Database' },
  { id: 'chatgpt', label: 'ChatGPT', icon: 'Openai' },
  { id: 'claude', label: 'Claude', icon: 'Claude' },
  { id: 'gemini', label: 'Gemini', icon: 'Googlegemini' },
  { id: 'cursor', label: 'Cursor', icon: 'Cursor' },
  { id: 'capcut', label: 'CapCut', icon: 'Capcut' }
];

const AVAILABLE_ICONS = [
  { id: 'Package', name: 'General Box (Package)' },
  { id: 'Aws', name: 'AWS Cloud' },
  { id: 'Digitalocean', name: 'DigitalOcean' },
  { id: 'Azure', name: 'Microsoft Azure' },
  { id: 'Googlecloud', name: 'Google Cloud' },
  { id: 'Vultr', name: 'Vultr' },
  { id: 'Hetzner', name: 'Hetzner' },
  { id: 'Database', name: 'Oracle / Database' },
  { id: 'Openai', name: 'ChatGPT' },
  { id: 'Claude', name: 'Claude AI' },
  { id: 'Googlegemini', name: 'Google Gemini' },
  { id: 'Cursor', name: 'Cursor AI' },
  { id: 'Capcut', name: 'CapCut' }
];

function SortableCategoryRow({
  category,
  onEdit,
  onDelete
}: {
  category: CategoryItem;
  onEdit: (cat: CategoryItem) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:border-purple-500/30 transition-all duration-200"
    >
      <div {...attributes} {...listeners} className="cursor-grab text-white/20 hover:text-white/40 active:cursor-grabbing">
        <GripVertical className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <span className="font-bold text-white text-sm">{category.label}</span>
          <span className="text-[10px] text-white/30 uppercase tracking-widest font-black">ID: {category.id}</span>
        </div>
        <p className="text-xs text-white/40 mt-0.5">Icon: {category.icon}</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 rounded-lg bg-neutral-900 text-purple-400 hover:text-purple-300 border border-white/5"
          onClick={() => onEdit(category)}
        >
          <Edit2 className="w-3.5 h-3.5" />
        </Button>
        {category.id !== 'all' && (
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-lg bg-neutral-900 text-red-400 hover:text-red-300 border border-white/5"
            onClick={() => onDelete(category.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function CategoryOrderPage() {
  const { toast } = useToast();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  
  // Dialog Form fields
  const [catId, setCatId] = useState("");
  const [catLabel, setCatLabel] = useState("");
  const [catIcon, setCatIcon] = useState("Package");

  const { data: settingData, isLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/CATEGORY_ORDER"],
  });

  useEffect(() => {
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
    mutationFn: async (updatedList: CategoryItem[]) => {
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

  function handleDragEnd(event: DragEndEvent) {
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

  const handleOpenEdit = (category: CategoryItem) => {
    setEditingCategory(category);
    setCatId(category.id);
    setCatLabel(category.label);
    setCatIcon(category.icon);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
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

    const cleanId = catId.trim().toLowerCase().replace(/\s+/g, '-');
    const newCatItem: CategoryItem = {
      id: cleanId,
      label: catLabel.trim(),
      icon: catIcon
    };

    let updatedList: CategoryItem[] = [];

    if (editingCategory) {
      // Editing existing category
      updatedList = categories.map((c) => c.id === editingCategory.id ? newCatItem : c);
    } else {
      // Adding new category
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

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter drop-shadow-2xl flex items-center gap-2">
            <LayoutGrid className="w-8 h-8 text-purple-400" />
            Category Customizer
          </h1>
          <p className="text-white/40 text-sm font-medium">
            Manage product filter tabs and reorder them using drag-and-drop.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="h-11 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      <div className="glass-card border-0 p-6 rounded-3xl bg-white/[0.01] backdrop-blur-3xl space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {categories.map((category) => (
                  <SortableCategoryRow
                    key={category.id}
                    category={category}
                    onEdit={handleOpenEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass-card border-white/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-black">
              {editingCategory ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-white/70 text-xs font-bold uppercase tracking-widest">Category ID (Unique)</Label>
              <Input
                placeholder="e.g. aws, chatgpt, new-category"
                className="glass-panel h-11 border-white/10 text-white"
                value={catId}
                onChange={(e) => setCatId(e.target.value)}
                disabled={editingCategory !== null}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-white/70 text-xs font-bold uppercase tracking-widest">Display Label</Label>
              <Input
                placeholder="e.g. AWS Cloud, ChatGPT, New Tag"
                className="glass-panel h-11 border-white/10 text-white"
                value={catLabel}
                onChange={(e) => setCatLabel(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-white/70 text-xs font-bold uppercase tracking-widest">Category Icon</Label>
              <select
                className="w-full h-11 bg-neutral-900 border border-white/10 rounded-lg px-3 text-white text-sm focus:outline-none focus:border-purple-500/50"
                value={catIcon}
                onChange={(e) => setCatIcon(e.target.value)}
              >
                {AVAILABLE_ICONS.map((i) => (
                  <option key={i.id} value={i.id}>{i.name}</option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="text-white/60 hover:text-white">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-6 shadow-lg shadow-purple-500/20"
            >
              <Save className="w-4 h-4 mr-2" /> Save Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
