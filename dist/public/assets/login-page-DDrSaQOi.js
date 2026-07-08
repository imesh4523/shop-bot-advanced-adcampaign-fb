import { s as useAuth, e as useToast, r as reactExports, u as useQuery, j as jsxRuntimeExports, K as Redirect, w as ShieldCheck, v as Mail, B as Button, L as LoaderCircle, i as apiRequest } from "./index-CnANFEG-.js";
import { I as Input } from "./input-BHaCFJK7.js";
import { u as useForm, F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormMessage, t } from "./form-CtWntR0-.js";
import { L as Label } from "./label-AQdI_34I.js";
import { z } from "./index-DwfS90rP.js";
import { m as motion, A as AnimatePresence } from "./proxy-Cs-une8j.js";
import { L as Lock } from "./lock-CQP6q3iz.js";
import { A as ArrowRight } from "./arrow-right-iwQVYd7i.js";
import { S as Sparkles } from "./sparkles-C524JS85.js";
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});
function LoginPage() {
  const { user, isLoading, login, isLoggingIn, verify2FA, isVerifying2FA } = useAuth();
  const { toast } = useToast();
  const [show2FA, setShow2FA] = reactExports.useState(false);
  const [otpCode, setOtpCode] = reactExports.useState("");
  const { data: pwaPasskeyOnlySetting } = useQuery({
    queryKey: ["/api/settings/PWA_ADMIN_PASSKEY_ONLY"]
  });
  const forcePasskeyOnly = pwaPasskeyOnlySetting?.value === "true";
  const [isPasskeyAuthenticating, setIsPasskeyAuthenticating] = reactExports.useState(false);
  const [emailInput, setEmailInput] = reactExports.useState("");
  const handlePasskeyLogin = async (e) => {
    e.preventDefault();
    if (!emailInput) {
      toast({ title: "Email Required", description: "Please enter your administrator email first.", variant: "destructive" });
      return;
    }
    setIsPasskeyAuthenticating(true);
    try {
      const challengeRes = await apiRequest("GET", "/api/auth/passkey-challenge");
      const { challenge } = await challengeRes.json();
      const privateKey = await new Promise((resolve, reject) => {
        const req = indexedDB.open("PasskeysDB", 1);
        req.onupgradeneeded = () => {
          req.result.createObjectStore("keys");
        };
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction("keys", "readonly");
          const getReq = tx.objectStore("keys").get(emailInput);
          getReq.onsuccess = () => resolve(getReq.result);
          getReq.onerror = () => reject(getReq.error);
        };
        req.onerror = () => reject(req.error);
      });
      if (!privateKey) {
        throw new Error("No Passkey registered for this email on this device.");
      }
      const encoder = new TextEncoder();
      const challengeData = encoder.encode(challenge);
      const signatureBuffer = await window.crypto.subtle.sign(
        {
          name: "RSASSA-PKCS1-v1_5"
        },
        privateKey,
        challengeData
      );
      const signatureHex = Array.from(new Uint8Array(signatureBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
      const verifyRes = await apiRequest("POST", "/api/auth/passkey-verify", {
        email: emailInput,
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
          description: "Please enter the 6-digit code from your authenticator app."
        });
      } else {
        window.location.reload();
      }
    } catch (err) {
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
  const form = useForm({
    resolver: t(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  if (!isLoading && user) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Redirect, { to: "/main-admin" });
  }
  const onSubmit = async (data) => {
    try {
      const res = await login(data);
      if (res && res.twoFactorRequired) {
        setShow2FA(true);
        toast({
          title: "Verification Required",
          description: "Please enter the 6-digit code from your authenticator app."
        });
      } else {
        toast({
          title: "Login successful",
          description: "Welcome back!"
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message
      });
    }
  };
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
          className: "absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[100px]"
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
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-card p-6 sm:p-10 rounded-[2.5rem] border-white/10 relative overflow-hidden", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-sm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center space-y-8", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  whileHover: { scale: 1.05, rotate: 5 },
                  className: "relative",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-[1.75rem] bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-2xl shadow-primary/40 relative z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-10 h-10 text-white" }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-primary/30 blur-2xl rounded-full -z-10 animate-pulse" })
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
                    children: "Admin Access"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.p,
                  {
                    initial: { opacity: 0 },
                    animate: { opacity: 1 },
                    transition: { delay: 0.3 },
                    className: "text-muted-foreground/80 font-medium",
                    children: "Enter your credentials to enter the vault"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: !show2FA ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 },
                  exit: { opacity: 0, x: 20 },
                  transition: { duration: 0.3 },
                  className: "w-full space-y-6",
                  children: forcePasskeyOnly ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handlePasskeyLogin, className: "w-full space-y-6", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold uppercase tracking-widest text-white/50 ml-1", children: "Admin Email" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            type: "email",
                            placeholder: "admin@cloudshop.io",
                            className: "h-14 pl-12 bg-white/[0.03] border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all text-white",
                            value: emailInput,
                            onChange: (e) => setEmailInput(e.target.value)
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        type: "submit",
                        size: "lg",
                        className: "w-full h-14 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 shadow-xl shadow-purple-500/20 transition-all active:scale-[0.98]",
                        disabled: isPasskeyAuthenticating,
                        children: isPasskeyAuthenticating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🔑 Sign In with Passkey" }) })
                      }
                    )
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Form, { ...form, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "w-full space-y-6", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FormField,
                        {
                          control: form.control,
                          name: "email",
                          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "space-y-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-xs font-bold uppercase tracking-widest text-white/50 ml-1", children: "Identity" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Input,
                                {
                                  placeholder: "admin@cloudshop.io",
                                  className: "h-14 pl-12 bg-white/[0.03] border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all",
                                  ...field
                                }
                              )
                            ] }) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-xs" })
                          ] })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        FormField,
                        {
                          control: form.control,
                          name: "password",
                          render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(FormItem, { className: "space-y-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(FormLabel, { className: "text-xs font-bold uppercase tracking-widest text-white/50 ml-1", children: "Access Key" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(FormControl, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                Input,
                                {
                                  type: "password",
                                  placeholder: "••••••••",
                                  className: "h-14 pl-12 bg-white/[0.03] border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all",
                                  ...field
                                }
                              )
                            ] }) }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(FormMessage, { className: "text-xs" })
                          ] })
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "submit",
                          size: "lg",
                          className: "w-full h-14 rounded-2xl font-bold text-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]",
                          disabled: isLoggingIn,
                          children: isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Authorize Access" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5" })
                          ] })
                        }
                      )
                    ] }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex py-2 items-center", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-grow border-t border-white/5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-shrink mx-4 text-white/20 text-xs font-bold uppercase tracking-widest", children: "or use passkey" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-grow border-t border-white/5" })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handlePasskeyLogin, className: "w-full space-y-4", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold uppercase tracking-widest text-white/30 ml-1", children: "Admin Email" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Input,
                            {
                              type: "email",
                              placeholder: "admin@cloudshop.io",
                              className: "h-12 pl-12 bg-white/[0.02] border-white/5 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all text-white text-sm",
                              value: emailInput,
                              onChange: (e) => setEmailInput(e.target.value)
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Button,
                        {
                          type: "submit",
                          variant: "outline",
                          size: "lg",
                          className: "w-full h-12 rounded-2xl font-bold border-white/10 hover:bg-white/5 transition-all text-white text-sm",
                          disabled: isPasskeyAuthenticating,
                          children: isPasskeyAuthenticating ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "🔑 Authenticate via Passkey" }) })
                        }
                      )
                    ] })
                  ] })
                },
                "login-form"
              ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, x: 20 },
                  animate: { opacity: 1, x: 0 },
                  exit: { opacity: 0, x: -20 },
                  transition: { duration: 0.3 },
                  className: "w-full space-y-6",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold uppercase tracking-widest text-white/50 ml-1", children: "Verification Code" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 group-focus-within:text-primary transition-colors" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            type: "text",
                            maxLength: 6,
                            placeholder: "000000",
                            className: "h-14 pl-12 bg-white/[0.03] border-white/10 focus:border-primary/50 focus:ring-primary/20 rounded-2xl transition-all text-center text-xl tracking-[0.4em] font-mono",
                            value: otpCode,
                            onChange: (e) => setOtpCode(e.target.value.replace(/\D/g, ""))
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        onClick: async () => {
                          try {
                            await verify2FA(otpCode);
                            toast({
                              title: "Verification successful",
                              description: "Welcome back!"
                            });
                          } catch (error) {
                            toast({
                              variant: "destructive",
                              title: "Verification failed",
                              description: error.message
                            });
                          }
                        },
                        disabled: otpCode.length !== 6 || isVerifying2FA,
                        size: "lg",
                        className: "w-full h-14 rounded-2xl font-bold text-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]",
                        children: isVerifying2FA ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Verify & Enter" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5" })
                        ] })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Button,
                      {
                        variant: "ghost",
                        onClick: () => {
                          setShow2FA(false);
                          setOtpCode("");
                        },
                        className: "w-full h-12 rounded-2xl font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-all",
                        children: "Back to Login"
                      }
                    )
                  ]
                },
                "2fa-form"
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 pt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-3 h-3 text-primary animate-pulse" }),
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
              className: "absolute w-1 h-1 bg-primary rounded-full blur-[1px]",
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
export {
  LoginPage as default
};
