import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  Users, Save, Loader2, Edit2, Search, Send, X,
  DollarSign, Wallet, TrendingUp, ShoppingBag, Mail, Globe, MessagesSquare
} from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";

interface TelegramUser {
  id: number;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  balance: number;
  balanceLkr: number;
  balanceUsdt: number;
  balanceTrx: number;
  createdAt: string;
  avatarUrl?: string;
}

interface EditBalances {
  balance: number;
  balanceLkr: number;
  balanceUsdt: number;
  balanceTrx: number;
}

function getUserType(telegramId: string): { label: string; color: string; icon: React.ReactNode } {
  if (telegramId.startsWith("email:"))
    return { label: "Email", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: <Mail className="w-3 h-3" /> };
  if (telegramId.startsWith("google:"))
    return { label: "Google", color: "bg-red-500/20 text-red-300 border-red-500/30", icon: <Globe className="w-3 h-3" /> };
  if (telegramId.startsWith("web_guest_"))
    return { label: "Guest", color: "bg-white/10 text-white/50 border-white/20", icon: <Globe className="w-3 h-3" /> };
  return { label: "Telegram", color: "bg-purple-500/20 text-purple-300 border-purple-500/30", icon: <MessagesSquare className="w-3 h-3" /> };
}

function getUserDisplayId(telegramId: string): string {
  if (telegramId.startsWith("email:")) return telegramId.replace("email:", "");
  if (telegramId.startsWith("google:")) return telegramId.replace("google:", "");
  if (telegramId.startsWith("web_guest_")) return "Guest #" + telegramId.substring(10, 16).toUpperCase();
  return `@${telegramId}`;
}

function getInitials(user: TelegramUser): string {
  if (user.firstName) return user.firstName[0].toUpperCase();
  if (user.username) return user.username[0].toUpperCase();
  return "?";
}

