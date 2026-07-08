import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, ShieldCheck, Lock, Mail, Sparkles, Shield } from "lucide-react";
import { Redirect } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { user, isLoading, login, isLoggingIn, verify2FA, isVerifying2FA } = useAuth();
  const { toast } = useToast();
  const [show2FA, setShow2FA] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  if (!isLoading && user) {
    return <Redirect to="/main-admin" />;
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await login(data);
      if (res && res.twoFactorRequired) {
        setShow2FA(true);
        toast({
          title: "Verification Required",
          description: "Please enter the 6-digit code from your authenticator app.",
        });
      } else {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    }
  };

  return (
    <div className="h-[100dvh] w-full overflow-y-auto bg-[#0a0a0c] relative scrollbar-none">
      {/* Static Background Elements fallback */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 pointer-events-none" />
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]" 
        />
        <motion.div 
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[10%] right-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]" 
        />
      </div>

      <div className="min-h-full w-full flex items-center justify-center p-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[440px] my-auto"
        >
          <div className="glass-card p-6 sm:p-10 rounded-[2.5rem] border-white/10 relative overflow-hidden">
            {/* Top accent glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm" />
            
            <div className="flex flex-col items-center space-y-8">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="relative"
              >
                <div className="w-20 h-20 rounded-[1.75rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-2xl shadow-primary/40 relative z-10">
                  <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full -z-10 animate-pulse" />
              </motion.div>

              <div className="text-center space-y-3">
                <motion.h1 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
                >
                  Admin Access
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-muted-foreground/80 font-medium"
                >
                  Enter your credentials to enter the vault
                </motion.p>
              </div>

              <AnimatePresence mode="wait">
                {!show2FA ? (
                  <motion.div
                    key="login-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Identity</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                                  <Input 
                                    placeholder="admin@cloudshop.io" 
                                    className="h-14 pl-12 bg-white/[0.03] border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all"
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">Access Key</FormLabel>
                              <FormControl>
                                <div className="relative group">
                                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                                  <Input 
                                    type="password" 
                                    placeholder="••••••••" 
                                    className="h-14 pl-12 bg-white/[0.03] border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all"
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormMessage className="text-xs" />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit"
                          size="lg" 
                          className="w-full h-14 rounded-2xl font-bold text-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]" 
                          disabled={isLoggingIn}
                        >
                          {isLoggingIn ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          ) : (
                            <div className="flex items-center gap-2">
                              <span>Authorize Access</span>
                              <ArrowRight className="w-5 h-5" />
                            </div>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="2fa-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="w-full space-y-6"
                  >
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-widest text-white/50 ml-1">
                        Verification Code
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" />
                        <Input
                          type="text"
                          maxLength={6}
                          placeholder="000000"
                          className="h-14 pl-12 bg-white/[0.03] border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all text-center text-xl tracking-[0.4em] font-mono"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                    </div>

                    <Button
                      onClick={async () => {
                        try {
                          await verify2FA(otpCode);
                          toast({
                            title: "Verification successful",
                            description: "Welcome back!",
                          });
                        } catch (error: any) {
                          toast({
                            variant: "destructive",
                            title: "Verification failed",
                            description: error.message,
                          });
                        }
                      }}
                      disabled={otpCode.length !== 6 || isVerifying2FA}
                      size="lg"
                      className="w-full h-14 rounded-2xl font-bold text-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]"
                    >
                      {isVerifying2FA ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>Verify & Enter</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        setShow2FA(false);
                        setOtpCode("");
                      }}
                      className="w-full h-12 rounded-2xl font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all"
                    >
                      Back to Login
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2 pt-2">
                <Sparkles className="w-3 h-3 text-primary animate-pulse" />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  Encrypted Session Active
                </p>
              </div>
            </div>
          </div>
          
          {/* Floating background particles */}
          <AnimatePresence>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: [0.1, 0.3, 0.1],
                  y: [0, -100, 0],
                  x: [0, (i % 2 === 0 ? 30 : -30), 0]
                }}
                transition={{ 
                  duration: 5 + i, 
                  repeat: Infinity,
                  delay: i * 0.5 
                }}
                className="absolute w-1 h-1 bg-primary rounded-full blur-[1px]"
                style={{
                  left: `${15 + (i * 15)}%`,
                  top: `${80 + (i * 2)}%`
                }}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
