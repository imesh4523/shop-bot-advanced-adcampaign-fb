import { e as useToast, N as useQueryClient, r as reactExports, u as useQuery, f as useMutation, ac as lookup, j as jsxRuntimeExports, h as MessageSquare, L as LoaderCircle, B as Button, ah as Settings, X, w as Send, i as apiRequest } from "./index-BkoZG9Fa.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent, d as CardDescription } from "./card-C6yw3WxF.js";
import { I as Input } from "./input-ON1LrtA4.js";
import { D as Dialog, b as DialogContent, c as DialogHeader, d as DialogTitle, e as DialogDescription, f as DialogFooter } from "./dialog-btiI1mDC.js";
import { B as Bot } from "./bot-B4mvvXE1.js";
import { S as Search } from "./search-BvKLYhYz.js";
import { T as Trash2 } from "./trash-2-DIEYE0o2.js";
import { F as FileText } from "./file-text-DxBjvreF.js";
import { Z as Zap, P as Paperclip } from "./zap-Cbsr-MRp.js";
import { P as Plus } from "./plus-Bu0G3nBA.js";
import { f as format } from "./format-Fqx7OmaC.js";
const QUICK_REPLIES = [
  "Hello! How can I help you today?",
  "Please send the transaction ID (TXID / Hash) of your payment.",
  "Your deposit has been verified! Please check your balance.",
  "This account is currently out of stock. We will restock it shortly.",
  "Thank you for contacting us! Let us know if you need anything else."
];
function SupportChatPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedChatId, setSelectedChatId] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [replyText, setReplyText] = reactExports.useState("");
  const messagesEndRef = reactExports.useRef(null);
  const [isUploadingFile, setIsUploadingFile] = reactExports.useState(false);
  const [uploadedAttachment, setUploadedAttachment] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const [lightboxUrl, setLightboxUrl] = reactExports.useState(null);
  const [isClearingChat, setIsClearingChat] = reactExports.useState(false);
  const [isClearingMedia, setIsClearingMedia] = reactExports.useState(false);
  const [isEditingTemplates, setIsEditingTemplates] = reactExports.useState(false);
  const [editingList, setEditingList] = reactExports.useState([]);
  const { data: chats = [], isLoading: isChatsLoading } = useQuery({
    queryKey: ["/api/support/chats"],
    refetchInterval: 4e3
  });
  const { data: messages = [], isLoading: isMessagesLoading } = useQuery({
    queryKey: ["/api/support/messages", selectedChatId],
    queryFn: async () => {
      if (!selectedChatId) return [];
      const res = await fetch(`/api/support/messages/${selectedChatId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!selectedChatId,
    refetchInterval: 4e3
  });
  const { data: quickRepliesSetting } = useQuery({
    queryKey: ["/api/settings/SUPPORT_QUICK_REPLIES"]
  });
  let parsedQuickReplies = QUICK_REPLIES;
  if (quickRepliesSetting?.value) {
    try {
      const parsed = JSON.parse(quickRepliesSetting.value);
      if (Array.isArray(parsed) && parsed.every((p) => typeof p === "string")) {
        parsedQuickReplies = parsed;
      }
    } catch (e) {
      console.error("Failed to parse custom quick replies setting:", e);
    }
  }
  const quickRepliesMutation = useMutation({
    mutationFn: async (replies) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "SUPPORT_QUICK_REPLIES",
        value: JSON.stringify(replies.filter((r) => r.trim() !== ""))
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/SUPPORT_QUICK_REPLIES"] });
      toast({
        title: "Templates Saved",
        description: "Your live chat fast reply templates have been updated."
      });
    },
    onError: (err) => {
      toast({
        title: "Failed to Save Templates",
        description: err.message,
        variant: "destructive"
      });
    }
  });
  reactExports.useEffect(() => {
    const socket = lookup();
    socket.on("support_message", (msg) => {
      queryClient.setQueryData(["/api/support/chats"], (oldChats = []) => {
        const chatsCopy = [...oldChats];
        const existingIdx = chatsCopy.findIndex((c) => c.telegramId === msg.telegramId);
        const updatedChat = {
          telegramId: msg.telegramId,
          username: msg.username,
          firstName: msg.firstName,
          lastName: msg.lastName,
          lastMessage: msg.message,
          lastMessageAt: msg.createdAt
        };
        if (existingIdx > -1) {
          chatsCopy.splice(existingIdx, 1);
        }
        return [updatedChat, ...chatsCopy];
      });
      if (selectedChatId && msg.telegramId === selectedChatId) {
        queryClient.setQueryData(
          ["/api/support/messages", selectedChatId],
          (oldMessages = []) => {
            if (oldMessages.some((m) => m.id === msg.id)) return oldMessages;
            return [...oldMessages, msg];
          }
        );
      }
      queryClient.invalidateQueries({ queryKey: ["/api/support/chats"] });
      if (selectedChatId && msg.telegramId === selectedChatId) {
        queryClient.invalidateQueries({ queryKey: ["/api/support/messages", selectedChatId] });
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [selectedChatId, queryClient]);
  reactExports.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const sendReplyMutation = useMutation({
    mutationFn: async ({ telegramId, message, attachmentUrl, attachmentType }) => {
      const res = await apiRequest("POST", "/api/support/reply", { telegramId, message, attachmentUrl, attachmentType });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to send message");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setReplyText("");
      setUploadedAttachment(null);
      queryClient.invalidateQueries({ queryKey: ["/api/support/messages", selectedChatId] });
      queryClient.invalidateQueries({ queryKey: ["/api/support/chats"] });
    },
    onError: (err) => {
      toast({
        title: "Send Failed",
        description: err.message,
        variant: "destructive"
      });
    }
  });
  const handleSendReply = () => {
    if (!selectedChatId || sendReplyMutation.isPending) return;
    if (!replyText.trim() && !uploadedAttachment) return;
    sendReplyMutation.mutate({
      telegramId: selectedChatId,
      message: replyText.trim(),
      attachmentUrl: uploadedAttachment?.url || null,
      attachmentType: uploadedAttachment?.type || null
    });
  };
  const handleUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingFile(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/support/upload", {
        method: "POST",
        body: formData
      });
      if (!res.ok) {
        throw new Error("Upload failed");
      }
      const data = await res.json();
      setUploadedAttachment({
        url: data.fileUrl,
        type: file.type.startsWith("image/") ? "image" : "pdf",
        name: file.name
      });
      toast({
        title: "File Uploaded",
        description: `${file.name} uploaded successfully.`
      });
    } catch (err) {
      toast({
        title: "Upload Failed",
        description: err.message || "Failed to upload file.",
        variant: "destructive"
      });
    } finally {
      setIsUploadingFile(false);
    }
  };
  const handleClearChat = async () => {
    if (!selectedChatId) return;
    if (!confirm("Are you sure you want to permanently clear this chat history?")) return;
    setIsClearingChat(true);
    try {
      const res = await fetch(`/api/support/chats/${selectedChatId}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to clear chat");
      toast({
        title: "Chat Cleared",
        description: "Chat history has been cleared successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/support/messages", selectedChatId] });
      queryClient.invalidateQueries({ queryKey: ["/api/support/chats"] });
    } catch (err) {
      toast({
        title: "Action Failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsClearingChat(false);
    }
  };
  const handleClearMedia = async () => {
    if (!selectedChatId) return;
    if (!confirm("Are you sure you want to delete all photos and PDF attachments from this chat?")) return;
    setIsClearingMedia(true);
    try {
      const res = await fetch(`/api/support/chats/${selectedChatId}/media`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to clear media");
      toast({
        title: "Media Cleared",
        description: "All files and attachments have been removed from this chat."
      });
      queryClient.invalidateQueries({ queryKey: ["/api/support/messages", selectedChatId] });
      queryClient.invalidateQueries({ queryKey: ["/api/support/chats"] });
    } catch (err) {
      toast({
        title: "Action Failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setIsClearingMedia(false);
    }
  };
  const getAvatarInitials = (chat) => {
    if (chat.firstName) {
      return (chat.firstName[0] + (chat.lastName?.[0] || "")).toUpperCase();
    }
    if (chat.username) {
      return chat.username.slice(0, 2).toUpperCase();
    }
    return "?";
  };
  const getAvatarBg = (chat) => {
    const colors = [
      "from-pink-500 to-rose-500",
      "from-purple-500 to-indigo-500",
      "from-blue-500 to-cyan-500",
      "from-emerald-500 to-teal-500",
      "from-amber-500 to-orange-500"
    ];
    const name = chat.firstName || chat.username || chat.telegramId;
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };
  const filteredChats = chats.filter((c) => {
    const searchLower = searchQuery.toLowerCase();
    return c.telegramId.includes(searchLower) || c.username && c.username.toLowerCase().includes(searchLower) || c.firstName && c.firstName.toLowerCase().includes(searchLower) || c.lastName && c.lastName.toLowerCase().includes(searchLower);
  });
  const activeChat = chats.find((c) => c.telegramId === selectedChatId);
  const openTemplateEditor = () => {
    setEditingList([...parsedQuickReplies]);
    setIsEditingTemplates(true);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8 animate-in fade-in duration-700", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-10 h-10 text-purple-400" }),
          "Telegram Live Support"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground/80 mt-2 font-medium", children: "Respond instantly to customer queries received on your Telegram Support Bot." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel px-6 py-2.5 rounded-full flex items-center gap-3 text-sm font-bold text-white shadow-lg border-white/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-5 h-5 text-purple-400" }),
        "Live Agent Active"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[650px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "lg:col-span-1 glass-card border-0 flex flex-col h-[650px] overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "p-5 border-b border-white/5 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg font-bold flex items-center gap-2", children: "Conversations" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-3 w-4 h-4 text-white/30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "text",
                placeholder: "Search customers...",
                className: "pl-9 h-11 bg-white/[0.03] border-white/10 rounded-xl focus:border-purple-500/50",
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-0 flex-1 overflow-y-auto min-h-0", children: isChatsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full gap-3 text-white/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-purple-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider", children: "Loading chats..." })
        ] }) : filteredChats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full p-6 text-center text-white/30 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-12 h-12 stroke-[1.5]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold uppercase tracking-wider", children: "No active threads" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/20", children: "Provide the Support Bot Token in Settings to receive live messages." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-white/5", children: filteredChats.map((chat) => {
          const isSelected = selectedChatId === chat.telegramId;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setSelectedChatId(chat.telegramId),
              className: `w-full p-4 flex gap-4 text-left transition-all duration-300 items-start ${isSelected ? "bg-purple-950/20 border-l-4 border-purple-500" : "hover:bg-white/[0.02] border-l-4 border-transparent"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-11 h-11 rounded-xl bg-gradient-to-tr ${getAvatarBg(chat)} flex items-center justify-center font-bold text-white shadow-md text-sm shrink-0`, children: getAvatarInitials(chat) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-baseline mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-extrabold text-sm text-white truncate", children: chat.firstName ? `${chat.firstName} ${chat.lastName || ""}`.trim() : `@${chat.username || chat.telegramId}` }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-white/30 font-semibold uppercase shrink-0", children: chat.lastMessageAt ? format(new Date(chat.lastMessageAt), "hh:mm a") : "" })
                  ] }),
                  chat.username && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-purple-400/80 font-bold block mb-1", children: [
                    "@",
                    chat.username
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50 truncate leading-relaxed", children: chat.lastMessage })
                ] })
              ]
            },
            chat.telegramId
          );
        }) }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "lg:col-span-2 glass-card border-0 flex flex-col h-[650px] overflow-hidden", children: selectedChatId && activeChat ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { className: "p-5 border-b border-white/5 shrink-0 flex flex-row items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-11 h-11 rounded-xl bg-gradient-to-tr ${getAvatarBg(activeChat)} flex items-center justify-center font-bold text-white text-sm shadow`, children: getAvatarInitials(activeChat) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-lg font-extrabold text-white", children: activeChat.firstName ? `${activeChat.firstName} ${activeChat.lastName || ""}`.trim() : `@${activeChat.username || activeChat.telegramId}` }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardDescription, { className: "text-xs text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" }),
                "ID: ",
                activeChat.telegramId,
                " ",
                activeChat.username ? `• @${activeChat.username}` : ""
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                onClick: handleClearMedia,
                disabled: isClearingMedia || isClearingChat,
                className: "h-8 px-3 text-white/50 hover:text-orange-400 hover:bg-white/[0.03] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all",
                children: [
                  isClearingMedia ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                  "Clear Media Only"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                onClick: handleClearChat,
                disabled: isClearingChat || isClearingMedia,
                className: "h-8 px-3 text-white/50 hover:text-red-400 hover:bg-white/[0.03] text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all",
                children: [
                  isClearingChat ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-3.5 h-3.5" }),
                  "Clear Full Chat"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-6 min-h-0 bg-[#0c0816]/30", children: isMessagesLoading && messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full text-white/40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-purple-400" }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          messages.map((msg, index) => {
            const isAdmin = msg.sender === "admin";
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `flex ${isAdmin ? "justify-end" : "justify-start"}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex gap-3 max-w-[70%] items-end ${isAdmin ? "flex-row-reverse" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex flex-col space-y-1`, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `px-4 py-3 rounded-2xl shadow-sm text-sm font-medium leading-relaxed break-all ${isAdmin ? "bg-[#18112e] text-white rounded-br-none border border-white/5" : "bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-bl-none"}`, children: [
                    msg.attachmentUrl && msg.attachmentType === "image" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 max-w-full overflow-hidden rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "img",
                      {
                        src: msg.attachmentUrl,
                        alt: "attachment",
                        className: "max-w-[280px] h-auto rounded-xl hover:opacity-90 transition-opacity cursor-pointer border border-white/10",
                        onClick: () => setLightboxUrl(msg.attachmentUrl || null)
                      }
                    ) }),
                    msg.attachmentUrl && msg.attachmentType === "pdf" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "a",
                      {
                        href: msg.attachmentUrl,
                        target: "_blank",
                        rel: "noreferrer",
                        className: "flex items-center gap-2 p-2.5 bg-black/20 rounded-xl mb-2 hover:bg-black/35 transition-all text-purple-300 font-bold border border-white/5",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4 text-purple-400 shrink-0" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-xs hover:underline", children: "View PDF Document" })
                        ]
                      }
                    ),
                    (!msg.attachmentUrl || msg.message !== "📷 Photo Attachment" && msg.message !== "📄 PDF Attachment") && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: msg.message })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[9px] text-white/30 font-semibold uppercase ${isAdmin ? "text-right" : "text-left"}`, children: format(new Date(msg.createdAt), "hh:mm a") })
                ] }) })
              },
              msg.id || index
            );
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-t border-white/5 bg-[#0f0a1a]/50 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] font-black uppercase text-purple-400 tracking-wider", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-3.5 h-3.5 fill-purple-400/20 text-purple-400" }),
              "Fast Replies"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "ghost",
                onClick: openTemplateEditor,
                className: "h-6 px-2 hover:bg-white/[0.05] text-white/50 hover:text-white flex items-center gap-1 text-[10px] font-bold rounded-lg",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-3.5 h-3.5" }),
                  "Edit Templates"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 overflow-x-auto scrollbar-none pb-1 select-none", children: parsedQuickReplies.map((reply, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setReplyText(reply),
              className: "px-3.5 py-2 text-[11px] font-bold bg-white/[0.03] hover:bg-purple-600 hover:text-white border border-white/5 rounded-full text-white/70 whitespace-nowrap transition-all duration-300 animate-in fade-in",
              children: reply
            },
            idx
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 bg-[#0f0a1a] border-t border-white/5 shrink-0 flex flex-col gap-3", children: [
          uploadedAttachment && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-2.5 bg-purple-950/40 border border-purple-500/20 rounded-2xl animate-in slide-in-from-bottom-2 duration-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 text-xs font-bold text-white truncate", children: [
              uploadedAttachment.type === "image" ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: uploadedAttachment.url, alt: "preview", className: "w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-8 h-8 text-purple-400 shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: uploadedAttachment.name })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                onClick: () => setUploadedAttachment(null),
                className: "p-1 h-8 w-8 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "form",
            {
              onSubmit: (e) => {
                e.preventDefault();
                handleSendReply();
              },
              className: "flex gap-3 items-center",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "file",
                    ref: fileInputRef,
                    className: "hidden",
                    onChange: handleUploadFile,
                    accept: "image/*,application/pdf"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "button",
                    variant: "outline",
                    onClick: () => fileInputRef.current?.click(),
                    disabled: isUploadingFile || sendReplyMutation.isPending,
                    className: "h-14 w-14 rounded-2xl bg-white/[0.03] border-white/10 flex items-center justify-center transition-all hover:bg-white/[0.08] active:scale-95 disabled:opacity-50 shrink-0",
                    children: isUploadingFile ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin text-purple-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "w-5 h-5 text-white/60" })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "text",
                    placeholder: "Write a message...",
                    value: replyText,
                    onChange: (e) => setReplyText(e.target.value),
                    className: "h-14 bg-white/[0.03] border-white/10 rounded-2xl focus:border-purple-500/50 flex-1 min-w-0",
                    disabled: sendReplyMutation.isPending
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    className: "h-14 w-14 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg shadow-purple-500/10 active:scale-95 transition-all shrink-0",
                    disabled: !replyText.trim() && !uploadedAttachment || sendReplyMutation.isPending,
                    children: sendReplyMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-5 h-5" })
                  }
                )
              ]
            }
          )
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full p-8 text-center text-white/30 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-full bg-purple-950/20 border border-purple-500/15 flex items-center justify-center text-purple-400", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-10 h-10 stroke-[1.5]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-xs space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base font-extrabold text-white", children: "Select a Conversation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/20", children: "Choose a user thread on the left pane to view message details and send replies." })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: isEditingTemplates, onOpenChange: setIsEditingTemplates, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "glass-panel border-white/10 bg-black/90 text-white max-w-lg rounded-2xl p-6 max-h-[calc(100dvh-4rem)] overflow-y-auto", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { className: "text-xl font-extrabold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-purple-400" }),
          "Customize Fast Replies"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { className: "text-xs text-white/40", children: "Add, edit, or delete template messages. Click a template in the chat to insert it instantly." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 my-4 max-h-[300px] overflow-y-auto pr-1", children: [
        editingList.map((template, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: template,
              onChange: (e) => {
                const updated = [...editingList];
                updated[idx] = e.target.value;
                setEditingList(updated);
              },
              placeholder: "Enter template text...",
              className: "bg-white/[0.03] border-white/10 rounded-xl text-sm"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              onClick: () => {
                const updated = [...editingList];
                updated.splice(idx, 1);
                setEditingList(updated);
              },
              className: "hover:bg-red-500/10 text-red-400 hover:text-red-300 p-2 shrink-0 rounded-xl h-10 w-10 flex items-center justify-center",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
            }
          )
        ] }, idx)),
        editingList.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-center text-white/20 py-4", children: "No templates. Add one below!" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => setEditingList([...editingList, ""]),
            className: "border-white/10 hover:bg-white/[0.05] rounded-xl flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
              "Add Template"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 sm:ml-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              onClick: () => setIsEditingTemplates(false),
              className: "rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 hover:bg-white/[0.05]",
              children: "Cancel"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => {
                quickRepliesMutation.mutate(editingList);
                setIsEditingTemplates(false);
              },
              disabled: quickRepliesMutation.isPending,
              className: "bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl text-xs font-bold uppercase tracking-wider text-white",
              children: quickRepliesMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 animate-spin" }) : "Save Changes"
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: !!lightboxUrl, onOpenChange: () => setLightboxUrl(null), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "border-0 bg-transparent text-white max-w-4xl p-0 flex items-center justify-center shadow-none select-none", children: lightboxUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-h-[85vh] max-w-full overflow-hidden flex flex-col items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: lightboxUrl,
          alt: "Enlarged view",
          className: "max-h-[80vh] max-w-full object-contain rounded-2xl shadow-2xl border border-white/5"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: () => setLightboxUrl(null),
          className: "mt-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl px-4 py-2 flex items-center gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }),
            "Close Preview"
          ]
        }
      )
    ] }) }) })
  ] });
}
export {
  SupportChatPage as default
};
