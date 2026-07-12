import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { io } from "socket.io-client";
import { Phone, Search, Users, Loader2, Volume2, ShieldCheck, Mail, Globe, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TelegramUser {
  id: number;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export default function SupportCallsPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [dialId, setDialId] = useState("");
  const [dialName, setDialName] = useState("");
  
  // Real-time online socket users
  const [onlineUsers, setOnlineUsers] = useState<Map<string, string>>(new Map());

  // Push Permission State
  const [pushPermission, setPushPermission] = useState<NotificationPermission>(
    typeof window !== "undefined" && window.Notification ? window.Notification.permission : "default"
  );

  const requestPushPermission = () => {
    if (typeof window === "undefined" || !window.Notification) return;

    window.Notification.requestPermission().then(permission => {
      setPushPermission(permission);
      if (permission === 'granted') {
        window.dispatchEvent(new CustomEvent('trigger-push-setup'));
        toast({
          title: "Permission Granted",
          description: "Attempting to register push notifications subscription...",
        });
      }
    }).catch(console.error);
  };

  const { data: users = [], isLoading } = useQuery<TelegramUser[]>({
    queryKey: ["/api/telegram-users"],
  });

  useEffect(() => {
    const socket = io();
    
    // Request online list on connect
    socket.emit("join-admin-calls");
    socket.emit("get-online-users");

    socket.on("online-users-list", (list: { telegramId: string; socketId: string }[]) => {
      const newMap = new Map<string, string>();
      list.forEach(u => newMap.set(u.telegramId, u.socketId));
      setOnlineUsers(newMap);
    });

    socket.on("user-online-status", (data: { telegramId: string; online: boolean; socketId?: string }) => {
      setOnlineUsers(prev => {
        const next = new Map(prev);
        if (data.online && data.socketId) {
          next.set(data.telegramId, data.socketId);
        } else {
          next.delete(data.telegramId);
        }
        return next;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const initiateCall = (telegramId: string, name: string) => {
    if (!onlineUsers.has(telegramId)) {
      toast({
        title: "User Offline",
        description: `${name} is not online in the shop app right now.`,
        variant: "destructive"
      });
      return;
    }

    // Dispatch custom event to AdminNotifier
    window.dispatchEvent(
      new CustomEvent("start-admin-call", {
        detail: { telegramId, name }
      })
    );
  };

  const handleManualDial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dialId.trim()) return;
    initiateCall(dialId.trim(), dialName.trim() || "Customer");
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = search.toLowerCase();
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim().toLowerCase();
    const username = (user.username || "").toLowerCase();
    const tid = user.telegramId.toLowerCase();
    return !searchLower || fullName.includes(searchLower) || username.includes(searchLower) || tid.includes(searchLower);
  });

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-white tracking-tight uppercase">Call Support Desk</h2>
        <p className="text-white/50 text-sm tracking-wide lowercase">
          Directly initiate zero-latency voice calls with online customers.
        </p>
      </div>

      {/* Push notification setup notification */}
      {pushPermission !== "granted" && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
            <div>
              <p className="font-bold">Push Notifications Disabled</p>
              <p className="text-xs text-white/50">You will not receive background alerts when customers start support voice calls.</p>
            </div>
          </div>
          <Button 
            onClick={requestPushPermission}
            className="bg-amber-600 hover:bg-amber-500 text-black font-extrabold uppercase text-xs tracking-wider px-6 py-2 rounded-xl shrink-0"
          >
            Enable Notifications
          </Button>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dial Board */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-[#0f0a18]/45 border border-purple-500/10 shadow-2xl backdrop-blur-md">
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-base font-black text-white uppercase tracking-wider">Manual Call Board</CardTitle>
              <CardDescription className="text-xs text-white/40">Enter user credentials to dial directly</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleManualDial} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Telegram ID / UUID</label>
                  <Input
                    required
                    value={dialId}
                    onChange={(e) => setDialId(e.target.value)}
                    placeholder="e.g. 17262726 or google:1022..."
                    className="bg-black/45 border-white/5 text-white placeholder-white/20 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/50 tracking-wider">Customer Name</label>
                  <Input
                    value={dialName}
                    onChange={(e) => setDialName(e.target.value)}
                    placeholder="e.g. Ruwan Perera"
                    className="bg-black/45 border-white/5 text-white placeholder-white/20 rounded-xl"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full py-6 rounded-xl bg-purple-600 hover:bg-purple-500 font-bold uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
                >
                  <Phone className="w-4 h-4 animate-pulse" />
                  Dial Call
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Directory */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#0f0a18]/45 border border-purple-500/10 shadow-2xl backdrop-blur-md">
            <CardHeader className="border-b border-white/5 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base font-black text-white uppercase tracking-wider">Users Directory</CardTitle>
                <CardDescription className="text-xs text-white/40">Select an online user to connect a WebRTC call</CardDescription>
              </div>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search user..."
                  className="pl-10 bg-black/45 border-white/5 text-white placeholder-white/20 rounded-xl w-full"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-6 p-0 max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-white/30 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-xs font-bold uppercase tracking-wider">Loading Directory...</span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-white/30 gap-2">
                  <Users className="w-8 h-8" />
                  <span className="text-xs font-bold uppercase tracking-wider">No users found</span>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {filteredUsers.map((user) => {
                    const isOnline = onlineUsers.has(user.telegramId);
                    const displayName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "Guest";
                    
                    return (
                      <div key={user.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-800 to-indigo-700 border border-white/10 flex items-center justify-center font-bold text-white uppercase text-sm">
                              {displayName[0]}
                            </div>
                            {/* Online badge indicator */}
                            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-[#0f0a18] ${
                              isOnline ? "bg-green-500 animate-pulse" : "bg-neutral-600"
                            }`} />
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-white">{displayName}</h4>
                              {user.username && (
                                <span className="text-xs text-white/30 font-mono">@{user.username}</span>
                              )}
                            </div>
                            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
                              ID: {user.telegramId}
                            </span>
                          </div>
                        </div>

                        {/* Call trigger button */}
                        <Button
                          disabled={!isOnline}
                          onClick={() => initiateCall(user.telegramId, displayName)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                            isOnline 
                              ? "bg-green-600/10 border-green-500/20 text-green-400 hover:bg-green-600 hover:text-white" 
                              : "bg-white/5 border-white/5 text-white/20 cursor-not-allowed"
                          }`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                          {isOnline ? "Call" : "Offline"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
