import { c as createLucideIcon, d as useToast, e as useQueryClient, r as reactExports, u as useQuery, ac as lookup, f as useMutation, j as jsxRuntimeExports, L as LoaderCircle, B as Button, w as ShieldCheck, ad as LogOut, U as Users, M as Megaphone, p as User, x as Send, h as MessageSquare, X } from "./index-3Z3iR78Z.js";
import { I as Input } from "./input-BJ8yvNVs.js";
import { m as motion, A as AnimatePresence } from "./proxy-D9PE0hkf.js";
import { K as Key } from "./key-DQY3BKrf.js";
import { A as ArrowRight } from "./arrow-right-B1l9XB2H.js";
import { L as Lock } from "./lock-B0kqOvX1.js";
import { S as Sparkles } from "./sparkles-D41MOFnI.js";
import { M as MessageCircle } from "./message-circle-aDitCOVF.js";
import { S as Search } from "./search-JqS88Ua3.js";
import { B as Bot } from "./bot-Bv4NSqIO.js";
import { I as Info } from "./info-CfleSScT.js";
import { C as CircleCheckBig } from "./circle-check-big-CQEjMsn6.js";
const AtSign = createLucideIcon("AtSign", [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8", key: "7n84p3" }]
]);
const Crown = createLucideIcon("Crown", [
  [
    "path",
    {
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",
      key: "1vdc57"
    }
  ],
  ["path", { d: "M5 21h14", key: "11awu3" }]
]);
const Hash = createLucideIcon("Hash", [
  ["line", { x1: "4", x2: "20", y1: "9", y2: "9", key: "4lhtct" }],
  ["line", { x1: "4", x2: "20", y1: "15", y2: "15", key: "vyu0kd" }],
  ["line", { x1: "10", x2: "8", y1: "3", y2: "21", key: "1ggp8o" }],
  ["line", { x1: "16", x2: "14", y1: "3", y2: "21", key: "weycgp" }]
]);
const IdCard = createLucideIcon("IdCard", [
  ["path", { d: "M16 10h2", key: "8sgtl7" }],
  ["path", { d: "M16 14h2", key: "epxaof" }],
  ["path", { d: "M6.17 15a3 3 0 0 1 5.66 0", key: "n6f512" }],
  ["circle", { cx: "9", cy: "11", r: "2", key: "yxgjnd" }],
  ["rect", { x: "2", y: "5", width: "20", height: "14", rx: "2", key: "qneu4z" }]
]);
const PhoneCall = createLucideIcon("PhoneCall", [
  [
    "path",
    {
      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
      key: "foiqr5"
    }
  ],
  ["path", { d: "M14.05 2a9 9 0 0 1 8 7.94", key: "vmijpz" }],
  ["path", { d: "M14.05 6A5 5 0 0 1 18 10", key: "13nbpp" }]
]);
const Phone = createLucideIcon("Phone", [
  [
    "path",
    {
      d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
      key: "foiqr5"
    }
  ]
]);
function TelegramClientPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [phone, setPhone] = reactExports.useState("");
  const [apiId, setApiId] = reactExports.useState("");
  const [apiHash, setApiHash] = reactExports.useState("");
  const [code, setCode] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [step, setStep] = reactExports.useState("credentials");
  const [is2FaRequired, setIs2FaRequired] = reactExports.useState(false);
  const [hasRootAccess, setHasRootAccess] = reactExports.useState(() => localStorage.getItem("tg_root_access") === "true");
  const [selectedChat, setSelectedChat] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [typedMessage, setTypedMessage] = reactExports.useState("");
  const [messages, setMessages] = reactExports.useState([]);
  const [activeTab, setActiveTab] = reactExports.useState("all");
  const [showDetailsPanel, setShowDetailsPanel] = reactExports.useState(false);
  const messagesEndRef = reactExports.useRef(null);
  const [photoErrors, setPhotoErrors] = reactExports.useState({});
  const handleAccessRoot = () => {
    const key = prompt("Enter your secret key:");
    if (key === "20101001") {
      localStorage.setItem("tg_root_access", "true");
      setHasRootAccess(true);
      toast({
        title: "Access Granted",
        description: "Root directory access successfully authorized."
      });
    } else if (key !== null) {
      toast({
        title: "Access Denied",
        description: "Invalid secret key.",
        variant: "destructive"
      });
    }
  };
  const handleLockRoot = () => {
    localStorage.removeItem("tg_root_access");
    setHasRootAccess(false);
    toast({
      title: "Logged Out of Root",
      description: "Root access cleared successfully."
    });
  };
  const { data: statusData, isLoading: isStatusLoading } = useQuery({
    queryKey: ["/api/telegram-client/status"]
  });
  const isConnected = statusData?.connected || false;
  const { data: chats = [], isLoading: isChatsLoading } = useQuery({
    queryKey: ["/api/telegram-client/chats"],
    enabled: isConnected,
    refetchInterval: 3e4
    // Refresh chat list every 30s
  });
  const { data: peerDetails, isLoading: isDetailsLoading, error: detailsError } = useQuery({
    queryKey: ["/api/telegram-client/peer-details", selectedChat?.id],
    queryFn: async () => {
      if (!selectedChat) return null;
      const response = await fetch(`/api/telegram-client/peer-details/${selectedChat.id}`);
      if (!response.ok) throw new Error("Failed to fetch peer details");
      return response.json();
    },
    enabled: !!selectedChat && showDetailsPanel
  });
  reactExports.useEffect(() => {
    if (!isConnected) return;
    const socket = lookup();
    socket.on("telegram_client_message", (msg) => {
      if (selectedChat && msg.chatId === selectedChat.id) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
      queryClient.invalidateQueries({ queryKey: ["/api/telegram-client/chats"] });
    });
    return () => {
      socket.disconnect();
    };
  }, [isConnected, selectedChat, queryClient]);
  reactExports.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  reactExports.useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/telegram-client/messages/${selectedChat.id}`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive"
        });
      }
    };
    fetchMessages();
  }, [selectedChat, toast]);
  const sendCodeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/telegram-client/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiId, apiHash, phoneNumber: phone })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to send code.");
      }
      return res.json();
    },
    onSuccess: () => {
      setStep("otp");
      setIs2FaRequired(false);
      toast({
        title: "OTP Sent",
        description: "Please check your Telegram app for the verification code."
      });
    },
    onError: (err) => {
      toast({
        title: "Connection Failed",
        description: err.message,
        variant: "destructive"
      });
    }
  });
  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/telegram-client/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, password })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to verify code.");
      }
      return res.json();
    },
    onSuccess: () => {
      setIs2FaRequired(false);
      queryClient.invalidateQueries({ queryKey: ["/api/telegram-client/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/telegram-client/chats"] });
      toast({
        title: "Logged In",
        description: "Telegram AI logged in successfully!"
      });
    },
    onError: (err) => {
      if (err.message && (err.message.includes("Two-step verification") || err.message.includes("2FA password") || err.message.includes("SESSION_PASSWORD_NEEDED"))) {
        setIs2FaRequired(true);
        toast({
          title: "2FA Password Required",
          description: "This account has 2FA enabled. Please enter your 2FA password."
        });
      } else {
        toast({
          title: "Verification Failed",
          description: err.message,
          variant: "destructive"
        });
      }
    }
  });
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/telegram-client/logout", { method: "POST" });
      if (!res.ok) throw new Error("Failed to logout");
      return res.json();
    },
    onSuccess: () => {
      setSelectedChat(null);
      setMessages([]);
      setStep("credentials");
      setIs2FaRequired(false);
      localStorage.removeItem("tg_root_access");
      setHasRootAccess(false);
      queryClient.invalidateQueries({ queryKey: ["/api/telegram-client/status"] });
      toast({
        title: "Logged Out",
        description: "Telegram session closed."
      });
    }
  });
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!selectedChat || !typedMessage.trim()) return;
      const text = typedMessage;
      setTypedMessage("");
      const res = await fetch("/api/telegram-client/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: selectedChat.id, text })
      });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: (newMsg) => {
      if (newMsg) {
        setMessages((prev) => [...prev, newMsg]);
        queryClient.invalidateQueries({ queryKey: ["/api/telegram-client/chats"] });
      }
    },
    onError: (err) => {
      toast({
        title: "Send Failed",
        description: err.message,
        variant: "destructive"
      });
    }
  });
  const getAvatarInitials = (name) => {
    if (!name) return "?";
    return name.slice(0, 2).toUpperCase();
  };
  const getAvatarBg = (name) => {
    const colors = [
      "from-pink-500 to-rose-500",
      "from-purple-500 to-indigo-500",
      "from-blue-500 to-cyan-500",
      "from-emerald-500 to-teal-500",
      "from-amber-500 to-orange-500"
    ];
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };
  const renderAvatar = (id, name, sizeClass) => {
    const hasError = photoErrors[id];
    if (hasError) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `${sizeClass} rounded-full flex items-center justify-center font-bold bg-gradient-to-tr shadow-md shrink-0 ${getAvatarBg(
            name
          )}`,
          children: getAvatarInitials(name)
        }
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${sizeClass} rounded-full flex items-center justify-center font-bold bg-slate-800 shadow-md shrink-0 overflow-hidden`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "img",
      {
        src: `/api/telegram-client/profile-photo/${id}`,
        alt: name,
        className: "w-full h-full object-cover rounded-full",
        onError: () => setPhotoErrors((prev) => ({ ...prev, [id]: true }))
      }
    ) });
  };
  const filteredChats = chats.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const groupsCount = chats.filter((c) => c.type === "group" || c.type === "channel").length;
  const contactsCount = chats.filter((c) => c.type === "user" && c.isContact && !c.isBot).length;
  const nonContactsCount = chats.filter((c) => c.type === "user" && !c.isContact && !c.isBot).length;
  const botsCount = chats.filter((c) => c.isBot).length;
  const displayedChats = filteredChats.filter((chat) => {
    if (activeTab === "all") return true;
    if (activeTab === "groups") return chat.type === "group" || chat.type === "channel";
    if (activeTab === "contacts") return chat.type === "user" && chat.isContact && !chat.isBot;
    if (activeTab === "non-contacts") return chat.type === "user" && !chat.isContact && !chat.isBot;
    if (activeTab === "bots") return !!chat.isBot;
    return true;
  });
  if (isStatusLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-screen items-center justify-center bg-slate-950", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-10 w-10 animate-spin text-purple-500" }) });
  }
  if (!isConnected) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-[100dvh] w-full overflow-y-auto bg-[#0a0a0c] relative scrollbar-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0 pointer-events-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            animate: {
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            },
            transition: { duration: 10, repeat: Infinity, ease: "linear" },
            className: "absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            animate: {
              scale: [1.1, 1, 1.1],
              opacity: [0.2, 0.4, 0.2]
            },
            transition: { duration: 12, repeat: Infinity, ease: "linear" },
            className: "absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-full w-full flex items-center justify-center p-4 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          className: "w-full max-w-[440px] my-auto",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card p-6 sm:p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-sm" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center space-y-8", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.div,
                  {
                    whileHover: { scale: 1.05, rotate: 5 },
                    className: "relative",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-[1.75rem] bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-purple-600/40 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-10 h-10 text-white" }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-purple-600/30 blur-2xl rounded-full -z-10 animate-pulse" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-3", children: [
                  step !== "credentials" && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.h1,
                    {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      transition: { delay: 0.2 },
                      className: "text-3xl font-extrabold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent",
                      children: "Verify Code"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.p,
                    {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      transition: { delay: 0.3 },
                      className: "text-muted-foreground/80 font-medium text-sm",
                      children: step === "credentials" ? "Enter API credentials to initialize MTProto" : "Enter the code sent to your Telegram account"
                    }
                  )
                ] }),
                step === "credentials" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "form",
                  {
                    onSubmit: (e) => {
                      e.preventDefault();
                      sendCodeMutation.mutate();
                    },
                    className: "w-full space-y-5",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold uppercase tracking-widest text-white/50 ml-1", children: "API ID" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Hash, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-500 transition-colors" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Input,
                            {
                              type: "number",
                              placeholder: "e.g. 1234567",
                              value: apiId,
                              onChange: (e) => setApiId(e.target.value),
                              className: "h-14 pl-12 bg-white/[0.03] border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-2xl transition-all text-white",
                              required: true
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold uppercase tracking-widest text-white/50 ml-1", children: "API Hash" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-500 transition-colors" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Input,
                            {
                              type: "text",
                              placeholder: "e.g. d2a24bb18...",
                              value: apiHash,
                              onChange: (e) => setApiHash(e.target.value),
                              className: "h-14 pl-12 bg-white/[0.03] border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-2xl transition-all text-white",
                              required: true
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold uppercase tracking-widest text-white/50 ml-1", children: "Phone Number" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-500 transition-colors" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Input,
                            {
                              type: "tel",
                              placeholder: "+94771234567",
                              value: phone,
                              onChange: (e) => setPhone(e.target.value),
                              className: "h-14 pl-12 bg-white/[0.03] border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-2xl transition-all text-white",
                              required: true
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "submit",
                          size: "lg",
                          disabled: sendCodeMutation.isPending,
                          className: "w-full h-14 rounded-2xl font-bold text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-650 hover:to-indigo-650 shadow-xl shadow-purple-600/20 transition-all active:scale-[0.98] mt-2",
                          children: sendCodeMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Initializing..." })
                          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Send Verification Code" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5" })
                          ] })
                        }
                      )
                    ]
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "form",
                  {
                    onSubmit: (e) => {
                      e.preventDefault();
                      loginMutation.mutate();
                    },
                    className: "w-full space-y-5",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold uppercase tracking-widest text-white/50 ml-1", children: "Verification Code" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-500 transition-colors" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Input,
                            {
                              type: "text",
                              placeholder: "Enter the Telegram code",
                              value: code,
                              onChange: (e) => setCode(e.target.value),
                              className: "h-14 pl-12 bg-white/[0.03] border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-2xl transition-all text-white",
                              required: true
                            }
                          )
                        ] })
                      ] }),
                      is2FaRequired && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 animate-in fade-in slide-in-from-top-2 duration-300", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-xs font-bold uppercase tracking-widest text-white/50 ml-1", children: "2FA Password" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-purple-500 transition-colors" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Input,
                            {
                              type: "password",
                              placeholder: "Two-step verification password",
                              value: password,
                              onChange: (e) => setPassword(e.target.value),
                              className: "h-14 pl-12 bg-white/[0.03] border-white/10 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-2xl transition-all text-white",
                              required: true
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "submit",
                          size: "lg",
                          disabled: loginMutation.isPending,
                          className: "w-full h-14 rounded-2xl font-bold text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-650 hover:to-indigo-650 shadow-xl shadow-purple-600/20 transition-all active:scale-[0.98] mt-2",
                          children: loginMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Verifying..." })
                          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Verify & Connect" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5" })
                          ] })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "button",
                          variant: "ghost",
                          onClick: () => {
                            setStep("credentials");
                            setIs2FaRequired(false);
                          },
                          className: "w-full h-12 rounded-2xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all",
                          children: "Back to Credentials"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3 text-purple-400 animate-pulse" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.2em] text-white/30", children: "Encrypted Session Active" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: [...Array(6)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: {
                  opacity: [0.1, 0.3, 0.1],
                  y: [0, -100, 0],
                  x: [0, i % 2 === 0 ? 30 : -30, 0]
                },
                transition: {
                  duration: 5 + i,
                  repeat: Infinity,
                  delay: i * 0.5
                },
                className: "absolute w-1 h-1 bg-purple-500 rounded-full blur-[1px]",
                style: {
                  left: `${15 + i * 15}%`,
                  top: `${80 + i * 2}%`
                }
              },
              i
            )) })
          ]
        }
      ) })
    ] });
  }
  if (isConnected && !hasRootAccess) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-[100dvh] w-full overflow-y-auto bg-[#0a0a0c] relative scrollbar-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 z-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 z-0 pointer-events-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            animate: {
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3]
            },
            transition: { duration: 10, repeat: Infinity, ease: "linear" },
            className: "absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            animate: {
              scale: [1.1, 1, 1.1],
              opacity: [0.2, 0.4, 0.2]
            },
            transition: { duration: 12, repeat: Infinity, ease: "linear" },
            className: "absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-full w-full flex items-center justify-center p-4 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20, scale: 0.95 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
          className: "w-full max-w-[440px] my-auto",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card p-6 sm:p-10 rounded-[2.5rem] border border-white/10 relative overflow-hidden text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-sm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center space-y-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  whileHover: { scale: 1.05, rotate: 5 },
                  className: "relative",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-[1.75rem] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/40 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-10 h-10 text-white animate-pulse" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full -z-10 animate-pulse" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.h1,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { delay: 0.2 },
                    className: "text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent",
                    children: "Linked Successfully"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.p,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { delay: 0.3 },
                    className: "text-emerald-400 font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-1.5",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" }),
                      "AI Model is Working Now"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 leading-relaxed font-medium", children: "Experience your super access now. The Telegram AI is connected, and automated shop messages, customer interaction, and AI processes are running smoothly in the background." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full pt-4 border-t border-white/5 flex flex-col items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "sm",
                  onClick: handleAccessRoot,
                  className: "text-xs text-white/40 hover:text-white/80 hover:bg-white/5 rounded-xl px-4 py-2 border border-white/5 transition-all",
                  children: "Access Root"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3 text-emerald-400 animate-pulse" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-[0.2em] text-white/30", children: "Secure MTProto Link" })
              ] })
            ] })
          ] })
        }
      ) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen bg-slate-950 text-white flex overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-80 border-r border-slate-800 flex flex-col bg-slate-900/40 backdrop-blur-xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-slate-800 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-2 rounded-lg bg-purple-500/10 border border-purple-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-5 w-5 text-purple-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-bold text-lg bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent", children: "My Telegram" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: handleLockRoot,
              className: "text-slate-400 hover:text-amber-400 hover:bg-slate-800 h-8 w-8",
              title: "Lock Root Access",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: () => {
                if (window.confirm("Are you sure you want to disconnect Telegram?")) {
                  logoutMutation.mutate();
                }
              },
              disabled: logoutMutation.isPending,
              className: "text-slate-400 hover:text-red-400 hover:bg-slate-800 h-8 w-8",
              title: "Log Out / Disconnect",
              children: logoutMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "h-4 w-4" })
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 border-b border-slate-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-slate-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "text",
            placeholder: "Search chats...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            className: "pl-9 bg-slate-950/60 border-slate-800 focus:border-purple-500 text-white h-9 text-sm"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-3 py-2.5 flex gap-1.5 overflow-x-auto scrollbar-none border-b border-slate-800/40 select-none shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setActiveTab("all"),
            className: `px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all ${activeTab === "all" ? "bg-purple-600 text-white shadow-md shadow-purple-950/30" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`,
            children: "All"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTab("groups"),
            className: `px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${activeTab === "groups" ? "bg-purple-600 text-white shadow-md shadow-purple-950/30" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`,
            children: [
              "Groups",
              groupsCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === "groups" ? "bg-white/20 text-white" : "bg-slate-850 text-slate-400"}`, children: groupsCount })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTab("contacts"),
            className: `px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${activeTab === "contacts" ? "bg-purple-600 text-white shadow-md shadow-purple-950/30" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`,
            children: [
              "Contacts",
              contactsCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === "contacts" ? "bg-white/20 text-white" : "bg-slate-855 text-slate-400"}`, children: contactsCount })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTab("non-contacts"),
            className: `px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${activeTab === "non-contacts" ? "bg-purple-600 text-white shadow-md shadow-purple-950/30" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`,
            children: [
              "Non-Contacts",
              nonContactsCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === "non-contacts" ? "bg-white/20 text-white" : "bg-slate-860 text-slate-400"}`, children: nonContactsCount })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setActiveTab("bots"),
            className: `px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${activeTab === "bots" ? "bg-cyan-600 text-white shadow-md shadow-cyan-950/30" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-3 w-3 shrink-0" }),
              "Bots",
              botsCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === "bots" ? "bg-white/20 text-white" : "bg-slate-800 text-cyan-400"}`, children: botsCount })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto divide-y divide-slate-800/40", children: isChatsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-purple-500" }) }) : displayedChats.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center p-8 text-slate-500 text-sm", children: "No chats found." }) : displayedChats.map((chat) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setSelectedChat(chat),
          className: `w-full p-3.5 flex items-start gap-3 text-left transition-all ${selectedChat?.id === chat.id ? "bg-purple-950/20 border-l-4 border-purple-500" : "hover:bg-slate-900/30 border-l-4 border-transparent"}`,
          children: [
            renderAvatar(chat.id, chat.name, "w-10 h-10 text-xs"),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-semibold text-slate-200 text-sm truncate flex items-center gap-1", children: [
                  chat.type === "group" && /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-3 w-3 text-indigo-400 shrink-0" }),
                  chat.type === "channel" && /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "h-3 w-3 text-cyan-400 shrink-0" }),
                  chat.isBot && /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-3 w-3 text-cyan-400 shrink-0" }),
                  chat.type === "user" && !chat.isBot && /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3 w-3 text-slate-400 shrink-0" }),
                  chat.name
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 shrink-0", children: chat.date ? new Date(chat.date * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 truncate pr-2", children: chat.lastMessage || "No messages yet" })
            ] }),
            chat.unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full self-center", children: chat.unreadCount })
          ]
        },
        chat.id
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col bg-slate-950 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1/3 right-1/4 w-80 h-80 bg-purple-900/5 rounded-full blur-3xl pointer-events-none" }),
      selectedChat ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-slate-800/80 bg-slate-900/20 backdrop-blur-md flex items-center justify-between z-10 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity",
              onClick: () => setShowDetailsPanel(!showDetailsPanel),
              children: [
                renderAvatar(selectedChat.id, selectedChat.name, "w-10 h-10 text-xs"),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-slate-200 text-sm flex items-center gap-1.5", children: selectedChat.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-slate-500 capitalize flex items-center gap-1.5", children: [
                    selectedChat.type,
                    " ",
                    selectedChat.username ? `@${selectedChat.username}` : "",
                    selectedChat.type === "user" && selectedChat.isContact && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] bg-emerald-500/10 text-emerald-400 px-1 rounded", children: "Contact" })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              onClick: () => setShowDetailsPanel(!showDetailsPanel),
              className: `h-9 w-9 hover:bg-slate-800 transition-colors ${showDetailsPanel ? "text-purple-400 bg-purple-950/20" : "text-slate-400 hover:text-slate-200"}`,
              title: "Toggle Inspect Panel",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-3 relative z-10", children: [
          messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center text-slate-500 text-sm", children: "No messages in this chat." }) : messages.map((msg, index) => {
            const isOut = msg.out;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `flex flex-col max-w-[70%] ${isOut ? "ml-auto items-end" : "mr-auto items-start"}`,
                children: [
                  !isOut && selectedChat.type !== "user" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-slate-500 font-medium ml-2 mb-0.5", children: msg.senderName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: `rounded-2xl px-4 py-2.5 text-sm shadow-md transition-all ${isOut ? "bg-purple-600 text-white rounded-br-none shadow-purple-950/20" : "bg-slate-900/60 border border-slate-800/40 text-slate-200 rounded-bl-none shadow-slate-950/50 backdrop-blur-sm"}`,
                      children: [
                        msg.hasPhoto && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 max-w-full overflow-hidden rounded-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: `/api/telegram-client/message-media/${selectedChat.id}/${msg.id}`,
                            alt: "Message media",
                            className: "max-h-60 w-full object-contain rounded bg-slate-950/40 hover:scale-[1.02] transition-transform cursor-pointer",
                            onClick: () => window.open(`/api/telegram-client/message-media/${selectedChat.id}/${msg.id}`, "_blank")
                          }
                        ) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap break-words", children: msg.text })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-slate-600 mt-1 mx-1.5", children: msg.date ? new Date(msg.date * 1e3).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "" })
                ]
              },
              msg.id || index
            );
          }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-t border-slate-800/80 bg-slate-900/20 backdrop-blur-md z-10 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            onSubmit: (e) => {
              e.preventDefault();
              sendMessageMutation.mutate();
            },
            className: "flex items-center gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "text",
                  placeholder: "Write a message...",
                  value: typedMessage,
                  onChange: (e) => setTypedMessage(e.target.value),
                  className: "flex-1 bg-slate-950 border-slate-800 focus:border-purple-500 text-white h-11 px-4 text-sm"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  type: "submit",
                  disabled: !typedMessage.trim() || sendMessageMutation.isPending,
                  className: "bg-purple-600 hover:bg-purple-700 text-white h-11 w-11 p-0 flex items-center justify-center shadow-lg shadow-purple-600/10 shrink-0",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
                }
              )
            ]
          }
        ) })
      ] }) : (
        /* Empty Chat View */
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col justify-center items-center p-6 text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mb-4 text-purple-400 shadow-xl shadow-slate-950/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "h-8 w-8" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-slate-200", children: "Start Messaging" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-sm max-w-sm mt-1", children: "Select a conversation from the sidebar list to view the chat history and send messages in real-time." })
        ] })
      )
    ] }),
    selectedChat && showDetailsPanel && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-80 border-l border-slate-800 bg-slate-900/40 backdrop-blur-xl flex flex-col h-full z-20 transition-all duration-300 relative shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-slate-800 flex items-center justify-between shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-purple-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm text-slate-200", children: "Inspect Details" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            onClick: () => setShowDetailsPanel(false),
            className: "h-7 w-7 text-slate-400 hover:text-white",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-4 space-y-6", children: isDetailsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-40 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-purple-500" }) }) : detailsError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-red-400 text-xs p-4 text-center", children: [
        "Error loading details: ",
        detailsError.message
      ] }) : peerDetails ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 animate-in fade-in duration-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center text-center space-y-3", children: [
          renderAvatar(peerDetails.id, peerDetails.firstName || peerDetails.name || "", "w-20 h-20 text-2xl"),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-base text-slate-100", children: peerDetails.firstName ? `${peerDetails.firstName} ${peerDetails.lastName || ""}` : peerDetails.name }),
            peerDetails.username && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-purple-400", children: [
              "@",
              peerDetails.username
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-center gap-1.5", children: [
            peerDetails.isVerified && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-blue-500/20 text-blue-400 border border-blue-500/30 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "h-3 w-3" }),
              " Verified"
            ] }),
            peerDetails.isPremium && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3 w-3 animate-pulse" }),
              " Premium"
            ] }),
            peerDetails.type === "user" ? peerDetails.isContact ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full", children: "Contact" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-slate-500/20 text-slate-400 border border-slate-500/30 text-[10px] px-2 py-0.5 rounded-full", children: "Non-Contact" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] px-2 py-0.5 rounded-full capitalize", children: peerDetails.type })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("hr", { className: "border-slate-800/80" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          (peerDetails.bio || peerDetails.about) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-slate-500 uppercase tracking-wider block", children: "Bio / Description" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-300 bg-slate-950/40 p-2.5 rounded-xl border border-slate-900 leading-relaxed whitespace-pre-wrap break-words", children: peerDetails.bio || peerDetails.about })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-950/20 rounded-2xl border border-slate-800 divide-y divide-slate-800/60 overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(IdCard, { className: "h-4 w-4 text-slate-400 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-slate-500 block", children: "ID" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-mono text-slate-300 select-all block truncate", children: peerDetails.id })
              ] })
            ] }),
            peerDetails.type === "user" && peerDetails.phone && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneCall, { className: "h-4 w-4 text-slate-400 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-slate-500 block", children: "Phone" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-300 select-all block truncate", children: [
                  "+",
                  peerDetails.phone
                ] })
              ] })
            ] }),
            peerDetails.type !== "user" && peerDetails.participantsCount !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "h-4 w-4 text-slate-400 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-slate-500 block", children: "Members" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-300 block font-semibold", children: peerDetails.participantsCount })
              ] })
            ] }),
            peerDetails.username && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(AtSign, { className: "h-4 w-4 text-slate-400 mt-0.5" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium text-slate-500 block", children: "Username" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-300 select-all block truncate", children: [
                  "@",
                  peerDetails.username
                ] })
              ] })
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-slate-500 text-sm text-center", children: "No details available." }) })
    ] })
  ] });
}
export {
  TelegramClientPage as default
};
