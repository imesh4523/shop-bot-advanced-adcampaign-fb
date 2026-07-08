import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Globe, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  AlertTriangle, 
  PlusCircle, 
  Save, 
  Clock,
  Eye,
  X,
  Camera,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface CheckedIp {
  id: number;
  ip: string;
  notes: string;
  createdAt: string;
  lastCheckedAt: string;
  checkCount: number;
}

interface CheckResult {
  ip: string;
  existed: boolean;
  record: CheckedIp;
}

export default function IpManagerPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [ipInput, setIpInput] = useState("");
  const [notesInput, setNotesInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [checkResults, setCheckResults] = useState<CheckResult[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingNotes, setEditingNotes] = useState("");

  // Scanner States
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isLoadingOcr, setIsLoadingOcr] = useState(false);
  const [detectedIps, setDetectedIps] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const autoScanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Inject scanning laser style on mount
  useEffect(() => {
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
    return new Promise<void>((resolve, reject) => {
      if ((window as any).Tesseract) {
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
      const Tesseract = (window as any).Tesseract;
      if (!Tesseract) return;

      const result = await Tesseract.recognize(dataUrl, 'eng');
      const text = result?.data?.text || "";
      const cleanedText = text.replace(/[,;]/g, '.');
      const ipRegex = /\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b/g;
      const matches = cleanedText.match(ipRegex) || [];
      
      const uniqueMatches = Array.from(new Set(matches));
      if (uniqueMatches.length > 0) {
        setDetectedIps(prev => {
          const combined = new Set([...prev, ...uniqueMatches]);
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
      
      // Start dynamic periodic auto-scanner loop
      if (autoScanIntervalRef.current) clearInterval(autoScanIntervalRef.current);
      autoScanIntervalRef.current = setInterval(() => {
        autoScanFrame();
      }, 1500); // scan every 1.5 seconds automatically
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
      stream.getTracks().forEach(track => track.stop());
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

      // Set canvas size to video frame size
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to grayscale or simple thresholding to improve OCR results
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
      const Tesseract = (window as any).Tesseract;
      if (!Tesseract) throw new Error("OCR Engine not loaded");

      const result = await Tesseract.recognize(dataUrl, 'eng');
      
      const text = result?.data?.text || "";
      // Clean commas and semicolons to dots for IP matching
      const cleanedText = text.replace(/[,;]/g, '.');
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
    } catch (err: any) {
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
      setIpInput(prev => {
        const existing = prev.trim();
        const joined = detectedIps.join(", ");
        return existing ? `${existing}, ${joined}` : joined;
      });
      closeCameraScanner();
    }
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stream]);

  // Fetch checked IPs list
  const { data: checkedIps, isLoading } = useQuery<CheckedIp[]>({
    queryKey: ["/api/admin/checked-ips"],
    queryFn: async () => {
      const res = await fetch("/api/admin/checked-ips");
      if (!res.ok) throw new Error("Failed to fetch checked IPs");
      return res.json();
    }
  });

  // Check IP Mutation
  const checkMutation = useMutation({
    mutationFn: async (data: { ipString: string; notes?: string }) => {
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
      
      const duplicates = data.results.filter((r: CheckResult) => r.existed);
      if (duplicates.length > 0) {
        toast({
          variant: "destructive",
          title: "Duplicate IP(s) Found!",
          description: `${duplicates.length} IP(s) have been checked or used before!`,
        });
      } else {
        toast({
          title: "IP Check Completed",
          description: "All entered IPs are new and have been logged.",
        });
      }
      setIpInput("");
      setNotesInput("");
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error Checking IPs",
        description: err.message
      });
    }
  });

  // Update Notes Mutation
  const updateNotesMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
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
        description: "IP description notes updated successfully.",
      });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error Updating Notes",
        description: err.message
      });
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/checked-ips/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete IP");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/checked-ips"] });
      toast({
        title: "IP Log Deleted",
        description: "The IP address log has been removed from database.",
      });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Error Deleting IP",
        description: err.message
      });
    }
  });

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ipInput.trim()) return;
    checkMutation.mutate({ ipString: ipInput, notes: notesInput });
  };

  const startEdit = (record: CheckedIp) => {
    setEditingId(record.id);
    setEditingNotes(record.notes);
  };

  const saveEdit = (id: number) => {
    updateNotesMutation.mutate({ id, notes: editingNotes });
  };

  const filteredIps = checkedIps?.filter(item => 
    item.ip.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-10 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-2xl flex items-center gap-3">
            <Globe className="w-12 h-12 text-purple-400" />
            IP Manager
          </h1>
          <p className="text-white/60 text-sm">
            Check, record, and track your work IP addresses.
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Check Form Section */}
        <Card className="lg:col-span-1 glass-card border-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent pointer-events-none" />
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-purple-400" />
              Check New IP(s)
            </CardTitle>
            <CardDescription className="text-white/40">
              Enter one or multiple IPs separated by spaces, commas, or new lines.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCheck} className="space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-white/60 uppercase tracking-wider">IP Addresses</label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 text-xs font-bold flex items-center gap-1.5 px-3 rounded-full h-8"
                    onClick={openCameraScanner}
                  >
                    <Camera className="w-3.5 h-3.5" /> Scan from Camera
                  </Button>
                </div>
                <Textarea
                  placeholder="e.g. 192.168.1.1, 10.0.0.5 8.8.8.8"
                  className="min-h-[140px] bg-white/[0.03] border-white/10 text-white placeholder-white/20 rounded-2xl focus-visible:ring-purple-500"
                  value={ipInput}
                  onChange={(e) => setIpInput(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/60 uppercase tracking-wider">Notes / Label (Optional)</label>
                <Input
                  type="text"
                  placeholder="e.g. Proxy Client-A, Server Setup"
                  className="bg-white/[0.03] border-white/10 text-white placeholder-white/20 rounded-2xl focus-visible:ring-purple-500"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-6 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                disabled={checkMutation.isPending}
              >
                {checkMutation.isPending ? "Checking..." : "Verify & Save IP"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Verification Results Panel */}
        <Card className="lg:col-span-2 glass-card border-0 relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Latest Scan Results
              </CardTitle>
              <CardDescription className="text-white/40">
                Detailed real-time feedback for the checked IP addresses.
              </CardDescription>
            </div>
            {checkResults.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/40 hover:text-white"
                onClick={() => setCheckResults([])}
              >
                <X className="w-4 h-4 mr-1" /> Clear Scan
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
            {checkResults.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center text-white/30 space-y-3">
                <Eye className="w-12 h-12 opacity-20" />
                <p className="text-sm">Scan results will appear here after checking.</p>
              </div>
            ) : (
              checkResults.map((result, idx) => (
                <div 
                  key={idx} 
                  className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${
                    result.existed 
                      ? 'bg-red-500/10 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]' 
                      : 'bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {result.existed ? (
                      <div className="p-3 rounded-full bg-red-500/20 text-red-400 mt-0.5">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                    ) : (
                      <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400 mt-0.5">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-extrabold tracking-tight text-white">{result.ip}</span>
                        {result.existed ? (
                          <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/30 font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                            ALREADY USED / SEARCHED
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 font-black px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                            NEW IP LOGGED
                          </Badge>
                        )}
                      </div>
                      
                      {result.existed && (
                        <div className="text-xs text-white/60 space-y-1 mt-1">
                          <p className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-red-400/70" />
                            First logged: {format(new Date(result.record.createdAt), "yyyy-MM-dd HH:mm")}
                          </p>
                          <p className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-red-400/70" />
                            Last checked: {format(new Date(result.record.lastCheckedAt), "yyyy-MM-dd HH:mm")}
                          </p>
                          <p className="font-medium text-white/70">
                            Check Count: <span className="text-red-400 font-bold">{result.record.checkCount} times</span>
                          </p>
                        </div>
                      )}
                      {result.record.notes && (
                        <p className="text-xs italic text-white/50 mt-1 font-medium">
                          Notes: "{result.record.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Checked IPs List Section */}
      <Card className="glass-card border-0 overflow-hidden relative">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold">IP Registration Directory</CardTitle>
            <CardDescription className="text-white/40">List of all logged IP addresses and check counts.</CardDescription>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search IP or description..."
              className="pl-11 bg-white/[0.03] border-white/10 text-white rounded-full focus-visible:ring-purple-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              <Skeleton className="h-12 w-full bg-white/5 rounded-2xl" />
              <Skeleton className="h-12 w-full bg-white/5 rounded-2xl" />
              <Skeleton className="h-12 w-full bg-white/5 rounded-2xl" />
            </div>
          ) : filteredIps && filteredIps.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.01]">
                    <th className="p-6 text-xs font-bold text-white/50 uppercase tracking-wider">IP Address</th>
                    <th className="p-6 text-xs font-bold text-white/50 uppercase tracking-wider">Check Count</th>
                    <th className="p-6 text-xs font-bold text-white/50 uppercase tracking-wider">First Scan Date</th>
                    <th className="p-6 text-xs font-bold text-white/50 uppercase tracking-wider">Last Check Date</th>
                    <th className="p-6 text-xs font-bold text-white/50 uppercase tracking-wider">Notes / Label</th>
                    <th className="p-6 text-xs font-bold text-white/50 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredIps.map((record) => (
                    <tr key={record.id} className="group hover:bg-white/[0.02] transition-colors duration-200">
                      <td className="p-6 font-extrabold text-white text-base">{record.ip}</td>
                      <td className="p-6">
                        <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30 px-3 py-1 font-bold rounded-full text-xs">
                          {record.checkCount} checks
                        </Badge>
                      </td>
                      <td className="p-6 text-sm text-white/60 font-medium">
                        {format(new Date(record.createdAt), "yyyy-MM-dd HH:mm")}
                      </td>
                      <td className="p-6 text-sm text-white/60 font-medium">
                        {format(new Date(record.lastCheckedAt), "yyyy-MM-dd HH:mm")}
                      </td>
                      <td className="p-6 flex-1">
                        {editingId === record.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="text"
                              value={editingNotes}
                              onChange={(e) => setEditingNotes(e.target.value)}
                              className="bg-white/[0.05] border-white/10 text-white rounded-xl py-1 text-sm max-w-xs focus-visible:ring-purple-500"
                            />
                            <Button size="icon" variant="ghost" className="text-emerald-400 hover:text-emerald-300" onClick={() => saveEdit(record.id)}>
                              <Save className="w-4 h-4" />
                            </Button>
                            <Button size="icon" variant="ghost" className="text-white/40 hover:text-white" onClick={() => setEditingId(null)}>
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group-hover:text-white">
                            <span className="text-sm text-white/50 italic font-medium">
                              {record.notes || "No notes"}
                            </span>
                            <Button size="icon" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-white/40 hover:text-white" onClick={() => startEdit(record)}>
                              <Edit3 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </td>
                      <td className="p-6 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete IP log for ${record.ip}?`)) {
                              deleteMutation.mutate(record.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center text-white/30 space-y-4">
              <Globe className="w-16 h-16 opacity-10" />
              <div className="space-y-1">
                <p className="text-base font-bold">No registered IPs found</p>
                <p className="text-xs text-white/40">Log some IPs using the check form above.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Camera OCR Scanner Modal */}
      <Dialog open={isScannerOpen} onOpenChange={(open) => { if(!open) closeCameraScanner(); }}>
        <DialogContent className="sm:max-w-xl bg-[#0d0d12]/95 border border-white/10 text-white rounded-3xl backdrop-blur-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Camera className="w-5 h-5 text-purple-400" />
              IP Address Camera Scanner
            </DialogTitle>
            <DialogDescription className="text-white/50 text-sm">
              Point your camera at the IP address text. Auto-detecting IPs live in real-time.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 my-2">
            {/* Camera Viewfinder */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/60 border border-white/5 flex items-center justify-center">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover"
              />
              
              {/* Target finder box overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-2/3 h-1/3 border-2 border-dashed border-purple-400 rounded-xl relative flex items-center justify-center bg-purple-500/5">
                  <div className="scanning-line" />
                  <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-4 border-l-4 border-purple-400 rounded-tl-md"></div>
                  <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-4 border-r-4 border-purple-400 rounded-tr-md"></div>
                  <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-4 border-l-4 border-purple-400 rounded-bl-md"></div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-4 border-r-4 border-purple-400 rounded-br-md"></div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-purple-300 bg-[#0d0d12]/80 px-2.5 py-1 rounded-full shadow-md">
                    Target Area
                  </span>
                </div>
              </div>

              {isLoadingOcr && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  <p className="text-sm font-bold text-purple-200 animate-pulse uppercase tracking-widest">
                    Analyzing Text...
                  </p>
                </div>
              )}
            </div>

            {/* Hidden canvas for image capture */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Detected IPs Display */}
            {detectedIps.length > 0 && (
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl space-y-2.5">
                <h4 className="text-xs font-black uppercase text-purple-300 tracking-wider">
                  Detected IP Addresses:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {detectedIps.map((ip, idx) => (
                    <Badge 
                      key={idx} 
                      className="bg-purple-600/30 border border-purple-500/40 text-purple-200 px-3 py-1 font-mono text-sm rounded-full"
                    >
                      {ip}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-row gap-3 sm:justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={closeCameraScanner}
              className="border-white/10 hover:bg-white/5 rounded-xl text-white text-xs py-4 px-5 h-auto"
            >
              Cancel
            </Button>
            
            <Button 
              type="button" 
              onClick={captureAndScan}
              disabled={isLoadingOcr || !stream}
              className="bg-purple-600 hover:bg-purple-500 font-bold rounded-xl text-xs py-4 px-5 h-auto flex items-center gap-1.5"
            >
              {isLoadingOcr ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              Capture & Scan
            </Button>
            
            {detectedIps.length > 0 && (
              <Button 
                type="button" 
                onClick={useDetectedIps}
                className="bg-emerald-600 hover:bg-emerald-500 font-bold rounded-xl text-xs py-4 px-5 h-auto"
              >
                Use IP(s)
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
