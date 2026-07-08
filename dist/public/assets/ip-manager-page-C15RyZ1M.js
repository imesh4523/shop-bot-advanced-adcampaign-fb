import { c as createLucideIcon, e as useToast, N as useQueryClient, r as reactExports, u as useQuery, f as useMutation, j as jsxRuntimeExports, G as Globe, B as Button, X, L as LoaderCircle } from "./index-BkoZG9Fa.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-C6yw3WxF.js";
import { T as Textarea } from "./textarea-CQRjhgM-.js";
import { I as Input } from "./input-ON1LrtA4.js";
import { B as Badge } from "./badge-BoMHwTiS.js";
import { S as Skeleton } from "./skeleton-R0Q4TAY3.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter } from "./dialog-btiI1mDC.js";
import { C as CircleCheckBig } from "./circle-check-big-DMtqarcp.js";
import { E as Eye } from "./eye-CYOvX0V9.js";
import { T as TriangleAlert } from "./triangle-alert-EYf3XfO4.js";
import { C as Clock } from "./clock-Ca-be91g.js";
import { S as Search } from "./search-BvKLYhYz.js";
import { S as Save } from "./save-2EbOrlvy.js";
import { T as Trash2 } from "./trash-2-DIEYE0o2.js";
import { f as format } from "./format-Fqx7OmaC.js";
const Camera = createLucideIcon("Camera", [
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
      key: "1tc9qg"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3", key: "1vg3eu" }]
]);
const CirclePlus = createLucideIcon("CirclePlus", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 12h8", key: "1wcyev" }],
  ["path", { d: "M12 8v8", key: "napkw2" }]
]);
const PenLine = createLucideIcon("PenLine", [
  ["path", { d: "M12 20h9", key: "t2du7b" }],
  [
    "path",
    {
      d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",
      key: "1ykcvy"
    }
  ]
]);
function IpManagerPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [ipInput, setIpInput] = reactExports.useState("");
  const [notesInput, setNotesInput] = reactExports.useState("");
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [checkResults, setCheckResults] = reactExports.useState([]);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editingNotes, setEditingNotes] = reactExports.useState("");
  const [isScannerOpen, setIsScannerOpen] = reactExports.useState(false);
  const [isLoadingOcr, setIsLoadingOcr] = reactExports.useState(false);
  const [detectedIps, setDetectedIps] = reactExports.useState([]);
  const videoRef = reactExports.useRef(null);
  const canvasRef = reactExports.useRef(null);
  const [stream, setStream] = reactExports.useState(null);
  const autoScanIntervalRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    let styleTag = document.getElementById("scanner-style-overlay");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "scanner-style-overlay";
      styleTag.innerHTML = `
        @keyframes scan-laser {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
          100% { top: 0%; opacity: 0.8; }
        }
        .scanning-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(to right, transparent, #a855f7, transparent);
          box-shadow: 0 0 10px #a855f7, 0 0 20px #a855f7;
          animation: scan-laser 2.5s infinite linear;
          pointer-events: none;
        }
      `;
      document.head.appendChild(styleTag);
    }
  }, []);
  const loadTesseract = () => {
    return new Promise((resolve, reject) => {
      if (window.Tesseract) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load OCR scanner library"));
      document.head.appendChild(script);
    });
  };
  const autoScanFrame = async () => {
    if (!videoRef.current || !canvasRef.current || isLoadingOcr) return;
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      if (canvas.width === 0 || canvas.height === 0) return;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/png");
      const Tesseract = window.Tesseract;
      if (!Tesseract) return;
      const result = await Tesseract.recognize(dataUrl, "eng");
      const text = result?.data?.text || "";
      const cleanedText = text.replace(/[,;]/g, ".");
      const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
      const matches = cleanedText.match(ipRegex) || [];
      const uniqueMatches = Array.from(new Set(matches));
      if (uniqueMatches.length > 0) {
        setDetectedIps((prev) => {
          const combined = /* @__PURE__ */ new Set([...prev, ...uniqueMatches]);
          return Array.from(combined);
        });
      }
    } catch (err) {
      console.error("Auto scan frame failed:", err);
    }
  };
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      if (autoScanIntervalRef.current) clearInterval(autoScanIntervalRef.current);
      autoScanIntervalRef.current = setInterval(() => {
        autoScanFrame();
      }, 1500);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Camera Access Error",
        description: "Could not access camera. Please check permissions."
      });
    }
  };
  const stopCamera = () => {
    if (autoScanIntervalRef.current) {
      clearInterval(autoScanIntervalRef.current);
      autoScanIntervalRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };
  const openCameraScanner = async () => {
    setIsScannerOpen(true);
    setDetectedIps([]);
    await loadTesseract();
    setTimeout(() => {
      startCamera();
    }, 300);
  };
  const closeCameraScanner = () => {
    stopCamera();
    setIsScannerOpen(false);
  };
  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsLoadingOcr(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not construct 2D context");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      for (let i = 0; i < data.length; i += 4) {
        const brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
        data[i] = brightness;
        data[i + 1] = brightness;
        data[i + 2] = brightness;
      }
      ctx.putImageData(imgData, 0, 0);
      const dataUrl = canvas.toDataURL("image/png");
      const Tesseract = window.Tesseract;
      if (!Tesseract) throw new Error("OCR Engine not loaded");
      const result = await Tesseract.recognize(dataUrl, "eng");
      const text = result?.data?.text || "";
      const cleanedText = text.replace(/[,;]/g, ".");
      const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
      const matches = cleanedText.match(ipRegex) || [];
      const uniqueMatches = Array.from(new Set(matches));
      if (uniqueMatches.length > 0) {
        setDetectedIps(uniqueMatches);
        toast({
          title: "IP Detected!",
          description: `Found ${uniqueMatches.length} IP address(es) in image.`
        });
      } else {
        toast({
          variant: "destructive",
          title: "No IP found",
          description: "Could not find any IP addresses. Try aligning the text closer or holding the camera steady."
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Scan Failed",
        description: err.message
      });
    } finally {
      setIsLoadingOcr(false);
    }
  };
  const useDetectedIps = () => {
    if (detectedIps.length > 0) {
      setIpInput((prev) => {
        const existing = prev.trim();
        const joined = detectedIps.join(", ");
        return existing ? `${existing}, ${joined}` : joined;
      });
      closeCameraScanner();
    }
  };
  reactExports.useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stream]);
  const { data: checkedIps, isLoading } = useQuery({
    queryKey: ["/api/admin/checked-ips"],
    queryFn: async () => {
      const res = await fetch("/api/admin/checked-ips");
      if (!res.ok) throw new Error("Failed to fetch checked IPs");
      return res.json();
    }
  });
  const checkMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/admin/checked-ips/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to check IP(s)");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setCheckResults(data.results);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/checked-ips"] });
      const duplicates = data.results.filter((r) => r.existed);
      if (duplicates.length > 0) {
        toast({
          variant: "destructive",
          title: "Duplicate IP(s) Found!",
          description: `${duplicates.length} IP(s) have been checked or used before!`
        });
      } else {
        toast({
          title: "IP Check Completed",
          description: "All entered IPs are new and have been logged."
        });
      }
      setIpInput("");
      setNotesInput("");
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Error Checking IPs",
        description: err.message
      });
    }
  });
  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }) => {
      const res = await fetch(`/api/admin/checked-ips/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes })
      });
      if (!res.ok) throw new Error("Failed to update notes");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/checked-ips"] });
      setEditingId(null);
      toast({
        title: "Notes Saved",
        description: "IP description notes updated successfully."
      });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Error Updating Notes",
        description: err.message
      });
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/checked-ips/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete IP");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/checked-ips"] });
      toast({
        title: "IP Log Deleted",
        description: "The IP address log has been removed from database."
      });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Error Deleting IP",
        description: err.message
      });
    }
  });
  const handleCheck = (e) => {
    e.preventDefault();
    if (!ipInput.trim()) return;
    checkMutation.mutate({ ipString: ipInput, notes: notesInput });
  };
  const startEdit = (record) => {
    setEditingId(record.id);
    setEditingNotes(record.notes);
  };
  const saveEdit = (id) => {
    updateNotesMutation.mutate({ id, notes: editingNotes });
  };
  const filteredIps = checkedIps?.filter(
    (item) => item.ip.toLowerCase().includes(searchTerm.toLowerCase()) || item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10 animate-in fade-in-50 duration-500", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl font-black tracking-tighter text-white drop-shadow-2xl flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-12 h-12 text-purple-400" }),
        "IP Manager"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-sm", children: "Check, record, and track your work IP addresses." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-8 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-1 glass-card border-0 relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent pointer-events-none" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xl font-bold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { className: "w-5 h-5 text-purple-400" }),
            "Check New IP(s)"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Enter one or multiple IPs separated by spaces, commas, or new lines." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleCheck, className: "space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-white/60 uppercase tracking-wider", children: "IP Addresses" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  className: "text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 text-xs font-bold flex items-center gap-1.5 px-3 rounded-full h-8",
                  onClick: openCameraScanner,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3.5 h-3.5" }),
                    " Scan from Camera"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                placeholder: "e.g. 192.168.1.1, 10.0.0.5 8.8.8.8",
                className: "min-h-[140px] bg-white/[0.03] border-white/10 text-white placeholder-white/20 rounded-2xl focus-visible:ring-purple-500",
                value: ipInput,
                onChange: (e) => setIpInput(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-white/60 uppercase tracking-wider", children: "Notes / Label (Optional)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "text",
                placeholder: "e.g. Proxy Client-A, Server Setup",
                className: "bg-white/[0.03] border-white/10 text-white placeholder-white/20 rounded-2xl focus-visible:ring-purple-500",
                value: notesInput,
                onChange: (e) => setNotesInput(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              className: "w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-6 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-[1.02]",
              disabled: checkMutation.isPending,
              children: checkMutation.isPending ? "Checking..." : "Verify & Save IP"
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-2 glass-card border-0 relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-xl font-bold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-5 h-5 text-emerald-400" }),
              "Latest Scan Results"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Detailed real-time feedback for the checked IP addresses." })
          ] }),
          checkResults.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "text-white/40 hover:text-white",
              onClick: () => setCheckResults([]),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4 mr-1" }),
                " Clear Scan"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-4 max-h-[360px] overflow-y-auto pr-2", children: checkResults.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center text-white/30 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-12 h-12 opacity-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: "Scan results will appear here after checking." })
        ] }) : checkResults.map((result, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: `p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${result.existed ? "bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]" : "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
              result.existed ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-full bg-red-500/20 text-red-400 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-6 h-6" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-6 h-6" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg font-extrabold tracking-tight text-white", children: result.ip }),
                  result.existed ? /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "destructive", className: "bg-red-500/20 text-red-300 border-red-500/30 font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase", children: "ALREADY USED / SEARCHED" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase", children: "NEW IP LOGGED" })
                ] }),
                result.existed && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-white/60 space-y-1 mt-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-red-400/70" }),
                    "First logged: ",
                    format(new Date(result.record.createdAt), "yyyy-MM-dd HH:mm")
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-3.5 h-3.5 text-red-400/70" }),
                    "Last checked: ",
                    format(new Date(result.record.lastCheckedAt), "yyyy-MM-dd HH:mm")
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium text-white/70", children: [
                    "Check Count: ",
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-red-400 font-bold", children: [
                      result.record.checkCount,
                      " times"
                    ] })
                  ] })
                ] }),
                result.record.notes && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs italic text-white/50 mt-1 font-medium", children: [
                  'Notes: "',
                  result.record.notes,
                  '"'
                ] })
              ] })
            ] })
          },
          idx
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 overflow-hidden relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-xl font-bold", children: "IP Registration Directory" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "List of all logged IP addresses and check counts." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full md:w-80", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "text",
              placeholder: "Search IP or description...",
              className: "pl-11 bg-white/[0.03] border-white/10 text-white rounded-full focus-visible:ring-purple-500",
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-8 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full bg-white/5 rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full bg-white/5 rounded-2xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-12 w-full bg-white/5 rounded-2xl" })
      ] }) : filteredIps && filteredIps.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left border-collapse", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-b border-white/5 bg-white/[0.01]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6 text-xs font-bold text-white/50 uppercase tracking-wider", children: "IP Address" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6 text-xs font-bold text-white/50 uppercase tracking-wider", children: "Check Count" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6 text-xs font-bold text-white/50 uppercase tracking-wider", children: "First Scan Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6 text-xs font-bold text-white/50 uppercase tracking-wider", children: "Last Check Date" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6 text-xs font-bold text-white/50 uppercase tracking-wider", children: "Notes / Label" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-6 text-xs font-bold text-white/50 uppercase tracking-wider text-right", children: "Actions" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y divide-white/5", children: filteredIps.map((record) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-white/[0.02] transition-colors duration-200", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 font-extrabold text-white text-base", children: record.ip }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-purple-600/20 text-purple-300 border-purple-500/30 px-3 py-1 font-bold rounded-full text-xs", children: [
            record.checkCount,
            " checks"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-sm text-white/60 font-medium", children: format(new Date(record.createdAt), "yyyy-MM-dd HH:mm") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-sm text-white/60 font-medium", children: format(new Date(record.lastCheckedAt), "yyyy-MM-dd HH:mm") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 flex-1", children: editingId === record.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "text",
                value: editingNotes,
                onChange: (e) => setEditingNotes(e.target.value),
                className: "bg-white/[0.05] border-white/10 text-white rounded-xl py-1 text-sm max-w-xs focus-visible:ring-purple-500"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-emerald-400 hover:text-emerald-300", onClick: () => saveEdit(record.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-white/40 hover:text-white", onClick: () => setEditingId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 group-hover:text-white", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-white/50 italic font-medium", children: record.notes || "No notes" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white/40 hover:text-white", onClick: () => startEdit(record), children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "w-3.5 h-3.5" }) })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-6 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl",
              onClick: () => {
                if (confirm(`Are you sure you want to delete IP log for ${record.ip}?`)) {
                  deleteMutation.mutate(record.id);
                }
              },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
            }
          ) })
        ] }, record.id)) })
      ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 text-center text-white/30 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-16 h-16 opacity-10" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-bold", children: "No registered IPs found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40", children: "Log some IPs using the check form above." })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isScannerOpen, onOpenChange: (open) => {
      if (!open) closeCameraScanner();
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "sm:max-w-xl bg-[#0d0d12]/95 border border-white/10 text-white rounded-3xl backdrop-blur-2xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-5 h-5 text-purple-400" }),
          "IP Address Camera Scanner"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-white/50 text-sm", children: "Point your camera at the IP address text. Auto-detecting IPs live in real-time." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 my-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/5 flex items-center justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "video",
            {
              ref: videoRef,
              autoPlay: true,
              playsInline: true,
              className: "w-full h-full object-cover"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-2/3 h-1/3 border-2 border-dashed border-purple-400 rounded-xl relative flex items-center justify-center bg-purple-500/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "scanning-line" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1.5 -left-1.5 w-4 h-4 border-t-4 border-l-4 border-purple-400 rounded-tl-md" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-1.5 -right-1.5 w-4 h-4 border-t-4 border-r-4 border-purple-400 rounded-tr-md" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-4 border-l-4 border-purple-400 rounded-bl-md" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-4 border-r-4 border-purple-400 rounded-br-md" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase font-black tracking-widest text-purple-300 bg-[#0d0d12]/80 px-2.5 py-1 rounded-full shadow-md", children: "Target Area" })
          ] }) }),
          isLoadingOcr && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-purple-400" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-purple-200 animate-pulse uppercase tracking-widest", children: "Analyzing Text..." })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "hidden" }),
        detectedIps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl space-y-2.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-black uppercase text-purple-300 tracking-wider", children: "Detected IP Addresses:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: detectedIps.map((ip, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: "bg-purple-600/30 border border-purple-500/40 text-purple-200 px-3 py-1 font-mono text-sm rounded-full",
              children: ip
            },
            idx
          )) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex flex-row gap-3 sm:justify-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "outline",
            onClick: closeCameraScanner,
            className: "border-white/10 hover:bg-white/5 rounded-xl text-white text-xs py-4 px-5 h-auto",
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            type: "button",
            onClick: captureAndScan,
            disabled: isLoadingOcr || !stream,
            className: "bg-purple-600 hover:bg-purple-500 font-bold rounded-xl text-xs py-4 px-5 h-auto flex items-center gap-1.5",
            children: [
              isLoadingOcr ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-4 h-4" }),
              "Capture & Scan"
            ]
          }
        ),
        detectedIps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            onClick: useDetectedIps,
            className: "bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-xs py-4 px-5 h-auto",
            children: "Use IP(s)"
          }
        )
      ] })
    ] }) })
  ] });
}
export {
  IpManagerPage as default
};
