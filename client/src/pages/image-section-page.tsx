import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, ArrowUp, ArrowDown, Upload, Check, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

export default function ImageSectionPage() {
  const { toast } = useToast();
  const [imageList, setImageList] = useState<string[]>([]);
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  
  // Crop states
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load current banner images setting
  const { data: bannerSetting, isLoading: bannerLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/BANNER_IMAGES"],
  });

  useEffect(() => {
    if (bannerSetting?.value) {
      try {
        const parsed = JSON.parse(bannerSetting.value);
        if (Array.isArray(parsed)) {
          setImageList(parsed);
        }
      } catch (e) {
        console.error("Failed to parse banner images:", e);
      }
    }
  }, [bannerSetting]);

  // Mutation to save the image list to settings
  const saveImagesMutation = useMutation({
    mutationFn: async (newList: string[]) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "BANNER_IMAGES",
        value: JSON.stringify(newList),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/BANNER_IMAGES"] });
      toast({
        title: "Banners Saved",
        description: "Banners list updated successfully on the store.",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Failed to save",
        description: err.message || "An error occurred.",
        variant: "destructive",
      });
    }
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImageSrc(reader.result as string);
        setZoom(1);
        setPan({ x: 0, y: 0 });
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Draw crop preview on Canvas
  useEffect(() => {
    if (!isCropModalOpen || !selectedImageSrc || !canvasRef.current) return;

    const img = new Image();
    img.src = selectedImageSrc;
    img.onload = () => {
      imageRef.current = img;
      drawCanvas();
    };
  }, [isCropModalOpen, selectedImageSrc, zoom, pan]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate centering dimensions for cover fit at scale = 1
    const targetRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let drawWidth = canvas.width;
    let drawHeight = canvas.height;
    let drawX = 0;
    let drawY = 0;

    if (imgRatio > targetRatio) {
      // Image is wider than crop box
      drawWidth = canvas.height * imgRatio;
      drawX = (canvas.width - drawWidth) / 2;
    } else {
      // Image is taller than crop box
      drawHeight = canvas.width / imgRatio;
      drawY = (canvas.height - drawHeight) / 2;
    }

    ctx.save();
    
    // Apply pan & zoom relative to center
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    ctx.translate(centerX + pan.x, centerY + pan.y);
    ctx.scale(zoom, zoom);
    ctx.translate(-centerX, -centerY);

    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    
    ctx.restore();
  };

  // Dragging event handlers for canvas panning
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Upload cropped banner to backend
  const handleCropSave = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsUploading(true);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast({ title: "Error", description: "Failed to generate cropped image", variant: "destructive" });
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", blob, "banner.jpg");

      try {
        const response = await fetch("/api/settings/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();
        const newUrl = data.imageUrl;

        const updatedList = [...imageList, newUrl];
        setImageList(updatedList);
        saveImagesMutation.mutate(updatedList);
        setIsCropModalOpen(false);
      } catch (err: any) {
        toast({
          title: "Upload Failed",
          description: err.message || "Failed to upload image banner.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }, "image/jpeg", 0.92);
  };

  // Banner list controls
  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const list = [...imageList];
    const temp = list[index];
    list[index] = list[index - 1];
    list[index - 1] = temp;
    setImageList(list);
    saveImagesMutation.mutate(list);
  };

  const handleMoveDown = (index: number) => {
    if (index === imageList.length - 1) return;
    const list = [...imageList];
    const temp = list[index];
    list[index] = list[index + 1];
    list[index + 1] = temp;
    setImageList(list);
    saveImagesMutation.mutate(list);
  };

  const handleDelete = (index: number) => {
    const list = imageList.filter((_, idx) => idx !== index);
    setImageList(list);
    saveImagesMutation.mutate(list);
  };

  return (
    <div className="space-y-10 animate-in">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-2xl uppercase italic">
            Image Section
          </h1>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
            Manage custom sliding banners for the storefront header
          </p>
        </div>
        
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest text-xs h-12 px-6 shadow-xl shadow-purple-600/20 active:scale-95 transition-all"
        >
          <Upload className="w-4 h-4 mr-2" /> Upload Banner
        </Button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <Card className="glass-card border-0 overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-indigo-500/5 to-transparent pointer-events-none" />
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            Active Banners
          </CardTitle>
          <CardDescription>
            Banners will be shown in the storefront header slide in this order. Upload rectangular images for the best visual experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bannerLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
          ) : imageList.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto text-purple-400">
                <Upload className="w-10 h-10" />
              </div>
              <p className="text-white/40 font-black uppercase tracking-widest text-xs">
                No custom banner images uploaded yet.
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl border-white/10 hover:bg-white/5 text-white text-xs font-black uppercase tracking-widest"
              >
                Upload first image
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {imageList.map((imgUrl, index) => (
                <div
                  key={index}
                  className="group relative bg-[#0f0a1a] rounded-[2rem] border border-white/5 overflow-hidden flex flex-col md:flex-row md:items-center justify-between p-4 gap-6 hover:border-purple-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-6 flex-1">
                    {/* Position badge */}
                    <div className="w-10 h-10 rounded-xl bg-purple-600/10 text-purple-400 flex items-center justify-center font-black text-lg">
                      {index + 1}
                    </div>

                    {/* Preview banner */}
                    <div className="w-full md:w-60 h-28 rounded-2xl overflow-hidden border border-white/10 relative">
                      <img
                        src={imgUrl}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    
                    <span className="text-xs font-mono text-white/30 truncate max-w-xs hidden lg:block">
                      {imgUrl}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="rounded-xl hover:bg-white/5 disabled:opacity-20"
                    >
                      <ArrowUp className="w-4 h-4 text-white" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleMoveDown(index)}
                      disabled={index === imageList.length - 1}
                      className="rounded-xl hover:bg-white/5 disabled:opacity-20"
                    >
                      <ArrowDown className="w-4 h-4 text-white" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(index)}
                      className="rounded-xl hover:bg-red-500/10 text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visual Canvas Crop Modal */}
      <Dialog open={isCropModalOpen} onOpenChange={setIsCropModalOpen}>
        <DialogContent className="bg-[#0f0a1a] border border-white/10 text-white max-w-3xl rounded-[2.5rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight italic text-purple-400">
              Crop Store Banner
            </DialogTitle>
            <DialogDescription className="text-white/40">
              Pan by dragging the image on the canvas. Use the slider below to zoom.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 my-6">
            {/* Interactive Canvas container */}
            <div className="relative border border-white/10 rounded-[2rem] overflow-hidden bg-neutral-950 flex items-center justify-center h-[340px]">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={660}
                  height={300}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="cursor-move max-w-full"
                />
                {/* Visual border guide overlay (not drawn on canvas pixels, so it won't be exported) */}
                <div className="absolute inset-0 pointer-events-none border-2 border-purple-500 rounded-sm" />
              </div>
            </div>

            {/* Scale/Zoom Control */}
            <div className="space-y-3 px-2">
              <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-white/50">
                <span className="flex items-center gap-1.5"><ZoomIn className="w-3.5 h-3.5" /> Scale</span>
                <span>{Math.round(zoom * 100)}%</span>
              </div>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.01}
                onValueChange={(val) => setZoom(val[0])}
                className="text-purple-600"
              />
            </div>
          </div>

          <DialogFooter className="flex gap-3 mt-4 justify-end">
            <Button
              variant="outline"
              disabled={isUploading}
              onClick={() => setIsCropModalOpen(false)}
              className="rounded-2xl border-white/10 text-white hover:bg-white/5 font-bold text-xs uppercase tracking-widest px-6"
            >
              Cancel
            </Button>
            <Button
              disabled={isUploading}
              onClick={handleCropSave}
              className="rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-widest px-6 shadow-xl"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              Crop & Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
