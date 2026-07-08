import { e as useToast, r as reactExports, u as useQuery, f as useMutation, j as jsxRuntimeExports, M as Megaphone, B as Button, X, x as Send, q as queryClient } from "./index-ClOeJcc_.js";
import { a as api, b as buildUrl } from "./routes-CWcsvMaP.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-B5KzlWrP.js";
import { I as Input } from "./input-DGFOLtxX.js";
import { T as Textarea } from "./textarea-rWD3o-Cf.js";
import { T as Table, d as TableBody, b as TableRow, e as TableCell } from "./table-CdZvakYU.js";
import { D as Dialog, a as DialogTrigger, b as DialogContent, c as DialogHeader, d as DialogTitle } from "./dialog--65ZQe9x.js";
import { C as Checkbox } from "./checkbox-B8yP097u.js";
import { B as Badge } from "./badge-DtJYzyRn.js";
import { P as Plus } from "./plus-Dtsiijx0.js";
import { T as Trash2 } from "./trash-2-DHNdCRF1.js";
import { S as Save } from "./save-0mmSjzCV.js";
import { P as Pen } from "./pen-CP74BxIR.js";
import "./index-DwfS90rP.js";
import "./schema-D5pAa-U7.js";
import "./index-Cepu-6RY.js";
function BroadcastPage() {
  const { toast } = useToast();
  const [message, setMessage] = reactExports.useState("");
  const [imageUrl, setImageUrl] = reactExports.useState("");
  const [buttonText, setButtonText] = reactExports.useState("");
  const [buttonUrl, setButtonUrl] = reactExports.useState("");
  const [botType, setBotType] = reactExports.useState("main");
  const [uploading, setUploading] = reactExports.useState(false);
  const [interval, setInterval] = reactExports.useState("0");
  const [newChannel, setNewChannel] = reactExports.useState({ channelId: "", name: "" });
  const [selectedChannels, setSelectedChannels] = reactExports.useState([]);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editContent, setEditingContent] = reactExports.useState("");
  const [editImageUrl, setEditImageUrl] = reactExports.useState("");
  const [editButtonText, setEditButtonText] = reactExports.useState("");
  const [editButtonUrl, setEditButtonUrl] = reactExports.useState("");
  const [editInterval, setEditInterval] = reactExports.useState("0");
  const { data: channels, isLoading: channelsLoading } = useQuery({
    queryKey: [api.broadcast.channels.list.path]
  });
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: [api.broadcast.messages.list.path]
  });
  const createChannelMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(api.broadcast.channels.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.broadcast.channels.list.path] });
      setNewChannel({ channelId: "", name: "" });
      toast({ title: "Success", description: "Channel added successfully" });
    }
  });
  const deleteChannelMutation = useMutation({
    mutationFn: async (id) => {
      await fetch(buildUrl(api.broadcast.channels.delete.path, { id }), {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.broadcast.channels.list.path] });
      toast({ title: "Success", description: "Channel removed" });
    }
  });
  const saveMessageMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(api.broadcast.messages.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to save message");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.broadcast.messages.list.path] });
      setMessage("");
      setImageUrl("");
      setButtonText("");
      setButtonUrl("");
      setInterval("0");
      toast({ title: "Saved", description: "Message saved to list" });
    },
    onError: (error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });
  const updateMessageMutation = useMutation({
    mutationFn: async ({ id, ...data }) => {
      const res = await fetch(buildUrl(api.broadcast.messages.update.path, { id }), {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.broadcast.messages.list.path] });
      setEditingId(null);
      toast({ title: "Updated", description: "Message updated" });
    }
  });
  const deleteMessageMutation = useMutation({
    mutationFn: async (id) => {
      await fetch(buildUrl(api.broadcast.messages.delete.path, { id }), {
        method: "DELETE"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.broadcast.messages.list.path] });
      toast({ title: "Deleted", description: "Message removed" });
    }
  });
  const broadcastMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch(api.broadcast.send.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: data.message,
          photo: data.imageUrl,
          channelIds: data.channelIds,
          message: data.message,
          buttonText: data.buttonText,
          buttonUrl: data.buttonUrl,
          botType: data.botType
        })
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Broadcast Complete",
        description: `Successfully sent to ${data.count} recipients`
      });
    }
  });
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/broadcast/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        toast({ title: "Success", description: "Image uploaded successfully" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };
  const handleEditFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/broadcast/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.imageUrl) {
        setEditImageUrl(data.imageUrl);
        toast({ title: "Success", description: "Image uploaded successfully" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
    }
  };
  const toggleChannel = (channelId) => {
    setSelectedChannels(
      (prev) => prev.includes(channelId) ? prev.filter((id) => id !== channelId) : [...prev, channelId]
    );
  };
  const [fromChatId, setFromChatId] = reactExports.useState("");
  const [messageId, setMessageId] = reactExports.useState("");
  const forwardMutation = useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/broadcast/forward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.count === 0 && data.failCount > 0) {
        toast({
          title: "Forward Failed",
          description: `Failed to forward to ${data.failCount} recipients. Check if the bot is a member of those chats.`,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Forward Complete",
          description: `Successfully forwarded to ${data.count} recipients${data.failCount > 0 ? ` (${data.failCount} failed)` : ""}`
        });
      }
      setFromChatId("");
      setMessageId("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold tracking-tight text-white", children: "Broadcast" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/40 mt-1", children: "Send and manage automated messages." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "xl:col-span-1 space-y-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-white flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "w-5 h-5 text-purple-400" }),
            "Compose"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-white/40", children: "Select Bot" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: botType === "main" ? "default" : "outline",
                    className: `flex-1 ${botType === "main" ? "bg-purple-600" : "border-white/10 text-white"}`,
                    onClick: () => setBotType("main"),
                    children: "Main Bot"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: botType === "broadcast" ? "default" : "outline",
                    className: `flex-1 ${botType === "broadcast" ? "bg-purple-600" : "border-white/10 text-white"}`,
                    onClick: () => setBotType("broadcast"),
                    children: "Broadcast Bot"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-white/40", children: "Interval (minutes, 0 for manual)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  className: "glass-panel border-white/10 text-white",
                  value: interval,
                  onChange: (e) => setInterval(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-white/40", children: "Upload Image (Optional)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "file",
                    accept: "image/*",
                    className: "glass-panel border-white/10 text-white cursor-pointer file:bg-purple-600 file:border-0 file:text-white file:rounded-md file:px-2 file:mr-2",
                    onChange: handleFileUpload,
                    disabled: uploading
                  }
                ),
                imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => setImageUrl(""), className: "text-red-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
              ] }),
              imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 p-1 bg-white/5 rounded-lg border border-white/10 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: imageUrl,
                  className: "w-full h-auto max-h-[300px] object-contain rounded-md",
                  alt: "Preview",
                  onLoad: (e) => {
                    const img = e.currentTarget;
                    console.log(`Preview image loaded: ${img.naturalWidth}x${img.naturalHeight}`);
                  },
                  onError: () => {
                    console.error("Preview image failed to load:", imageUrl);
                    toast({ title: "Preview Error", description: "Failed to load image preview", variant: "destructive" });
                  }
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                placeholder: "Enter message...",
                className: "min-h-[150px] glass-panel border-white/10 text-white",
                value: message,
                onChange: (e) => setMessage(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-white/40", children: "Button Text" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "e.g. Visit Bot",
                    className: "glass-panel border-white/10 text-white",
                    value: buttonText,
                    onChange: (e) => setButtonText(e.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-white/40", children: "Button URL" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "t.me/yourbot",
                    className: "glass-panel border-white/10 text-white",
                    value: buttonUrl,
                    onChange: (e) => setButtonUrl(e.target.value)
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  className: "flex-1 bg-purple-600 hover:bg-purple-500",
                  disabled: !message || broadcastMutation.isPending,
                  onClick: () => broadcastMutation.mutate({ message, imageUrl, buttonText, buttonUrl, channelIds: selectedChannels, botType }),
                  children: "Send Now"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  className: "flex-1 border-white/10 text-white",
                  disabled: !message || saveMessageMutation.isPending,
                  onClick: () => saveMessageMutation.mutate({ content: message, imageUrl, buttonText, buttonUrl, interval: Number(interval) || null }),
                  children: "Save Message"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-white flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-5 h-5 text-blue-400" }),
            "Forward Message"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-white/40", children: "From Chat ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. -100123456789",
                  className: "glass-panel border-white/10 text-white",
                  value: fromChatId,
                  onChange: (e) => setFromChatId(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-white/40", children: "Message ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. 1234",
                  className: "glass-panel border-white/10 text-white",
                  value: messageId,
                  onChange: (e) => setMessageId(e.target.value)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-white/20", children: [
                "Copy message link to find ID (e.g. t.me/chat/",
                /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "1234" }),
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                className: "w-full bg-blue-600 hover:bg-blue-500",
                disabled: !fromChatId || !messageId || forwardMutation.isPending,
                onClick: () => forwardMutation.mutate({ fromChatId, messageId, channelIds: selectedChannels }),
                children: "Forward Now"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-white", children: "Channels" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-white/40 hover:text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass-panel border-white/10 bg-[#0f0a1e]/90", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-white", children: "Add Channel" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Channel ID", className: "glass-panel text-white", value: newChannel.channelId, onChange: (e) => setNewChannel({ ...newChannel, channelId: e.target.value }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { placeholder: "Name", className: "glass-panel text-white", value: newChannel.name, onChange: (e) => setNewChannel({ ...newChannel, name: e.target.value }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "w-full bg-purple-600", onClick: () => createChannelMutation.mutate(newChannel), children: "Add" })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[300px] overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: channels?.map((channel) => /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-white/5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: selectedChannels.includes(channel.channelId), onCheckedChange: () => toggleChannel(channel.channelId), className: "border-white/20" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-white text-sm", children: channel.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", onClick: () => deleteChannelMutation.mutate(channel.id), className: "text-white/20 hover:text-red-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) }) })
          ] }, channel.id)) }) }) }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "xl:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 h-full", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-white", children: "Saved & Scheduled Messages" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid gap-4", children: messages?.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-2xl glass-panel border-white/5 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              msg.interval ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-blue-500/10 text-blue-400", children: [
                "Every ",
                msg.interval,
                "m"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "outline", className: "text-white/40", children: "Manual" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: msg.status === "active" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400", children: msg.status }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { variant: "outline", className: "text-white/40", children: [
                "Sent: ",
                msg.sentCount || 0
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-white/40", onClick: () => {
                if (msg.status === "active") updateMessageMutation.mutate({ id: msg.id, status: "paused" });
                else updateMessageMutation.mutate({ id: msg.id, status: "active" });
              }, children: msg.status === "active" ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-white/40", onClick: () => {
                setEditingId(msg.id);
                setEditingContent(msg.content);
                setEditImageUrl(msg.imageUrl || "");
                setEditButtonText(msg.buttonText || "");
                setEditButtonUrl(msg.buttonUrl || "");
                setEditInterval(msg.interval?.toString() || "0");
              }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pen, { className: "w-4 h-4" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "icon", variant: "ghost", className: "text-white/40 hover:text-red-400", onClick: () => deleteMessageMutation.mutate(msg.id), children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" }) })
            ] })
          ] }),
          editingId === msg.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "file",
                  accept: "image/*",
                  className: "glass-panel border-white/10 text-white cursor-pointer",
                  onChange: handleEditFileUpload
                }
              ),
              editImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "icon", onClick: () => setEditImageUrl(""), className: "text-red-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
            ] }),
            editImageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 p-1 bg-white/5 rounded-lg border border-white/10 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: editImageUrl,
                className: "w-full h-auto max-h-[300px] object-contain rounded-md",
                alt: "Edit Preview",
                onLoad: (e) => {
                  const img = e.currentTarget;
                  console.log(`Edit preview image loaded: ${img.naturalWidth}x${img.naturalHeight}`);
                },
                onError: () => {
                  console.error("Edit preview image failed to load:", editImageUrl);
                  toast({ title: "Preview Error", description: "Failed to load edit image preview", variant: "destructive" });
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold text-white/40", children: "Interval (minutes)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  min: "0",
                  className: "glass-panel text-white",
                  value: editInterval,
                  onChange: (e) => setEditInterval(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { className: "glass-panel text-white", value: editContent, onChange: (e) => setEditingContent(e.target.value) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Button Text",
                  className: "glass-panel text-white",
                  value: editButtonText,
                  onChange: (e) => setEditButtonText(e.target.value)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "Button URL",
                  className: "glass-panel text-white",
                  value: editButtonUrl,
                  onChange: (e) => setEditButtonUrl(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", className: "bg-purple-600", onClick: () => updateMessageMutation.mutate({ id: msg.id, content: editContent, imageUrl: editImageUrl, buttonText: editButtonText, buttonUrl: editButtonUrl, interval: Number(editInterval) }), children: "Save" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", variant: "ghost", onClick: () => setEditingId(null), children: "Cancel" })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            msg.imageUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: msg.imageUrl, className: "w-full max-h-[200px] object-cover rounded-xl border border-white/10", alt: "Preview" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-white/60 whitespace-pre-wrap", children: msg.content }),
            msg.buttonText && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "w-full border-purple-500/30 text-purple-400 pointer-events-none", children: msg.buttonText })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "w-full text-xs text-purple-400 hover:bg-purple-400/10", onClick: () => broadcastMutation.mutate({ message: msg.content, imageUrl: msg.imageUrl, buttonText: msg.buttonText, buttonUrl: msg.buttonUrl, channelIds: selectedChannels }), children: "Broadcast This Now" })
        ] }, msg.id)) }) })
      ] }) })
    ] })
  ] });
}
export {
  BroadcastPage as default
};
