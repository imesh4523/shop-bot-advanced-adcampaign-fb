import { useState, useEffect } from "react";
import { useProducts, useCreateProduct, useDeleteProduct } from "@/hooks/use-products";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product, InsertProduct, Credential, InsertCredential } from "@shared/schema";
import { api, buildUrl } from "@shared/routes";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Trash, Search, Server, Cloud, Shield, Copy, Key, Loader2, Trash2, Edit2, Megaphone, MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertProductSchema, insertCredentialSchema } from "@shared/schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

function CredentialsDialog({ product }: { product: Product }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const { data: credentials, isLoading } = useQuery<Credential[]>({
    queryKey: [buildUrl(api.credentials.list.path, { productId: product.id })],
    enabled: open,
  });

  const form = useForm<InsertCredential>({
    resolver: zodResolver(insertCredentialSchema),
    defaultValues: {
      productId: product.id,
      content: "",
      status: "available",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCredential) => {
      await apiRequest("POST", api.credentials.create.path, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [buildUrl(api.credentials.list.path, { productId: product.id })] });
      form.reset();
      toast({ title: "Credential added successfully" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", buildUrl(api.credentials.delete.path, { id }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [buildUrl(api.credentials.list.path, { productId: product.id })] });
      toast({ title: "Credential deleted" });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="rounded-lg px-2.5 py-2 text-xs font-bold text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer flex items-center gap-2 w-full justify-start">
          <Key className="w-3.5 h-3.5 text-blue-400" />
          Manage Credentials
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel border-white/10 bg-background/95 backdrop-blur-3xl sm:max-w-[600px] rounded-3xl p-8 shadow-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-black text-white tracking-tighter">Manage Credentials - {product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 pt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Add New Credential</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Login: user&#10;Pass: secret" 
                        className="glass-panel rounded-xl border-white/5 bg-white/[0.02] text-xs text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all font-mono min-h-[100px] py-3"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 font-bold text-xs" />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={createMutation.isPending} className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:opacity-90 font-black uppercase tracking-widest text-[9px] h-10 rounded-xl shadow-lg transition-all active:scale-95">
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Credential
              </Button>
            </form>
          </Form>

          <div className="border border-white/5 rounded-xl overflow-hidden bg-white/[0.01]">
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[9px] py-3">Content</TableHead>
                  <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[9px] py-3">Status</TableHead>
                  <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[9px] text-right py-3 pr-4">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-white/20 text-xs">Loading...</TableCell>
                  </TableRow>
                ) : credentials?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-white/20 text-xs font-black uppercase tracking-tighter">No credentials yet</TableCell>
                  </TableRow>
                ) : (
                  credentials?.map((cred) => (
                    <TableRow key={cred.id} className="border-white/5 hover:bg-white/[0.03]">
                      <TableCell className="font-mono text-[10px] text-white/60 max-w-[250px] truncate py-3">{cred.content}</TableCell>
                      <TableCell className="py-3">
                        <Badge variant="outline" className={`border-0 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${cred.status === 'available' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                          {cred.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right py-3 pr-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => deleteMutation.mutate(cred.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-3.5 h-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const formatProductPrice = (priceInCents: number, currency: string) => {
  const amount = priceInCents / 100;
  if (currency === 'LKR') return `Rs. ${amount.toFixed(2)}`;
  if (currency === 'USDT') return `₮ ${amount.toFixed(2)}`;
  if (currency === 'TRX') return `${amount.toFixed(2)} TRX`;
  if (currency === 'INR') return `₹${amount.toFixed(2)}`;
  if (currency === 'EUR') return `€${amount.toFixed(2)}`;
  return `$${amount.toFixed(2)}`;
};

// Zod schema for the form (needs coercion for number)
const productFormSchema = insertProductSchema.extend({
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  currency: z.string().default("USD"),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (products) setSortedProducts(products);
  }, [products]);

  const reorderMutation = useMutation({
    mutationFn: async (orderedIds: number[]) => {
      await apiRequest("POST", "/api/products/reorder", { orderedIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.products.list.path] });
      toast({ title: "✅ Order saved", description: "Product order updated successfully." });
    },
    onError: () => {
      toast({ title: "Failed to save order", variant: "destructive" });
      if (products) setSortedProducts(products);
    },
  });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
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

  const [isCustomBroadcastOpen, setIsCustomBroadcastOpen] = useState(false);

  const broadcastMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/broadcast/availability");
    },
    onSuccess: () => {
      toast({ title: "Availability broadcast sent to all users" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Broadcast failed", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  const filteredProducts = (search
    ? sortedProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.type.toLowerCase().includes(search.toLowerCase())
      )
    : sortedProducts) || [];

  return (
    <div className="space-y-8 animate-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter drop-shadow-2xl">
            Products
          </h1>
          <p className="text-white/40 text-sm font-medium">Manage your cloud account inventory. <span className="text-purple-400/60 inline-flex items-center gap-1"><GripVertical className="w-3 h-3 inline" />Drag rows to reorder.</span></p>
        </div>
          <div className="flex items-center gap-3">
            <CreateProductDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
            <Button 
              variant="outline"
              onClick={() => {
                if (confirm("Send availability list to all bot users?")) {
                  broadcastMutation.mutate();
                }
              }}
              disabled={broadcastMutation.isPending}
              className="h-11 px-6 rounded-xl border-white/10 bg-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
            >
              {broadcastMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Megaphone className="h-4 w-4" />
              )}
              Broadcast Stock
            </Button>
            <Button 
              variant="outline"
              onClick={() => setIsCustomBroadcastOpen(true)}
              className="h-11 px-6 rounded-xl border-white/10 bg-white/5 text-white font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Custom Broadcast
            </Button>
            <CustomBroadcastDialog open={isCustomBroadcastOpen} onOpenChange={setIsCustomBroadcastOpen} />
          </div>
      </div>

      <div className="glass-card border-0 rounded-2xl overflow-hidden shadow-2xl bg-white/[0.01] backdrop-blur-3xl">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Table>
          <TableHeader>
            <TableRow className="border-white/5 hover:bg-transparent">
              <TableHead className="w-8 pl-4 py-4"></TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] pl-2 py-4">Product</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] py-4">Category</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] py-4">Price</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] py-4">Status</TableHead>
              <TableHead className="text-white/40 font-bold uppercase tracking-widest text-[10px] text-right pr-6 py-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-white/5">
                  <TableCell className="pl-4 py-4"><Skeleton className="h-5 w-5 bg-white/5 rounded" /></TableCell>
                  <TableCell className="pl-2 py-4"><Skeleton className="h-10 w-40 bg-white/5 rounded-xl" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 bg-white/5 rounded-lg" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12 bg-white/5 rounded-lg" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20 bg-white/5 rounded-lg" /></TableCell>
                  <TableCell className="pr-6"><Skeleton className="h-8 w-8 ml-auto rounded-lg bg-white/5" /></TableCell>
                </TableRow>
              ))
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-48 text-center text-white/20 font-black text-sm uppercase tracking-tighter">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              <SortableContext items={filteredProducts.map((p) => p.id)} strategy={verticalListSortingStrategy}>
                {filteredProducts.map((product) => (
                  <SortableProductRow key={product.id} product={product} />
                ))}
              </SortableContext>
            )}
          </TableBody>
        </Table>
        </DndContext>
      </div>
    </div>
  );
}

function SortableProductRow({ product }: { product: Product }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: product.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? "rgba(139,92,246,0.08)" : undefined,
    zIndex: isDragging ? 10 : undefined,
  };
  return (
    <TableRow ref={setNodeRef} style={style} className="border-white/5 hover:bg-white/[0.03] transition-all duration-200 group">
      <TableCell className="pl-4 py-4 w-8">
        <button
          {...attributes}
          {...listeners}
          className="text-white/20 hover:text-purple-400 cursor-grab active:cursor-grabbing transition-colors p-1 rounded"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </TableCell>
      <TableCell className="pl-2 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform duration-300 shadow-md">
            <Server className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-0">
            <span className="text-sm font-black text-white tracking-tight leading-tight">{product.name}</span>
            <span className="text-[10px] text-white/30 font-medium truncate max-w-[200px] leading-tight">{product.description}</span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="outline" className="border-white/10 text-white/60 bg-white/5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest">
          {product.type}
        </Badge>
      </TableCell>
      <TableCell className="font-black text-white text-base tracking-tighter">
        {formatProductPrice(product.price, product.currency || 'USD')}
      </TableCell>
      <TableCell>
        <StatusBadge status={product.status} />
      </TableCell>
      <TableCell className="text-right pr-6">
        <ProductActions product={product} />
      </TableCell>
    </TableRow>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "available") {
    return (
      <Badge className="bg-green-500/10 text-green-400 border-green-500/20 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest no-default-hover-elevate">
        Available
      </Badge>
    );
  }
  return (
    <Badge className="bg-white/5 text-white/30 border-white/5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest no-default-hover-elevate">
      Sold
    </Badge>
  );
}

function ProductActions({ product }: { product: any }) {
  const { mutate: deleteProduct, isPending } = useDeleteProduct();
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl text-white/20 hover:text-white hover:bg-white/5 transition-all">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="glass-panel border-white/10 bg-background/95 backdrop-blur-3xl rounded-xl p-1.5 shadow-4xl min-w-[160px]">
          <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-widest text-white/30 px-2.5 py-1.5">Management</DropdownMenuLabel>
          <DropdownMenuItem 
            onClick={() => setIsEditOpen(true)}
            className="rounded-lg px-2.5 py-2 text-xs font-bold text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer flex items-center gap-2"
          >
            <Edit2 className="w-3.5 h-3.5 text-blue-400" />
            Edit Product
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => navigator.clipboard.writeText(product.content)}
            className="rounded-lg px-2.5 py-2 text-xs font-bold text-white hover:bg-white/10 focus:bg-white/10 cursor-pointer flex items-center gap-2"
          >
            <Copy className="w-3.5 h-3.5 text-purple-400" />
            Copy Info
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-white/5 my-1" />
          <DropdownMenuItem 
            className="rounded-lg px-2.5 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 cursor-pointer flex items-center gap-2"
            onClick={() => {
              if (confirm("Are you sure you want to delete this product?")) {
                deleteProduct(product.id);
              }
            }}
            disabled={isPending}
          >
            <Trash className="w-3.5 h-3.5" />
            Delete Product
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditProductDialog 
        product={product} 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
      />
    </>
  );
}

function EditProductDialog({ 
  product, 
  open, 
  onOpenChange 
}: { 
  product: Product, 
  open: boolean, 
  onOpenChange: (open: boolean) => void 
}) {
  const { toast } = useToast();
  const [customType, setCustomType] = useState(
    ["AWS", "DigitalOcean", "Google Cloud", "Azure", "Linode", "ChatGPT", "Claude", "Gemini", "Cursor", "CapCut", "Other"].includes(product.type) 
      ? "" 
      : product.type
  );

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product.name,
      type: ["AWS", "DigitalOcean", "Google Cloud", "Azure", "Linode", "ChatGPT", "Claude", "Gemini", "Cursor", "CapCut", "Other"].includes(product.type) 
        ? product.type 
        : "Custom",
      description: product.description || "",
      price: product.price / 100,
      currency: product.currency || "USD",
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
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
    },
  });

  const selectedType = form.watch("type");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-white/10 bg-background/95 backdrop-blur-3xl sm:max-w-[500px] rounded-3xl p-8 shadow-4xl animate-in fade-in zoom-in duration-300">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Edit2 className="w-5 h-5" />
            </div>
            Edit Product
          </DialogTitle>
          <DialogDescription className="text-white/40 font-medium text-sm">
            Update product details for {product.name}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="AWS 10k Credits Account" className="glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all shadow-inner" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400 font-bold text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Provider</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white focus:border-purple-500/50 transition-all">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass-panel border-white/10 bg-background text-white rounded-xl">
                        <SelectItem value="AWS">AWS</SelectItem>
                        <SelectItem value="DigitalOcean">DigitalOcean</SelectItem>
                        <SelectItem value="Google Cloud">Google Cloud</SelectItem>
                        <SelectItem value="Azure">Azure</SelectItem>
                        <SelectItem value="Linode">Linode</SelectItem>
                        <SelectItem value="ChatGPT">ChatGPT</SelectItem>
                        <SelectItem value="Claude">Claude</SelectItem>
                        <SelectItem value="Gemini">Gemini</SelectItem>
                        <SelectItem value="Cursor">Cursor</SelectItem>
                        <SelectItem value="CapCut">CapCut</SelectItem>
                        <SelectItem value="Custom">Custom (Enter below)</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 font-bold text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="15.00" className="glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400 font-bold text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white focus:border-purple-500/50 transition-all">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass-panel border-white/10 bg-background text-white rounded-xl">
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="LKR">LKR (Rs)</SelectItem>
                        <SelectItem value="USDT">USDT (₮)</SelectItem>
                        <SelectItem value="TRX">TRX (TRX)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 font-bold text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {selectedType === "Custom" && (
              <FormItem className="animate-in fade-in slide-in-from-top-2">
                <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Custom Provider Type</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter custom type (e.g. Vultr, Oracle)" 
                    className="glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white focus:border-purple-500/50 transition-all"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Account details, limits, etc." 
                      className="glass-panel rounded-xl border-white/5 bg-white/[0.02] text-sm text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all min-h-[80px] py-3"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 font-bold text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t border-white/5 gap-3">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-11 px-6 rounded-xl text-white/40 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[9px]">
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending} className="h-11 px-8 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:opacity-90 font-black uppercase tracking-widest text-[9px] shadow-xl transition-all active:scale-95">
                {updateMutation.isPending ? "Updating..." : "Update Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function CustomBroadcastDialog({ 
  open, 
  onOpenChange 
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void 
}) {
  const { toast } = useToast();
  const [message, setMessage] = useState("");

  const broadcastMutation = useMutation({
    mutationFn: async (content: string) => {
      await apiRequest("POST", "/api/broadcast/custom", { message: content });
    },
    onSuccess: () => {
      toast({ title: "Custom broadcast sent to all users" });
      setMessage("");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Broadcast failed", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-panel border-white/10 bg-background/95 backdrop-blur-3xl sm:max-w-[500px] rounded-3xl p-8 shadow-4xl animate-in fade-in zoom-in duration-300">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <MessageSquare className="w-5 h-5" />
            </div>
            Custom Broadcast
          </DialogTitle>
          <DialogDescription className="text-white/40 font-medium text-sm">
            Send a custom message to all registered bot users.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Message Content</label>
            <Textarea 
              placeholder="Enter your message here... (Markdown supported)" 
              className="glass-panel rounded-xl border-white/5 bg-white/[0.02] text-sm text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all min-h-[150px] py-3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4 border-t border-white/5 gap-3">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-11 px-6 rounded-xl text-white/40 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[9px]">
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (!message.trim()) {
                  toast({ title: "Error", description: "Message cannot be empty", variant: "destructive" });
                  return;
                }
                broadcastMutation.mutate(message);
              }}
              disabled={broadcastMutation.isPending} 
              className="h-11 px-8 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:opacity-90 font-black uppercase tracking-widest text-[9px] shadow-xl transition-all active:scale-95"
            >
              {broadcastMutation.isPending ? "Sending..." : "Send Broadcast"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CreateProductDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { mutate: createProduct, isPending } = useCreateProduct();
  
  const [customType, setCustomType] = useState("");

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      type: "AWS",
      description: "",
      price: 0,
      currency: "USD",
    },
  });

  const selectedType = form.watch("type");

  function onSubmit(values: ProductFormValues) {
    const finalValues = {
      ...values,
      type: values.type === "Custom" ? customType : values.type,
      price: Math.round(values.price * 100) // Convert Dollars to Cents for storage
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
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="h-11 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-black text-xs uppercase tracking-widest shadow-lg transition-all duration-300 hover:scale-105 active:scale-95">
          <Plus className="mr-2 h-4 w-4" /> Add
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel border-white/10 bg-background/95 backdrop-blur-3xl sm:max-w-[500px] rounded-3xl p-8 shadow-4xl animate-in fade-in zoom-in duration-300">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-black text-white tracking-tighter flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white shadow-md">
              <Plus className="w-5 h-5" />
            </div>
            Create Product
          </DialogTitle>
          <DialogDescription className="text-white/40 font-medium text-sm">
            Add a new cloud account to your inventory.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="AWS 10k Credits Account" className="glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all shadow-inner" {...field} />
                  </FormControl>
                  <FormMessage className="text-red-400 font-bold text-xs" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Provider</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white focus:border-purple-500/50 transition-all">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass-panel border-white/10 bg-background text-white rounded-xl">
                        <SelectItem value="AWS">AWS</SelectItem>
                        <SelectItem value="DigitalOcean">DigitalOcean</SelectItem>
                        <SelectItem value="Google Cloud">Google Cloud</SelectItem>
                        <SelectItem value="Azure">Azure</SelectItem>
                        <SelectItem value="Linode">Linode</SelectItem>
                        <SelectItem value="ChatGPT">ChatGPT</SelectItem>
                        <SelectItem value="Claude">Claude</SelectItem>
                        <SelectItem value="Gemini">Gemini</SelectItem>
                        <SelectItem value="Cursor">Cursor</SelectItem>
                        <SelectItem value="CapCut">CapCut</SelectItem>
                        <SelectItem value="Custom">Custom (Enter below)</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 font-bold text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Price</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="15.00" className="glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-400 font-bold text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white focus:border-purple-500/50 transition-all">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="glass-panel border-white/10 bg-background text-white rounded-xl">
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="LKR">LKR (Rs)</SelectItem>
                        <SelectItem value="USDT">USDT (₮)</SelectItem>
                        <SelectItem value="TRX">TRX (TRX)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-red-400 font-bold text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {selectedType === "Custom" && (
              <FormItem className="animate-in fade-in slide-in-from-top-2">
                <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Custom Provider Type</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter custom type (e.g. Vultr, Oracle)" 
                    className="glass-panel h-11 rounded-xl border-white/5 bg-white/[0.02] text-sm text-white focus:border-purple-500/50 transition-all"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[9px] font-black uppercase tracking-widest text-white/30 ml-0.5">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Account details, limits, etc." 
                      className="glass-panel rounded-xl border-white/5 bg-white/[0.02] text-sm text-white placeholder:text-white/10 focus:border-purple-500/50 transition-all min-h-[80px] py-3"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 font-bold text-xs" />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 border-t border-white/5 gap-3">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-11 px-6 rounded-xl text-white/40 hover:text-white hover:bg-white/5 font-black uppercase tracking-widest text-[9px]">
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="h-11 px-8 rounded-xl bg-white text-black hover:bg-white/90 font-black uppercase tracking-widest text-[9px] shadow-xl">
                {isPending ? "Adding..." : "Add Product"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
