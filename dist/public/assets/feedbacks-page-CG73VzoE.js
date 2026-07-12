import { d as useToast, r as reactExports, u as useQuery, f as useMutation, j as jsxRuntimeExports, B as Button, L as LoaderCircle, C as Check, q as queryClient } from "./index-BgAAhk4T.js";
import { I as Input } from "./input-1hX8moNj.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-DX2A8Xyh.js";
import { U as Upload } from "./upload-BgN8qiSa.js";
import { I as Info } from "./info-CsyKsj5V.js";
import { T as Trash2 } from "./trash-2-ClwZZDDx.js";
function FeedbacksPage() {
  const { toast } = useToast();
  const [title, setTitle] = reactExports.useState("");
  const [selectedFile, setSelectedFile] = reactExports.useState(null);
  const [imageSrc, setImageSrc] = reactExports.useState(null);
  const canvasRef = reactExports.useRef(null);
  const [imgElement, setImgElement] = reactExports.useState(null);
  const [blurBoxes, setBlurBoxes] = reactExports.useState([]);
  const [isDrawing, setIsDrawing] = reactExports.useState(false);
  const [startPos, setStartPos] = reactExports.useState({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = reactExports.useState({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = reactExports.useState(false);
  const [showPreviewUrl, setShowPreviewUrl] = reactExports.useState(null);
  const { data: feedbacks = [], isLoading } = useQuery({
    queryKey: ["/api/feedbacks"]
  });
  const deleteFeedbackMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/feedbacks/${id}`, {
        method: "DELETE"
      });
      if (!response.ok) throw new Error("Failed to delete feedback");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/feedbacks"] });
      toast({
        title: "Deleted",
        description: "Feedback proof deleted successfully."
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message || "Failed to delete feedback.",
        variant: "destructive"
      });
    }
  });
  const handleFileChange = (e) => {
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
      };
      img.src = url;
    }
  };
  reactExports.useEffect(() => {
    drawCanvas();
  }, [imgElement, blurBoxes, isDrawing, currentPos]);
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imgElement) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    ctx.drawImage(imgElement, 0, 0);
    blurBoxes.forEach((box) => {
      ctx.fillStyle = box.isAuto ? "rgba(249, 115, 22, 0.4)" : "rgba(168, 85, 247, 0.4)";
      ctx.strokeStyle = box.isAuto ? "rgb(249, 115, 22)" : "rgb(168, 85, 247)";
      ctx.lineWidth = Math.max(2, imgElement.width / 400);
      ctx.fillRect(box.x, box.y, box.w, box.h);
      ctx.strokeRect(box.x, box.y, box.w, box.h);
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${Math.max(10, imgElement.width / 60)}px sans-serif`;
      ctx.fillText(
        box.isAuto ? "Auto Blur" : "Manual Blur",
        box.x + 4,
        box.y + Math.max(12, imgElement.width / 50)
      );
    });
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
  const getCanvasMousePos = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };
  const handleMouseDown = (e) => {
    if (!imgElement) return;
    const pos = getCanvasMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);
    setCurrentPos(pos);
  };
  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const pos = getCanvasMousePos(e);
    setCurrentPos(pos);
  };
  const handleMouseUp = (e) => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const pos = getCanvasMousePos(e);
    const x = Math.min(startPos.x, pos.x);
    const y = Math.min(startPos.y, pos.y);
    const w = Math.abs(startPos.x - pos.x);
    const h = Math.abs(startPos.y - pos.y);
    if (w > 5 && h > 5) {
      setBlurBoxes([...blurBoxes, { x, y, w, h, isAuto: false }]);
    }
  };
  const applyBlurAndExport = async () => {
    return new Promise((resolve, reject) => {
      const canvas = canvasRef.current;
      const img = imgElement;
      if (!canvas || !img) {
        reject(new Error("Canvas or image element is missing"));
        return;
      }
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = img.width;
      exportCanvas.height = img.height;
      const ctx = exportCanvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get 2D context"));
        return;
      }
      ctx.drawImage(img, 0, 0);
      blurBoxes.forEach((box) => {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = box.w;
        tempCanvas.height = box.h;
        const tempCtx = tempCanvas.getContext("2d");
        if (tempCtx) {
          tempCtx.drawImage(
            exportCanvas,
            box.x,
            box.y,
            box.w,
            box.h,
            0,
            0,
            box.w,
            box.h
          );
          ctx.save();
          const blurSize = Math.max(10, img.width / 50);
          ctx.filter = `blur(${blurSize}px)`;
          ctx.drawImage(tempCanvas, box.x, box.y, box.w, box.h);
          ctx.restore();
        }
      });
      exportCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to compress canvas image"));
          }
        },
        "image/jpeg",
        0.85
        // High quality (85%) compression
      );
    });
  };
  const handleUpload = async () => {
    if (!title) {
      toast({
        title: "Required Field",
        description: "Please enter a feedback title/caption.",
        variant: "destructive"
      });
      return;
    }
    setIsUploading(true);
    try {
      const compressedBlob = await applyBlurAndExport();
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", compressedBlob, "customer-proof.jpg");
      const response = await fetch("/api/feedbacks", {
        method: "POST",
        body: formData
      });
      if (!response.ok) {
        throw new Error("Failed to upload and process feedback proof");
      }
      await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/feedbacks"] });
      toast({
        title: "Success",
        description: "Customer feedback proof uploaded and auto-blurred successfully!"
      });
      resetUploader();
    } catch (err) {
      console.error("Upload process error:", err);
      toast({
        title: "Upload Failed",
        description: err.message || "An error occurred during compression or upload.",
        variant: "destructive"
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 p-6 text-white bg-[#06040a] min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-black tracking-tight leading-none bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent", children: "Customer Feedbacks & Proofs" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-white/50 tracking-wide uppercase", children: "Compress and auto-mask/blur customer phone numbers instantly" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-1 space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0f0a1a] border-white/5 shadow-2xl rounded-3xl overflow-hidden relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-white font-black", children: "Upload Customer Proof" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Select feedback screenshot. It will be compressed locally and phone numbers will be automatically masked on the server." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-black uppercase text-purple-400 tracking-wider", children: "Feedback Title / Caption" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. Dialogue Router Purchase Proof - RS 8500",
                value: title,
                onChange: (e) => setTitle(e.target.value),
                className: "bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/20"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-black uppercase text-purple-400 tracking-wider block", children: "Feedback Screenshot" }),
            !imageSrc ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-2 border-dashed border-white/10 hover:border-purple-500/40 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative group min-h-48", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "file",
                  accept: "image/*",
                  onChange: handleFileChange,
                  className: "absolute inset-0 opacity-0 cursor-pointer"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-8 h-8 text-white/20 group-hover:text-purple-400 mb-2 transition-colors duration-300" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-black text-white/40 group-hover:text-white transition-colors duration-300", children: "Drag & drop or Click to choose screenshot" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-white/20 mt-1 uppercase tracking-wider", children: "Supports files up to 10MB" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: resetUploader,
                  className: "flex-1 rounded-xl border-white/10 bg-white/5 text-white hover:bg-white/10",
                  children: "Choose Different Image"
                }
              ),
              blurBoxes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  onClick: () => setBlurBoxes([]),
                  className: "rounded-xl border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10",
                  title: "Clear Blur boxes",
                  children: "Clear Blurs"
                }
              )
            ] })
          ] }),
          imageSrc && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4 border-t border-white/5 space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 p-3 bg-purple-500/5 border border-purple-500/10 rounded-xl text-xs font-medium text-purple-200", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-4 h-4 text-purple-400 shrink-0 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-white mb-0.5", children: "Mask Phone Numbers" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60", children: "Drag your mouse over the image canvas on the right to manually draw additional blur zones." })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleUpload,
                disabled: isUploading,
                className: "w-full rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black",
                children: isUploading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin mr-2" }),
                  "Scanning & Blurring on Server..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4 h-4 mr-2" }),
                  "Apply Blur & Upload Instantly"
                ] })
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 space-y-6", children: imageSrc ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0f0a1a] border-white/5 shadow-2xl rounded-3xl overflow-hidden relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "flex flex-row items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-white font-black", children: "Image Canvas Workspace" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Workspace is active. Drag your mouse to manually blur extra areas." })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-center justify-center p-6 bg-black/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[60vh] max-w-full overflow-auto rounded-xl border border-white/10 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "canvas",
            {
              ref: canvasRef,
              onMouseDown: handleMouseDown,
              onMouseMove: handleMouseMove,
              onMouseUp: handleMouseUp,
              className: "max-w-full h-auto cursor-crosshair block"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 mt-4 text-[10px] uppercase tracking-wider font-black text-white/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded bg-purple-500 inline-block" }),
            "Purple: Custom Blur Rectangles"
          ] }) })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-[#0f0a1a] border-white/5 shadow-2xl rounded-3xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-white font-black", children: "Current Feedbacks Grid" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "View and manage currently uploaded customer proofs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-purple-400" }) }) : feedbacks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-10 text-white/20 uppercase tracking-widest text-xs font-black", children: "No customer proofs uploaded yet" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: feedbacks.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "group relative bg-[#06040a] rounded-2xl overflow-hidden border border-white/5 hover:border-purple-500/20 transition-all duration-300 flex flex-col",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "aspect-[4/3] w-full overflow-hidden relative", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: item.imageUrl,
                    alt: item.title || "Feedback",
                    className: "w-full h-full object-cover"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "destructive",
                    size: "icon",
                    onClick: () => deleteFeedbackMutation.mutate(item.id),
                    disabled: deleteFeedbackMutation.isPending,
                    className: "rounded-xl",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                  }
                ) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-xs text-white truncate", children: item.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] font-bold text-purple-400 mt-0.5", children: new Date(item.createdAt).toLocaleDateString() })
              ] })
            ]
          },
          item.id
        )) }) })
      ] }) })
    ] })
  ] });
}
export {
  FeedbacksPage as default
};
