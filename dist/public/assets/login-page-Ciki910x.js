import { J as useAuth, e as useToast, r as reactExports, j as jsxRuntimeExports, K as Redirect, v as ShieldCheck, t as Mail, B as Button, L as LoaderCircle } from "./index-BkoZG9Fa.js";
import { I as Input } from "./input-ON1LrtA4.js";
import { u as useForm, F as Form, a as FormField, b as FormItem, c as FormLabel, d as FormControl, e as FormMessage, t } from "./form-De4cUVmh.js";
import { L as Label } from "./label-CE8EBsHd.js";
import { z } from "./index-DwfS90rP.js";
import { m as motion, A as AnimatePresence } from "./proxy-DsBSGVgR.js";
import { L as Lock } from "./lock-CwoaxJ4o.js";
import { A as ArrowRight } from "./arrow-right-CO2_DuBt.js";
import { S as Sparkles } from "./sparkles-CZrHYL1U.js";
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required")
});
function LoginPage() {
  const { user, isLoading, login, isLoggingIn, loginWithGoogle, isLoggingInGoogle, verify2FA, isVerifying2FA } = useAuth();
  const { toast } = useToast();
  const [show2FA, setShow2FA] = reactExports.useState(false);
  const [otpCode, setOtpCode] = reactExports.useState("");
  const [googleClientId, setGoogleClientId] = reactExports.useState(null);
  const [googleEnabled, setGoogleEnabled] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const fetchGoogleSettings = async () => {
      try {
        const resEnabled = await fetch("/api/settings/GOOGLE_LOGIN_ENABLED");
        const dataEnabled = await resEnabled.json();
        const resClientId = await fetch("/api/settings/GOOGLE_CLIENT_ID");
        const dataClientId = await resClientId.json();
        if (dataEnabled?.value === "true" && dataClientId?.value) {
          setGoogleClientId(dataClientId.value.trim());
          setGoogleEnabled(true);
        }
      } catch (err) {
        console.error("Failed to load Google login settings:", err);
      }
    };
    fetchGoogleSettings();
  }, []);
  const handleGoogleCredentialResponse = async (response) => {
    try {
      await loginWithGoogle(response.credential);
      toast({
        title: "Login successful",
        description: "Welcome back!"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Google Login failed",
        description: error.message || "Unauthorized access."
      });
    }
  };
  reactExports.useEffect(() => {
    if (!googleEnabled || !googleClientId) return;
    if (!document.getElementById("google-gsi-client")) {
      const script = document.createElement("script");
      script.id = "google-gsi-client";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeGoogleButton();
      };
      document.body.appendChild(script);
    } else {
      initializeGoogleButton();
    }
    function initializeGoogleButton() {
      try {
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleCredentialResponse
          });
          const targetDiv = document.getElementById("google-signin-div");
          if (targetDiv) {
            window.google.accounts.id.renderButton(
              targetDiv,
              {
                theme: "outline",
                size: "large",
                width: 360,
                shape: "pill",
                text: "signin_with"
              }
            );
          }
        }
      } catch (e) {
        console.error("Error rendering Google button:", e);
      }
    }
  }, [googleEnabled, googleClientId]);
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
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: !show2FA ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0, x: -20 },
                  animate: { opacity: 1, x: 0 },
                  exit: { opacity: 0, x: 20 },
                  transition: { duration: 0.3 },
                  className: "w-full",
                  children: [
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
                          disabled: isLoggingIn || isLoggingInGoogle,
                          children: isLoggingIn ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-5 w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Authorize Access" }),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "w-5 h-5" })
                          ] })
                        }
                      )
                    ] }) }),
                    googleEnabled && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-col items-center justify-center space-y-4 border-t border-white/5 pt-6 w-full", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase tracking-widest text-white/30", children: "Or sign in with" }),
                      isLoggingInGoogle ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          id: "google-signin-div",
                          className: "w-full flex justify-center scale-95 hover:scale-100 transition-transform duration-300"
                        }
                      )
                    ] })
                  ]
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
