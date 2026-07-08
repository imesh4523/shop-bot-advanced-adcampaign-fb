import { useEffect, useRef, useState } from "react";
import { generateTOTP, getRemainingSeconds } from "@/lib/totp";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { Product, TelegramUser, Order, Payment, SpecialOffer, SupportMessage } from "@shared/schema";
import { io } from "socket.io-client";
import { getTelegramInitData, expandTelegramWebApp } from "@/lib/telegram";
import { queryClient } from "@/lib/queryClient";
import { 
  Loader2, 
  ShoppingCart, 
  User as UserIcon, 
  Package, 
  Wallet, 
  ChevronRight, 
  CreditCard,
  History as HistoryIcon,
  Store as StoreIcon,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  ExternalLink,
  ChevronDown,
  MessageCircle,
  Send,
  X,
  Minimize2,
  Copy,
  PlayCircle,
  Database
} from "lucide-react";

import { format } from "date-fns";
import { FaAws, FaCcVisa, FaCcMastercard, FaCcAmex, FaTelegram } from "react-icons/fa";
import { SiDigitalocean, SiGooglecloud, SiVultr, SiHetzner, SiBinance, SiOpenai, SiClaude, SiGooglegemini } from "react-icons/si";
import { VscAzure } from "react-icons/vsc";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Helper for MiniApp API requests
const miniApiRequest = async (method: string, path: string, body?: any) => {
  const initData = getTelegramInitData();
  
  let webUserId = "";
  if (!initData) {
    webUserId = localStorage.getItem("web_user_id") || "";
    if (!webUserId) {
      webUserId = "web_guest_" + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("web_user_id", webUserId);
    }
  }

  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-telegram-init-data': initData,
      'x-web-user-id': webUserId
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Request failed");
  }
  return res;
};

// Provider Theme Mapping (Icon + Color)
const getProviderTheme = (name: string, type: string) => {
  const n = (name + " " + type).toLowerCase();
  
  // Base themes for backgrounds
  const themes: Record<string, { logo: string, color: string, bg: string, hover: string }> = {
    aws: {
      logo: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg",
      color: "text-[#FF9900]",
      bg: "bg-[#FF9900]/5 dark:bg-white",
      hover: "group-hover:bg-[#FF9900]"
    },
    digitalocean: {
      logo: "https://www.vectorlogo.zone/logos/digitalocean/digitalocean-icon.svg",
      color: "text-[#0080FF]",
      bg: "bg-[#0080FF]/5",
      hover: "group-hover:bg-[#0080FF]"
    },
    azure: {
      logo: "https://www.vectorlogo.zone/logos/microsoft_azure/microsoft_azure-icon.svg",
      color: "text-[#0089D6]",
      bg: "bg-[#0089D6]/5",
      hover: "group-hover:bg-[#0089D6]"
    },
    oracle: {
      logo: "https://www.vectorlogo.zone/logos/oracle/oracle-icon.svg",
      color: "text-[#F11010]",
      bg: "bg-[#F11010]/5",
      hover: "group-hover:bg-[#F11010]"
    },
    google: {
      logo: "https://www.vectorlogo.zone/logos/google_cloud/google_cloud-icon.svg",
      color: "text-[#4285F4]",
      bg: "bg-[#4285F4]/5",
      hover: "group-hover:bg-[#4285F4]"
    },
    vultr: {
      logo: "https://www.vectorlogo.zone/logos/vultr/vultr-icon.svg",
      color: "text-[#007BFF]",
      bg: "bg-[#007BFF]/5",
      hover: "group-hover:bg-[#007BFF]"
    },
    hetzner: {
      logo: "https://v1.hetzner.com/img/hetzner-logo.svg",
      color: "text-[#D50C2D]",
      bg: "bg-[#D50C2D]/5",
      hover: "group-hover:bg-[#D50C2D]"
    },
    binance: {
      logo: "https://www.vectorlogo.zone/logos/binance/binance-icon.svg",
      color: "text-[#F3BA2F]",
      bg: "bg-[#F3BA2F]/5",
      hover: "group-hover:bg-[#F3BA2F]"
    },
    claude: {
      logo: "https://svgl.app/library/claude.svg",
      color: "text-[#D97706]",
      bg: "bg-[#D97706]/5",
      hover: "group-hover:bg-[#D97706]"
    },
    gemini: {
      logo: "https://svgl.app/library/gemini.svg",
      color: "text-[#1A73E8]",
      bg: "bg-[#1A73E8]/5",
      hover: "group-hover:bg-[#1A73E8]"
    },
    cursor: {
      logo: "https://svgl.app/library/cursor.svg",
      color: "text-white",
      bg: "bg-white/5",
      hover: "group-hover:bg-white/20"
    },
    chatgpt: {
      logo: "https://svgl.app/library/chatgpt.svg",
      color: "text-[#10A37F]",
      bg: "bg-[#10A37F]/5",
      hover: "group-hover:bg-[#10A37F]"
    },
    capcut: {
      logo: "https://svgl.app/library/capcut.svg",
      color: "text-[#00C4FF]",
      bg: "bg-[#00C4FF]/5",
      hover: "group-hover:bg-[#00C4FF]"
    }
  };

  let target: any = null;
  if (n.includes("aws") || n.includes("amazon")) target = themes.aws;
  else if (n.includes("digitalocean") || n.includes("digital ocean")) target = themes.digitalocean;
  else if (n.includes("vultr")) target = themes.vultr;
  else if (n.includes("azure") || n.includes("microsoft")) target = themes.azure;
  else if (n.includes("oracle")) target = themes.oracle;
  else if (n.includes("hetzner")) target = themes.hetzner;
  else if (n.includes("google") || n.includes("gcp")) target = themes.google;
  else if (n.includes("binance")) target = themes.binance;
  else if (n.includes("claude")) target = themes.claude;
  else if (n.includes("gemini")) target = themes.gemini;
  else if (n.includes("cursor")) target = themes.cursor;
  else if (n.includes("chatgpt") || n.includes("openai") || n.includes("gpt")) target = themes.chatgpt;
  else if (n.includes("capcut") || n.includes("cap cut")) target = themes.capcut;

  if (target) {
    return {
      icon: <img src={target.logo} alt={name} className="w-7 h-7 object-contain group-hover:brightness-0 group-hover:invert transition-all duration-300" />,
      color: target.color,
      bg: target.bg,
      hover: target.hover
    };
  }
  
  return { 
    icon: <Package className="w-6 h-6" />, 
    color: "text-neutral-600", 
    bg: "bg-neutral-50", 
    hover: "group-hover:bg-neutral-600" 
  };
};

// Simple icon getter for historical orders
const getProviderIcon = (name: string, type: string) => {
  return getProviderTheme(name, type).icon;
};

// User Profile Photo Component
const UserAvatar = ({ fallback: Fallback, className }: { fallback: any, className?: string }) => {
  const tgUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
  const photoUrl = tgUser?.photo_url;

  if (photoUrl) {
    return (
      <img 
        src={photoUrl} 
        alt="Profile" 
        className={`${className} object-cover rounded-[30%]`}
        onError={(e) => {
          (e.target as any).style.display = 'none';
        }}
      />
    );
  }

  return <Fallback className="w-5 h-5 text-white" />;
};

type Tab = "store" | "orders" | "payments" | "profile";