export default function TelegramUsersPage() {
  const { toast } = useToast();
  const [editingUser, setEditingUser] = useState<TelegramUser | null>(null);
  const [editBalances, setEditBalances] = useState<EditBalances>({ balance: 0, balanceLkr: 0, balanceUsdt: 0, balanceTrx: 0 });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "telegram" | "email" | "google" | "guest">("all");

  const { data: users = [], isLoading } = useQuery<TelegramUser[]>({
    queryKey: ["/api/telegram-users"],
  });

  const mutation = useMutation({
    mutationFn: async ({ id, balances }: { id: number; balances: EditBalances }) => {
      const res = await apiRequest("PATCH", `/api/telegram-users/${id}`, {
        balance: Math.round(balances.balance * 100),
        balanceLkr: Math.round(balances.balanceLkr * 100),
        balanceUsdt: Math.round(balances.balanceUsdt * 100),
        balanceTrx: Math.round(balances.balanceTrx * 100000), // TRX stored in sun (1 TRX = 1,000,000 sun but let's keep cents-like precision)
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/telegram-users"] });
      toast({ title: "✅ User Updated", description: "All balances have been updated successfully." });
      setEditingUser(null);
    },
    onError: () => {
      toast({ title: "❌ Update Failed", description: "Could not update user balances.", variant: "destructive" });
    }
  });

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchLower = search.toLowerCase();
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim().toLowerCase();
      const username = (user.username || "").toLowerCase();
      const tid = user.telegramId.toLowerCase();
      const matchesSearch = !searchLower || fullName.includes(searchLower) || username.includes(searchLower) || tid.includes(searchLower);

      let matchesFilter = true;
      if (filter === "telegram") matchesFilter = !user.telegramId.startsWith("email:") && !user.telegramId.startsWith("google:") && !user.telegramId.startsWith("web_guest_");
      else if (filter === "email") matchesFilter = user.telegramId.startsWith("email:");
      else if (filter === "google") matchesFilter = user.telegramId.startsWith("google:");
      else if (filter === "guest") matchesFilter = user.telegramId.startsWith("web_guest_");

      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  const stats = useMemo(() => ({
    total: users.length,
    telegram: users.filter(u => !u.telegramId.startsWith("email:") && !u.telegramId.startsWith("google:") && !u.telegramId.startsWith("web_guest_")).length,
    email: users.filter(u => u.telegramId.startsWith("email:")).length,
    google: users.filter(u => u.telegramId.startsWith("google:")).length,
    guest: users.filter(u => u.telegramId.startsWith("web_guest_")).length,
  }), [users]);

  const handleEdit = (user: TelegramUser) => {
    setEditingUser(user);
    setEditBalances({
      balance: user.balance / 100,
      balanceLkr: (user.balanceLkr || 0) / 100,
      balanceUsdt: (user.balanceUsdt || 0) / 100,
      balanceTrx: (user.balanceTrx || 0) / 100,
    });
  };

  const handleDM = (user: TelegramUser) => {
    if (user.telegramId.startsWith("web_guest_") || user.telegramId.startsWith("email:") || user.telegramId.startsWith("google:")) {
      toast({ title: "Cannot DM", description: "Direct message is only available for Telegram users.", variant: "destructive" });
      return;
    }
    window.open(`https://t.me/${user.username || user.telegramId}`, "_blank");
  };

  const filterButtons: { key: typeof filter; label: string; count: number }[] = [
    { key: "all", label: "All", count: stats.total },
    { key: "telegram", label: "Telegram", count: stats.telegram },
    { key: "email", label: "Email", count: stats.email },
    { key: "google", label: "Google", count: stats.google },
    { key: "guest", label: "Guest", count: stats.guest },
  ];

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-2xl">Users</h1>
          <p className="text-white/40 mt-1 font-medium">Manage balances and view all registered users</p>
        </div>
        <div className="glass-panel px-6 py-2.5 rounded-full flex items-center gap-3 text-sm font-bold text-white shadow-lg border-white/20">
          <Users className="w-5 h-5 text-purple-400" />
          {stats.total} Total Users
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Telegram", value: stats.telegram, color: "from-purple-600/30 to-purple-800/10", icon: <MessagesSquare className="w-5 h-5 text-purple-400" /> },
          { label: "Email", value: stats.email, color: "from-blue-600/30 to-blue-800/10", icon: <Mail className="w-5 h-5 text-blue-400" /> },
          { label: "Google", value: stats.google, color: "from-red-600/30 to-red-800/10", icon: <Globe className="w-5 h-5 text-red-400" /> },
          { label: "Guest", value: stats.guest, color: "from-white/10 to-white/5", icon: <Globe className="w-5 h-5 text-white/40" /> },
        ].map(s => (
          <Card key={s.label} className={`border-0 bg-gradient-to-br ${s.color} backdrop-blur-xl`}>
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/50 font-semibold uppercase tracking-wider">{s.label}</p>
                  <p className="text-3xl font-black text-white mt-1">{s.value}</p>
                </div>
                {s.icon}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
          <Input
            placeholder="Search by name, username or ID..."
            className="glass-panel pl-12 h-12 rounded-2xl border-white/10 text-white placeholder:text-white/30"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {filterButtons.map(btn => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                filter === btn.key
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-500/30"
                  : "glass-panel text-white/60 hover:text-white border-white/10"
              }`}
            >
              {btn.label} <span className="ml-1 opacity-60">({btn.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="glass-card border-0">
            <CardContent className="py-16 text-center">
              <Users className="w-14 h-14 mx-auto mb-4 opacity-20 text-white" />
              <p className="text-white/40 font-medium text-lg">
                {search ? "No users match your search" : "No registered users yet"}
              </p>
              <p className="text-white/20 text-sm mt-1">Users appear here when they interact with the shop or bot</p>
            </CardContent>
          </Card>
        ) : (
          filteredUsers.map((user) => {
            const type = getUserType(user.telegramId);
            const displayId = getUserDisplayId(user.telegramId);
            const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || "Unknown User";
            const isTelegram = !user.telegramId.startsWith("email:") && !user.telegramId.startsWith("google:") && !user.telegramId.startsWith("web_guest_");

            return (
              <Card key={user.id} className="glass-card border-0 hover:border-white/10 transition-all duration-200 group">
                <CardContent className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-lg">
                      {user.avatarUrl
                        ? <img src={user.avatarUrl} className="w-full h-full rounded-2xl object-cover" alt="" />
                        : getInitials(user)
                      }
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-base truncate">{name}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${type.color}`}>
                          {type.icon} {type.label}
                        </span>
                      </div>
                      <p className="text-sm text-white/50 mt-0.5 truncate">{displayId}</p>
                      {/* Balances */}
                      <div className="flex gap-3 mt-2 flex-wrap">
                        <span className="text-xs text-green-400 font-semibold">${(user.balance / 100).toFixed(2)} USD</span>
                        {(user.balanceLkr || 0) > 0 && <span className="text-xs text-yellow-400 font-semibold">Rs.{((user.balanceLkr || 0) / 100).toFixed(2)} LKR</span>}
                        {(user.balanceUsdt || 0) > 0 && <span className="text-xs text-teal-400 font-semibold">{((user.balanceUsdt || 0) / 100).toFixed(2)} USDT</span>}
                        {(user.balanceTrx || 0) > 0 && <span className="text-xs text-orange-400 font-semibold">{((user.balanceTrx || 0) / 100).toFixed(2)} TRX</span>}
                        {user.balance === 0 && !user.balanceLkr && !user.balanceUsdt && !user.balanceTrx && (
                          <span className="text-xs text-white/20">No balance</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      {isTelegram && (
                        <Button
                          onClick={() => handleDM(user)}
                          variant="ghost"
                          size="icon"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-all"
                          title="Send DM on Telegram"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        onClick={() => handleEdit(user)}
                        variant="ghost"
                        size="icon"
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
                        title="Edit Balances"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={editingUser !== null} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent className="glass-card border-white/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl font-black flex items-center gap-2">
              <Wallet className="w-5 h-5 text-purple-400" />
              Edit Balances
            </DialogTitle>
            {editingUser && (
              <p className="text-white/50 text-sm">
                {[editingUser.firstName, editingUser.lastName].filter(Boolean).join(" ") || editingUser.username || getUserDisplayId(editingUser.telegramId)}
              </p>
            )}
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* USD Balance */}
            <div className="space-y-2">
              <Label className="text-white/70 text-sm font-semibold flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" /> USD Balance
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold">$</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  className="glass-panel pl-8 h-12 rounded-xl border-white/10 text-white"
                  value={editBalances.balance}
                  onChange={(e) => setEditBalances(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            {/* LKR Balance */}
            <div className="space-y-2">
              <Label className="text-white/70 text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-yellow-400" /> LKR Balance
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-xs">Rs.</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  className="glass-panel pl-10 h-12 rounded-xl border-white/10 text-white"
                  value={editBalances.balanceLkr}
                  onChange={(e) => setEditBalances(prev => ({ ...prev, balanceLkr: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            {/* USDT Balance */}
            <div className="space-y-2">
              <Label className="text-white/70 text-sm font-semibold flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-teal-400" /> USDT Balance
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-xs">₮</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  className="glass-panel pl-8 h-12 rounded-xl border-white/10 text-white"
                  value={editBalances.balanceUsdt}
                  onChange={(e) => setEditBalances(prev => ({ ...prev, balanceUsdt: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>

            {/* TRX Balance */}
            <div className="space-y-2">
              <Label className="text-white/70 text-sm font-semibold flex items-center gap-2">
                <Wallet className="w-4 h-4 text-orange-400" /> TRX Balance
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-bold text-xs">TRX</span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  className="glass-panel pl-12 h-12 rounded-xl border-white/10 text-white"
                  value={editBalances.balanceTrx}
                  onChange={(e) => setEditBalances(prev => ({ ...prev, balanceTrx: parseFloat(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => setEditingUser(null)}
              className="text-white/60 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={() => editingUser && mutation.mutate({ id: editingUser.id, balances: editBalances })}
              disabled={mutation.isPending}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold px-6 shadow-lg shadow-purple-500/20"
            >
              {mutation.isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Save Balances</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
