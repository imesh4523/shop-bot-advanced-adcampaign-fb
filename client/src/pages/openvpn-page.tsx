import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Loader2, 
  Server, 
  ExternalLink, 
  Copy, 
  Check, 
  Calendar,
  Key,
  Activity,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface VpnServerType {
  id: number;
  dropletId: string;
  ipAddress: string | null;
  password: string | null;
  errorMessage: string | null;
  status: "creating" | "configuring" | "active" | "failed";
  createdAt: string;
}

interface DoRegion {
  slug: string;
  name: string;
  sizes: string[];
  available: boolean;
}

interface DoSize {
  slug: string;
  memory: number;
  vcpus: number;
  disk: number;
  transfer: number;
  price_monthly: number;
  regions: string[];
}

export default function OpenVpnPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Region and size selection state
  const [selectedRegion, setSelectedRegion] = useState("nyc3");
  const [selectedSize, setSelectedSize] = useState("s-1vcpu-1gb");

  // Fetch VPN servers list
  const { data: servers = [], isLoading, refetch } = useQuery<VpnServerType[]>({
    queryKey: ["/api/admin/vpn-servers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/vpn-servers");
      if (!res.ok) throw new Error("Failed to fetch OpenVPN servers");
      return res.json();
    }
  });

  // Fetch DO Regions list
  const { data: regions = [] } = useQuery<DoRegion[]>({
    queryKey: ["/api/admin/digitalocean/regions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/digitalocean/regions");
      if (!res.ok) throw new Error("Failed to fetch DigitalOcean regions");
      return res.json();
    }
  });

  // Fetch DO Sizes list
  const { data: sizes = [] } = useQuery<DoSize[]>({
    queryKey: ["/api/admin/digitalocean/sizes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/digitalocean/sizes");
      if (!res.ok) throw new Error("Failed to fetch DigitalOcean sizes");
      return res.json();
    }
  });

  // Fetch Default settings for region and size
  const { data: defaultRegionSetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/OPENVPN_DEFAULT_REGION"],
    queryFn: async () => {
      const res = await fetch("/api/settings/OPENVPN_DEFAULT_REGION");
      if (!res.ok) return { value: "" };
      return res.json();
    }
  });

  const { data: defaultSizeSetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/OPENVPN_DEFAULT_SIZE"],
    queryFn: async () => {
      const res = await fetch("/api/settings/OPENVPN_DEFAULT_SIZE");
      if (!res.ok) return { value: "" };
      return res.json();
    }
  });

  // Load default template values on page load
  useEffect(() => {
    if (defaultRegionSetting?.value) {
      setSelectedRegion(defaultRegionSetting.value);
    }
  }, [defaultRegionSetting]);

  useEffect(() => {
    if (defaultSizeSetting?.value) {
      setSelectedSize(defaultSizeSetting.value);
    }
  }, [defaultSizeSetting]);

  // Filter sizes based on selected region
  const filteredSizes = sizes.filter((size) =>
    size.regions.includes(selectedRegion)
  );

  // Auto-switch selected size if it's not supported in newly selected region
  useEffect(() => {
    if (filteredSizes.length > 0 && !filteredSizes.some((s) => s.slug === selectedSize)) {
      setSelectedSize(filteredSizes[0].slug);
    }
  }, [selectedRegion, sizes]);

  // Auto-refresh when any server is in provisioning/creating/configuring state
  useEffect(() => {
    const hasPendingServers = servers.some(
      (s) => s.status === "creating" || s.status === "configuring"
    );

    if (hasPendingServers) {
      const interval = setInterval(() => {
        refetch();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [servers, refetch]);

  // Create VPN Server Mutation
  const createMutation = useMutation({
    mutationFn: async (params: { region: string; size: string }) => {
      const res = await fetch("/api/admin/vpn-servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to initiate OpenVPN server creation");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Provisioning Started",
        description: `Your DigitalOcean OpenVPN droplet (${selectedSize}) is being created in ${selectedRegion}. This will take 2-3 minutes.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vpn-servers"] });
    },
    onError: (err: Error) => {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: err.message,
      });
    }
  });

  // Save creation template setting mutation
  const saveTemplateMutation = useMutation({
    mutationFn: async (params: { region: string; size: string }) => {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "OPENVPN_DEFAULT_REGION", value: params.region })
      });
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "OPENVPN_DEFAULT_SIZE", value: params.size })
      });
    },
    onSuccess: () => {
      toast({
        title: "Template Settings Saved",
        description: `Set default template to Region: ${selectedRegion.toUpperCase()}, Size: ${selectedSize}.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/OPENVPN_DEFAULT_REGION"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/OPENVPN_DEFAULT_SIZE"] });
    },
    onError: (err: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to save template",
        description: err.message,
      });
    }
  });

  // Delete VPN Server Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/admin/vpn-servers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete VPN server");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Droplet Deleted",
        description: "Droplet has been removed from your DigitalOcean account and dashboard.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vpn-servers"] });
    },
    onError: (err: Error) => {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: err.message,
      });
    }
  });

  const handleCopy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard.",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: VpnServerType["status"]) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Active
          </Badge>
        );
      case "creating":
        return (
          <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Creating Droplet
          </Badge>
        );
      case "configuring":
        return (
          <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Configuring OpenVPN
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Failed
          </Badge>
        );
    }
  };

  const activeCount = servers.filter(s => s.status !== "failed").length;

  return (
    <div className="space-y-10 animate-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-2xl flex items-center gap-4">
            <Shield className="w-12 h-12 text-purple-400" />
            OpenVPN Servers
          </h1>
          <p className="text-white/60 mt-2 text-lg">
            Automated DigitalOcean droplet creation and automatic interactive wizard provisioning.
          </p>
        </div>
        
        <div className="flex gap-3">
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="glass-panel border-white/10 text-white rounded-xl h-12 hover:bg-white/5"
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>

          <Button
            onClick={() => createMutation.mutate({ region: selectedRegion, size: selectedSize })}
            disabled={createMutation.isPending || activeCount >= 2}
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold h-12 px-6 rounded-xl shadow-lg shadow-purple-500/20 flex items-center gap-2"
          >
            {createMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
            Create Server ({activeCount}/2)
          </Button>
        </div>
      </div>

      {/* Region & Size Configuration Template Card */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2 text-white">
            <Server className="w-6 h-6 text-purple-400" />
            Deployment Template
          </CardTitle>
          <CardDescription className="text-white/60">
            Choose the region, size, and pricing structure for newly deployed droplets.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Region Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/70 uppercase tracking-widest">DigitalOcean Region</label>
              <select
                className="w-full h-12 px-4 glass-panel border border-white/10 bg-[#0f0a1a] text-white rounded-xl focus:border-purple-500/50 transition-all text-sm outline-none cursor-pointer"
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
              >
                {regions.map((reg) => (
                  <option key={reg.slug} value={reg.slug} className="bg-purple-950 text-white">
                    {reg.name} ({reg.slug.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            {/* Size Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/70 uppercase tracking-widest">Instance Size & Pricing</label>
              <select
                className="w-full h-12 px-4 glass-panel border border-white/10 bg-[#0f0a1a] text-white rounded-xl focus:border-purple-500/50 transition-all text-sm outline-none cursor-pointer"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {filteredSizes.map((sz) => (
                  <option key={sz.slug} value={sz.slug} className="bg-purple-950 text-white">
                    {sz.slug} | {sz.vcpus} vCPU, {sz.memory / 1024} GB RAM - ${sz.price_monthly.toFixed(2)}/mo
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-white/5">
            <Button
              onClick={() => saveTemplateMutation.mutate({ region: selectedRegion, size: selectedSize })}
              disabled={saveTemplateMutation.isPending}
              variant="outline"
              className="glass-panel border-white/10 text-white hover:bg-white/5 font-bold h-12 rounded-xl px-6"
            >
              {saveTemplateMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
              Save Template Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
        </div>
      ) : servers.length === 0 ? (
        <Card className="glass-card border-0 py-16 text-center">
          <CardContent className="space-y-4">
            <div className="w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto">
              <Server className="w-10 h-10 text-purple-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">No VPN Servers Found</h3>
              <p className="text-white/55 max-w-sm mx-auto text-sm">
                Initiate automatic OpenVPN setup by clicking "Create Server". Droplet will be spun up on DigitalOcean.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {servers.map((server) => (
            <Card key={server.id} className="glass-card border-0 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <CardHeader className="border-b border-white/5 pb-4 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <Server className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                      Droplet: {server.dropletId === "pending" ? "Pending..." : `#${server.dropletId}`}
                    </CardTitle>
                    <CardDescription className="text-xs text-white/40 flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {format(new Date(server.createdAt), "PPP p")}
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(server.status)}
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  {/* IP Address Field */}
                  <div className="glass-panel border-white/5 bg-black/20 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-black flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-purple-400" /> Public IP Address
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-mono text-sm font-bold">
                        {server.ipAddress || "Provisioning IP..."}
                      </span>
                      {server.ipAddress && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg hover:bg-white/5 text-white/60 hover:text-white"
                            onClick={() => {
                              navigator.clipboard.writeText(server.ipAddress || "");
                              toast({ title: "Copied!", description: "IP copied to clipboard." });
                            }}
                          >
                            <Copy className="w-4.5 h-4.5" />
                          </Button>
                          <a
                            href={`https://${server.ipAddress}:943/admin`}
                            target="_blank"
                            rel="noreferrer"
                            className="h-8 w-8 rounded-lg hover:bg-white/5 text-white/60 hover:text-white flex items-center justify-center transition-colors"
                          >
                            <ExternalLink className="w-4.5 h-4.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generated Password Field */}
                  <div className="glass-panel border-white/5 bg-black/20 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-black flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-blue-400" /> Admin Username
                    </span>
                    <div className="text-white text-sm font-bold font-mono">
                      openvpn
                    </div>
                  </div>

                  <div className="glass-panel border-white/5 bg-black/20 p-4 rounded-xl space-y-1">
                    <span className="text-[10px] text-white/40 uppercase tracking-widest font-black flex items-center gap-1">
                      <Key className="w-3.5 h-3.5 text-blue-400" /> Admin Password
                    </span>
                    <div className="flex items-center justify-between">
                      <span className="text-white font-mono text-sm font-bold">
                        {server.password ? "••••••••" : "Generating..."}
                      </span>
                      {server.password && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-lg hover:bg-white/5 text-white/60 hover:text-white"
                          onClick={() => handleCopy(server.password || "", server.id)}
                        >
                          {copiedId === server.id ? (
                            <Check className="w-4.5 h-4.5 text-green-400" />
                          ) : (
                            <Copy className="w-4.5 h-4.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {server.status === "configuring" && (
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-amber-400">Automated Setup Wizard Running</p>
                      <p className="text-[11px] text-white/50 leading-relaxed mt-0.5">
                        Logging into the server console over SSH automatically, bypassing first-login interactive prompts, and configuring user password credentials.
                      </p>
                    </div>
                  </div>
                )}
                {server.status === "failed" && server.errorMessage && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-red-400">Deployment Error</p>
                      <p className="text-[11px] text-white/70 leading-relaxed mt-0.5 font-mono">
                        {server.errorMessage}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-2 border-t border-white/5">
                  <Button
                    onClick={() => {
                      if (confirm("Are you sure you want to terminate this droplet and delete the VPN server?")) {
                        deleteMutation.mutate(server.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                    variant="destructive"
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-200 border border-red-500/25 font-bold rounded-xl flex items-center gap-2 h-10 px-4 transition-all"
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Terminate Server
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