function LiveTOTP({ secret, onCopy }: { secret: string, onCopy: (text: string) => void }) {
  const [code, setCode] = useState("000000");
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const updateCode = async () => {
      const newCode = await generateTOTP(secret);
      setCode(newCode);
    };

    updateCode();
    const timer = setInterval(() => {
      const remaining = getRemainingSeconds();
      setTimeLeft(remaining);
      if (remaining === 30) {
        updateCode();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [secret]);

  return (
    <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-4 rounded-2xl text-white shadow-lg relative overflow-hidden group mb-4">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-2xl rounded-full translate-x-8 -translate-y-8" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="text-[9px] font-black uppercase tracking-widest text-purple-100/60 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
            Live 2FA
          </div>
          <div className="text-2xl font-black tracking-widest font-mono tabular-nums">
            {code.slice(0, 3)} {code.slice(3)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24"
                cy="24"
                r="19"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                className="text-white/20"
              />
              <circle
                cx="24"
                cy="24"
                r="19"
                stroke="currentColor"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={119.38}
                strokeDashoffset={119.38 - (119.38 * timeLeft) / 30}
                strokeLinecap="round"
                className="text-white transition-all duration-1000 ease-linear"
              />
            </svg>
            <span className="absolute text-[9px] font-black tabular-nums">{timeLeft}s</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white shadow-sm transition-all active:scale-90"
            onClick={() => onCopy(code)}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helpers for customer support formatting
const getTelegramLink = (username: string) => {
  if (!username) return "https://t.me/";
  if (username.startsWith("http")) return username;
  const clean = username.startsWith("@") ? username.substring(1) : username;
  return `https://t.me/${clean}`;
};

const formatChatMessage = (text: string) => {
  if (!text) return "";
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    const isBullet = line.trim().startsWith("* ") || line.trim().startsWith("- ");
    const content = isBullet ? line.trim().substring(2) : line;
    
    const boldRegex = /\*\*(.*?)\*\*/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    while ((match = boldRegex.exec(content)) !== null) {
      const matchIndex = match.index;
      const matchText = match[1];
      if (matchIndex > lastIndex) {
        elements.push(content.substring(lastIndex, matchIndex));
      }
      elements.push(<strong key={matchIndex} className="font-black text-purple-400 dark:text-purple-300">{matchText}</strong>);
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < content.length) {
      elements.push(content.substring(lastIndex));
    }

    if (isBullet) {
      return (
        <div key={idx} className="flex gap-2 pl-2 py-0.5 leading-relaxed text-[11px]">
          <span className="text-purple-500 dark:text-purple-400 font-black">•</span>
          <span className="flex-1">{elements.length > 0 ? elements : content}</span>
        </div>
      );
    }

    return (
      <div key={idx} className="min-h-[1.25em] leading-relaxed text-[11px]">
        {elements.length > 0 ? elements : content}
      </div>
    );
  });
};

// Helper to convert hex to HSL format for Tailwind
function hexToHsl(hex: string): string {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "275 100% 70%";
  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return `${h} ${s}% ${l}%`;
}

export default function MiniAppShop() {
  const { theme } = useTheme();
  const { toast } = useToast();
  const { data: user, isLoading: userLoading } = useQuery<TelegramUser>({
    queryKey: ["/api/mini/user"],
    queryFn: async () => {
      const res = await miniApiRequest("GET", "/api/mini/user");
      return res.json();
    }
  });

  const [displayCurrency, setDisplayCurrency] = useState<"USD" | "LKR" | "INR" | "EUR">((localStorage.getItem("display_currency") as any) || "USD");

  const { data: rateLkrSetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/CURRENCY_RATE_LKR"]
  });
  const { data: rateInrSetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/CURRENCY_RATE_INR"]
  });
  const { data: rateEurSetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/CURRENCY_RATE_EUR"]
  });

  const getRate = (currency: string) => {
    if (currency === 'LKR') return rateLkrSetting?.value ? parseFloat(rateLkrSetting.value) : 300;
    if (currency === 'INR') return rateInrSetting?.value ? parseFloat(rateInrSetting.value) : 83;
    if (currency === 'EUR') return rateEurSetting?.value ? parseFloat(rateEurSetting.value) : 0.92;
    return 1.0;
  };

  const formatPrice = (amountInCents: number, fromCurrency: string = 'USD', toCurrency: string) => {
    const fromRate = getRate(fromCurrency);
    const amountInUsdCents = Math.round(amountInCents / fromRate);
    const toRate = getRate(toCurrency);
    const convertedAmount = (amountInUsdCents / 100) * toRate;
    
    if (toCurrency === 'LKR') return `${convertedAmount.toFixed(0)} LKR`;
    if (toCurrency === 'INR') return `₹${convertedAmount.toFixed(2)}`;
    if (toCurrency === 'EUR') return `€${convertedAmount.toFixed(2)}`;
    return `$${(amountInUsdCents / 100).toFixed(2)}`;
  };

  // Immediately set body background on first render (before useEffect) to avoid flash
  const isDarkMode = theme === "dark" || (theme === "system" && typeof window !== 'undefined' && window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (typeof window !== 'undefined') {
    const bg = isDarkMode ? '#121212' : '#f8f7ff';
    document.body.style.background = bg;
    document.body.style.backgroundColor = bg;
  }


  const [activeTab, setActiveTab] = useState<Tab>("store");
  const [selectedProduct, setSelectedProduct] = useState<(Product & { stockCount?: number }) | null>(null);
  const [viewingOrder, setViewingOrder] = useState<(Order & { product: Product, credential: any }) | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const autoSwapRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [selectedOffer, setSelectedOffer] = useState<(SpecialOffer & { product?: any }) | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeTutorial, setActiveTutorial] = useState<"buy" | "deposit" | null>(null);

  // Deposit States
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("10.00");
  const [depositMethod, setDepositMethod] = useState<"stripe" | "trc20" | "aptos" | "binance">("stripe");
  const [activeDeposit, setActiveDeposit] = useState<{ paymentId: number; walletAddress: string; amount: number; method: string; remark?: string } | null>(null);
  const [txidInput, setTxidInput] = useState("");
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);

  // Unified Auth States
  const [emailInput, setEmailInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const handleSendOtp = async () => {
    if (!emailInput || !emailInput.includes("@")) {
      toast({ title: "Error", description: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    setIsAuthSubmitting(true);
    try {
      const res = await fetch("/api/mini/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to send code");
      }
      const data = await res.json();
      setOtpSent(true);
      toast({ title: "OTP Sent", description: "Verification code sent to your email." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput || otpInput.trim().length !== 6) {
      toast({ title: "Error", description: "Please enter a valid 6-digit OTP code", variant: "destructive" });
      return;
    }
    setIsAuthSubmitting(true);
    try {
      const res = await fetch("/api/mini/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, code: otpInput })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Verification failed");
      }
      const data = await res.json();
      localStorage.setItem("web_user_id", data.user.telegramId);
      toast({ title: "Login Successful", description: `Welcome back, ${data.user.firstName}!` });
      
      // Reset inputs & refetch user
      setOtpSent(false);
      setOtpInput("");
      setEmailInput("");
      setIsLoginDialogOpen(false);
      
      // Invalidate queries to refresh balance & orders
      queryClient.invalidateQueries({ queryKey: ["/api/mini/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mini/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mini/payments"] });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("web_user_id");
    toast({ title: "Logged Out", description: "You have been logged out and returned to guest session." });
    
    // Invalidate queries to trigger re-fetch as guest
    queryClient.invalidateQueries({ queryKey: ["/api/mini/user"] });
    queryClient.invalidateQueries({ queryKey: ["/api/mini/orders"] });
    queryClient.invalidateQueries({ queryKey: ["/api/mini/payments"] });
  };

  const handleCreateDeposit = async () => {
    try {
      const amt = parseFloat(depositAmount);
      if (isNaN(amt) || amt <= 0) {
        toast({ title: "Invalid Amount", description: "Please enter a positive number.", variant: "destructive" });
        return;
      }

      const minDepositLimit = minDepositSetting?.value ? parseFloat(minDepositSetting.value) : 1.0;
      if (amt < minDepositLimit) {
        toast({ title: "Minimum Deposit Required", description: `Minimum deposit amount is $${minDepositLimit.toFixed(2)}.`, variant: "destructive" });
        return;
      }
      
      const res = await miniApiRequest("POST", "/api/mini/deposit", {
        amount: amt,
        method: depositMethod
      });
      const data = await res.json();

      if (depositMethod === 'stripe') {
        toast({ title: "Redirection", description: "Redirecting you to Stripe checkout..." });
        setIsDepositModalOpen(false);
        window.location.href = data.url;
      } else {
        setActiveDeposit({
          paymentId: data.paymentId,
          walletAddress: data.walletAddress,
          amount: data.amount,
          method: depositMethod,
          remark: data.remark
        });
      }
    } catch (err: any) {
      toast({ title: "Failed to deposit", description: err.message, variant: "destructive" });
    }
  };

  const handleResumePendingPayment = (payment: any) => {
    let walletAddress = "Not Set";
    const method = payment.paymentMethod.toLowerCase();
    
    if (method === 'trc20') {
      walletAddress = trc20WalletSetting?.value || "Txxxx...";
    } else if (method === 'aptos') {
      walletAddress = aptosWalletSetting?.value || "0xxxx...";
    } else if (method === 'binance') {
      walletAddress = binancePayIdSetting?.value || "999999...";
    }

    setActiveDeposit({
      paymentId: payment.id,
      walletAddress,
      amount: payment.amount / 100,
      method: method as any,
      remark: payment.cryptomusUuid || ""
    });
    setIsDepositModalOpen(true);
  };

  const handleVerifyCryptoPayment = async () => {
    if (!activeDeposit || (activeDeposit.method !== 'binance' && !txidInput.trim())) {
      toast({ title: "TXID Required", description: "Please enter the Transaction ID (TXID) first.", variant: "destructive" });
      return;
    }

    setIsVerifyingPayment(true);
    try {
      const res = await miniApiRequest("POST", "/api/mini/check-payment", {
        paymentId: activeDeposit.paymentId,
        txId: activeDeposit.method === 'binance' ? (activeDeposit.remark || "binance") : txidInput.trim()
      });
      const data = await res.json();

      toast({ title: "Payment Verified", description: data.message });
      queryClient.invalidateQueries({ queryKey: ["/api/mini/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mini/payments"] });
      setActiveDeposit(null);
      setTxidInput("");
      setIsDepositModalOpen(false);
    } catch (err: any) {
      toast({ title: "Verification Failed", description: err.message, variant: "destructive" });
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  // AI Support Chat States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot', content: string }[]>([
    { role: 'bot', content: "Hello! 👋 I'm your AI Support Concierge. How can I help you today?" }
  ]);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [chatMode, setChatMode] = useState<"ai" | "human">("ai");
  const [liveMessages, setLiveMessages] = useState<SupportMessage[]>([]);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [isRequestingHuman, setIsRequestingHuman] = useState(false);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (dateStr: any) => {
    if (!dateStr) return "";
    try {
      const normalizedStr = typeof dateStr === 'string' ? dateStr.replace(' ', 'T') : dateStr;
      const d = new Date(normalizedStr);
      if (isNaN(d.getTime())) return "";
      return format(d, "hh:mm a");
    } catch (e) {
      return "";
    }
  };

  useEffect(() => {
    if (isChatOpen) scrollToBottom();
  }, [chatHistory, liveMessages, isChatOpen]);

  // Fetch live support messages
  const fetchLiveMessages = async () => {
    setIsLiveLoading(true);
    try {
      const res = await miniApiRequest("GET", "/api/mini/support/messages");
      const data = await res.json();
      setLiveMessages(data);
    } catch (err) {
      console.error("Failed to load live support messages:", err);
    } finally {
      setIsLiveLoading(false);
    }
  };

  // Request human agent
  const handleRequestHuman = async () => {
    setIsRequestingHuman(true);
    try {
      const res = await miniApiRequest("POST", "/api/mini/support/request");
      const data = await res.json();
      setChatMode("human");
      await fetchLiveMessages();
    } catch (err: any) {
      toast({
        title: "Request Failed",
        description: err.message || "Failed to contact live support.",
        variant: "destructive"
      });
    } finally {
      setIsRequestingHuman(false);
    }
  };

  // Send message in human live chat mode
  const handleSendLiveMessage = async () => {
    if (!chatMessage.trim() || isSendingChat || !user?.telegramId) return;

    const userMsg = chatMessage.trim();
    setChatMessage("");
    setIsSendingChat(true);

    try {
      const res = await miniApiRequest("POST", "/api/mini/support/send", { message: userMsg });
      const data = await res.json();
      
      setLiveMessages(prev => {
        if (prev.some(m => m.id === data.message.id)) return prev;
        return [...prev, data.message];
      });
    } catch (err: any) {
      toast({
        title: "Send Failed",
        description: err.message || "Failed to send message to live agent.",
        variant: "destructive"
      });
    } finally {
      setIsSendingChat(false);
    }
  };

  // Socket.io for real-time human chat updates
  useEffect(() => {
    if (!isChatOpen || chatMode !== "human" || !user?.telegramId) return;

    const socket = io();

    socket.on("support_message", (msg: SupportMessage) => {
      if (msg.telegramId === user.telegramId.toString()) {
        setLiveMessages(prev => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [isChatOpen, chatMode, user?.telegramId]);

  // Initial fetch when switching to human mode
  useEffect(() => {
    if (chatMode === "human") {
      fetchLiveMessages();
    }
  }, [chatMode]);

  const handleSendChat = async () => {
    if (!chatMessage.trim() || isSendingChat) return;
    
    const userMsg = chatMessage.trim();
    setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatMessage("");
    setIsSendingChat(true);

    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'bot', content: data.answer || "I'm offline right now." }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'bot', content: `Sorry, I'm having trouble connecting. Reach out to ${supportUsername}.` }]);
    } finally {
      setIsSendingChat(false);
    }
  };

  useEffect(() => {
    expandTelegramWebApp();
    const webApp = (window as any).Telegram?.WebApp;
    const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    const bgLight = '#f8f7ff';
    const bgDark = '#121212';
    const bg = isDark ? bgDark : bgLight;

    // Force body background via inline style — reliable across all browsers & WebViews
    document.body.style.background = bg;
    document.body.style.backgroundColor = bg;

    if (webApp) {
      webApp.setHeaderColor(isDark ? '#1a1a1a' : '#ffffff');
      webApp.setBackgroundColor(bg);
    }

    if (isDark) {
      document.body.classList.add('tg-body');
    } else {
      document.body.classList.remove('tg-body');
    }

    // Check url params for simulated/stripe payment success or cancel
    const params = new URLSearchParams(window.location.search);
    const paymentStatus = params.get("payment");
    const sessionId = params.get("session_id");

    if (paymentStatus === "success" && sessionId) {
      fetch("/api/mini/stripe-verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-telegram-init-data": getTelegramInitData(),
          "x-web-user-id": localStorage.getItem("web_user_id") || ""
        },
        body: JSON.stringify({ sessionId })
      }).then(res => res.json()).then(data => {
        if (data.success) {
          toast({ title: "Deposit Credited", description: data.message || "Your Stripe payment was successfully credited!" });
        } else {
          toast({ title: "Verification Failed", description: data.message || "Could not verify payment.", variant: "destructive" });
        }
        queryClient.invalidateQueries({ queryKey: ["/api/mini/user"] });
        queryClient.invalidateQueries({ queryKey: ["/api/mini/payments"] });
        window.history.replaceState({}, document.title, window.location.pathname);
      }).catch(err => {
        console.error("Error crediting simulated stripe:", err);
      });
    } else if (paymentStatus === "cancel") {
      toast({ title: "Payment Cancelled", description: "You cancelled the Stripe checkout.", variant: "destructive" });
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return () => {
      document.body.classList.remove('tg-body');
      document.body.style.background = '';
      document.body.style.backgroundColor = '';
    };
  }, [theme]);


  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ 
      title: "Copied to Clipboard", 
      description: "Credential details have been copied successfully.",
      duration: 2000 
    });
  };



  // Branding Settings
  const { data: storeNameSetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/STORE_NAME"],
  });

  const { data: supportUsernameSetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/SUPPORT_USERNAME"],
  });

  const { data: supportBtnTextSetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/SUPPORT_BTN_TEXT"],
  });

  const { data: loadingTextSetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/LOADING_TEXT"],
  });

  const { data: minDepositSetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/MIN_DEPOSIT_LIMIT"],
  });

  const { data: trc20WalletSetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/TRC20_WALLET_ADDRESS"],
  });

  const { data: aptosWalletSetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/APTOS_WALLET_ADDRESS"],
  });

  const { data: binancePayIdSetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/BINANCE_PAY_ID"],
  });

  const { data: bannerImagesSetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/BANNER_IMAGES"],
  });

  const { data: themeColorSetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/THEME_COLOR"],
  });

  const storeName = storeNameSetting?.value || "Shopeefy";
  const supportUsername = supportUsernameSetting?.value || "@rochana_imesh";
  const supportBtnText = supportBtnTextSetting?.value || "Write to Support";
  const loadingText = loadingTextSetting?.value || "Shopeefy...";
  const minDepositLimit = minDepositSetting?.value ? parseFloat(minDepositSetting.value) : 1.0;
  const themeColor = themeColorSetting?.value || "#a855f7";

  useEffect(() => {
    try {
      const color = themeColor && typeof themeColor === 'string' && themeColor.trim() !== '' ? themeColor : "#a855f7";
      const hslVal = hexToHsl(color) || "275 100% 70%";
      const parts = hslVal.split(" ");
      const h = parts[0] || "275";
      const s = parts[1] || "100%";
      const l = parseInt(parts[2]) || 70;
      const sClean = s.replace('%', '');

      let styleTag = document.getElementById("dynamic-theme-style");
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "dynamic-theme-style";
        document.head.appendChild(styleTag);
      }
      
      styleTag.innerHTML = `
        :root, .dark {
          --primary: ${hslVal} !important;
          --ring: ${hslVal} !important;
          
          --theme-color: hsl(${h} ${s} ${l}%) !important;
          --theme-color-hover: hsl(${h} ${s} ${Math.max(0, l - 10)}%) !important;
          --theme-color-border: hsla(${h}, ${sClean}%, ${l}%, 0.15) !important;
          --theme-color-bg-light: hsla(${h}, ${sClean}%, ${l}%, 0.05) !important;
          --theme-color-bg-trans: hsla(${h}, ${sClean}%, ${l}%, 0.1) !important;
        }

        /* Override all hardcoded Tailwind purple classes inside the mini app */
        .tg-mini-app .bg-purple-600,
        .tg-mini-app .bg-purple-500 {
          background-color: var(--theme-color) !important;
        }

        .tg-mini-app .hover\\:bg-purple-600:hover,
        .tg-mini-app .hover\\:bg-purple-700:hover {
          background-color: var(--theme-color-hover) !important;
        }

        .tg-mini-app .text-purple-600,
        .tg-mini-app .text-purple-500,
        .tg-mini-app .text-purple-400,
        .tg-mini-app .text-purple-300 {
          color: var(--theme-color) !important;
        }

        .tg-mini-app .border-purple-600,
        .tg-mini-app .border-purple-500,
        .tg-mini-app .border-purple-200,
        .tg-mini-app .border-purple-100,
        .tg-mini-app .border-purple-50 {
          border-color: var(--theme-color-border) !important;
        }

        .tg-mini-app .bg-purple-50,
        .tg-mini-app .bg-purple-50\\/50,
        .tg-mini-app .bg-purple-500\\/10 {
          background-color: var(--theme-color-bg-light) !important;
        }
        
        .tg-mini-app .ring-purple-500\\/20 {
          --tw-ring-color: var(--theme-color-border) !important;
        }

        .tg-mini-app .shadow-purple-500\\/\\[0\\.02\\] {
          --tw-shadow-color: hsla(${h}, ${sClean}%, ${l}%, 0.02) !important;
        }
        
        .tg-mini-app .text-purple-100\\/60,
        .tg-mini-app .text-purple-100\\/80 {
          color: hsla(${h}, ${sClean}%, 90%, 0.7) !important;
        }

        .tg-mini-app .from-purple-600 {
          --tw-gradient-from: var(--theme-color) !important;
          --tw-gradient-to: var(--theme-color-hover) !important;
          --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;
        }

        /* SVG and Icon colors */
        .tg-mini-app svg.text-purple-600,
        .tg-mini-app svg.text-purple-500 {
          color: var(--theme-color) !important;
          stroke: var(--theme-color) !important;
        }
      `;
    } catch (err) {
      console.error("Theme color dynamic styling failed:", err);
    }
  }, [themeColor]);

  const { data: products, isLoading: productsLoading } = useQuery<(Product & { stockCount?: number })[]>({
    queryKey: ["/api/mini/products"],
    queryFn: async () => {
      const res = await miniApiRequest("GET", "/api/mini/products");
      return res.json();
    }
  });

  const { data: offers, isLoading: offersLoading } = useQuery<SpecialOffer[]>({
    queryKey: ["/api/mini/offers"],
    queryFn: async () => {
      const res = await miniApiRequest("GET", "/api/mini/offers");
      return res.json();
    },
    enabled: activeTab === "store"
  });

  // Auto-swap carousel every 3 seconds
  useEffect(() => {
    const activeOffers = offers?.filter(o => o.status === 'active') ?? [];
    let customBannersCount = 0;
    if (bannerImagesSetting?.value) {
      try {
        const parsed = JSON.parse(bannerImagesSetting.value);
        if (Array.isArray(parsed) && parsed.length > 0) {
          customBannersCount = parsed.length;
        }
      } catch (e) {}
    }
    const bannerCount = customBannersCount === 0 ? 1 : customBannersCount;
    const totalSlides = bannerCount + activeOffers.length;
    if (totalSlides <= 1) return;
    
    if (autoSwapRef.current) clearInterval(autoSwapRef.current);
    autoSwapRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    }, 3000);
    return () => {
      if (autoSwapRef.current) clearInterval(autoSwapRef.current);
    };
  }, [offers, bannerImagesSetting]);

  const { data: orders, isLoading: ordersLoading } = useQuery<(Order & { product: Product, credential: any })[]>({
    queryKey: ["/api/mini/orders"],
    queryFn: async () => {
      const res = await miniApiRequest("GET", "/api/mini/orders");
      return res.json();
    },
    enabled: activeTab === "orders" || activeTab === "store"
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/mini/payments"],
    queryFn: async () => {
      const res = await miniApiRequest("GET", "/api/mini/payments");
      return res.json();
    },
    enabled: activeTab === "payments"
  });

  const purchaseMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: number, quantity: number }) => {
      const res = await miniApiRequest("POST", "/api/mini/purchase", { productId, quantity });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mini/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mini/orders"] });
      setPurchaseSuccess(true);
      setSelectedProduct(null);
      toast({ title: "Purchase Successful!", description: "Account credentials sent to your DM." });
    },
    onError: (error: any) => {
      toast({ title: "Purchase Failed", description: error.message, variant: "destructive" });
    }
  });

  const purchaseOfferMutation = useMutation({
    mutationFn: async (offerId: number) => {
      const res = await miniApiRequest("POST", "/api/mini/purchase-offer", { offerId });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mini/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/mini/orders"] });
      setPurchaseSuccess(true);
      setSelectedOffer(null);
      toast({ title: "Bundle Claimed!", description: "Your premium bundle credentials have been sent to your DM." });
    },
    onError: (error: any) => {
      toast({ title: "Claim Failed", description: error.message, variant: "destructive" });
    }
  });

  // Views for different tabs
  const renderStore = () => {
    const activeOffers = offers?.filter(o => o.status === 'active') ?? [];
    const customBanners: string[] = [];
    if (bannerImagesSetting?.value) {
      try {
        const parsed = JSON.parse(bannerImagesSetting.value);
        if (Array.isArray(parsed)) {
          customBanners.push(...parsed);
        }
      } catch (e) {}
    }
    const showDefaultHero = customBanners.length === 0;
    const bannerCount = showDefaultHero ? 1 : customBanners.length;
    const totalSlides = bannerCount + activeOffers.length;

    // Offer slide gradient palettes
    const offerGradients = [
      "from-amber-500 via-orange-500 to-red-600",
      "from-emerald-500 via-teal-500 to-cyan-600",
      "from-pink-500 via-rose-500 to-red-500",
      "from-violet-600 via-purple-500 to-pink-500",
      "from-sky-500 via-blue-500 to-indigo-600",
    ];
    const offerShadows = [
      "shadow-orange-200",
      "shadow-teal-200",
      "shadow-rose-200",
      "shadow-purple-200",
      "shadow-blue-200",
    ];
    const offerIndicatorColors = [
      "bg-orange-500",
      "bg-teal-500",
      "bg-rose-500",
      "bg-purple-500",
      "bg-blue-500",
    ];

    const handleDragEnd = (_: any, info: any, goTo: number) => {
      if (info.offset.x < -50 && goTo < totalSlides - 1) setCurrentSlide(goTo + 1);
      if (info.offset.x > 50 && goTo > 0) setCurrentSlide(goTo - 1);
      // restart auto-swap timer
      if (autoSwapRef.current) clearInterval(autoSwapRef.current);
      autoSwapRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
      }, 3000);
    };

    return (
    <div className="space-y-6">
      <div className="relative overflow-hidden group">
        <AnimatePresence mode="wait">
          {showDefaultHero && currentSlide === 0 && (
            <motion.section 
              key="hero-main"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => handleDragEnd(e, info, 0)}
              className="relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 p-8 text-white cursor-grab active:cursor-grabbing"
            >
              <div className="relative z-10">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-3 py-1 mb-4 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                  Elite Cloud Services
                </Badge>
                <h2 className="text-3xl font-black tracking-tighter leading-none mb-2">Instant<br/>Deployment</h2>
                <p className="text-purple-100/80 text-[11px] font-medium max-w-[200px] leading-relaxed">High-tier verified accounts for AWS, DigitalOcean & more.</p>
              </div>
              {/* Removed blue glow blur */}
              <Zap className="absolute bottom-6 right-8 w-12 h-12 text-white/10" />
            </motion.section>
          )}

          {!showDefaultHero && currentSlide < bannerCount && (
            <motion.section 
              key={`custom-banner-${currentSlide}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => handleDragEnd(e, info, currentSlide)}
              className="relative rounded-[2.5rem] overflow-hidden h-[180px] bg-neutral-900 text-white cursor-grab active:cursor-grabbing border-0 shadow-lg"
            >
              <img src={customBanners[currentSlide]} className="w-full h-full object-cover" alt="Banner" />
            </motion.section>
          )}

          {activeOffers.map((offer, idx) => (
            currentSlide === idx + bannerCount && (
              <motion.section 
                key={`offer-${offer.id}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, info) => handleDragEnd(e, info, idx + bannerCount)}
                className={`relative rounded-[2.5rem] overflow-hidden bg-gradient-to-br ${offerGradients[idx % offerGradients.length]} p-8 text-white cursor-grab active:cursor-grabbing`}
              >
                <div className="relative z-10">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-3 py-1 mb-4 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
                    Hot Bundle 🔥
                  </Badge>
                  <h2 className="text-2xl font-black tracking-tighter leading-tight mb-1">{offer.name}</h2>
                  {offer.description && (
                    <p className="text-white/75 text-[11px] font-medium max-w-[210px] leading-relaxed mb-4">{offer.description}</p>
                  )}
                  <div className="flex items-end gap-3 mt-3">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black uppercase tracking-widest text-white/60 mb-0.5">Bundle × {offer.bundleQuantity}</span>
                      <span className="text-4xl font-black tracking-tighter leading-none">{formatPrice(offer.price, offer.product?.currency || 'USD', displayCurrency)}</span>
                    </div>
                    <Button 
                      size="sm" 
                      className="mb-1 h-10 px-5 rounded-full bg-white/95 hover:bg-white text-neutral-900 font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-95 transition-all"
                      onClick={() => setSelectedOffer(offer)}
                    >
                      Claim Now
                    </Button>
                  </div>
                  {offer.expiresAt && (
                    <p className="text-[9px] font-black text-white/50 uppercase tracking-widest mt-3">
                      ⏰ Expires {new Date(offer.expiresAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {/* Removed white glow blur */}
                <StoreIcon className="absolute bottom-6 right-8 w-12 h-12 text-white/10" />
              </motion.section>
            )
          ))}
        </AnimatePresence>
        
        {/* Dynamic dot indicators */}
        <div className="flex justify-center gap-1.5 mt-4">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentSlide(i);
                if (autoSwapRef.current) clearInterval(autoSwapRef.current);
                autoSwapRef.current = setInterval(() => {
                  setCurrentSlide(prev => (prev + 1) % totalSlides);
                }, 3000);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentSlide === i 
                  ? `w-5 ${i < bannerCount ? 'bg-purple-600' : offerIndicatorColors[(i - bannerCount) % offerIndicatorColors.length]}` 
                  : 'w-1.5 bg-neutral-200'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-lg font-black tracking-tighter flex items-center gap-2 text-neutral-800 dark:text-foreground uppercase italic">
            <StoreIcon className="w-5 h-5 text-purple-600" /> {storeName}
          </h3>
           <Badge variant="outline" className="text-[10px] border-purple-100 text-purple-600 font-black px-3 py-1 rounded-full uppercase">
            {products?.length || 0} Products
          </Badge>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 px-1 scrollbar-hide no-scrollbar">
          {[
            { id: 'all', label: 'All', icon: <Package className="w-4 h-4" /> },
            { id: 'aws', label: 'AWS', icon: <FaAws className="w-4 h-4" /> },
            { id: 'digitalocean', label: 'DO', icon: <SiDigitalocean className="w-4 h-4" /> },
            { id: 'azure', label: 'Azure', icon: <VscAzure className="w-4 h-4" /> },
            { id: 'google', label: 'GCP', icon: <SiGooglecloud className="w-4 h-4" /> },
            { id: 'vultr', label: 'Vultr', icon: <SiVultr className="w-4 h-4" /> },
            { id: 'hetzner', label: 'Hetzner', icon: <SiHetzner className="w-4 h-4" /> },
            { id: 'oracle', label: 'Oracle', icon: <Database className="w-4 h-4" /> },
            { id: 'chatgpt', label: 'ChatGPT', icon: <SiOpenai className="w-4 h-4" style={{color:'#10a37f'}} /> },
            { id: 'claude', label: 'Claude', icon: <SiClaude className="w-4 h-4" style={{color:'#D4A574'}} /> },
            { id: 'gemini', label: 'Gemini', icon: <SiGooglegemini className="w-4 h-4" style={{color:'#4285F4'}} /> },
            { id: 'cursor', label: 'Cursor', icon: <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none"><rect width="24" height="24" rx="6" fill="#000"/><path d="M12 4L20 19H4L12 4Z" fill="white"/></svg> },
            { id: 'capcut', label: 'CapCut', icon: <svg viewBox="0 0 24 24" className="w-4 h-4"><rect width="24" height="24" rx="4" fill="#000"/><path d="M7 7h4v10H7zM13 7h4v10h-4z" fill="white"/></svg> },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl whitespace-nowrap text-[11px] font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white dark:bg-card text-neutral-400 border border-purple-50/50 dark:border-white/5'
              }`}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid gap-3.5">
          <AnimatePresence mode="popLayout">
            {products?.filter(p => {
              if (selectedCategory === 'all') return true;
              const n = (p.name + " " + p.type).toLowerCase();
              if (selectedCategory === 'aws') return n.includes('aws') || n.includes('amazon');
              if (selectedCategory === 'digitalocean') return n.includes('digitalocean') || n.includes('digital ocean');
              if (selectedCategory === 'chatgpt') return n.includes('chatgpt') || n.includes('openai') || n.includes('gpt');
              if (selectedCategory === 'capcut') return n.includes('capcut') || n.includes('cap cut');
              return n.includes(selectedCategory);
            }).map((product, index) => {
              const theme = getProviderTheme(product.name, product.type);
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setPurchaseQuantity(1);
                    setSelectedProduct(product);
                  }}
                  className={`group relative bg-white dark:bg-card p-5 rounded-[2rem] border border-purple-50/50 dark:border-white/10 shadow-sm hover:shadow-xl hover:border-purple-200 dark:hover:border-purple-500 hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between active:scale-[0.97]`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-inner ${theme.bg} ${theme.color} ${theme.hover} group-hover:text-white`}>
                      {theme.icon}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-black text-neutral-900 dark:text-card-foreground tracking-tight text-base leading-tight">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{product.type}</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-neutral-100" />
                        <Badge className="bg-green-50 text-green-600 border-0 hover:bg-green-50 text-[9px] font-black px-2 py-0.5 uppercase">
                          {product.stockCount} Stock
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-xl text-neutral-900 dark:text-card-foreground tracking-tighter">
                      {formatPrice(product.price, product.currency || 'USD', displayCurrency)}
                    </span>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${theme.bg} ${theme.color} ${theme.hover} group-hover:text-white`}>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
    );
  };

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 px-2">
        <h3 className="text-2xl font-black tracking-tighter text-neutral-900 uppercase italic">Your Orders</h3>
        <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest">History of your success</p>
      </div>

      <div className="space-y-4">
        {ordersLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>
        ) : orders?.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-200">
              <Package className="w-10 h-10" />
            </div>
            <p className="text-neutral-300 font-black uppercase tracking-widest text-xs">No orders found yet</p>
          </div>
        ) : (
          orders?.map((order, i) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setViewingOrder(order)}
              className="group bg-white p-6 rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-4 relative overflow-hidden cursor-pointer"
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="space-y-1">
                  <h5 className="font-black text-neutral-900 tracking-tight text-lg leading-tight uppercase italic group-hover:text-purple-600 transition-colors">{order.product?.name}</h5>
                  <div className="flex items-center gap-2 text-neutral-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-black uppercase tracking-tight">
                      {format(new Date(order.createdAt || Date.now()), "MMM dd, yyyy • hh:mm a")}
                    </span>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white border-0 rounded-full text-[9px] font-black uppercase tracking-widest px-3 py-1 shadow-lg">
                  Delivered
                </Badge>
              </div>
              
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 font-mono text-[11px] text-neutral-600 break-all flex items-center justify-between group/code relative cursor-pointer">
                <code className="line-clamp-1 pr-8 pointer-events-none">{order.credential?.content || "Check your Telegram DM"}</code>
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(order.credential?.content || "");
                  }}
                  className="absolute right-3 p-2 bg-white rounded-xl border border-neutral-100 shadow-sm opacity-0 group-hover/code:opacity-100 transition-opacity active:scale-90 pointer-events-auto"
                >
                  <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                </div>
              </div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/30 rounded-full translate-x-12 -translate-y-12" />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-black tracking-tighter text-neutral-900 dark:text-white uppercase italic">Payments</h3>
          <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest">Full account financial history</p>
        </div>
        <Button 
          onClick={() => setIsDepositModalOpen(true)}
          className="rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest text-[10px] h-10 px-4 shadow-md"
        >
          <Wallet className="w-3.5 h-3.5 mr-2" /> Top Up
        </Button>
      </div>

      <div className="space-y-3">
        {paymentsLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-600" /></div>
        ) : payments?.length === 0 ? (
          <div className="text-center py-20 space-y-4">
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto text-purple-200">
              <CreditCard className="w-10 h-10" />
            </div>
            <p className="text-neutral-300 font-black uppercase tracking-widest text-xs">No payments found</p>
          </div>
        ) : (
          payments?.map((payment, i) => {
            const isPendingCrypto = payment.status === 'pending' && ['trc20', 'aptos', 'binance'].includes(payment.paymentMethod.toLowerCase());
            return (
              <motion.div 
                key={payment.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  if (isPendingCrypto) {
                    handleResumePendingPayment(payment);
                  }
                }}
                className={`bg-white dark:bg-card p-5 rounded-3xl border border-neutral-100 dark:border-white/10 flex items-center justify-between shadow-sm relative overflow-hidden group ${
                  isPendingCrypto 
                    ? 'cursor-pointer hover:border-purple-200 dark:hover:border-purple-500 hover:shadow-md transition-all active:scale-[0.98]' 
                    : ''
                }`}
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                    payment.paymentMethod.toLowerCase().includes('binance') 
                      ? 'bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white dark:bg-amber-950/20 dark:text-amber-400 dark:group-hover:bg-amber-500 dark:group-hover:text-neutral-900' 
                      : payment.paymentMethod.toLowerCase().includes('stripe')
                        ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950/20 dark:text-indigo-400 dark:group-hover:bg-indigo-500'
                        : payment.paymentMethod.toLowerCase().includes('aptos')
                          ? 'bg-sky-50 text-sky-500 group-hover:bg-sky-500 group-hover:text-white dark:bg-sky-950/20 dark:text-sky-400 dark:group-hover:bg-sky-500'
                          : 'bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white dark:bg-teal-950/20 dark:text-teal-400 dark:group-hover:bg-teal-500' // trc20
                  }`}>
                    {(() => {
                      const method = payment.paymentMethod.toLowerCase();
                      if (method.includes('binance')) {
                        return <SiBinance className="w-6 h-6" />;
                      } else if (method.includes('stripe')) {
                        return (
                          <div className="relative w-8 h-8 flex items-center justify-center">
                            <FaCcVisa className="w-4.5 h-4.5 absolute -left-1.5 -rotate-12 transition-transform duration-300 group-hover:-translate-x-0.5" />
                            <FaCcMastercard className="w-4.5 h-4.5 absolute z-10 transition-transform duration-300 group-hover:-translate-y-0.5" />
                            <FaCcAmex className="w-4.5 h-4.5 absolute -right-1.5 rotate-12 transition-transform duration-300 group-hover:translate-x-0.5" />
                          </div>
                        );
                      } else if (method.includes('aptos')) {
                        return (
                          <svg viewBox="0 0 74.67 74.96" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                            <path d="M57.84,25.08H51.23a2.67,2.67,0,0,1-2-.91l-2.68-3a2.12,2.12,0,0,0-3.15,0l-2.3,2.6a4,4,0,0,1-3,1.34H2a37.24,37.24,0,0,0-2,9.25H34.13a2.21,2.21,0,0,0,1.59-.68l3.18-3.32a2.13,2.13,0,0,1,1.52-.64h.13a2.05,2.05,0,0,1,1.57.71l2.68,3a2.69,2.69,0,0,0,2,.91H74.67a36.79,36.79,0,0,0-2-9.25H57.84Z"/>
                            <path d="M20.65,53.78a2.17,2.17,0,0,0,1.59-.68l3.18-3.31a2.1,2.1,0,0,1,1.52-.65h.13a2.12,2.12,0,0,1,1.58.71l2.68,3a2.7,2.7,0,0,0,2,.9H71.09a37.09,37.09,0,0,0,3.07-9.34H37.92a2.67,2.67,0,0,1-2-.91l-2.68-3a2.1,2.1,0,0,0-3.15,0l-2.3,2.59a4,4,0,0,1-3,1.34H.51a37.5,37.5,0,0,0,3.07,9.34Z"/>
                            <path d="M47.44,15A2.23,2.23,0,0,0,49,14.29L52.21,11a2.09,2.09,0,0,1,1.52-.64h.13a2.09,2.09,0,0,1,1.57.7l2.68,3a2.67,2.67,0,0,0,2,.91H67.3A37.48,37.48,0,0,0,7.37,15Z"/>
                            <path d="M33,63H23.2a2.7,2.7,0,0,1-2-.9l-2.68-3a2.1,2.1,0,0,0-3.15,0l-2.3,2.6a4,4,0,0,1-3,1.33H9.94a37.44,37.44,0,0,0,54.79,0Z"/>
                          </svg>
                        );
                      } else { // trc20
                        return (
                          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.7538 10.5176c0 .6251-2.2379 1.1483-5.2381 1.2812l.0028.0007c-.0848.0064-.5233.0325-1.5012.0325-.7778 0-1.33-.0233-1.5237-.0325-3.0059-.1322-5.2495-.6555-5.2495-1.2819s2.2436-1.149 5.2495-1.2834v2.0442c.1965.0142.7594.0474 1.5372.0474.9334 0 1.4008-.0389 1.4849-.0466V9.2356c2.9994.1337 5.2381.657 5.2381 1.282zm5.19.5466L12.1248 22.389a.1803.1803 0 0 1-.2496 0L.0562 11.0635a.1781.1781 0 0 1-.0382-.2079l4.3762-9.1921a.1767.1767 0 0 1 .1626-.1026h14.8878a.1768.1768 0 0 1 .1612.1032l4.3762 9.1922a.1782.1782 0 0 1-.0382.2079zm-4.478-.4038c0-.8068-2.5515-1.4799-5.9473-1.6369V7.195h4.186V4.4055H6.3076V7.195h4.1852v1.8286c-3.4018.1562-5.9601.83-5.9601 1.6376 0 .8075 2.5583 1.4806 5.9601 1.6376v5.8618h3.025v-5.8639c3.394-.1563 5.948-.8295 5.948-1.6363z"/>
                          </svg>
                        );
                      }
                    })()}
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{payment.paymentMethod}</span>
                    <div className="text-[12px] font-black text-neutral-900 dark:text-white italic">
                      {format(new Date(payment.createdAt || Date.now()), "MMMM dd, HH:mm")}
                    </div>
                  </div>
                </div>
                <div className="text-right relative z-10">
                  <div className="text-lg font-black text-neutral-900 dark:text-white tracking-tighter">
                    +${(payment.amount / 100).toFixed(2)}
                  </div>
                  <Badge className={`bg-transparent p-0 text-[10px] font-black uppercase tracking-[0.2em] ${payment.status === 'completed' ? 'text-green-500' : 'text-amber-500'}`}>
                    ● {payment.status} {isPendingCrypto && <span className="text-[9px] text-purple-600 dark:text-purple-400 animate-pulse font-extrabold normal-case tracking-normal ml-1">(Resume)</span>}
                  </Badge>
                </div>
                <div className="absolute left-0 bottom-0 w-full h-[3px] bg-green-500/10 group-hover:bg-green-500/50 transition-all" />
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );

  const renderProfile = () => {
    const isGuest = user?.telegramId?.startsWith("web_guest_");

    return (
      <div className="space-y-8 animate-in">
        <div className="flex flex-col gap-1 px-2">
          <h3 className="text-2xl font-black tracking-tighter text-neutral-900 dark:text-white uppercase italic">Profile</h3>
          <p className="text-neutral-400 dark:text-neutral-500 text-xs font-bold uppercase tracking-widest">
            {isGuest ? "Guest Session" : "Account Details"}
          </p>
        </div>

        {/* User Card */}
        <div className="bg-white dark:bg-card rounded-[3rem] p-10 border border-purple-50 dark:border-white/5 relative overflow-hidden shadow-xl shadow-purple-500/[0.02]">
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-purple-600 via-pink-500 to-blue-600 rounded-[35%] blur-sm opacity-70 group-hover:opacity-100 transition duration-700 group-hover:duration-300"></div>
              <div className="relative w-24 h-24 rounded-[30%] bg-neutral-900 flex items-center justify-center text-white shadow-2xl rotate-12 group-hover:rotate-0 transition-transform duration-500 overflow-hidden ring-4 ring-white dark:ring-neutral-900">
                <UserAvatar fallback={UserIcon} className="w-full h-full -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-4 border-white dark:border-neutral-900 flex items-center justify-center shadow-lg z-20">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
            
            {/* User Info */}
            <div className="space-y-3">
              <h4 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tighter italic">
                {isGuest ? "Temporary Guest" : (user?.firstName || "Web Client")}
              </h4>
              
              {/* Account ID / Email Copy Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-neutral-50 dark:bg-white/5 border border-purple-100/50 dark:border-white/5 text-neutral-600 dark:text-white/80 text-xs font-semibold shadow-inner group">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-widest">
                  {isGuest ? "Guest ID:" : "Email:"}
                </span>
                <span className="font-mono font-bold text-neutral-800 dark:text-white">
                  {isGuest 
                    ? user?.telegramId?.substring(10, 18) 
                    : user?.telegramId?.replace("email:", "")}
                </span>
                <button 
                  onClick={() => {
                    const idText = isGuest 
                      ? user?.telegramId?.substring(10, 18) 
                      : user?.telegramId?.replace("email:", "");
                    if (idText) {
                      copyToClipboard(idText);
                    }
                  }}
                  className="p-1 hover:text-purple-600 dark:hover:text-purple-400 text-neutral-400 transition-colors duration-150 rounded-md hover:bg-neutral-200/50 dark:hover:bg-white/10 ml-0.5"
                  title="Copy ID"
                >
                  <Copy className="w-3 h-3 group-hover:scale-110 transition-transform duration-200" />
                </button>
              </div>
            </div>

            <div className="w-full h-px bg-neutral-100 dark:bg-white/5" />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Balance Card */}
              <div 
                onClick={() => setIsDepositModalOpen(true)}
                className="bg-neutral-50/60 dark:bg-white/5 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-white/5 flex flex-col items-center gap-3 cursor-pointer hover:bg-purple-50/30 dark:hover:bg-purple-950/10 hover:border-purple-200 dark:hover:border-purple-500/20 hover:scale-[1.03] transition-all duration-300 active:scale-[0.97] shadow-sm"
              >
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20">
                  <Wallet className="w-6 h-6" />
                </div>
                <div className="text-center space-y-0.5">
                  <div className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Balance</div>
                  <div className="text-xl font-black text-neutral-900 dark:text-white tracking-tighter">{formatPrice(user?.balance || 0, 'USD', displayCurrency)}</div>
                </div>
              </div>

              {/* Orders Card */}
              <div 
                onClick={() => setActiveTab("orders")}
                className="bg-neutral-50/60 dark:bg-white/5 p-6 rounded-[2.5rem] border border-neutral-100 dark:border-white/5 flex flex-col items-center gap-3 cursor-pointer hover:bg-blue-50/30 dark:hover:bg-blue-950/10 hover:border-blue-200 dark:hover:border-blue-500/20 hover:scale-[1.03] transition-all duration-300 active:scale-[0.97] shadow-sm"
              >
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20">
                  <Package className="w-6 h-6" />
                </div>
                <div className="text-center space-y-0.5">
                  <div className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Orders</div>
                  <div className="text-xl font-black text-neutral-900 dark:text-white tracking-tighter">{orders?.length || 0}</div>
                </div>
              </div>
            </div>

            {!isGuest && (
              <Button 
                variant="outline"
                className="w-full h-14 rounded-[2rem] border-red-200 dark:border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 dark:text-red-400 font-black uppercase tracking-[0.2em] shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] mt-2"
                onClick={handleLogout}
              >
                Log Out Account
              </Button>
            )}
          </div>
          
          <div className="absolute top-0 left-0 w-full h-2.5 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500" />
        </div>

        {/* Guest Authentication Form */}
        {isGuest && (
          <div className="glass-card border border-purple-100/50 rounded-[3rem] p-8 space-y-6 relative overflow-hidden bg-white/80 backdrop-blur-xl">
            <div className="space-y-1 text-center">
              <h4 className="text-xl font-black text-neutral-800 tracking-tight uppercase">Save Progress / Sign In</h4>
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Unified Email OTP Login & Register</p>
            </div>

            {!otpSent ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl bg-neutral-50 border border-neutral-100 text-sm font-semibold placeholder:text-neutral-300 text-neutral-800 focus:outline-none focus:border-purple-300 transition-all"
                  />
                </div>

                <Button
                  className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-wider shadow-md disabled:opacity-50"
                  disabled={isAuthSubmitting || !emailInput}
                  onClick={handleSendOtp}
                >
                  {isAuthSubmitting ? "Sending..." : "Send Verification Code"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest pl-2">Verification Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl bg-neutral-50 border border-neutral-100 text-center font-mono text-lg font-black tracking-widest text-neutral-800 focus:outline-none focus:border-purple-300 transition-all"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-wider text-neutral-400 hover:bg-neutral-50"
                    onClick={() => {
                      setOtpSent(false);
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-wider shadow-md disabled:opacity-50"
                    disabled={isAuthSubmitting || otpInput.length !== 6}
                    onClick={handleVerifyOtp}
                  >
                    {isAuthSubmitting ? "Verifying..." : "Verify & Login"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100/50 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-amber-500 shrink-0 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h5 className="text-sm font-black text-amber-900 tracking-tight uppercase">Support Security</h5>
            <p className="text-[11px] font-bold text-amber-700/70 leading-relaxed uppercase">Your credentials are encrypted end-to-end. Contact {supportUsername} for bulk inquiries.</p>
          </div>
        </div>
      </div>
    );
  };

  if (userLoading || productsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden" style={{ background: '#f8f7ff' }}>
        <div className="relative w-16 h-16">
          <motion.div
            className="w-full h-full relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <motion.div 
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-0 left-1/2 -ml-2.5 w-5 h-5 rounded-full bg-purple-600 shadow-lg" 
            />
            <motion.div 
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
              className="absolute bottom-0 left-0 w-5 h-5 rounded-full bg-blue-600 shadow-lg" 
            />
            <motion.div 
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-pink-600 shadow-lg" 
            />
          </motion.div>
        </div>
        
        <div className="mt-16 text-center space-y-2">
          <h3 className="text-xl font-black italic tracking-tighter text-neutral-800 uppercase">
            {storeName}
          </h3>
          <p className="font-black text-[9px] text-purple-600/40 tracking-[0.5em] uppercase animate-pulse">
            {loadingText}
          </p>
        </div>
      </div>
    );
  }

  const isGuest = user?.telegramId?.startsWith("web_guest_");

  return (
    <div className="tg-mini-app min-h-screen text-neutral-900 dark:text-foreground font-sans selection:bg-purple-200 pb-32" style={{ background: 'inherit' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-background/80 backdrop-blur-2xl border-b border-purple-50/50 dark:border-white/10 px-6 py-5">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div 
            className="flex items-center gap-3.5 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => {
              if (isGuest) {
                setIsLoginDialogOpen(true);
              } else {
                setActiveTab("profile");
              }
            }}
          >
            <motion.div 
              whileHover={{ rotate: 10 }}
              className="w-11 h-11 rounded-2xl bg-neutral-900 flex items-center justify-center shadow-lg transition-all overflow-hidden"
            >
              <UserAvatar fallback={UserIcon} className="w-full h-full" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.25em] leading-none mb-1">
                {isGuest ? "Demo Guest" : "Authenticated"}
              </span>
              <span className="text-base font-black tracking-tighter text-neutral-900 dark:text-white leading-none italic">
                {isGuest ? "WEB" : (user?.firstName?.toUpperCase() || "ACCESS_DENIED")}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.div 
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDepositModalOpen(true)}
              className="px-5 py-2.5 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 flex items-center gap-3 shadow-inner cursor-pointer hover:opacity-95 transition-opacity"
            >
              <Wallet className="w-4 h-4 text-purple-600" />
              <span className="text-lg font-black tracking-tighter text-neutral-900 dark:text-white leading-none italic">
                {formatPrice(user?.balance || 0, 'USD', displayCurrency)}
              </span>
            </motion.div>
            <ThemeToggle className="bg-neutral-50 dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 shadow-inner" />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-md mx-auto p-6 pb-28 min-h-[60vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {activeTab === "store" && renderStore()}
            {activeTab === "orders" && renderOrders()}
            {activeTab === "payments" && renderPayments()}
            {activeTab === "profile" && renderProfile()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Fixed Bottom Navigation */}
      <nav className="fixed bottom-2 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm z-[100]">
        <div className="bg-neutral-900/95 backdrop-blur-xl rounded-[2.5rem] p-2 flex items-center justify-between shadow-2xl border border-white/10 relative overflow-hidden">
          <TabButton 
            active={activeTab === "store"} 
            onClick={() => setActiveTab("store")} 
            icon={<StoreIcon className="w-5 h-5" />} 
            label="Shop"
          />
          <TabButton 
            active={activeTab === "orders"} 
            onClick={() => setActiveTab("orders")} 
            icon={<HistoryIcon className="w-5 h-5" />} 
            label="Stock"
          />
          <TabButton 
            active={activeTab === "payments"} 
            onClick={() => setActiveTab("payments")} 
            icon={<CreditCard className="w-5 h-5" />} 
            label="Funds"
          />
          <TabButton 
            active={activeTab === "profile"} 
            onClick={() => setActiveTab("profile")} 
            icon={<UserIcon className="w-5 h-5" />} 
            label="ID"
          />
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </nav>

      {/* Regular Purchase Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="rounded-[2.5rem] border-0 bg-white/95 backdrop-blur-xl p-8 shadow-2xl max-w-[90vw] mx-auto">
          <DialogHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-3xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-inner">
                {selectedProduct && getProviderIcon(selectedProduct.name, selectedProduct.type)}
              </div>
            </div>
            <div className="text-center">
              <DialogTitle className="text-2xl font-black tracking-tighter text-neutral-900 uppercase italic">
                {selectedProduct?.name}
              </DialogTitle>
              <DialogDescription className="text-xs font-bold uppercase tracking-widest text-neutral-400 mt-1">
                Select quantity and confirm
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="py-6 space-y-6">
            {/* Quantity Selector */}
            <div className="flex flex-col items-center gap-4">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Select Quantity</span>
              <div className="flex items-center gap-6 bg-purple-50/50 p-2 rounded-[2rem] border border-purple-100">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-12 h-12 rounded-[1.25rem] bg-white shadow-md hover:bg-purple-600 hover:text-white text-purple-600 transition-all disabled:opacity-30 border border-purple-50"
                  disabled={purchaseQuantity <= 1}
                  onClick={() => setPurchaseQuantity(q => q - 1)}
                >
                  <Minimize2 className="w-5 h-5" />
                </Button>
                <div className="flex flex-col items-center min-w-[3rem]">
                  <span className="text-3xl font-black text-neutral-900 tabular-nums leading-none">{purchaseQuantity}</span>
                  <span className="text-[9px] font-black text-purple-400 uppercase tracking-tighter mt-1">Items</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-12 h-12 rounded-[1.25rem] bg-white shadow-md hover:bg-purple-600 hover:text-white text-purple-600 transition-all disabled:opacity-30 border border-purple-50"
                  disabled={selectedProduct && purchaseQuantity >= (selectedProduct.stockCount || 0)}
                  onClick={() => setPurchaseQuantity(q => q + 1)}
                >
                  <X className="w-5 h-5 rotate-45" />
                </Button>
              </div>
            </div>

            <div className="bg-purple-50/50 p-5 rounded-3xl border border-purple-100 flex justify-between items-center">
              <span className="text-xs font-black text-purple-900/40 uppercase tracking-widest">Total Price</span>
              <span className="text-2xl font-black text-purple-900 tracking-tighter">
                {selectedProduct ? formatPrice(selectedProduct.price * purchaseQuantity, selectedProduct.currency || 'USD', displayCurrency) : formatPrice(0, 'USD', displayCurrency)}
              </span>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button 
              variant="ghost" 
              className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-neutral-400 hover:bg-neutral-50"
              onClick={() => setSelectedProduct(null)}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest shadow-xl disabled:opacity-50"
              disabled={purchaseMutation.isPending || !selectedProduct || (selectedProduct.stockCount || 0) < purchaseQuantity}
              onClick={() => {
                if (selectedProduct) {
                  purchaseMutation.mutate({ productId: selectedProduct.id, quantity: purchaseQuantity });
                }
              }}
            >
              {purchaseMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Buy"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Special Offer Dialog */}
      <Dialog open={!!selectedOffer} onOpenChange={(open) => !open && setSelectedOffer(null)}>
        <DialogContent className="rounded-[3rem] border-0 bg-gradient-to-br from-neutral-900 to-neutral-800 p-0 shadow-2xl max-w-[90vw] mx-auto overflow-hidden">
          <div className="p-8 space-y-6 relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/10 blur-3xl rounded-full translate-x-12 -translate-y-12" />
            
            <div className="flex justify-center relative z-10">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-orange-600 flex items-center justify-center text-white shadow-2xl shadow-orange-500/20">
                <Zap className="w-10 h-10 fill-white/20" />
              </div>
            </div>

            <div className="text-center space-y-2 relative z-10">
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-2">
                Exclusive Bundle Deal
              </Badge>
              <DialogTitle className="text-3xl font-black tracking-tighter text-white uppercase italic">
                {selectedOffer?.name}
              </DialogTitle>
              <p className="text-neutral-400 text-[11px] font-medium max-w-[250px] mx-auto leading-relaxed">
                {selectedOffer?.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-white/5 p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-1">
                <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Quantity</span>
                <span className="text-xl font-black text-white">{selectedOffer?.bundleQuantity} Units</span>
              </div>
              <div className="bg-white/5 p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-1">
                <span className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Bundle Price</span>
                <span className="text-xl font-black text-amber-400">{selectedOffer ? formatPrice(selectedOffer.price, selectedOffer.product?.currency || 'USD', displayCurrency) : formatPrice(0, 'USD', displayCurrency)}</span>
              </div>
            </div>

            <Button 
              className="w-full h-16 rounded-3xl bg-amber-500 hover:bg-amber-400 text-neutral-900 font-black uppercase tracking-[0.2em] shadow-2xl shadow-amber-500/20 group relative z-10"
              disabled={purchaseOfferMutation.isPending}
              onClick={() => {
                if (selectedOffer) {
                  purchaseOfferMutation.mutate(selectedOffer.id);
                }
              }}
            >
              {purchaseOfferMutation.isPending ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>Claim Offer <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" /></>
              )}
            </Button>

            <button 
              onClick={() => setSelectedOffer(null)}
              className="w-full text-center text-neutral-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors py-2"
            >
              Maybe later
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Animation Overlay */}
      <AnimatePresence>
        {purchaseSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-white/90 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-32 h-32 rounded-[2.5rem] bg-green-500 text-white flex items-center justify-center mb-8"
            >
              <CheckCircle2 className="w-16 h-16" />
            </motion.div>
            <h2 className="text-3xl font-black tracking-tighter text-neutral-900 uppercase italic mb-2">Order Confirmed!</h2>
            <p className="text-neutral-500 text-[11px] font-bold uppercase tracking-widest mb-8">Your credentials have been sent to your Telegram DM</p>
            <Button 
              className="h-14 px-10 rounded-2xl bg-neutral-900 hover:bg-black text-white font-black uppercase tracking-widest shadow-xl"
              onClick={() => setPurchaseSuccess(false)}
            >
              Return to Store
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Order Detail Dialog */}
      <Dialog open={viewingOrder !== null} onOpenChange={(open) => !open && setViewingOrder(null)}>
        <DialogContent className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-6 border-0 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] max-w-[90%] sm:max-w-md overflow-hidden">
          {viewingOrder && (
            <>
              <DialogHeader className="space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center mb-1 mx-auto shadow-inner group">
                   {getProviderIcon(viewingOrder.product?.name || "", viewingOrder.product?.type || "")}
                </div>
                <DialogTitle className="text-xl font-black text-center text-neutral-900 tracking-tighter uppercase italic leading-none">Order Details</DialogTitle>
                <DialogDescription className="text-center text-neutral-400 font-bold text-[10px] px-4 uppercase tracking-[0.1em] leading-relaxed">
                  {format(new Date(viewingOrder.createdAt || Date.now()), "MMMM dd, yyyy • hh:mm a")}
                </DialogDescription>
              </DialogHeader>

              <div className="my-3 space-y-3">
                <div className="bg-neutral-50/80 p-4 rounded-3xl border border-neutral-100 flex flex-col gap-2 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Credentials</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 rounded-full bg-white text-purple-600 hover:bg-purple-600 hover:text-white border border-purple-100 shadow-sm font-black text-[8px] uppercase px-3"
                      onClick={() => copyToClipboard(viewingOrder.credential?.content || "")}
                    >
                      Copy All
                    </Button>
                  </div>
                  <div className="bg-white p-3.5 rounded-2xl border border-neutral-100 font-mono text-[11px] text-neutral-700 break-all leading-relaxed shadow-inner max-h-[120px] overflow-y-auto scrollbar-hide">
                    {viewingOrder.credential?.content || "Credentials not found"}
                  </div>
                </div>

                {/* 2FA Section Detection */}
                {(() => {
                  const content = viewingOrder.credential?.content || "";
                  const secretMatch = content.match(/[A-Z2-7]{16,32}/);
                  if (secretMatch) {
                    return <LiveTOTP secret={secretMatch[0]} onCopy={(text) => {
                      navigator.clipboard.writeText(text);
                      toast({ title: "2FA Code Copied", description: "The live verification code is now in your clipboard." });
                    }} />;
                  }
                  return null;
                })()}

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-neutral-50/50 p-3.5 rounded-[1.25rem] border border-neutral-100/50 text-center">
                    <div className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Status</div>
                    <div className="text-[10px] font-black text-green-600 uppercase">Delivered</div>
                  </div>
                  <div className="bg-neutral-50/50 p-3.5 rounded-[1.25rem] border border-neutral-100/50 text-center">
                    <div className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Stock ID</div>
                    <div className="text-[10px] font-black text-neutral-900 italic">#{viewingOrder.id.toString().padStart(4, '0')}</div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button 
                  onClick={() => setViewingOrder(null)}
                  className="w-full h-12 rounded-[1.25rem] bg-neutral-900 hover:bg-black text-white font-black uppercase tracking-[0.2em] transition-all shadow-xl active:scale-95 text-[10px]"
                >
                  Close Record
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Floating AI Chat Widget */}
      <div className="fixed bottom-24 right-4 z-50">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-16 right-0 w-[320px] max-h-[450px] bg-[#1a1625]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Chat Header */}
              <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 animate-in fade-in">
                    {chatMode === "ai" ? (
                      <SiDigitalocean className="w-4 h-4 text-primary animate-pulse" />
                    ) : (
                      <MessageCircle className="w-4 h-4 text-purple-400 animate-pulse" />
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-white uppercase tracking-widest transition-all">
                      {chatMode === "ai" ? "AI Concierge" : "Live Chat"}
                    </div>
                    <div className="text-[8px] text-green-400 flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" /> 
                      {chatMode === "ai" ? "Online Support" : "Human Agent"}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {chatMode === "human" ? (
                    <button 
                      onClick={() => setChatMode("ai")} 
                      className="text-[8px] font-extrabold uppercase bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white px-2.5 py-1.5 rounded-full transition-all duration-300"
                    >
                      AI Mode
                    </button>
                  ) : (
                    <button 
                      onClick={handleRequestHuman}
                      disabled={isRequestingHuman}
                      className="text-[8px] font-extrabold uppercase bg-purple-600 hover:bg-purple-700 hover:scale-105 active:scale-95 text-white px-2.5 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1 shadow-md shadow-purple-900/30"
                    >
                      {isRequestingHuman ? (
                        <Loader2 className="w-2.5 h-2.5 animate-spin" />
                      ) : (
                        "Live Agent"
                      )}
                    </button>
                  )}
                  <button onClick={() => setIsChatOpen(false)} className="text-white/40 hover:text-white transition-colors">
                    <Minimize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide min-h-[300px]">
                {chatMode === "ai" ? (
                  chatHistory.map((msg, i) => {
                    const showContactBtn = msg.role === 'bot' && (
                      msg.content.toLowerCase().includes('contact') || 
                      msg.content.toLowerCase().includes('support') || 
                      msg.content.toLowerCase().includes('@')
                    );
                    return (
                      <div key={i} className={`flex flex-col w-full ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-primary text-white rounded-tr-none shadow-lg' 
                            : 'bg-white/5 text-white/90 border border-white/10 rounded-tl-none'
                        }`}>
                          <div className="space-y-1">
                            {msg.role === 'user' ? msg.content : formatChatMessage(msg.content)}
                          </div>
                          {showContactBtn && (
                            <div className="mt-2 pt-2 border-t border-white/10 flex justify-start">
                              <a 
                                href={getTelegramLink(supportUsername)} 
                                target="_blank" 
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white rounded-full text-[9px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-md shadow-purple-900/40"
                              >
                                <FaTelegram className="w-3 h-3 text-white" />
                                <span>Contact Us</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
                    {isLiveLoading ? (
                      <div className="flex justify-center items-center h-full min-h-[250px]">
                        <Loader2 className="w-5 h-5 animate-spin text-primary" />
                      </div>
                    ) : liveMessages.length === 0 ? (
                      <div className="text-center py-12 text-white/30 text-[9px] uppercase font-black tracking-widest animate-pulse">
                        No messages yet.<br/>Requesting connection to a human...
                      </div>
                    ) : (
                      liveMessages.map((msg, i) => {
                        const isAdmin = msg.sender === "admin";
                        return (
                          <div key={msg.id || i} className={`flex flex-col w-full ${!isAdmin ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                            <div className={`max-w-[85%] p-3 rounded-2xl text-[11px] leading-relaxed ${
                              !isAdmin 
                                ? 'bg-primary text-white rounded-tr-none shadow-lg' 
                                : 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-tl-none border border-white/5 shadow-md'
                            }`}>
                              <div className="space-y-1 break-all">
                                {msg.message}
                              </div>
                              <div className="text-[7px] text-white/30 text-right mt-1 font-semibold uppercase">
                                {formatTime(msg.createdAt)}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </>
                )}
                {isSendingChat && (
                  <div className="flex justify-start">
                    <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none border border-white/10">
                      <Loader2 className="w-3 h-3 animate-spin text-primary" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
                <input 
                  type="text"
                  placeholder={chatMode === "ai" ? "Ask anything..." : "Reply to live agent..."}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[11px] text-white focus:outline-none focus:border-primary/50"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (chatMode === 'human' ? handleSendLiveMessage() : handleSendChat())}
                />
                <button 
                  onClick={chatMode === 'human' ? handleSendLiveMessage : handleSendChat}
                  disabled={!chatMessage.trim() || isSendingChat}
                  className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center transition-transform active:scale-90 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Dialog open={isDepositModalOpen} onOpenChange={(open) => {
          if (!open) {
            setIsDepositModalOpen(false);
            setActiveDeposit(null);
            setTxidInput("");
          }
        }}>
          <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="rounded-[2.5rem] border-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-5 sm:p-8 shadow-2xl max-w-[90vw] mx-auto text-neutral-900 dark:text-white">
            <DialogHeader className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 shadow-inner">
                  <Wallet className="w-8 h-8" />
                </div>
              </div>
              <div className="text-center">
                <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic">
                  {activeDeposit ? "Verify Crypto Payment" : "Top Up Balance"}
                </DialogTitle>
                <DialogDescription className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mt-1">
                  {activeDeposit ? "Submit transaction details" : "Select amount and method"}
                </DialogDescription>
                {!activeDeposit && (
                  <div className="flex justify-center gap-2 mt-4">
                    {(['USD', 'LKR', 'INR', 'EUR'] as const).map((curr) => (
                      <button
                        key={curr}
                        onClick={() => {
                          setDisplayCurrency(curr);
                          localStorage.setItem("display_currency", curr);
                        }}
                        className={`text-[9px] font-black px-3.5 py-1.5 rounded-full transition-all duration-300 ${
                          displayCurrency === curr
                            ? 'bg-purple-600 text-white shadow-md shadow-purple-900/30 scale-105'
                            : 'bg-neutral-100 dark:bg-white/5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-white/5'
                        }`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </DialogHeader>

            {!activeDeposit ? (
              <div className="py-4 space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest flex justify-between">
                    <span>Amount ($ USD)</span>
                    <span className="text-purple-500 font-bold lowercase tracking-normal">Min: ${minDepositLimit.toFixed(2)}</span>
                  </label>
                  <input 
                    type="text" 
                    value={depositAmount} 
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="20.00"
                    className="w-full h-14 rounded-2xl bg-purple-50/50 dark:bg-white/5 border border-purple-100 dark:border-white/10 px-4 text-lg font-black focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 focus:ring-1 focus:ring-purple-500 text-center"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block">Payment Method</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { 
                        id: 'stripe', 
                        name: 'Stripe / Card', 
                        icon: (
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#635BFF]" xmlns="http://www.w3.org/2000/svg">
                            <title>Stripe</title>
                            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
                          </svg>
                        )
                      },
                      { 
                        id: 'trc20', 
                        name: 'USDT (TRC20)', 
                        icon: (
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#26A17B]" xmlns="http://www.w3.org/2000/svg">
                            <title>Tether</title>
                            <path d="M18.7538 10.5176c0 .6251-2.2379 1.1483-5.2381 1.2812l.0028.0007c-.0848.0064-.5233.0325-1.5012.0325-.7778 0-1.33-.0233-1.5237-.0325-3.0059-.1322-5.2495-.6555-5.2495-1.2819s2.2436-1.149 5.2495-1.2834v2.0442c.1965.0142.7594.0474 1.5372.0474.9334 0 1.4008-.0389 1.4849-.0466V9.2356c2.9994.1337 5.2381.657 5.2381 1.282zm5.19.5466L12.1248 22.389a.1803.1803 0 0 1-.2496 0L.0562 11.0635a.1781.1781 0 0 1-.0382-.2079l4.3762-9.1921a.1767.1767 0 0 1 .1626-.1026h14.8878a.1768.1768 0 0 1 .1612.1032l4.3762 9.1922a.1782.1782 0 0 1-.0382.2079zm-4.478-.4038c0-.8068-2.5515-1.4799-5.9473-1.6369V7.195h4.186V4.4055H6.3076V7.195h4.1852v1.8286c-3.4018.1562-5.9601.83-5.9601 1.6376 0 .8075 2.5583 1.4806 5.9601 1.6376v5.8618h3.025v-5.8639c3.394-.1563 5.948-.8295 5.948-1.6363z"/>
                          </svg>
                        )
                      },
                      { 
                        id: 'aptos', 
                        name: 'USDT (Aptos)', 
                        icon: (
                          <svg viewBox="0 0 74.67 74.96" className="w-4 h-4 fill-current text-[#1ea7d6]" xmlns="http://www.w3.org/2000/svg">
                            <title>Aptos</title>
                            <path d="M57.84,25.08H51.23a2.67,2.67,0,0,1-2-.91l-2.68-3a2.12,2.12,0,0,0-3.15,0l-2.3,2.6a4,4,0,0,1-3,1.34H2a37.24,37.24,0,0,0-2,9.25H34.13a2.21,2.21,0,0,0,1.59-.68l3.18-3.32a2.13,2.13,0,0,1,1.52-.64h.13a2.05,2.05,0,0,1,1.57.71l2.68,3a2.69,2.69,0,0,0,2,.91H74.67a36.79,36.79,0,0,0-2-9.25H57.84Z"/>
                            <path d="M20.65,53.78a2.17,2.17,0,0,0,1.59-.68l3.18-3.31a2.1,2.1,0,0,1,1.52-.65h.13a2.12,2.12,0,0,1,1.58.71l2.68,3a2.7,2.7,0,0,0,2,.9H71.09a37.09,37.09,0,0,0,3.07-9.34H37.92a2.67,2.67,0,0,1-2-.91l-2.68-3a2.1,2.1,0,0,0-3.15,0l-2.3,2.59a4,4,0,0,1-3,1.34H.51a37.5,37.5,0,0,0,3.07,9.34Z"/>
                            <path d="M47.44,15A2.23,2.23,0,0,0,49,14.29L52.21,11a2.09,2.09,0,0,1,1.52-.64h.13a2.09,2.09,0,0,1,1.57.7l2.68,3a2.67,2.67,0,0,0,2,.91H67.3A37.48,37.48,0,0,0,7.37,15Z"/>
                            <path d="M33,63H23.2a2.7,2.7,0,0,1-2-.9l-2.68-3a2.1,2.1,0,0,0-3.15,0l-2.3,2.6a4,4,0,0,1-3,1.33H9.94a37.44,37.44,0,0,0,54.79,0Z"/>
                          </svg>
                        )
                      },
                      { 
                        id: 'binance', 
                        name: 'Binance Pay', 
                        icon: (
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-[#F0B90B]" xmlns="http://www.w3.org/2000/svg">
                            <title>Binance</title>
                            <path d="M16.624 13.9202l2.7175 2.7154-7.353 7.353-7.353-7.352 2.7175-2.7164 4.6355 4.6595 4.6356-4.6595zm4.6366-4.6366L24 12l-2.7154 2.7164L18.5682 12l2.6924-2.7164zm-9.272.001l2.7163 2.6914-2.7164 2.7174v-.001L9.2721 12l2.7164-2.7154zm-9.2722-.001L5.4088 12l-2.6914 2.6924L0 12l2.7164-2.7164zM11.9885.0115l7.353 7.329-2.7174 2.7154-4.6356-4.6356-4.6355 4.6595-2.7174-2.7154 7.353-7.353z"/>
                          </svg>
                        )
                      }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          console.log("Selected payment method:", m.id);
                          setDepositMethod(m.id as any);
                        }}
                        className={`flex items-center gap-3 p-4 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all ${
                          depositMethod === m.id 
                            ? 'bg-purple-600 text-white border-purple-600' 
                            : 'bg-white dark:bg-card text-neutral-500 dark:text-neutral-400 border-purple-50/50 dark:border-white/5 hover:border-purple-200 dark:hover:border-purple-500'
                        }`}
                      >
                        <span className="pointer-events-none flex items-center gap-3">
                          {m.icon}
                          {m.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {depositMethod === 'stripe' && (() => {
                  const amt = parseFloat(depositAmount);
                  if (!isNaN(amt) && amt > 0) {
                    const fee = amt * 0.045 + 0.30;
                    const total = amt + fee;
                    return (
                      <div className="bg-purple-50/30 dark:bg-white/5 p-4 rounded-2xl border border-purple-100/50 dark:border-white/5 space-y-2 text-xs">
                        <div className="flex justify-between items-center text-neutral-500 dark:text-neutral-400">
                          <span className="font-bold uppercase tracking-wider text-[10px]">Deposit Amount:</span>
                          <span className="font-mono font-black">${amt.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-neutral-500 dark:text-neutral-400">
                          <span className="font-bold uppercase tracking-wider text-[10px]">Stripe Processing Fee (4.5% + $0.30):</span>
                          <span className="font-mono font-black">${fee.toFixed(2)}</span>
                        </div>
                        <div className="h-px bg-purple-100 dark:bg-white/5 my-1" />
                        <div className="flex justify-between items-center text-neutral-900 dark:text-white font-black">
                          <span className="uppercase tracking-wider text-[10px]">Total Amount:</span>
                          <span className="font-mono text-sm">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                <DialogFooter className="pt-4">
                  <Button 
                    className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest shadow-xl transition-all"
                    onClick={handleCreateDeposit}
                  >
                    Continue to Pay
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <div className="py-4 space-y-5">
                <div className="bg-purple-50/50 dark:bg-white/5 p-5 rounded-3xl border border-purple-100 dark:border-white/10 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-neutral-400 uppercase tracking-widest">Send Exactly:</span>
                    <span className="font-black text-neutral-900 dark:text-white">${activeDeposit.amount.toFixed(2)} USDT</span>
                  </div>
                  <div className="flex flex-col gap-1.5 pt-2 border-t border-purple-100/50 dark:border-white/5">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      {activeDeposit.method === 'binance' ? "To Binance Pay ID:" : "To Wallet Address:"}
                    </span>
                    <div className="bg-white dark:bg-neutral-950 p-3 rounded-xl border border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs font-mono select-all">
                      <code className="line-clamp-1 break-all pr-4">{activeDeposit.walletAddress}</code>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-white/5 border dark:border-white/5 shadow-sm"
                        onClick={() => copyToClipboard(activeDeposit.walletAddress)}
                      >
                        <Copy className="w-3.5 h-3.5 text-purple-600" />
                      </Button>
                    </div>
                  </div>
                  {activeDeposit.method === 'binance' && (
                    <div className="flex flex-col gap-1.5 pt-2 border-t border-purple-100/50 dark:border-white/5">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Required Remark:</span>
                      <div className="bg-white dark:bg-neutral-950 p-3 rounded-xl border border-neutral-100 dark:border-white/5 flex items-center justify-between text-xs font-mono select-all">
                        <code className="line-clamp-1 break-all pr-4 text-purple-600 dark:text-purple-400 font-black">{activeDeposit.remark}</code>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-8 h-8 rounded-lg bg-neutral-50 dark:bg-white/5 border dark:border-white/5 shadow-sm"
                          onClick={() => {
                            copyToClipboard(activeDeposit.remark || "");
                            toast({ title: "Remark Copied", description: "Make sure to include this remark in your payment!" });
                          }}
                        >
                          <Copy className="w-3.5 h-3.5 text-purple-600" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {activeDeposit.method !== 'binance' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                      Transaction ID (TXID / Hash)
                    </label>
                    <input 
                      type="text" 
                      value={txidInput} 
                      onChange={(e) => setTxidInput(e.target.value)}
                      placeholder="Enter your transaction hash..."
                      className="w-full h-14 rounded-2xl bg-purple-50/50 dark:bg-white/5 border border-purple-100 dark:border-white/10 px-4 text-xs font-mono focus:outline-none focus:border-purple-500 dark:focus:border-purple-400"
                    />
                    <p className="text-[9px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wider leading-relaxed">
                      * Payments are verified automatically on the blockchain network within 1-3 minutes of submission.
                    </p>
                  </div>
                )}

                <DialogFooter className="flex-col sm:flex-row gap-3 pt-3">
                  <Button 
                    variant="ghost" 
                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5"
                    onClick={() => setActiveDeposit(null)}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1 h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest shadow-xl disabled:opacity-50"
                    disabled={isVerifyingPayment || (activeDeposit.method !== 'binance' && !txidInput.trim())}
                    onClick={handleVerifyCryptoPayment}
                  >
                    {isVerifyingPayment ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Payment"}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Login Dialog Popup */}
        <Dialog open={isLoginDialogOpen} onOpenChange={(open) => {
          if (!open) {
            setIsLoginDialogOpen(false);
            setOtpSent(false);
            setOtpInput("");
            setEmailInput("");
          }
        }}>
          <DialogContent className="rounded-[2.5rem] border-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl p-5 sm:p-8 shadow-2xl max-w-[90vw] mx-auto text-neutral-900 dark:text-white">
            <DialogHeader className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center text-purple-600 shadow-inner">
                  <UserIcon className="w-8 h-8" />
                </div>
              </div>
              <div className="text-center">
                <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic">
                  Sign In to Save Progress
                </DialogTitle>
                <DialogDescription className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mt-1">
                  Unified Email OTP Login
                </DialogDescription>
              </div>
            </DialogHeader>

            {!otpSent ? (
              <div className="py-4 space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest pl-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl bg-purple-50/50 dark:bg-white/5 border border-purple-100 dark:border-white/10 text-sm font-semibold placeholder:text-neutral-300 text-neutral-800 dark:text-white focus:outline-none focus:border-purple-500 transition-all text-center"
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    className="w-full h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-wider shadow-md disabled:opacity-50"
                    disabled={isAuthSubmitting || !emailInput}
                    onClick={handleSendOtp}
                  >
                    {isAuthSubmitting ? "Sending..." : "Send Verification Code"}
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <div className="py-4 space-y-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest pl-2">Verification Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full h-14 px-5 rounded-2xl bg-purple-50/50 dark:bg-white/5 border border-purple-100 dark:border-white/10 text-center font-mono text-lg font-black tracking-widest text-neutral-800 dark:text-white focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <DialogFooter className="flex gap-3 pt-2">
                  <Button
                    variant="ghost"
                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-wider text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5"
                    onClick={() => {
                      setOtpSent(false);
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    className="flex-1 h-14 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-wider shadow-md disabled:opacity-50"
                    disabled={isAuthSubmitting || otpInput.length !== 6}
                    onClick={handleVerifyOtp}
                  >
                    {isAuthSubmitting ? "Verifying..." : "Verify & Login"}
                  </Button>
                </DialogFooter>
              </div>
            )}
          </DialogContent>
        </Dialog>
 
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
            isChatOpen ? 'bg-white text-black rotate-90' : 'bg-primary text-white shadow-primary/30'
          }`}
        >
          {isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-7 h-7" />}
        </motion.button>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-all duration-500 overflow-hidden ${active ? 'text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
    >
      <motion.div
        animate={{ 
          y: active ? -2 : 0,
          scale: active ? 1.1 : 1
        }}
        className="z-10"
      >
        {icon}
      </motion.div>
      <span className={`text-[8px] font-black uppercase tracking-widest mt-1 transition-all duration-500 ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        {label}
      </span>
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute inset-0 bg-white/5 rounded-2xl"
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </button>
  );
}
