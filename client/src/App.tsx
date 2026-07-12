import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { LayoutShell } from "@/components/layout-shell";
import { AdminNotifier } from "@/components/admin-notifier";

// Lazy load pages for code splitting
const Dashboard = lazy(() => import("@/pages/dashboard"));
const ProductsPage = lazy(() => import("@/pages/products-page"));
const InventoryPage = lazy(() => import("@/pages/inventory-page"));
const OrdersPage = lazy(() => import("@/pages/orders-page"));
const PaymentsPage = lazy(() => import("@/pages/payments-page"));
const SettingsPage = lazy(() => import("@/pages/settings-page"));
const AwsCheckerPage = lazy(() => import("@/pages/aws-checker-page"));
const BroadcastPage = lazy(() => import("@/pages/broadcast-page"));
const EmailCampaignPage = lazy(() => import("@/pages/email-campaign-page"));
const LoginPage = lazy(() => import("@/pages/login-page"));
const SpecialOffersPage = lazy(() => import("@/pages/special-offers-page"));
const TelegramUsersPage = lazy(() => import("@/pages/telegram-users-page"));
const TelegramClientPage = lazy(() => import("@/pages/telegram-client-page"));
const BackupPage = lazy(() => import("@/pages/backup-page"));
const ForwardPage = lazy(() => import("@/pages/forward-page"));
const DomainEmailPage = lazy(() => import("@/pages/domain-email-page"));
const SupportChatPage = lazy(() => import("@/pages/support-chat-page"));
const IpManagerPage = lazy(() => import("@/pages/ip-manager-page"));
const ImageSectionPage = lazy(() => import("@/pages/image-section-page"));
const MiniAppShop = lazy(() => import("@/pages/mini-app-shop"));
const OpenVpnPage = lazy(() => import("@/pages/openvpn-page"));
const CategoryOrderPage = lazy(() => import("@/pages/category-order-page"));
const FeedbacksPage = lazy(() => import("@/pages/feedbacks-page"));
const CustomerFeedbacksPublic = lazy(() => import("@/pages/customer-feedbacks-public"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

function WhatsappRedirect() {
  useEffect(() => {
    window.location.replace("/whatsapp");
  }, []);
  return null;
}

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  if (!user) {
    return <Redirect to="/main-admin-login" />;
  }

  return (
    <LayoutShell>
      <Suspense fallback={<PageLoader />}>
        <Component />
      </Suspense>
    </LayoutShell>
  );
}

function Router() {
  const { user, isLoading } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    const manifestLink = document.getElementById('manifest-placeholder');
    if (manifestLink) {
      if (location.startsWith('/main-admin')) {
        manifestLink.setAttribute('href', '/manifest-admin.json');
      } else {
        manifestLink.setAttribute('href', '/manifest.json');
      }
    }
  }, [location]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/main-admin-login">
          {user ? <Redirect to="/main-admin" /> : <LoginPage />}
        </Route>
        
        <Route path="/">
          <Suspense fallback={<PageLoader />}>
            {user ? <Redirect to="/main-admin" /> : <MiniAppShop />}
          </Suspense>
        </Route>

        <Route path="/customer-feedbacks">
          <Suspense fallback={<PageLoader />}>
            <CustomerFeedbacksPublic />
          </Suspense>
        </Route>

        <Route path="/whatsapp">
          <WhatsappRedirect />
        </Route>

        <Route path="/main-admin">
          <ProtectedRoute component={Dashboard} />
        </Route>
        
        <Route path="/main-admin/products">
          <ProtectedRoute component={ProductsPage} />
        </Route>

        <Route path="/main-admin/image-section">
          <ProtectedRoute component={ImageSectionPage} />
        </Route>
        
        <Route path="/main-admin/inventory">
          <ProtectedRoute component={InventoryPage} />
        </Route>

        <Route path="/main-admin/orders">
          <ProtectedRoute component={OrdersPage} />
        </Route>

        <Route path="/main-admin/payments">
          <ProtectedRoute component={PaymentsPage} />
        </Route>

        <Route path="/main-admin/broadcast">
          <ProtectedRoute component={BroadcastPage} />
        </Route>

        <Route path="/main-admin/email-campaign">
          <ProtectedRoute component={EmailCampaignPage} />
        </Route>

        <Route path="/main-admin/settings">
          <ProtectedRoute component={SettingsPage} />
        </Route>

        <Route path="/main-admin/aws-checker">
          <ProtectedRoute component={AwsCheckerPage} />
        </Route>

        <Route path="/main-admin/special-offers">
          <ProtectedRoute component={SpecialOffersPage} />
        </Route>

        <Route path="/main-admin/backups">
          <ProtectedRoute component={BackupPage} />
        </Route>

        <Route path="/main-admin/users">
          <ProtectedRoute component={TelegramUsersPage} />
        </Route>

        <Route path="/main-admin/telegram-client">
          <ProtectedRoute component={TelegramClientPage} />
        </Route>

        <Route path="/main-admin/forward">
          <ProtectedRoute component={ForwardPage} />
        </Route>

        <Route path="/main-admin/domain-email">
          <ProtectedRoute component={DomainEmailPage} />
        </Route>

        <Route path="/main-admin/support">
          <ProtectedRoute component={SupportChatPage} />
        </Route>

        <Route path="/main-admin/ip-manager">
          <ProtectedRoute component={IpManagerPage} />
        </Route>

        <Route path="/main-admin/openvpn">
          <ProtectedRoute component={OpenVpnPage} />
        </Route>

        <Route path="/main-admin/category-order">
          <ProtectedRoute component={CategoryOrderPage} />
        </Route>

        <Route path="/main-admin/feedbacks">
          <ProtectedRoute component={FeedbacksPage} />
        </Route>

        {/* Fallback to 404 */}
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="shopeefy-theme">
        <TooltipProvider>
          <Toaster />
          <AdminNotifier />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
