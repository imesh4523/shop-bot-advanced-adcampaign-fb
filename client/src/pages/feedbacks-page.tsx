import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import {
  Heart,
  Upload,
  Trash2,
  Loader2,
  RefreshCw,
  Scissors,
  Check,
  Eye,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createWorker } from "tesseract.js";

interface Feedback {
  id: number;
  title: string | null;
  imageUrl: string;
  createdAt: string;
}

interface BlurBox {
  x: number;
  y: number;
  w: number;
  h: number;
  isAuto?: boolean;
}

export default function FeedbacksPage() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  // Canvas operations
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [blurBoxes, setBlurBoxes] = useState<BlurBox[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });
  
  // Status states
  const [ocrProgress, setOcrProgress] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showPreviewUrl, setShowPreviewUrl] = useState<string | null>(null);

  // Fetch feedbacks query
  const { data: feedbacks = [], isLoading } = useQuery<Feedback[]>({
    queryKey: ["/api/feedbacks"],
  });

  // Create feedback record mutation
  const createFeedbackMutation = useMutation({
    mutationFn: async (data: { title: string; imageUrl: string }) => {
      const response = await fetch("/api/feedbacks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to save feedback record");
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedbacks"] });
      toast({
        title: "Success",
        description: "Customer feedback proof uploaded successfully!",
      });
      resetUploader();
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to upload feedback.",
        variant: "destructive",
      });
    },
  });

  // Delete feedback record mutation
  const deleteFeedbackMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/feedbacks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete feedback");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedbacks"] });
      toast({
        title: "Deleted",
        description: "Feedback proof deleted successfully.",
      });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.message || "Failed to delete feedback.",
        variant: "destructive",
      });
    },
  });

  // File Select Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      
      const img = new Image();
      img.onload = () => {
        setImgElement(img);
        setBlurBoxes([]);
        setShowPreviewUrl(null);
        runOcrAndDetect(url, img.width, img.height);
      };
      img.src = url;
    }
  };

  // Run OCR to find phone numbers
  const runOcrAndDetect = async (src: string, originalWidth: number, originalHeight: number) => {
    setOcrProgress("Initializing OCR Scanner...");
    try {
      const worker = await createWorker("eng");
      setOcrProgress("Scanning image text...");
      const { data } = await worker.recognize(src);
      setOcrProgress("Processing phone number coordinates...");
      
      const detectedBoxes: BlurBox[] = [];
      const words = data.words || [];

      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const cleanText = word.text.replace(/[^0-9+]/g, "");

        // Match complete Sri Lankan mobile formats in single word (e.g. 0777123456 or +94777123456)
        if (/^(?:\+94|0)7[0-8]\d{7}$/.test(cleanText)) {
          const { x0, y0, x1, y1 } = word.bbox;
          const w = x1 - x0;
          const h = y1 - y0;
          
          // Blur the right 70% of the box (the last 7 digits)
          detectedBoxes.push({
            x: x0 + w * 0.3,
            y: y0,
            w: w * 0.7,
            h: h,
            isAuto: true,
          });
        }

        // Match multi-part words (e.g., ["+94", "77", "726", "2726"] or ["077", "726", "2726"])
        if (i < words.length - 2) {
          const w1 = words[i].text.replace(/[^0-9+]/g, "");
          const w2 = words[i + 1].text.replace(/[^0-9]/g, "");
          const w3 = words[i + 2].text.replace(/[^0-9]/g, "");

          const isOperator = /^(?:\+94|0)?7[0-8]$/.test(w1) || (w1 === "+94" && /^[7][0-8]$/.test(w2));

          if (isOperator) {
            let digitIndex1 = i + 2;
            let digitIndex2 = i + 3;

            if (w1 === "+94" && /^[7][0-8]$/.test(w2) && i < words.length - 3) {
              digitIndex1 = i + 3;
              digitIndex2 = i + 4;
            }

            if (digitIndex2 < words.length) {
              const num1 = words[digitIndex1];
              const num2 = words[digitIndex2];
              const cleanNum1 = num1.text.replace(/[^0-9]/g, "");
              const cleanNum2 = num2.text.replace(/[^0-9]/g, "");

              if (cleanNum1.length === 3 && cleanNum2.length === 4) {
                // Blur the last 7 digits bounding boxes
                detectedBoxes.push({
                  x: num1.bbox.x0,
                  y: num1.bbox.y0,
                  w: num1.bbox.x1 - num1.bbox.x0,
                  h: num1.bbox.y1 - num1.bbox.y0,
                  isAuto: true,
                });
                detectedBoxes.push({
                  x: num2.bbox.x0,
                  y: num2.bbox.y0,
                  w: num2.bbox.x1 - num2.bbox.x0,
                  h: num2.bbox.y1 - num2.bbox.y0,
                  isAuto: true,
                });
              }
            }
          }
        }
      }

      await worker.terminate();
      setBlurBoxes(detectedBoxes);
      setOcrProgress(null);
      
      if (detectedBoxes.length > 0) {
        toast({
          title: "Phone Numbers Detected",
          description: `Automatically found and masked ${detectedBoxes.length} phone number parts!`,
        });
      } else {
        toast({
          title: "Scan Completed",
          description: "No phone numbers automatically found. You can blur manually by clicking & dragging.",
        });
      }
    } catch (err) {
      console.error("OCR scanning error:", err);
      setOcrProgress(null);
      toast({
        title: "Scanning Failed",
        description: "Auto-scan failed. You can still blur any number manually.",
        variant: "destructive",
      });
    }
  };

  // Canvas drawing loop
  useEffect(() => {
    drawCanvas();
  }, [imgElement, blurBoxes, isDrawing, currentPos]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imgElement) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions matching image size
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;

    // 1. Draw base image
    ctx.drawImage(imgElement, 0, 0);

    // 2. Draw existing blur boxes overlays
    blurBoxes.forEach((box) => {
      ctx.fillStyle = box.isAuto ? "rgba(249, 115, 22, 0.4)" : "rgba(168, 85, 247, 0.4)";
      ctx.strokeStyle = box.isAuto ? "rgb(249, 115, 22)" : "rgb(168, 85, 247)";
      ctx.lineWidth = Math.max(2, imgElement.width / 400);
      
      // Draw highlighted fill and border
      ctx.fillRect(box.x, box.y, box.w, box.h);
      ctx.strokeRect(box.x, box.y, box.w, box.h);
      
      // Draw a tiny text indicator
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.max(10, imgElement.width / 60)}px sans-serif`;
      ctx.fillText(
        box.isAuto ? "Auto Blur" : "Manual Blur",
        box.x + 4,
        box.y + Math.max(12, imgElement.width / 50)
      );
    });

    // 3. Draw active drawing box
    if (isDrawing) {
      ctx.strokeStyle = "rgba(168, 85, 247, 0.8)";
      ctx.lineWidth = Math.max(2, imgElement.width / 400);
      ctx.setLineDash([6, 6]);
      
      const x = Math.min(startPos.x, currentPos.x);
      const y = Math.min(startPos.y, currentPos.y);
      const w = Math.abs(startPos.x - currentPos.x);
      const h = Math.abs(startPos.y - currentPos.y);
      
      ctx.fillStyle = "rgba(168, 85, 247, 0.2)";
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
      ctx.setLineDash([]);
    }
  };

  // Mouse coordinate mapping
  const getCanvasMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Canvas Mouse Events
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!imgElement) return;
    const pos = getCanvasMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentPos(pos);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const pos = getCanvasMousePos(e);
    setCurrentPos(pos);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    const pos = getCanvasMousePos(e);
    const x = Math.min(startPos.x, pos.x);
    const y = Math.min(startPos.y, pos.y);
    const w = Math.abs(startPos.x - pos.x);
    const h = Math.abs(startPos.y - pos.y);

    // Only add if dragging was large enough
    if (w > 5 && h > 5) {
      setBlurBoxes([...blurBoxes, { x, y, w, h, isAuto: false }]);
    }
  };

  // Apply Blurring filters directly to image canvas
  const applyBlurAndExport = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      const img = imgElement;
      if (!canvas || !img) {
        reject(new Error("Canvas or image element is missing"));
        return;
      }

      // Create a clean canvas containing only the image (without highlighted red overlays)
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = img.width;
      exportCanvas.height = img.height;
      
      const ctx = exportCanvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get 2D context"));
        return;
      }

      // Draw baseline image
      ctx.drawImage(img, 0, 0);

      // Draw blurred regions
      blurBoxes.forEach((box) => {
        // 1. Create a temporary sub-canvas containing only the rectangle region to blur
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = box.w;
        tempCanvas.height = box.h;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          // Draw region from exportCanvas onto tempCanvas
          tempCtx.drawImage(
            exportCanvas,
            box.x, box.y, box.w, box.h,
            0, 0, box.w, box.h
          );

          // 2. Draw back the region with blur filter applied
          ctx.save();
          // Adjust blur amount dynamically based on image size
          const blurSize = Math.max(10, img.width / 50);
          ctx.filter = `blur(${blurSize}px)`;
          ctx.drawImage(tempCanvas, box.x, box.y, box.w, box.h);
          ctx.restore();
        }
      });

      // 3. Compress using toBlob to reduce size dramatically while keeping quality
      exportCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to compress canvas image"));
          }
        },
        "image/jpeg",
        0.85 // High quality (85%) compression
      );
    });
  };

  // Upload Logic
  const handleUpload = async () => {
    if (!title) {
      toast({
        title: "Required Field",
        description: "Please enter a feedback title/caption.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // 1. Apply blur filters and compress client-side
      const compressedBlob = await applyBlurAndExport();
      
      // 2. Create Multipart Form upload payload
      const formData = new FormData();
      formData.append("image", compressedBlob, "customer-proof.jpg");

      // 3. Post to existing upload endpoint
      const uploadResponse = await fetch("/api/settings/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload compressed image file");
      }

      const { imageUrl } = await uploadResponse.json();

      // 4. Create database feedback entry
      await createFeedbackMutation.mutateAsync({ title, imageUrl });
    } catch (err: any) {
      console.error("Upload process error:", err);
      toast({
        title: "Upload Failed",
        description: err.message || "An error occurred during compression or upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const resetUploader = () => {
    setSelectedFile(null);
    setImageSrc(null);
    setImgElement(null);
    setBlurBoxes([]);
    setTitle("");
    setShowPreviewUrl(null);
  };

  return (
    <div className="space-y-8 p-6 text-white bg-[#06040a] min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight leading-none bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
          Customer Feedbacks & Proofs
        </h1>
        <p className="text-sm font-bold text-white/50 tracking-wide uppercase">
          Compress and auto-mask/blur customer phone numbers instantly
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Management / Input */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-[#0f0a1a] border-white/5 shadow-2xl rounded-3xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
            <CardHeader>
              <CardTitle className="text-white font-black">Upload Customer Proof</CardTitle>
              <CardDescription className="text-white/40">
                Select feedback screenshot. Phone numbers are automatically detected and masked.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-purple-400 tracking-wider">
                  Feedback Title / Caption
                </label>
                <Input
                  placeholder="e.g. Dialogue Router Purchase Proof - RS 8500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-purple-400 tracking-wider block">
                  Feedback Screenshot
                </label>
                {!imageSrc ? (
                  <div className="border-2 border-dashed border-white/10 hover:border-purple-500/40 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative group min-h-48">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-white/20 group-hover:text-purple-400 mb-2 transition-colors duration-300" />
                    <span className="text-xs font-black text-white/40 group-hover:text-white transition-colors duration-300">
                      Drag & drop or Click to choose screenshot
                    </span>
                    <span className="text-[10px] font-bold text-white/20 mt-1 uppercase tracking-wider">
                      Supports files up to 10MB
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={resetUploader}
                      className="flex-1 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                      Choose Different Image
                    </Button>
                    {blurBoxes.length > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setBlurBoxes([])}
                        className="rounded-xl border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10"
                        title="Clear Blur boxes"
                      >
                        Clear Blurs
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {imageSrc && (
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-start gap-2 p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl text-xs font-medium text-purple-200">
                    <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white mb-0.5">Mask Phone Numbers</p>
                      <p className="text-white/60">
                        Drag your mouse over the image canvas on the right to manually draw additional blur zones.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleUpload}
                    disabled={isUploading || isProcessing}
                    className="w-full rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Uploading Compressed JPG...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Apply Blur & Upload Instantly
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Canvas workspace or showcase list */}
        <div className="lg:col-span-2 space-y-6">
          {imageSrc ? (
            <Card className="bg-[#0f0a1a] border-white/5 shadow-2xl rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" />
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-white font-black">Image Canvas Workspace</CardTitle>
                  <CardDescription className="text-white/40">
                    Auto-scan status: {ocrProgress ? <span className="text-orange-400 animate-pulse font-bold">{ocrProgress}</span> : <span className="text-green-400 font-bold">Ready / Interactive</span>}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6 bg-black/40">
                <div className="max-h-[60vh] max-w-full overflow-auto rounded-xl border border-white/10 relative">
                  {ocrProgress && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
                      <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
                      <span className="text-sm font-bold text-white">{ocrProgress}</span>
                    </div>
                  )}
                  <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    className="max-w-full h-auto cursor-crosshair block"
                  />
                </div>
                <div className="flex gap-4 mt-4 text-[10px] uppercase tracking-wider font-black text-white/40">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block" />
                    Orange: Detected Numbers
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-purple-500 inline-block" />
                    Purple: Custom Blur Rectangles
                  </span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-[#0f0a1a] border-white/5 shadow-2xl rounded-3xl">
              <CardHeader>
                <CardTitle className="text-white font-black">Current Feedbacks Grid</CardTitle>
                <CardDescription className="text-white/40">
                  View and manage currently uploaded customer proofs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  </div>
                ) : feedbacks.length === 0 ? (
                  <div className="text-center py-10 text-white/20 uppercase tracking-widest text-xs font-black">
                    No customer proofs uploaded yet
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {feedbacks.map((item) => (
                      <div
                        key={item.id}
                        className="group relative bg-[#06040a] rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/20 transition-all duration-300 flex flex-col"
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden relative">
                          <img
                            src={item.imageUrl}
                            alt={item.title || "Feedback"}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() => deleteFeedbackMutation.mutate(item.id)}
                              disabled={deleteFeedbackMutation.isPending}
                              className="rounded-xl"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="font-bold text-xs text-white truncate">{item.title}</p>
                          <p className="text-[9px] font-bold text-purple-400 mt-0.5">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
