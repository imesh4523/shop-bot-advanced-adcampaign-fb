import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Users,
  Megaphone,
  ShieldCheck,
  Tag,
  Database,
  Send,
  Share2,
  Mail,
  Globe,
  MessageSquare,
  Image,
  Shield,
  ListOrdered,
  Heart,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProfileButton } from "./profile-button";
import { AdminNotifier } from "./admin-notifier";
import { ThemeToggle } from "./theme-toggle";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && typeof window !== 'undefined' && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Fetch unique support chats to get the pending/unread messages count
  const { data: supportChats = [] } = useQuery<any[]>({
    queryKey: ["/api/support/chats"],
    refetchInterval: 8000, // Refresh count every 8 seconds
    enabled: !!user,
  });

  const pendingChatsCount = supportChats.filter(c => c.lastSender === 'user').length;

  const navigation = [
    { name: 'Dashboard', href: '/main-admin', icon: LayoutDashboard },
    { name: 'Live Support', href: '/main-admin/support', icon: MessageSquare },
    { name: 'Support Calls', href: '/main-admin/support?tab=calls', icon: Phone },
    { name: 'Broadcast', href: '/main-admin/broadcast', icon: Megaphone },
    { name: 'Email Campaign', href: '/main-admin/email-campaign', icon: Mail },
    { name: 'Products', href: '/main-admin/products', icon: Package },
    { name: 'Category Order', href: '/main-admin/category-order', icon: ListOrdered },
    { name: 'Inventory', href: '/main-admin/inventory', icon: Package },
    { name: 'Orders', href: '/main-admin/orders', icon: ShoppingCart },
    { name: 'Payments', href: '/main-admin/payments', icon: User },
    { name: 'Special Offers', href: '/main-admin/special-offers', icon: Tag },
    { name: 'AWS Checker', href: '/main-admin/aws-checker', icon: ShieldCheck },
    { name: 'DB Backup', href: '/main-admin/backups', icon: Database },
    { name: 'Users', href: '/main-admin/users', icon: Users },
    { name: 'Telegram AI', href: '/main-admin/telegram-client', icon: Send },
    { name: 'Auto Forward', href: '/main-admin/forward', icon: Share2 },
    { name: 'Domain & Email', href: '/main-admin/domain-email', icon: Globe },
    { name: 'IP Manager', href: '/main-admin/ip-manager', icon: Globe },
    { name: 'Image Section', href: '/main-admin/image-section', icon: Image },
    { name: 'Customer Feedbacks', href: '/main-admin/feedbacks', icon: Heart },
    { name: 'OpenVPN Servers', href: '/main-admin/openvpn', icon: Shield },
    { name: 'Settings', href: '/main-admin/settings', icon: Settings },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex shrink-0 h-24 flex-none items-center px-8">
        <div className="flex items-center gap-4 font-black text-3xl text-white tracking-tighter">
          <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500">
            <img src="/logo.png" className="w-full h-full object-cover" />
          </div>
          Shopeefy
        </div>
      </div>
      <div className="flex-1 overflow-y-auto pb-6">
        <nav className="grid gap-3 px-4">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const hasBadge = item.name === 'Live Support' && pendingChatsCount > 0;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  flex shrink-0 items-center gap-4 px-5 py-4 rounded-2xl text-sm font-black transition-all duration-500
                  ${isActive 
                    ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10 backdrop-blur-md' 
                    : 'text-white/40 hover:bg-white/5 hover:text-white'
                  }
                `}
                onClick={() => setIsMobileOpen(false)}
              >
                <item.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-purple-400' : 'text-white/30'}`} />
                <span className="flex-1 truncate">{item.name}</span>
                {hasBadge && (
                  <span className="shrink-0 flex items-center justify-center w-5 h-5 text-[10px] font-black text-white bg-red-500 rounded-full animate-pulse shadow-md shadow-red-500/20">
                    {pendingChatsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen relative overflow-hidden bg-background ${isDark ? 'dark' : ''}`}>
      {/* Dynamic Animated Orbs for Premium Purple Aesthetic */}
      <div className="orb w-[800px] h-[800px] bg-purple-600/10 -top-40 -left-40 animate-pulse" />
      <div className="orb w-[600px] h-[600px] bg-indigo-600/5 bottom-20 right-20" />
      <div className="orb w-[400px] h-[400px] bg-purple-500/10 top-1/2 left-1/3 blur-[120px]" />

      {/* Mobile Sidebar */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden fixed top-6 left-6 z-50 glass-panel border-white/10 rounded-2xl">
            <Menu className="w-6 h-6 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0 bg-[#0f0a1a] border-r border-white/5 flex flex-col h-full">
          <div className="flex-1 min-h-0">
            <NavContent />
          </div>
          <div className="p-6 border-t border-white/5 bg-white/[0.01] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent" />
            <div className="relative text-[10px] text-white/30 font-black uppercase tracking-[0.4em] text-center animate-pulse">
              Developed by <span className="text-purple-400">Rochana Imesh</span>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-6 left-6 z-30 w-80 bg-[#0f0a1a] rounded-[2.5rem] border border-white/10 shadow-3xl overflow-hidden group">
        <div className="flex-1 overflow-hidden min-h-0">
          <NavContent />
        </div>
        <div className="mt-auto p-6 border-t border-white/5 bg-white/[0.01] space-y-4">
          {/* Admin profile card */}
          {user && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group/profile">
              <Avatar className="h-10 w-10 ring-2 ring-purple-500/40 shrink-0">
                <AvatarImage src={(user as any)?.avatarUrl || user?.profileImageUrl || undefined} alt={user?.firstName || 'Admin'} />
                <AvatarFallback className="bg-purple-700 text-white font-black text-sm">{user?.firstName?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-[10px] text-white/40 font-bold truncate">{user?.email}</p>
              </div>
              <button
                onClick={() => logout()}
                className="text-white/30 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-400/10"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="relative py-2 group/watermark">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-purple-500/10 blur-xl opacity-0 group-hover/watermark:opacity-100 transition-opacity duration-700" />
            <div className="relative text-[10px] text-white/20 font-black uppercase tracking-[0.3em] text-center transition-all duration-500 group-hover/watermark:text-purple-400 group-hover/watermark:scale-110 group-hover/watermark:tracking-[0.4em] drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              Developed by <span className="text-white/40 group-hover/watermark:text-white transition-colors">Rochana Imesh</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-[23rem] min-h-screen flex flex-col relative z-10">
        <div className="fixed bottom-6 right-10 z-50 pointer-events-none select-none hidden lg:block group/float">
          <div className="relative px-4 py-2 bg-[#5b21b6]/60 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-lg shadow-[0_8px_32px_rgba(0,0,0,0.3)] rounded-full transform transition-all duration-700 hover:scale-110 hover:-translate-y-2 group-hover/float:shadow-purple-500/20">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 rounded-full blur-md opacity-50 animate-pulse" />
            <span className="relative text-[10px] font-black uppercase tracking-[0.3em] text-white/40 whitespace-nowrap drop-shadow-lg">
              Designed by <span className="text-purple-400">Rochana Imesh</span>
            </span>
          </div>
        </div>
        {/* Header - Mobile Only (User Menu) */}
        <header className="lg:hidden h-24 flex items-center justify-end gap-4 px-8 border-b border-white/5 bg-[#5b21b6]/20 backdrop-blur-md sticky top-0 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={(user as any)?.avatarUrl || user?.profileImageUrl || undefined} alt={user?.firstName || 'User'} />
                  <AvatarFallback className="bg-purple-700 text-white font-black">{user?.firstName?.[0]?.toUpperCase() || 'A'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.firstName}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Admin
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="flex-1 p-8 lg:p-16 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
