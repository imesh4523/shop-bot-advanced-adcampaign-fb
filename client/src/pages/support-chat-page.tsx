import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { 
  Send, 
  Search, 
  MessageSquare, 
  User as UserIcon, 
  Loader2, 
  Sparkles, 
  Zap, 
  Bot, 
  Clock,
  Plus,
  Trash2,
  Settings
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

interface SupportChat {
  telegramId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  lastMessage: string;
  lastMessageAt: string;
}

interface SupportMessage {
  id: number;
  telegramId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  message: string;
  sender: "user" | "admin";
  createdAt: string;
}

const QUICK_REPLIES = [
  "Hello! How can I help you today?",
  "Please send the transaction ID (TXID / Hash) of your payment.",
  "Your deposit has been verified! Please check your balance.",
  "This account is currently out of stock. We will restock it shortly.",
  "Thank you for contacting us! Let us know if you need anything else."
];

export default function SupportChatPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // States for customizing fast replies
  const [isEditingTemplates, setIsEditingTemplates] = useState(false);
  const [editingList, setEditingList] = useState<string[]>([]);

  // 1. Fetch support chats list (4s interval to guarantee fresh fallback updates)
  const { data: chats = [], isLoading: isChatsLoading } = useQuery<SupportChat[]>({
    queryKey: ["/api/support/chats"],
    refetchInterval: 4000, 
  });

  // 2. Fetch selected chat messages (4s interval to guarantee fresh fallback updates)
  const { data: messages = [], isLoading: isMessagesLoading } = useQuery<SupportMessage[]>({
    queryKey: ["/api/support/messages", selectedChatId],
    queryFn: async () => {
      if (!selectedChatId) return [];
      const res = await fetch(`/api/support/messages/${selectedChatId}`);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: !!selectedChatId,
    refetchInterval: 4000,
  });

  // 3. Fetch custom quick replies from DB
  const { data: quickRepliesSetting } = useQuery<{ key: string; value: string }>({
    queryKey: ["/api/settings/SUPPORT_QUICK_REPLIES"],
  });

  let parsedQuickReplies = QUICK_REPLIES;
  if (quickRepliesSetting?.value) {
    try {
      const parsed = JSON.parse(quickRepliesSetting.value);
      if (Array.isArray(parsed) && parsed.every(p => typeof p === 'string')) {
        parsedQuickReplies = parsed;
      }
    } catch (e) {
      console.error("Failed to parse custom quick replies setting:", e);
    }
  }

  // 4. Save quick replies mutation
  const quickRepliesMutation = useMutation({
    mutationFn: async (replies: string[]) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "SUPPORT_QUICK_REPLIES",
        value: JSON.stringify(replies.filter(r => r.trim() !== ""))
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
    onError: (err: any) => {
      toast({
        title: "Failed to Save Templates",
        description: err.message,
        variant: "destructive"
      });
    }
  });

  // 5. Socket.io setup for instant zero-lag real-time cache updates
  useEffect(() => {
    const socket = io();

    socket.on("support_message", (msg: SupportMessage) => {
      // Direct cache updates for maximum speed without waiting for HTTP network hop
      queryClient.setQueryData<SupportChat[]>(["/api/support/chats"], (oldChats = []) => {
        const chatsCopy = [...oldChats];
        const existingIdx = chatsCopy.findIndex(c => c.telegramId === msg.telegramId);
        
        const updatedChat: SupportChat = {
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
        queryClient.setQueryData<SupportMessage[]>(
          ["/api/support/messages", selectedChatId],
          (oldMessages = []) => {
            if (oldMessages.some(m => m.id === msg.id)) return oldMessages;
            return [...oldMessages, msg];
          }
        );
      }

      // Background refetches to keep DB in sync
      queryClient.invalidateQueries({ queryKey: ["/api/support/chats"] });
      if (selectedChatId && msg.telegramId === selectedChatId) {
        queryClient.invalidateQueries({ queryKey: ["/api/support/messages", selectedChatId] });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedChatId, queryClient]);

  // 6. Scroll to bottom of message list on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 7. Send reply mutation
  const sendReplyMutation = useMutation({
    mutationFn: async ({ telegramId, message }: { telegramId: string; message: string }) => {
      const res = await apiRequest("POST", "/api/support/reply", { telegramId, message });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to send message");
      }
      return res.json();
    },
    onSuccess: (data) => {
      setReplyText("");
      queryClient.invalidateQueries({ queryKey: ["/api/support/messages", selectedChatId] });
      queryClient.invalidateQueries({ queryKey: ["/api/support/chats"] });
    },
    onError: (err: any) => {
      toast({
        title: "Send Failed",
        description: err.message,
        variant: "destructive"
      });
    }
  });

  const handleSendReply = () => {
    if (!selectedChatId || !replyText.trim() || sendReplyMutation.isPending) return;

    sendReplyMutation.mutate({
      telegramId: selectedChatId,
      message: replyText.trim()
    });
  };

  const getAvatarInitials = (chat: SupportChat) => {
    if (chat.firstName) {
      return (chat.firstName[0] + (chat.lastName?.[0] || "")).toUpperCase();
    }
    if (chat.username) {
      return chat.username.slice(0, 2).toUpperCase();
    }
    return "?";
  };

  const getAvatarBg = (chat: SupportChat) => {
    const colors = [
      "from-pink-500 to-rose-500",
      "from-purple-500 to-indigo-500",
      "from-blue-500 to-cyan-500",
      "from-emerald-500 to-teal-500",
      "from-amber-500 to-orange-500",
    ];
    const name = chat.firstName || chat.username || chat.telegramId;
    let sum = 0;
    for (let i = 0; i < name.length; i++) sum += name.charCodeAt(i);
    return colors[sum % colors.length];
  };

  const filteredChats = chats.filter((c) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      c.telegramId.includes(searchLower) ||
      (c.username && c.username.toLowerCase().includes(searchLower)) ||
      (c.firstName && c.firstName.toLowerCase().includes(searchLower)) ||
      (c.lastName && c.lastName.toLowerCase().includes(searchLower))
    );
  });

  const activeChat = chats.find(c => c.telegramId === selectedChatId);

  const openTemplateEditor = () => {
    setEditingList([...parsedQuickReplies]);
    setIsEditingTemplates(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent flex items-center gap-3">
            <MessageSquare className="w-10 h-10 text-purple-400" />
            Telegram Live Support
          </h1>
          <p className="text-muted-foreground/80 mt-2 font-medium">
            Respond instantly to customer queries received on your Telegram Support Bot.
          </p>
        </div>
        <div className="glass-panel px-6 py-2.5 rounded-full flex items-center gap-3 text-sm font-bold text-white shadow-lg border-white/20">
          <Bot className="w-5 h-5 text-purple-400" />
          Live Agent Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[650px]">
        {/* Chats List Sidebar */}
        <Card className="lg:col-span-1 glass-card border-0 flex flex-col h-[650px] overflow-hidden">
          <CardHeader className="p-5 border-b border-white/5 shrink-0">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              Conversations
            </CardTitle>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-3 w-4 h-4 text-white/30" />
              <Input
                type="text"
                placeholder="Search customers..."
                className="pl-9 h-11 bg-white/[0.03] border-white/10 rounded-xl focus:border-purple-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto min-h-0">
            {isChatsLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-white/40">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                <span className="text-xs font-semibold uppercase tracking-wider">Loading chats...</span>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center text-white/30 space-y-3">
                <MessageSquare className="w-12 h-12 stroke-[1.5]" />
                <p className="text-sm font-bold uppercase tracking-wider">No active threads</p>
                <p className="text-xs text-white/20">Provide the Support Bot Token in Settings to receive live messages.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {filteredChats.map((chat) => {
                  const isSelected = selectedChatId === chat.telegramId;
                  return (
                    <button
                      key={chat.telegramId}
                      onClick={() => setSelectedChatId(chat.telegramId)}
                      className={`w-full p-4 flex gap-4 text-left transition-all duration-300 items-start ${
                        isSelected 
                          ? 'bg-purple-950/20 border-l-4 border-purple-500' 
                          : 'hover:bg-white/[0.02] border-l-4 border-transparent'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${getAvatarBg(chat)} flex items-center justify-center font-bold text-white shadow-md text-sm shrink-0`}>
                        {getAvatarInitials(chat)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                          <span className="font-extrabold text-sm text-white truncate">
                            {chat.firstName ? `${chat.firstName} ${chat.lastName || ""}`.trim() : `@${chat.username || chat.telegramId}`}
                          </span>
                          <span className="text-[10px] text-white/30 font-semibold uppercase shrink-0">
                            {chat.lastMessageAt ? format(new Date(chat.lastMessageAt), "hh:mm a") : ""}
                          </span>
                        </div>
                        {chat.username && (
                          <span className="text-xs text-purple-400/80 font-bold block mb-1">@{chat.username}</span>
                        )}
                        <p className="text-xs text-white/50 truncate leading-relaxed">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Conversation View */}
        <Card className="lg:col-span-2 glass-card border-0 flex flex-col h-[650px] overflow-hidden">
          {selectedChatId && activeChat ? (
            <>
              {/* Header */}
              <CardHeader className="p-5 border-b border-white/5 shrink-0 flex flex-row items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${getAvatarBg(activeChat)} flex items-center justify-center font-bold text-white text-sm shadow`}>
                    {getAvatarInitials(activeChat)}
                  </div>
                  <div>
                    <CardTitle className="text-lg font-extrabold text-white">
                      {activeChat.firstName ? `${activeChat.firstName} ${activeChat.lastName || ""}`.trim() : `@${activeChat.username || activeChat.telegramId}`}
                    </CardTitle>
                    <CardDescription className="text-xs text-purple-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                      ID: {activeChat.telegramId} {activeChat.username ? `• @${activeChat.username}` : ""}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-[#0c0816]/30">
                {isMessagesLoading && messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-white/40">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {messages.map((msg, index) => {
                      const isAdmin = msg.sender === "admin";
                      return (
                        <div
                          key={msg.id || index}
                          className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-3 max-w-[70%] items-end ${isAdmin ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex flex-col space-y-1`}>
                              <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm font-medium leading-relaxed break-all ${
                                isAdmin 
                                  ? 'bg-[#18112e] text-white rounded-br-none border border-white/5' 
                                  : 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-bl-none'
                              }`}>
                                {msg.message}
                              </div>
                              <span className={`text-[9px] text-white/30 font-semibold uppercase ${isAdmin ? 'text-right' : 'text-left'}`}>
                                {format(new Date(msg.createdAt), "hh:mm a")}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Fast Reply / Quick Templates */}
              <div className="p-4 border-t border-white/5 bg-[#0f0a1a]/50 shrink-0">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase text-purple-400 tracking-wider">
                    <Zap className="w-3.5 h-3.5 fill-purple-400/20 text-purple-400" />
                    Fast Replies
                  </div>
                  <Button
                    variant="ghost"
                    onClick={openTemplateEditor}
                    className="h-6 px-2 hover:bg-white/[0.05] text-white/50 hover:text-white flex items-center gap-1 text-[10px] font-bold rounded-lg"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    Edit Templates
                  </Button>
                </div>
                <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 select-none">
                  {parsedQuickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => setReplyText(reply)}
                      className="px-3.5 py-2 text-[11px] font-bold bg-white/[0.03] hover:bg-purple-600 hover:text-white border border-white/5 rounded-full text-white/70 whitespace-nowrap transition-all duration-300 animate-in fade-in"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reply Input Box */}
              <div className="p-4 bg-[#0f0a1a] border-t border-white/5 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendReply();
                  }}
                  className="flex gap-3"
                >
                  <Input
                    type="text"
                    placeholder="Write a message..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="h-14 bg-white/[0.03] border-white/10 rounded-2xl focus:border-purple-500/50"
                    disabled={sendReplyMutation.isPending}
                  />
                  <Button
                    type="submit"
                    className="h-14 w-14 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-lg shadow-purple-500/10 active:scale-95 transition-all shrink-0"
                    disabled={!replyText.trim() || sendReplyMutation.isPending}
                  >
                    {sendReplyMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-white/30 space-y-4">
              <div className="w-20 h-20 rounded-full bg-purple-950/20 border border-purple-500/15 flex items-center justify-center text-purple-400">
                <MessageSquare className="w-10 h-10 stroke-[1.5]" />
              </div>
              <div className="max-w-xs space-y-2">
                <p className="text-base font-extrabold text-white">Select a Conversation</p>
                <p className="text-xs text-white/20">Choose a user thread on the left pane to view message details and send replies.</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Customize Fast Replies Modal */}
      <Dialog open={isEditingTemplates} onOpenChange={setIsEditingTemplates}>
        <DialogContent className="glass-panel border-white/10 bg-black/90 text-white max-w-lg rounded-2xl p-6 max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              Customize Fast Replies
            </DialogTitle>
            <DialogDescription className="text-xs text-white/40">
              Add, edit, or delete template messages. Click a template in the chat to insert it instantly.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 my-4 max-h-[300px] overflow-y-auto pr-1">
            {editingList.map((template, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <Input
                  value={template}
                  onChange={(e) => {
                    const updated = [...editingList];
                    updated[idx] = e.target.value;
                    setEditingList(updated);
                  }}
                  placeholder="Enter template text..."
                  className="bg-white/[0.03] border-white/10 rounded-xl text-sm"
                />
                <Button
                  variant="ghost"
                  onClick={() => {
                    const updated = [...editingList];
                    updated.splice(idx, 1);
                    setEditingList(updated);
                  }}
                  className="hover:bg-red-500/10 text-red-400 hover:text-red-300 p-2 shrink-0 rounded-xl h-10 w-10 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
            {editingList.length === 0 && (
              <p className="text-xs text-center text-white/20 py-4">No templates. Add one below!</p>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/5">
            <Button
              variant="outline"
              onClick={() => setEditingList([...editingList, ""])}
              className="border-white/10 hover:bg-white/[0.05] rounded-xl flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              Add Template
            </Button>
            <div className="flex gap-2 sm:ml-auto">
              <Button
                variant="ghost"
                onClick={() => setIsEditingTemplates(false)}
                className="rounded-xl text-xs font-bold uppercase tracking-wider text-white/60 hover:bg-white/[0.05]"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  quickRepliesMutation.mutate(editingList);
                  setIsEditingTemplates(false);
                }}
                disabled={quickRepliesMutation.isPending}
                className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl text-xs font-bold uppercase tracking-wider text-white"
              >
                {quickRepliesMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

