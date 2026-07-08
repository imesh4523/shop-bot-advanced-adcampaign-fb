import { d as useToast, K as useQueryClient, r as reactExports, u as useQuery, e as useMutation, j as jsxRuntimeExports, p as Shield, B as Button, L as LoaderCircle, C as Check } from "./index-CLLsc2ce.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-DxroiW3R.js";
import { B as Badge } from "./badge-BWVrRcD4.js";
import { R as RefreshCw } from "./refresh-cw-ByJQ4Uun.js";
import { P as Plus } from "./plus-yLXA8Mer.js";
import { S as Server } from "./server-C8Vo5Tqz.js";
import { C as Calendar } from "./calendar-DcySqNC4.js";
import { A as Activity } from "./activity-Bhkl1y22.js";
import { C as Copy } from "./copy-C9fSKEpT.js";
import { E as ExternalLink } from "./external-link-bJ2qChvo.js";
import { K as Key } from "./key-DsaTJ2cv.js";
import { C as CircleAlert } from "./circle-alert-DbQ16RPw.js";
import { T as Trash2 } from "./trash-2-2FcwUg5n.js";
import { f as format } from "./format-Fqx7OmaC.js";
function OpenVpnPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = reactExports.useState(null);
  const [selectedRegion, setSelectedRegion] = reactExports.useState("nyc3");
  const [selectedSize, setSelectedSize] = reactExports.useState("s-1vcpu-1gb");
  const { data: servers = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/admin/vpn-servers"],
    queryFn: async () => {
      const res = await fetch("/api/admin/vpn-servers");
      if (!res.ok) throw new Error("Failed to fetch OpenVPN servers");
      return res.json();
    }
  });
  const { data: regions = [] } = useQuery({
    queryKey: ["/api/admin/digitalocean/regions"],
    queryFn: async () => {
      const res = await fetch("/api/admin/digitalocean/regions");
      if (!res.ok) throw new Error("Failed to fetch DigitalOcean regions");
      return res.json();
    }
  });
  const { data: sizes = [] } = useQuery({
    queryKey: ["/api/admin/digitalocean/sizes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/digitalocean/sizes");
      if (!res.ok) throw new Error("Failed to fetch DigitalOcean sizes");
      return res.json();
    }
  });
  const { data: defaultRegionSetting } = useQuery({
    queryKey: ["/api/settings/OPENVPN_DEFAULT_REGION"],
    queryFn: async () => {
      const res = await fetch("/api/settings/OPENVPN_DEFAULT_REGION");
      if (!res.ok) return { value: "" };
      return res.json();
    }
  });
  const { data: defaultSizeSetting } = useQuery({
    queryKey: ["/api/settings/OPENVPN_DEFAULT_SIZE"],
    queryFn: async () => {
      const res = await fetch("/api/settings/OPENVPN_DEFAULT_SIZE");
      if (!res.ok) return { value: "" };
      return res.json();
    }
  });
  reactExports.useEffect(() => {
    if (defaultRegionSetting?.value) {
      setSelectedRegion(defaultRegionSetting.value);
    }
  }, [defaultRegionSetting]);
  reactExports.useEffect(() => {
    if (defaultSizeSetting?.value) {
      setSelectedSize(defaultSizeSetting.value);
    }
  }, [defaultSizeSetting]);
  const filteredSizes = sizes.filter(
    (size) => size.regions.includes(selectedRegion)
  );
  reactExports.useEffect(() => {
    if (filteredSizes.length > 0 && !filteredSizes.some((s) => s.slug === selectedSize)) {
      setSelectedSize(filteredSizes[0].slug);
    }
  }, [selectedRegion, sizes]);
  reactExports.useEffect(() => {
    const hasPendingServers = servers.some(
      (s) => s.status === "creating" || s.status === "configuring"
    );
    if (hasPendingServers) {
      const interval = setInterval(() => {
        refetch();
      }, 5e3);
      return () => clearInterval(interval);
    }
  }, [servers, refetch]);
  const createMutation = useMutation({
    mutationFn: async (params) => {
      const res = await fetch("/api/admin/vpn-servers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
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
        description: `Your DigitalOcean OpenVPN droplet (${selectedSize}) is being created in ${selectedRegion}. This will take 2-3 minutes.`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vpn-servers"] });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Creation Failed",
        description: err.message
      });
    }
  });
  const saveTemplateMutation = useMutation({
    mutationFn: async (params) => {
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
        description: `Set default template to Region: ${selectedRegion.toUpperCase()}, Size: ${selectedSize}.`
      });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/OPENVPN_DEFAULT_REGION"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/OPENVPN_DEFAULT_SIZE"] });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Failed to save template",
        description: err.message
      });
    }
  });
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/vpn-servers/${id}`, {
        method: "DELETE"
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
        description: "Droplet has been removed from your DigitalOcean account and dashboard."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vpn-servers"] });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Deletion Failed",
        description: err.message
      });
    }
  });
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard."
    });
    setTimeout(() => setCopiedId(null), 2e3);
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-400" }),
          "Active"
        ] });
      case "creating":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold px-3 py-1 rounded-full flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }),
          "Creating Droplet"
        ] });
      case "configuring":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold px-3 py-1 rounded-full flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }),
          "Configuring OpenVPN"
        ] });
      case "failed":
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-red-500/20 text-red-400 border border-red-500/30 font-bold px-3 py-1 rounded-full flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5" }),
          "Failed"
        ] });
    }
  };
  const activeCount = servers.filter((s) => s.status !== "failed").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10 animate-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-5xl font-black tracking-tighter text-white drop-shadow-2xl flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-12 h-12 text-purple-400" }),
          "OpenVPN Servers"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 mt-2 text-lg", children: "Automated DigitalOcean droplet creation and automatic interactive wizard provisioning." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => refetch(),
            variant: "outline",
            className: "glass-panel border-white/10 text-white rounded-xl h-12 hover:bg-white/5",
            disabled: isLoading,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-5 h-5 ${isLoading ? "animate-spin" : ""}` })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => createMutation.mutate({ region: selectedRegion, size: selectedSize }),
            disabled: createMutation.isPending || activeCount >= 2,
            className: "bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold h-12 px-6 rounded-xl shadow-lg shadow-purple-500/20 flex items-center gap-2",
            children: [
              createMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-5 h-5" }),
              "Create Server (",
              activeCount,
              "/2)"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-2xl font-bold flex items-center gap-2 text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "w-6 h-6 text-purple-400" }),
          "Deployment Template"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/60", children: "Choose the region, size, and pricing structure for newly deployed droplets." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "DigitalOcean Region" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                className: "w-full h-12 px-4 glass-panel border border-white/10 bg-[#0f0a1a] text-white rounded-xl focus:border-purple-500/50 transition-all text-sm outline-none cursor-pointer",
                value: selectedRegion,
                onChange: (e) => setSelectedRegion(e.target.value),
                children: regions.map((reg) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: reg.slug, className: "bg-purple-950 text-white", children: [
                  reg.name,
                  " (",
                  reg.slug.toUpperCase(),
                  ")"
                ] }, reg.slug))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "Instance Size & Pricing" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                className: "w-full h-12 px-4 glass-panel border border-white/10 bg-[#0f0a1a] text-white rounded-xl focus:border-purple-500/50 transition-all text-sm outline-none cursor-pointer",
                value: selectedSize,
                onChange: (e) => setSelectedSize(e.target.value),
                children: filteredSizes.map((sz) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: sz.slug, className: "bg-purple-950 text-white", children: [
                  sz.slug,
                  " | ",
                  sz.vcpus,
                  " vCPU, ",
                  sz.memory / 1024,
                  " GB RAM - $",
                  sz.price_monthly.toFixed(2),
                  "/mo"
                ] }, sz.slug))
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-4 pt-4 border-t border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => saveTemplateMutation.mutate({ region: selectedRegion, size: selectedSize }),
            disabled: saveTemplateMutation.isPending,
            variant: "outline",
            className: "glass-panel border-white/10 text-white hover:bg-white/5 font-bold h-12 rounded-xl px-6",
            children: [
              saveTemplateMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin mr-2" }) : null,
              "Save Template Settings"
            ]
          }
        ) })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[300px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-10 h-10 animate-spin text-purple-400" }) }) : servers.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "glass-card border-0 py-16 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "w-10 h-10 text-purple-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white", children: "No VPN Servers Found" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/55 max-w-sm mx-auto text-sm", children: 'Initiate automatic OpenVPN setup by clicking "Create Server". Droplet will be spun up on DigitalOcean.' })
      ] })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 gap-6", children: servers.map((server) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 overflow-hidden relative group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "border-b border-white/5 pb-4 flex flex-row items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Server, { className: "w-5 h-5 text-purple-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-lg font-bold text-white flex items-center gap-2", children: [
              "Droplet: ",
              server.dropletId === "pending" ? "Pending..." : `#${server.dropletId}`
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { className: "text-xs text-white/40 flex items-center gap-1.5 mt-0.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "w-3.5 h-3.5" }),
              format(new Date(server.createdAt), "PPP p")
            ] })
          ] })
        ] }),
        getStatusBadge(server.status)
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "pt-6 space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel border-white/5 bg-black/20 p-4 rounded-xl space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-white/40 uppercase tracking-widest font-black flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3.5 h-3.5 text-purple-400" }),
              " Public IP Address"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-mono text-sm font-bold", children: server.ipAddress || "Provisioning IP..." }),
              server.ipAddress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    className: "h-8 w-8 rounded-lg hover:bg-white/5 text-white/60 hover:text-white",
                    onClick: () => {
                      navigator.clipboard.writeText(server.ipAddress || "");
                      toast({ title: "Copied!", description: "IP copied to clipboard." });
                    },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4.5 h-4.5" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "a",
                  {
                    href: `https://${server.ipAddress}:943/admin`,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "h-8 w-8 rounded-lg hover:bg-white/5 text-white/60 hover:text-white flex items-center justify-center transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4.5 h-4.5" })
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel border-white/5 bg-black/20 p-4 rounded-xl space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-white/40 uppercase tracking-widest font-black flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-3.5 h-3.5 text-blue-400" }),
              " Admin Username"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white text-sm font-bold font-mono", children: "openvpn" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel border-white/5 bg-black/20 p-4 rounded-xl space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-white/40 uppercase tracking-widest font-black flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-3.5 h-3.5 text-blue-400" }),
              " Admin Password"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white font-mono text-sm font-bold", children: server.password ? "••••••••" : "Generating..." }),
              server.password && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 rounded-lg hover:bg-white/5 text-white/60 hover:text-white",
                  onClick: () => handleCopy(server.password || "", server.id),
                  children: copiedId === server.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-4.5 h-4.5 text-green-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-4.5 h-4.5" })
                }
              )
            ] })
          ] })
        ] }),
        server.status === "configuring" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin text-amber-400 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-amber-400", children: "Automated Setup Wizard Running" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/50 leading-relaxed mt-0.5", children: "Logging into the server console over SSH automatically, bypassing first-login interactive prompts, and configuring user password credentials." })
          ] })
        ] }),
        server.status === "failed" && server.errorMessage && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-red-500/10 border border-red-500/25 flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-red-400 shrink-0 mt-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold text-red-400", children: "Deployment Error" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/70 leading-relaxed mt-0.5 font-mono", children: server.errorMessage })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end pt-2 border-t border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => {
              if (confirm("Are you sure you want to terminate this droplet and delete the VPN server?")) {
                deleteMutation.mutate(server.id);
              }
            },
            disabled: deleteMutation.isPending,
            variant: "destructive",
            className: "bg-red-500/10 hover:bg-red-500/20 text-red-200 border border-red-500/25 font-bold rounded-xl flex items-center gap-2 h-10 px-4 transition-all",
            children: [
              deleteMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }),
              "Terminate Server"
            ]
          }
        ) })
      ] })
    ] }, server.id)) })
  ] });
}
export {
  OpenVpnPage as default
};
