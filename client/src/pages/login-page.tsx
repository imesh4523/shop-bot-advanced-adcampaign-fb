import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
  
  // Passkey Login State & Logic
  const { data: pwaPasskeyOnlySetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/PWA_ADMIN_PASSKEY_ONLY"]
  });
  const forcePasskeyOnly = pwaPasskeyOnlySetting?.value === "true";
  
  const [isPasskeyAuthenticating, setIsPasskeyAuthenticating] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  const registerDevicePasskey = async () => {}; // dummy placeholder check if needed, but not here

  const handlePasskeyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasskeyAuthenticating(true);
    try {
      // 1. Fetch challenge from server
      const challengeRes = await apiRequest("GET", "/api/auth/passkey-challenge");
      const { challenge } = await challengeRes.json();

      const challengeBuffer = new Uint8Array(
        challenge.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16))
      );

      // 2. Call standard native WebAuthn get API (triggers Apple Face ID / Touch ID prompt)
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: challengeBuffer,
          rpId: window.location.hostname,
          userVerification: "required"
        }
      });

      if (!assertion) {
        throw new Error("Device authentication cancelled.");
      }

      const authResponse = assertion.response as AuthenticatorAssertionResponse;
      const userHandle = authResponse.userHandle;
      const email = userHandle ? new TextDecoder().decode(userHandle) : emailInput;

      if (!email) {
        throw new Error("Could not identify account email from this passkey. Please register again.");
      }

      // 3. Hex encode parameters to verify securely on server
      const clientDataJSONHex = Array.from(new Uint8Array(authResponse.clientDataJSON))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      const authenticatorDataHex = Array.from(new Uint8Array(authResponse.authenticatorData))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      const signatureHex = Array.from(new Uint8Array(authResponse.signature))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      // 4. Verify assertion on server
      const verifyRes = await apiRequest("POST", "/api/auth/passkey-verify", {
        email: email,
        credentialId: assertion.id,
        clientDataJSONHex,
        authenticatorDataHex,
        signatureHex
      });

      if (!verifyRes.ok) {
        const errData = await verifyRes.json();
        throw new Error(errData.message || "Passkey authentication failed");
      }

      const verifyData = await verifyRes.json();
      if (verifyData.twoFactorRequired) {
        setShow2FA(true);
        toast({
          title: "Verification Required",
          description: "Please enter the 6-digit code from your authenticator app.",
        });
      } else {
        window.location.reload();
      }
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Passkey Verification Failed",
        description: err.message || "Passkey login failed.",
        variant: "destructive"
      });
    } finally {
      setIsPasskeyAuthenticating(false);
    }
  };

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
                    className="w-full space-y-6"
                  >
                    {forcePasskeyOnly ? (
                      <form onSubmit={handlePasskeyLogin} className="w-full space-y-6">
                        <div className="flex flex-col items-center justify-center p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                          <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-full animate-pulse text-purple-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key-round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 1 1-1v-1a1 1 0 0 0 .586-.172l1.9-1.9a7.5 7.5 0 1 0-5.83-5.83l-4.24 4.24a2 2 0 0 0-.586 1.414Z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>
                          </div>
                          <p className="text-xs text-white/40 text-center max-w-[240px]">
                            Biometric login enforced. Securely sign in using your device passkey (Face ID / Touch ID / PIN).
                          </p>
                        </div>
                        <Button 
                          type="submit"
                          size="lg" 
                          className="w-full h-14 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-xl shadow-purple-500/20 transition-all active:scale-[0.98]"
                          disabled={isPasskeyAuthenticating}
                        >
                          {isPasskeyAuthenticating ? (
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          ) : (
                            <div className="flex items-center gap-2 justify-center">
                              <span>🔑 Sign In with Passkey</span>
                            </div>
                          )}
                        </Button>
                      </form>
                    ) : (
                      <>
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

                        <div className="relative flex py-2 items-center">
                          <div className="flex-grow border-t border-white/5"></div>
                          <span className="flex-shrink mx-4 text-white/20 text-xs font-bold uppercase tracking-widest">or use passkey</span>
                          <div className="flex-grow border-t border-white/5"></div>
                        </div>

                        <form onSubmit={handlePasskeyLogin} className="w-full">
                          <Button 
                            type="submit"
                            variant="outline"
                            size="lg" 
                            className="w-full h-12 rounded-2xl font-bold border-white/10 hover:bg-white/5 transition-all text-white text-sm"
                            disabled={isPasskeyAuthenticating}
                          >
                            {isPasskeyAuthenticating ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <div className="flex items-center gap-2 justify-center">
                                <span>🔑 Authenticate via Passkey</span>
                              </div>
                            )}
                          </Button>
                        </form>
                      </>
                    )}
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
