import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Bot, Save, Loader2, Sparkles, Lock, Megaphone, Mail, CreditCard, Shield } from "lucide-react";

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

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [token, setToken] = useState("");
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [vertexKey, setVertexKey] = useState("");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [openaiApiBase, setOpenaiApiBase] = useState("");
  const [openaiModel, setOpenaiModel] = useState("");
  const [aiProviderPriority, setAiProviderPriority] = useState("gemini");
  const [extraInstructionsText, setExtraInstructionsText] = useState("");
  const [broadcastToken, setBroadcastToken] = useState("");
  const [supportBotToken, setSupportBotToken] = useState("");
  const [supportContact, setSupportContact] = useState("");
  const [cryptomusApiKey, setCryptomusApiKey] = useState("");
  const [cryptomusMerchantId, setCryptomusMerchantId] = useState("");
  const [binanceApiKey, setBinanceApiKey] = useState("");
  const [binanceSecretKey, setBinanceSecretKey] = useState("");
  const [binancePayId, setBinancePayId] = useState("");
  const [faqText, setFaqText] = useState("");
  const [howToBuyVideo, setHowToBuyVideo] = useState("");
  const [howToDepositVideo, setHowToDepositVideo] = useState("");
  const [storeName, setStoreName] = useState("");
  const [themeColor, setThemeColor] = useState("#a855f7");
  const [supportUsername, setSupportUsername] = useState("");
  const [supportBtnText, setSupportBtnText] = useState("");
  const [loadingText, setLoadingText] = useState("");
  const [defaultTheme, setDefaultTheme] = useState("dark");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [vapidPublicKey, setVapidPublicKey] = useState("");
  const [vapidPrivateKey, setVapidPrivateKey] = useState("");
  const [vapidSubject, setVapidSubject] = useState("");

  const [emailService, setEmailService] = useState("none");
  const [emailSender, setEmailSender] = useState("");
  const [resendApiKey, setResendApiKey] = useState("");
  const [sendgridApiKey, setSendgridApiKey] = useState("");
  const [brevoApiKey, setBrevoApiKey] = useState("");
  const [sesSmtpHost, setSesSmtpHost] = useState("");
  const [sesSmtpPort, setSesSmtpPort] = useState("");
  const [sesSmtpUser, setSesSmtpUser] = useState("");
  const [sesSmtpPass, setSesSmtpPass] = useState("");
  const [stripeSecretKey, setStripeSecretKey] = useState("");
  const [stripeWebhookSecret, setStripeWebhookSecret] = useState("");
  const [minDepositLimit, setMinDepositLimit] = useState("1.00");
  const [digitalOceanApiKey, setDigitalOceanApiKey] = useState("");
  const [currencyRateLkr, setCurrencyRateLkr] = useState("300.0");
  const [currencyRateInr, setCurrencyRateInr] = useState("83.0");
  const [currencyRateEur, setCurrencyRateEur] = useState("0.92");

  // Passkey State & Helper Functions
  const [isPasskeyRegistering, setIsPasskeyRegistering] = useState(false);
  const { data: pwaPasskeyOnlySetting } = useQuery<{ value: string }>({
    queryKey: ["/api/settings/PWA_ADMIN_PASSKEY_ONLY"]
  });
  const forcePasskeyOnly = pwaPasskeyOnlySetting?.value === "true";

  const pwaPasskeyOnlyMutation = useMutation({
    mutationFn: async (value: boolean) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "PWA_ADMIN_PASSKEY_ONLY",
        value: value ? "true" : "false"
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/PWA_ADMIN_PASSKEY_ONLY"] });
      toast({ title: "Settings Saved", description: "PWA passkey security updated successfully." });
    }
  });

  const registerDevicePasskey = async () => {
    if (!user?.email) {
      toast({ title: "Error", description: "Admin email not found.", variant: "destructive" });
      return;
    }

    setIsPasskeyRegistering(true);
    try {
      // 1. Fetch challenge from server
      const challengeRes = await apiRequest("GET", "/api/auth/passkey-challenge");
      const { challenge } = await challengeRes.json();

      // Convert challenge hex string to Uint8Array
      const challengeBuffer = new Uint8Array(
        challenge.match(/.{1,2}/g).map((byte: string) => parseInt(byte, 16))
      );

      // Convert user email to dynamic ID buffer
      const userIdBuffer = new TextEncoder().encode(user.email);

      // 2. Call standard native WebAuthn API (triggers FaceID/TouchID prompt on Apple/Android)
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: challengeBuffer,
          rp: {
            name: "Shopeefy Admin Portal",
            id: window.location.hostname, // Matches domain (e.g. localhost or cloudaccount.store)
          },
          user: {
            id: userIdBuffer,
            name: user.email,
            displayName: `${user.firstName || "Admin"} (${user.email})`,
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },   // ES256 (standard EC WebAuthn)
            { type: "public-key", alg: -257 }  // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform", // Prompts device native authentication (Touch ID / Face ID / Windows Hello)
            userVerification: "required",
            residentKey: "required"
          },
          timeout: 60000,
          attestation: "none"
        }
      });

      if (!credential) {
        throw new Error("Device cancelled passkey generation.");
      }

      // 3. Extract standard public key SPKI DER buffer
      const attestationResponse = credential.response as AuthenticatorAttestationResponse;
      const publicKeyBuffer = attestationResponse.getPublicKey();
      const credentialId = credential.id;

      const publicKeyDerHex = Array.from(new Uint8Array(publicKeyBuffer))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      // 4. Send to server
      const res = await apiRequest("POST", "/api/auth/passkey-register", {
        credentialId,
        publicKeyDerHex
      });

      if (!res.ok) {
        throw new Error("Failed to register credential on the server");
      }

      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

      toast({
        title: "Passkey Registered",
        description: "This device's native biometric key has been linked to your account!",
      });
    } catch (err: any) {
      console.error("Passkey error:", err);
      toast({
        title: "Registration Failed",
        description: err.message || "Failed to set up native passkey.",
        variant: "destructive"
      });
    } finally {
      setIsPasskeyRegistering(false);
    }
  };

  // 2FA state variables
  const [showSetup, setShowSetup] = useState(false);
  const [setupData, setSetupData] = useState<{ secret: string; qrUrl: string } | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [showDisableForm, setShowDisableForm] = useState(false);
  const [disableCode, setDisableCode] = useState("");

  // SMTP state variables
  const [smtpHost, setSmtpHost] = useState("");
  const [smtpPort, setSmtpPort] = useState("");
  const [smtpUser, setSmtpUser] = useState("");
  const [smtpPass, setSmtpPass] = useState("");

  const [emailLoginOnly, setEmailLoginOnly] = useState(false);
  const [stripeEnabled, setStripeEnabled] = useState(true);

  const { data: setting, isLoading: isTokenLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/TELEGRAM_BOT_TOKEN"],
  });

  const { data: geminiSetting, isLoading: isGeminiLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/GEMINI_API_KEY"],
  });

  const { data: vertexSetting } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/GOOGLE_VERTEX_KEY"],
  });

  const { data: openaiApiSetting } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/OPENAI_API_KEY"],
  });

  const { data: openaiBaseSetting } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/OPENAI_API_BASE"],
  });

  const { data: openaiModelSetting } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/OPENAI_MODEL"],
  });

  const { data: prioritySetting } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/AI_PROVIDER_PRIORITY"],
  });

  const { data: extraInstructionsSetting, isLoading: isExtraInstructionsLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/EXTRA_INSTRUCTIONS"],
  });

  const { data: broadcastSetting, isLoading: isBroadcastLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/BROADCAST_BOT_TOKEN"],
  });

  const { data: supportBotSetting, isLoading: isSupportBotLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/TELEGRAM_SUPPORT_BOT_TOKEN"],
  });

  const { data: supportSetting, isLoading: isSupportLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/SUPPORT_CONTACT"],
  });

  const { data: cryptomusSetting, isLoading: isCryptomusLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/CRYPTOMUS_API_KEY"],
  });

  const { data: merchantSetting, isLoading: isMerchantLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/CRYPTOMUS_MERCHANT_ID"],
  });

  const { data: binanceSetting, isLoading: isBinanceLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/BINANCE_PAY_ID"],
  });

  const { data: binanceApiSetting, isLoading: isBinanceApiLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/BINANCE_API_KEY"],
  });

  const { data: binanceSecretSetting, isLoading: isBinanceSecretLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/BINANCE_SECRET_KEY"],
  });

  const { data: faqSetting, isLoading: isFaqLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/faq_content"],
  });

  const { data: howToBuySetting, isLoading: isHowToBuyLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/TUTORIAL_BUY_VIDEO"],
  });

  const { data: howToDepositSetting, isLoading: isHowToDepositLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/TUTORIAL_DEPOSIT_VIDEO"],
  });

  const { data: binanceEnabledSetting, isLoading: isBinanceEnabledLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/PAYMENT_BINANCE_ENABLED"],
  });

  const { data: cryptomusEnabledSetting, isLoading: isCryptomusEnabledLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/PAYMENT_CRYPTOMUS_ENABLED"],
  });

  const { data: trc20EnabledSetting, isLoading: isTrc20EnabledLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/PAYMENT_TRC20_ENABLED"],
  });

  const { data: aptosEnabledSetting, isLoading: isAptosEnabledLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/PAYMENT_APTOS_ENABLED"],
  });

  const { data: trc20WalletSetting, isLoading: isTrc20WalletLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/TRC20_WALLET_ADDRESS"],
  });

  const { data: aptosWalletSetting, isLoading: isAptosWalletLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/APTOS_WALLET_ADDRESS"],
  });

  const { data: trc20VerificationModeSetting, isLoading: isTrc20VerificationModeLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/TRC20_VERIFICATION_MODE"],
  });

  const { data: aptosVerificationModeSetting, isLoading: isAptosVerificationModeLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/APTOS_VERIFICATION_MODE"],
  });

  const { data: automationEnabledSetting, isLoading: isAutomationEnabledLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/AUTOMATION_ENABLED"],
  });

  const { data: specialOffersEnabledSetting, isLoading: isSpecialOffersEnabledLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/SPECIAL_OFFERS_ENABLED"],
  });

  const { data: storeNameSetting, isLoading: isStoreNameLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/STORE_NAME"],
  });

  const { data: themeColorSetting, isLoading: isThemeColorLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/THEME_COLOR"],
  });

  const { data: rateLkrSetting } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/CURRENCY_RATE_LKR"],
  });

  const { data: rateInrSetting } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/CURRENCY_RATE_INR"],
  });

  const { data: rateEurSetting } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/CURRENCY_RATE_EUR"],
  });

  const { data: supportUsernameSetting, isLoading: isSupportUsernameLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/SUPPORT_USERNAME"],
  });

  const { data: supportBtnTextSetting, isLoading: isSupportBtnTextLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/SUPPORT_BTN_TEXT"],
  });

  const { data: whatsappLinkSetting } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/WHATSAPP_CONTACT_LINK"],
  });

  const { data: loadingTextSetting, isLoading: isLoadingTextLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/LOADING_TEXT"],
  });

  const { data: defaultThemeSetting } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/DEFAULT_THEME"],
  });

  const { data: vapidPublicSetting, isLoading: isVapidPublicLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/VAPID_PUBLIC_KEY"],
  });

  const { data: vapidPrivateSetting, isLoading: isVapidPrivateLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/VAPID_PRIVATE_KEY"],
  });

  const { data: vapidSubjectSetting, isLoading: isVapidSubjectLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/VAPID_SUBJECT"],
  });

  const { data: emailServiceSetting, isLoading: isEmailServiceLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/EMAIL_SERVICE"],
  });
  const { data: emailSenderSetting, isLoading: isEmailSenderLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/EMAIL_SENDER"],
  });
  const { data: resendApiKeySetting, isLoading: isResendApiKeyLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/RESEND_API_KEY"],
  });
  const { data: sendgridApiKeySetting, isLoading: isSendgridApiKeyLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/SENDGRID_API_KEY"],
  });
  const { data: brevoApiKeySetting, isLoading: isBrevoApiKeyLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/BREVO_API_KEY"],
  });
  const { data: sesHostSetting, isLoading: isSesHostLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/SES_SMTP_HOST"],
  });
  const { data: sesPortSetting, isLoading: isSesPortLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/SES_SMTP_PORT"],
  });
  const { data: sesUserSetting, isLoading: isSesUserLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/SES_SMTP_USER"],
  });
  const { data: sesPassSetting, isLoading: isSesPassLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/SES_SMTP_PASS"],
  });
  const { data: smtpHostSetting, isLoading: isSmtpHostLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/SMTP_HOST"],
  });
  const { data: smtpPortSetting, isLoading: isSmtpPortLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/SMTP_PORT"],
  });
  const { data: smtpUserSetting, isLoading: isSmtpUserLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/SMTP_USER"],
  });
  const { data: smtpPassSetting, isLoading: isSmtpPassLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/SMTP_PASS"],
  });
  const { data: emailLoginOnlySetting, isLoading: isEmailLoginOnlyLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/EMAIL_LOGIN_ONLY"],
  });
  const { data: stripeSecretSetting, isLoading: isStripeSecretLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/STRIPE_SECRET_KEY"],
  });
  const { data: stripeWebhookSetting, isLoading: isStripeWebhookLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/STRIPE_WEBHOOK_SECRET"],
  });
  const { data: stripeEnabledSetting, isLoading: isStripeEnabledLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/STRIPE_ENABLED"],
  });
  const { data: minDepositSetting, isLoading: isMinDepositLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/MIN_DEPOSIT_LIMIT"],
  });

  const { data: digitalOceanSetting, isLoading: isDigitalOceanLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/DIGITALOCEAN_API_KEY"],
  });

  const [googleClientId, setGoogleClientId] = useState("");
  const [googleLoginEnabled, setGoogleLoginEnabled] = useState(false);

  const { data: googleClientIdSetting, isLoading: isGoogleClientIdLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/GOOGLE_CLIENT_ID"],
  });

  const { data: googleLoginEnabledSetting, isLoading: isGoogleLoginEnabledLoading } = useQuery<{ key: string, value: string }>({
    queryKey: ["/api/settings/GOOGLE_LOGIN_ENABLED"],
  });

  useEffect(() => {
    if (googleClientIdSetting?.value !== undefined) setGoogleClientId(googleClientIdSetting.value);
  }, [googleClientIdSetting]);

  useEffect(() => {
    if (googleLoginEnabledSetting?.value !== undefined) setGoogleLoginEnabled(googleLoginEnabledSetting.value === "true");
  }, [googleLoginEnabledSetting]);

  const isLoading = isTokenLoading || isBroadcastLoading || isSupportLoading || isCryptomusLoading ||
    isMerchantLoading || isBinanceLoading || isBinanceApiLoading || isBinanceSecretLoading ||
    isFaqLoading || isHowToBuyLoading || isHowToDepositLoading || isBinanceEnabledLoading ||
    isCryptomusEnabledLoading || isAutomationEnabledLoading ||
    isSpecialOffersEnabledLoading || isStoreNameLoading || isSupportUsernameLoading ||
    isSupportBtnTextLoading || isLoadingTextLoading ||
    isTrc20EnabledLoading || isAptosEnabledLoading || isTrc20WalletLoading || isAptosWalletLoading ||
    isTrc20VerificationModeLoading || isAptosVerificationModeLoading || isGeminiLoading ||
    isExtraInstructionsLoading || isVapidPublicLoading || isVapidPrivateLoading || isVapidSubjectLoading ||
    isEmailServiceLoading || isEmailSenderLoading || isResendApiKeyLoading || isSendgridApiKeyLoading ||
    isBrevoApiKeyLoading || isSesHostLoading || isSesPortLoading || isSesUserLoading || isSesPassLoading ||
    isSmtpHostLoading || isSmtpPortLoading || isSmtpUserLoading || isSmtpPassLoading ||
    isEmailLoginOnlyLoading || isStripeSecretLoading || isStripeWebhookLoading || isStripeEnabledLoading || isMinDepositLoading || isDigitalOceanLoading || isGoogleClientIdLoading || isGoogleLoginEnabledLoading;

  const [binanceEnabled, setBinanceEnabled] = useState(true);
  const [cryptomusEnabled, setCryptomusEnabled] = useState(true);
  const [trc20Enabled, setTrc20Enabled] = useState(false);
  const [aptosEnabled, setAptosEnabled] = useState(false);
  const [trc20Wallet, setTrc20Wallet] = useState("");
  const [aptosWallet, setAptosWallet] = useState("");
  const [trc20VerificationMode, setTrc20VerificationMode] = useState("binance");
  const [aptosVerificationMode, setAptosVerificationMode] = useState("binance");
  const [automationEnabled, setAutomationEnabled] = useState(true);
  const [specialOffersEnabled, setSpecialOffersEnabled] = useState(true);

  useEffect(() => {
    if (binanceEnabledSetting?.value !== undefined) setBinanceEnabled(binanceEnabledSetting.value === "true");
  }, [binanceEnabledSetting]);

  useEffect(() => {
    if (cryptomusEnabledSetting?.value !== undefined) setCryptomusEnabled(cryptomusEnabledSetting.value === "true");
  }, [cryptomusEnabledSetting]);

  useEffect(() => {
    if (trc20EnabledSetting?.value !== undefined) setTrc20Enabled(trc20EnabledSetting.value === "true");
  }, [trc20EnabledSetting]);

  useEffect(() => {
    if (aptosEnabledSetting?.value !== undefined) setAptosEnabled(aptosEnabledSetting.value === "true");
  }, [aptosEnabledSetting]);

  useEffect(() => {
    if (trc20WalletSetting?.value !== undefined) setTrc20Wallet(trc20WalletSetting.value);
  }, [trc20WalletSetting]);

  useEffect(() => {
    if (aptosWalletSetting?.value !== undefined) setAptosWallet(aptosWalletSetting.value);
  }, [aptosWalletSetting]);

  useEffect(() => {
    if (trc20VerificationModeSetting?.value !== undefined) setTrc20VerificationMode(trc20VerificationModeSetting.value || "binance");
  }, [trc20VerificationModeSetting]);

  useEffect(() => {
    if (aptosVerificationModeSetting?.value !== undefined) setAptosVerificationMode(aptosVerificationModeSetting.value || "binance");
  }, [aptosVerificationModeSetting]);

  useEffect(() => {
    if (automationEnabledSetting?.value !== undefined) setAutomationEnabled(automationEnabledSetting.value === "true");
  }, [automationEnabledSetting]);

  useEffect(() => {
    if (specialOffersEnabledSetting?.value !== undefined) setSpecialOffersEnabled(specialOffersEnabledSetting.value !== "false");
  }, [specialOffersEnabledSetting]);

  useEffect(() => {
    if (setting?.value !== undefined) setToken(setting.value);
  }, [setting]);

  useEffect(() => {
    if (supportBotSetting?.value !== undefined) setSupportBotToken(supportBotSetting.value);
  }, [supportBotSetting]);

  useEffect(() => {
    if (geminiSetting?.value !== undefined) setGeminiApiKey(geminiSetting.value);
  }, [geminiSetting]);

  useEffect(() => {
    if (vertexSetting?.value !== undefined) setVertexKey(vertexSetting.value);
  }, [vertexSetting]);

  useEffect(() => {
    if (openaiApiSetting?.value !== undefined) setOpenaiApiKey(openaiApiSetting.value);
  }, [openaiApiSetting]);

  useEffect(() => {
    if (openaiBaseSetting?.value !== undefined) setOpenaiApiBase(openaiBaseSetting.value);
  }, [openaiBaseSetting]);

  useEffect(() => {
    if (openaiModelSetting?.value !== undefined) setOpenaiModel(openaiModelSetting.value);
  }, [openaiModelSetting]);

  useEffect(() => {
    if (prioritySetting?.value !== undefined) setAiProviderPriority(prioritySetting.value);
  }, [prioritySetting]);

  useEffect(() => {
    if (extraInstructionsSetting?.value !== undefined) setExtraInstructionsText(extraInstructionsSetting.value);
  }, [extraInstructionsSetting]);

  useEffect(() => {
    if (broadcastSetting?.value !== undefined) setBroadcastToken(broadcastSetting.value);
  }, [broadcastSetting]);

  useEffect(() => {
    if (supportSetting?.value !== undefined) setSupportContact(supportSetting.value);
  }, [supportSetting]);

  useEffect(() => {
    if (cryptomusSetting?.value !== undefined) setCryptomusApiKey(cryptomusSetting.value);
  }, [cryptomusSetting]);

  useEffect(() => {
    if (merchantSetting?.value !== undefined) setCryptomusMerchantId(merchantSetting.value);
  }, [merchantSetting]);

  useEffect(() => {
    if (binanceSetting?.value !== undefined) setBinancePayId(binanceSetting.value);
  }, [binanceSetting]);

  useEffect(() => {
    if (binanceApiSetting?.value !== undefined) setBinanceApiKey(binanceApiSetting.value);
  }, [binanceApiSetting]);

  useEffect(() => {
    if (binanceSecretSetting?.value !== undefined) setBinanceSecretKey(binanceSecretSetting.value);
  }, [binanceSecretSetting]);

  useEffect(() => {
    if (faqSetting?.value !== undefined) setFaqText(faqSetting.value);
  }, [faqSetting]);

  useEffect(() => {
    if (howToBuySetting?.value !== undefined) setHowToBuyVideo(howToBuySetting.value);
  }, [howToBuySetting]);

  useEffect(() => {
    if (howToDepositSetting?.value !== undefined) setHowToDepositVideo(howToDepositSetting.value);
  }, [howToDepositSetting]);

  useEffect(() => {
    if (storeNameSetting?.value !== undefined) setStoreName(storeNameSetting.value);
  }, [storeNameSetting]);

  useEffect(() => {
    if (themeColorSetting?.value !== undefined) setThemeColor(themeColorSetting.value || "#a855f7");
  }, [themeColorSetting]);

  useEffect(() => {
    if (rateLkrSetting?.value !== undefined) setCurrencyRateLkr(rateLkrSetting.value);
  }, [rateLkrSetting]);

  useEffect(() => {
    if (rateInrSetting?.value !== undefined) setCurrencyRateInr(rateInrSetting.value);
  }, [rateInrSetting]);

  useEffect(() => {
    if (rateEurSetting?.value !== undefined) setCurrencyRateEur(rateEurSetting.value);
  }, [rateEurSetting]);

  useEffect(() => {
    if (supportUsernameSetting?.value !== undefined) setSupportUsername(supportUsernameSetting.value);
  }, [supportUsernameSetting]);

  useEffect(() => {
    if (supportBtnTextSetting?.value !== undefined) setSupportBtnText(supportBtnTextSetting.value);
  }, [supportBtnTextSetting]);

  useEffect(() => {
    if (whatsappLinkSetting?.value !== undefined) setWhatsappLink(whatsappLinkSetting.value || "");
  }, [whatsappLinkSetting]);

  useEffect(() => {
    if (loadingTextSetting?.value !== undefined) setLoadingText(loadingTextSetting.value);
  }, [loadingTextSetting]);

  useEffect(() => {
    if (defaultThemeSetting?.value !== undefined) setDefaultTheme(defaultThemeSetting.value || "dark");
  }, [defaultThemeSetting]);

  useEffect(() => {
    if (vapidPublicSetting?.value !== undefined) setVapidPublicKey(vapidPublicSetting.value);
  }, [vapidPublicSetting]);

  useEffect(() => {
    if (vapidPrivateSetting?.value !== undefined) setVapidPrivateKey(vapidPrivateSetting.value);
  }, [vapidPrivateSetting]);

  useEffect(() => {
    if (vapidSubjectSetting?.value !== undefined) setVapidSubject(vapidSubjectSetting.value);
  }, [vapidSubjectSetting]);

  useEffect(() => { if (emailServiceSetting?.value !== undefined) setEmailService(emailServiceSetting.value || "none"); }, [emailServiceSetting]);
  useEffect(() => { if (emailSenderSetting?.value !== undefined) setEmailSender(emailSenderSetting.value); }, [emailSenderSetting]);
  useEffect(() => { if (resendApiKeySetting?.value !== undefined) setResendApiKey(resendApiKeySetting.value); }, [resendApiKeySetting]);
  useEffect(() => { if (sendgridApiKeySetting?.value !== undefined) setSendgridApiKey(sendgridApiKeySetting.value); }, [sendgridApiKeySetting]);
  useEffect(() => { if (brevoApiKeySetting?.value !== undefined) setBrevoApiKey(brevoApiKeySetting.value); }, [brevoApiKeySetting]);
  useEffect(() => { if (sesHostSetting?.value !== undefined) setSesSmtpHost(sesHostSetting.value); }, [sesHostSetting]);
  useEffect(() => { if (sesPortSetting?.value !== undefined) setSesSmtpPort(sesPortSetting.value); }, [sesPortSetting]);
  useEffect(() => { if (sesUserSetting?.value !== undefined) setSesSmtpUser(sesUserSetting.value); }, [sesUserSetting]);
  useEffect(() => { if (sesPassSetting?.value !== undefined) setSesSmtpPass(sesPassSetting.value); }, [sesPassSetting]);
  useEffect(() => { if (smtpHostSetting?.value !== undefined) setSmtpHost(smtpHostSetting.value); }, [smtpHostSetting]);
  useEffect(() => { if (smtpPortSetting?.value !== undefined) setSmtpPort(smtpPortSetting.value); }, [smtpPortSetting]);
  useEffect(() => { if (smtpUserSetting?.value !== undefined) setSmtpUser(smtpUserSetting.value); }, [smtpUserSetting]);
  useEffect(() => { if (smtpPassSetting?.value !== undefined) setSmtpPass(smtpPassSetting.value); }, [smtpPassSetting]);
  useEffect(() => { if (emailLoginOnlySetting?.value !== undefined) setEmailLoginOnly(emailLoginOnlySetting.value === "true"); }, [emailLoginOnlySetting]);
  useEffect(() => { if (stripeSecretSetting?.value !== undefined) setStripeSecretKey(stripeSecretSetting.value); }, [stripeSecretSetting]);
  useEffect(() => { if (stripeWebhookSetting?.value !== undefined) setStripeWebhookSecret(stripeWebhookSetting.value); }, [stripeWebhookSetting]);
  useEffect(() => { if (stripeEnabledSetting?.value !== undefined) setStripeEnabled(stripeEnabledSetting.value !== "false"); }, [stripeEnabledSetting]);
  useEffect(() => { if (minDepositSetting?.value !== undefined) setMinDepositLimit(minDepositSetting.value); }, [minDepositSetting]);

  useEffect(() => {
    if (digitalOceanSetting?.value !== undefined) setDigitalOceanApiKey(digitalOceanSetting.value);
  }, [digitalOceanSetting]);

  useEffect(() => {
    try {
      const color = themeColor && typeof themeColor === 'string' && themeColor.trim() !== '' ? themeColor : "#a855f7";
      const hslVal = hexToHsl(color) || "275 100% 70%";
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
        }
      `;
    } catch (err) {
      console.error("Theme color dynamic styling in settings page failed:", err);
    }
  }, [themeColor]);

  const googleConfigMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const res = await apiRequest("POST", "/api/settings", { key, value });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${variables.key}`] });
      toast({
        title: "Google Login Settings Saved",
        description: `${variables.key.replace("_", " ").toLowerCase()} updated successfully.`,
      });
    }
  });

  const handleSaveGoogleSettings = () => {
    googleConfigMutation.mutate({ key: "GOOGLE_CLIENT_ID", value: googleClientId });
    googleConfigMutation.mutate({ key: "GOOGLE_LOGIN_ENABLED", value: googleLoginEnabled ? "true" : "false" });
  };

  const emailServiceMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: string }) => {
      const res = await apiRequest("POST", "/api/settings", { key, value });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${variables.key}`] });
      toast({
        title: "Email Configuration Saved",
        description: `${variables.key.replace("_", " ").toLowerCase()} updated successfully.`,
      });
    }
  });

  const stripeConfigMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: string }) => {
      const res = await apiRequest("POST", "/api/settings", { key, value });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${variables.key}`] });
      toast({
        title: "Stripe Credentials Saved",
        description: `${variables.key.replace("_", " ").toLowerCase()} updated successfully.`,
      });
    }
  });

  const mutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "TELEGRAM_BOT_TOKEN",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/TELEGRAM_BOT_TOKEN"] });
      toast({
        title: "Settings Updated",
        description: "Telegram Bot has been re-initialized with the new token.",
      });
    }
  });

  const broadcastMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "BROADCAST_BOT_TOKEN",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/BROADCAST_BOT_TOKEN"] });
      toast({
        title: "Broadcast Bot Updated",
        description: "Separate broadcast bot token has been saved.",
      });
    }
  });

  const supportBotMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "TELEGRAM_SUPPORT_BOT_TOKEN",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/TELEGRAM_SUPPORT_BOT_TOKEN"] });
      toast({
        title: "Support Bot Updated",
        description: "Telegram Support bot token has been saved and re-initialized.",
      });
    }
  });

  const geminiMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "GEMINI_API_KEY",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/GEMINI_API_KEY"] });
      toast({
        title: "Gemini API Key Updated",
        description: "Live support chat bot is now using the updated Gemini API key.",
      });
    }
  });

  const vertexMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "GOOGLE_VERTEX_KEY",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/GOOGLE_VERTEX_KEY"] });
      toast({
        title: "Vertex AI Config Updated",
        description: "Live support chat bot is now using the updated Google Cloud Vertex AI configuration.",
      });
    }
  });

  const extraInstructionsMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "EXTRA_INSTRUCTIONS",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/EXTRA_INSTRUCTIONS"] });
      toast({
        title: "Extra Instructions Updated",
        description: "Extra instructions & rules have been updated.",
      });
    }
  });

  const supportMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "SUPPORT_CONTACT",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/SUPPORT_CONTACT"] });
      toast({
        title: "Support Contact Updated",
        description: "Support contact has been updated.",
      });
    }
  });

  const cryptomusMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "CRYPTOMUS_API_KEY",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/CRYPTOMUS_API_KEY"] });
      toast({
        title: "Cryptomus API Key Updated",
        description: "Cryptomus integration is now ready to process payments.",
      });
    }
  });

  const cryptomusMerchantMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "CRYPTOMUS_MERCHANT_ID",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/CRYPTOMUS_MERCHANT_ID"] });
      toast({
        title: "Cryptomus Merchant ID Updated",
        description: "Merchant ID has been saved.",
      });
    }
  });

  const binancePayMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "BINANCE_PAY_ID",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/BINANCE_PAY_ID"] });
      toast({
        title: "Binance Pay ID Updated",
        description: "Binance Pay ID has been saved.",
      });
    }
  });

  const binanceApiKeyMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "BINANCE_API_KEY",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/BINANCE_API_KEY"] });
      toast({
        title: "Binance API Key Updated",
        description: "Binance API Key has been saved.",
      });
    }
  });

  const binanceSecretKeyMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "BINANCE_SECRET_KEY",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/BINANCE_SECRET_KEY"] });
      toast({
        title: "Binance Secret Key Updated",
        description: "Binance Secret Key has been saved.",
      });
    }
  });

  const trc20WalletMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "TRC20_WALLET_ADDRESS",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/TRC20_WALLET_ADDRESS"] });
      toast({
        title: "TRC20 Wallet Updated",
        description: "TRC20 wallet address has been updated.",
      });
    }
  });

  const aptosWalletMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "APTOS_WALLET_ADDRESS",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/APTOS_WALLET_ADDRESS"] });
      toast({
        title: "Aptos Wallet Updated",
        description: "Aptos wallet address has been updated.",
      });
    }
  });

  const trc20VerificationModeMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "TRC20_VERIFICATION_MODE",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/TRC20_VERIFICATION_MODE"] });
      toast({
        title: "TRC20 Verification Mode Updated",
        description: "TRC20 payment verification mode has been updated.",
      });
    }
  });

  const aptosVerificationModeMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "APTOS_VERIFICATION_MODE",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/APTOS_VERIFICATION_MODE"] });
      toast({
        title: "Aptos Verification Mode Updated",
        description: "Aptos payment verification mode has been updated.",
      });
    }
  });

  const faqMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "faq_content",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/faq_content"] });
      toast({
        title: "FAQ Updated",
        description: "FAQ content has been updated for all users.",
      });
    }
  });

  const tutorialBuyMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "TUTORIAL_BUY_VIDEO",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/TUTORIAL_BUY_VIDEO"] });
      toast({
        title: "Tutorial Updated",
        description: "How to buy video URL has been updated.",
      });
    }
  });

  const tutorialDepositMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "TUTORIAL_DEPOSIT_VIDEO",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/TUTORIAL_DEPOSIT_VIDEO"] });
      toast({
        title: "Tutorial Updated",
        description: "How to deposit video URL has been updated.",
      });
    }
  });

  const brandingMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: string }) => {
      const res = await apiRequest("POST", "/api/settings", { key, value });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${variables.key}`] });
      toast({
        title: "Branding Updated",
        description: `${variables.key.replace("_", " ").toLowerCase()} has been updated.`,
      });
    }
  });

  const currencyRatesMutation = useMutation({
    mutationFn: async (rates: { CURRENCY_RATE_LKR: string; CURRENCY_RATE_INR: string; CURRENCY_RATE_EUR: string }) => {
      const promises = Object.entries(rates).map(([key, value]) =>
        apiRequest("POST", "/api/settings", { key, value }).then(res => res.json())
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/CURRENCY_RATE_LKR"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/CURRENCY_RATE_INR"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/CURRENCY_RATE_EUR"] });
      toast({
        title: "Exchange Rates Updated",
        description: "Currency exchange rates have been saved successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Exchange Rates",
        description: error.message || "An error occurred.",
        variant: "destructive",
      });
    }
  });

  const togglePaymentMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: string }) => {
      const res = await apiRequest("POST", "/api/settings", { key, value });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${variables.key}`] });
      toast({
        title: "Setting Updated",
        description: `${variables.key.replace("PAYMENT_", "").replace("_ENABLED", "").toLowerCase()} ${variables.value === "true" ? "enabled" : "disabled"}.`,
      });
    }
  });

  const adminCredentialsMutation = useMutation({
    mutationFn: async (data: { newEmail: string; newPassword: string }) => {
      const res = await apiRequest("POST", "/api/admin/credentials", data);
      return res.json();
    },
    onSuccess: () => {
      setAdminPassword("");
      toast({
        title: "Admin Credentials Updated",
        description: "Your login email and password have been updated successfully.",
      });
    },
    onError: (err: Error) => {
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update admin credentials.",
        variant: "destructive",
      });
    }
  });

  // 2FA status query & mutations
  const { data: twoFactorStatus, isLoading: is2FALoading, refetch: refetch2FA } = useQuery<{ enabled: boolean }>({
    queryKey: ["/api/admin/2fa/status"],
  });

  const setup2FAMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/2fa/setup");
      return res.json();
    },
    onSuccess: (data: { secret: string; qrUrl: string }) => {
      setSetupData(data);
      setShowSetup(true);
      setVerificationCode("");
      toast({
        title: "2FA Setup Initiated",
        description: "Scan the QR code with your authenticator app.",
      });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Setup Failed",
        description: err.message || "Could not initiate 2FA setup.",
      });
    }
  });

  const enable2FAMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest("POST", "/api/admin/2fa/enable", { code });
      return res.json();
    },
    onSuccess: (data: { success: boolean; message: string }) => {
      refetch2FA();
      setShowSetup(false);
      setSetupData(null);
      setVerificationCode("");
      toast({
        title: "2FA Enabled",
        description: data.message || "Two-factor authentication is now active.",
      });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: err.message || "Could not verify code.",
      });
    }
  });

  const disable2FAMutation = useMutation({
    mutationFn: async (code: string) => {
      const res = await apiRequest("POST", "/api/admin/2fa/disable", { code });
      return res.json();
    },
    onSuccess: (data: { success: boolean; message: string }) => {
      refetch2FA();
      setShowDisableForm(false);
      setDisableCode("");
      toast({
        title: "2FA Disabled",
        description: data.message || "Two-factor authentication has been disabled.",
      });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "Disable Failed",
        description: err.message || "Could not disable 2FA.",
      });
    }
  });

  const vapidPublicKeyMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "VAPID_PUBLIC_KEY",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/VAPID_PUBLIC_KEY"] });
      toast({
        title: "VAPID Public Key Updated",
        description: "Browser push notification credentials updated successfully.",
      });
    }
  });

  const vapidPrivateKeyMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "VAPID_PRIVATE_KEY",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/VAPID_PRIVATE_KEY"] });
      toast({
        title: "VAPID Private Key Updated",
        description: "Browser push notification credentials updated successfully.",
      });
    }
  });

  const vapidSubjectMutation = useMutation({
    mutationFn: async (value: string) => {
      const res = await apiRequest("POST", "/api/settings", {
        key: "VAPID_SUBJECT",
        value
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/VAPID_SUBJECT"] });
      toast({
        title: "VAPID Subject Email Updated",
        description: "Browser push notification contact email updated successfully.",
      });
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in">
      <div className="flex items-center justify-between">
        <h1 className="text-5xl font-black tracking-tighter text-white drop-shadow-2xl">
          Settings
        </h1>
        <div className="glass-panel px-6 py-2.5 rounded-full flex items-center gap-3 text-sm font-bold text-white shadow-lg border-white/20">
          <Bot className="w-5 h-5 text-purple-400" />
          Bot Configuration
        </div>
      </div>

      <div className="max-w-2xl">
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Telegram Integration
            </CardTitle>
            <CardDescription className="text-white/60">
              Configure your Telegram Bot token here. Changes are applied instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="token" className="text-sm font-bold text-white/70 uppercase tracking-widest">Bot Token</Label>
              <div className="flex gap-3">
                <Input
                  id="token"
                  type="password"
                  placeholder="Paste your bot token here..."
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                />
                <Button
                  onClick={() => mutation.mutate(token)}
                  disabled={mutation.isPending}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold"
                >
                  {mutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
              <p className="text-xs text-white/40">
                You can get this token from <a href="https://t.me/botfather" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">@BotFather</a>
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <Label htmlFor="broadcast-token" className="text-sm font-bold text-white/70 uppercase tracking-widest">Broadcast Bot Token (Optional)</Label>
              <div className="flex gap-3">
                <Input
                  id="broadcast-token"
                  type="password"
                  placeholder="Separate token for broadcasting..."
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                  value={broadcastToken}
                  onChange={(e) => setBroadcastToken(e.target.value)}
                />
                <Button
                  onClick={() => broadcastMutation.mutate(broadcastToken)}
                  disabled={broadcastMutation.isPending}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  {broadcastMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
              <p className="text-xs text-white/40">
                If provided, this bot will be used for sending broadcasts instead of the main bot.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <Label htmlFor="support-bot-token" className="text-sm font-bold text-white/70 uppercase tracking-widest">Support Bot Token (Optional)</Label>
              <div className="flex gap-3">
                <Input
                  id="support-bot-token"
                  type="password"
                  placeholder="Token for live support bot..."
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                  value={supportBotToken}
                  onChange={(e) => setSupportBotToken(e.target.value)}
                />
                <Button
                  onClick={() => supportBotMutation.mutate(supportBotToken)}
                  disabled={supportBotMutation.isPending}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  {supportBotMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
              <p className="text-xs text-white/40">
                This bot is used to host a live support system. Any user messaging this bot will appear in the admin Live Support panel.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl">
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              AI Support Assistant (Gemini)
            </CardTitle>
            <CardDescription className="text-white/60">
              Configure your Google AI Studio Gemini API Key to power the live support chat bot.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="geminiApiKey" className="text-sm font-bold text-white/70 uppercase tracking-widest">Gemini API Key(s)</Label>
              <CardDescription className="text-white/40">
                You can paste a single key or multiple keys separated by commas, semicolons, or newlines for automatic rotation & failover.
              </CardDescription>
              <div className="flex gap-3">
                <Textarea
                  id="geminiApiKey"
                  placeholder="Paste your Gemini API Keys here (one per line or separated by commas)..."
                  className="glass-panel border-white/10 bg-purple-950/20 text-white min-h-[80px] rounded-xl focus:border-purple-500/50 transition-all font-mono text-xs"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                />
                <Button
                  onClick={() => geminiMutation.mutate(geminiApiKey)}
                  disabled={geminiMutation.isPending}
                  className="h-12 self-end px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold"
                >
                  {geminiMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
              <p className="text-xs text-white/40">
                Get your API key from the <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">Google AI Studio Dashboard</a>.
              </p>
            </div>

            <div className="h-px bg-white/5 my-6" />

            {/* Vertex AI Section */}
            <div className="space-y-2">
              <Label htmlFor="vertexKey" className="text-sm font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Google Cloud Vertex AI (Service Account JSON)
              </Label>
              <CardDescription className="text-white/40">
                Paste your Google Cloud IAM Service Account Credentials JSON here to connect Vertex AI (Gemini model).
              </CardDescription>
              <div className="flex gap-3">
                <Textarea
                  id="vertexKey"
                  placeholder='{"type": "service_account", "project_id": "...", ...}'
                  className="glass-panel border-white/10 bg-purple-950/20 text-white min-h-[120px] rounded-xl focus:border-purple-500/50 transition-all font-mono text-xs"
                  value={vertexKey}
                  onChange={(e) => setVertexKey(e.target.value)}
                />
                <Button
                  onClick={() => vertexMutation.mutate(vertexKey)}
                  disabled={vertexMutation.isPending}
                  className="h-12 self-end px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold"
                >
                  {vertexMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="h-px bg-white/5 my-6" />

            {/* OpenAI / DigitalOcean AI Section */}
            <div className="space-y-4">
              <Label className="text-sm font-bold text-white/70 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                OpenAI / DigitalOcean / Custom Provider
              </Label>
              <CardDescription className="text-white/40">
                Use an OpenAI-compatible API (e.g. DigitalOcean GenAI, DeepSeek, or OpenRouter) as an alternative or failover support bot.
              </CardDescription>

              <div className="space-y-4 pt-2">
                {/* Provider Priority Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="aiProviderPriority" className="text-xs font-bold text-white/70 uppercase tracking-widest">Provider Priority</Label>
                  <div className="flex gap-3">
                    <select
                      id="aiProviderPriority"
                      className="flex-1 h-12 px-4 glass-panel border border-white/10 bg-[#0f0a1a] text-white rounded-xl focus:border-purple-500/50 transition-all text-sm"
                      value={aiProviderPriority}
                      onChange={(e) => setAiProviderPriority(e.target.value)}
                    >
                      <option value="gemini">Prefer Gemini AI Studio first</option>
                      <option value="vertex">Prefer Google Cloud Vertex AI first</option>
                      <option value="openai">Prefer OpenAI/DigitalOcean first</option>
                    </select>
                    <Button
                      onClick={() => brandingMutation.mutate({ key: "AI_PROVIDER_PRIORITY", value: aiProviderPriority })}
                      disabled={brandingMutation.isPending}
                      className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold"
                    >
                      {brandingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                {/* OpenAI / Custom API Key */}
                <div className="space-y-2">
                  <Label htmlFor="openaiApiKey" className="text-xs font-bold text-white/70 uppercase tracking-widest">API Key</Label>
                  <div className="flex gap-3">
                    <Input
                      id="openaiApiKey"
                      type="password"
                      placeholder="Paste your API key here..."
                      className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all text-xs font-mono"
                      value={openaiApiKey}
                      onChange={(e) => setOpenaiApiKey(e.target.value)}
                    />
                    <Button
                      onClick={() => brandingMutation.mutate({ key: "OPENAI_API_KEY", value: openaiApiKey })}
                      disabled={brandingMutation.isPending}
                      className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold"
                    >
                      {brandingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                {/* API Base URL */}
                <div className="space-y-2">
                  <Label htmlFor="openaiApiBase" className="text-xs font-bold text-white/70 uppercase tracking-widest">API Base URL</Label>
                  <div className="flex gap-3">
                    <Input
                      id="openaiApiBase"
                      type="text"
                      placeholder="e.g. https://api.openai.com/v1 or DigitalOcean endpoint"
                      className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all text-sm"
                      value={openaiApiBase}
                      onChange={(e) => setOpenaiApiBase(e.target.value)}
                    />
                    <Button
                      onClick={() => brandingMutation.mutate({ key: "OPENAI_API_BASE", value: openaiApiBase })}
                      disabled={brandingMutation.isPending}
                      className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold"
                    >
                      {brandingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>

                {/* Model Name */}
                <div className="space-y-2">
                  <Label htmlFor="openaiModel" className="text-xs font-bold text-white/70 uppercase tracking-widest">Model Name</Label>
                  <div className="flex gap-3">
                    <Input
                      id="openaiModel"
                      type="text"
                      placeholder="e.g. gpt-4o-mini, deepseek-chat, or your custom model"
                      className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all text-sm"
                      value={openaiModel}
                      onChange={(e) => setOpenaiModel(e.target.value)}
                    />
                    <Button
                      onClick={() => brandingMutation.mutate({ key: "OPENAI_MODEL", value: openaiModel })}
                      disabled={brandingMutation.isPending}
                      className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold"
                    >
                      {brandingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5 my-6" />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">Extra Instructions & Rules</Label>
                <CardDescription className="text-white/40">
                  Upload a text file (.txt) or write custom guidelines to guide the AI chatbot's behavior.
                </CardDescription>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept=".txt"
                    className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all cursor-pointer file:bg-purple-600/30 file:text-white file:border-0 file:h-full file:px-4 file:-ml-3 file:mr-3 file:hover:bg-purple-600/50 file:transition-all"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const text = event.target?.result as string;
                        if (text !== undefined) {
                          setExtraInstructionsText(text);
                          toast({
                            title: "File Loaded",
                            description: `Successfully loaded content from "${file.name}". Click 'Save Instructions & Rules' below to apply.`,
                          });
                        }
                      };
                      reader.readAsText(file);
                    }}
                  />
                </div>

                <Textarea
                  placeholder="Enter extra instructions, store guidelines, custom product rules, or restrictions for the AI bot..."
                  className="glass-panel border-white/10 bg-purple-950/20 text-white min-h-[150px] rounded-xl focus:border-purple-500/50 transition-all"
                  value={extraInstructionsText}
                  onChange={(e) => setExtraInstructionsText(e.target.value)}
                />

                <Button
                  onClick={() => extraInstructionsMutation.mutate(extraInstructionsText)}
                  disabled={extraInstructionsMutation.isPending}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold"
                >
                  {extraInstructionsMutation.isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <Save className="w-5 h-5 mr-2" />
                  )}
                  Save Instructions & Rules
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl">
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Shield className="w-6 h-6 text-purple-400" />
              DigitalOcean Integration
            </CardTitle>
            <CardDescription className="text-white/60">
              Configure your DigitalOcean API key to automate OpenVPN droplet creation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="digitalOceanApiKey" className="text-sm font-bold text-white/70 uppercase tracking-widest">DigitalOcean Personal Access Token</Label>
              <div className="flex gap-3">
                <Input
                  id="digitalOceanApiKey"
                  type="password"
                  placeholder="dop_v1_..."
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all text-xs font-mono"
                  value={digitalOceanApiKey}
                  onChange={(e) => setDigitalOceanApiKey(e.target.value)}
                />
                <Button
                  onClick={() => brandingMutation.mutate({ key: "DIGITALOCEAN_API_KEY", value: digitalOceanApiKey })}
                  disabled={brandingMutation.isPending}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold"
                >
                  {brandingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
              <p className="text-xs text-white/40">
                Create a read/write token in your <a href="https://cloud.digitalocean.com/account/api/tokens" target="_blank" rel="noreferrer" className="text-purple-400 hover:underline">DigitalOcean API settings</a>.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl">
        <Card className="glass-card border-0">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
            <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-purple-400" />
              Multi-Currency Exchange Rates
            </CardTitle>
            <CardDescription className="text-white/40">
              Configure the exchange rates for converting USD value into other currencies (1 USD = Rate).
            </CardDescription>
          </div>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold text-white/70 uppercase tracking-widest">LKR Rate (1 USDT = ? LKR)</Label>
                <Input
                  type="number"
                  step="any"
                  placeholder="15000"
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                  value={currencyRateLkr}
                  onChange={(e) => setCurrencyRateLkr(e.target.value)}
                />
                <p className="text-[10px] text-white/30">Binance P2P rate — LKR per 1 USDT</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-white/70 uppercase tracking-widest">INR Rate</Label>
                <Input
                  type="number"
                  step="any"
                  placeholder="83"
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                  value={currencyRateInr}
                  onChange={(e) => setCurrencyRateInr(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold text-white/70 uppercase tracking-widest">EUR Rate</Label>
                <Input
                  type="number"
                  step="any"
                  placeholder="0.92"
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                  value={currencyRateEur}
                  onChange={(e) => setCurrencyRateEur(e.target.value)}
                />
              </div>
            </div>
            <Button
              onClick={() => currencyRatesMutation.mutate({
                CURRENCY_RATE_LKR: currencyRateLkr,
                CURRENCY_RATE_INR: currencyRateInr,
                CURRENCY_RATE_EUR: currencyRateEur,
              })}
              disabled={currencyRatesMutation.isPending}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold"
            >
              {currencyRatesMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              Save Exchange Rates
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl">
        <Card className="glass-card border-0">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
              <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
                <Lock className="w-6 h-6 text-purple-400" />
                Admin Login Credentials
              </CardTitle>
              <CardDescription className="text-white/40">
                Update the email and password used to access this dashboard.
              </CardDescription>
            </div>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">New Login Email</Label>
              <Input
                type="email"
                placeholder="Enter new admin email..."
                className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">New Login Password</Label>
              <Input
                type="password"
                placeholder="Enter new admin password..."
                className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
            </div>

            <Button
              onClick={() => adminCredentialsMutation.mutate({ newEmail: adminEmail, newPassword: adminPassword })}
              disabled={adminCredentialsMutation.isPending || !adminEmail || !adminPassword}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold"
            >
              {adminCredentialsMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
              Update Credentials
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl">
        <Card className="glass-card border-0">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
            <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <Shield className="w-6 h-6 text-purple-400" />
              Two-Factor Authentication (2FA)
            </CardTitle>
            <CardDescription className="text-white/40">
              Add an extra layer of security to your admin account.
            </CardDescription>
          </div>
          <CardContent className="p-6 space-y-6">
            {is2FALoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
              </div>
            ) : twoFactorStatus?.enabled ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/25 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-400">2FA is Enabled</p>
                    <p className="text-xs text-white/50">Your administrator account is protected with TOTP verification.</p>
                  </div>
                </div>

                {!showDisableForm ? (
                  <Button
                    onClick={() => setShowDisableForm(true)}
                    variant="destructive"
                    className="w-full h-12 rounded-xl font-bold bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 transition-all"
                  >
                    Disable Two-Factor Authentication
                  </Button>
                ) : (
                  <div className="space-y-4 p-4 glass-panel border-red-500/20 rounded-2xl">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-red-200 uppercase tracking-widest">
                        Enter 2FA Code to Disable
                      </Label>
                      <Input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        className="glass-panel border-white/10 bg-red-950/10 text-white h-12 rounded-xl text-center text-lg tracking-[0.3em] font-mono focus:border-red-500/50 transition-all"
                        value={disableCode}
                        onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => setShowDisableForm(false)}
                        variant="outline"
                        className="flex-1 h-12 rounded-xl border-white/10 hover:bg-white/5 font-bold"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => disable2FAMutation.mutate(disableCode)}
                        disabled={disableCode.length !== 6 || disable2FAMutation.isPending}
                        variant="destructive"
                        className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 font-bold"
                      >
                        {disable2FAMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Confirm Disable"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-yellow-400">2FA is Disabled</p>
                    <p className="text-xs text-white/50">Enable 2FA to prevent unauthorized access to the admin dashboard.</p>
                  </div>
                </div>

                {!showSetup ? (
                  <Button
                    onClick={() => setup2FAMutation.mutate()}
                    disabled={setup2FAMutation.isPending}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold transition-all shadow-lg shadow-purple-500/15"
                  >
                    {setup2FAMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Set Up Two-Factor Authentication"}
                  </Button>
                ) : (
                  <div className="space-y-6 p-4 glass-panel border-white/5 rounded-2xl">
                    <div className="flex flex-col items-center gap-4">
                      {setupData?.qrUrl && (
                        <div className="p-3 bg-white rounded-2xl shadow-xl">
                          <img
                            src={setupData.qrUrl}
                            alt="2FA QR Code"
                            className="w-[180px] h-[180px]"
                          />
                        </div>
                      )}
                      
                      <div className="w-full text-center space-y-1">
                        <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Secret Key</p>
                        <code className="px-3 py-1.5 bg-black/40 rounded-lg text-sm text-purple-300 font-mono tracking-wider select-all border border-white/5 inline-block">
                          {setupData?.secret}
                        </code>
                        <p className="text-[10px] text-white/30 pt-1">
                          Scan the QR code or enter the key manually into your app (Google Authenticator, Duo, etc.)
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    <div className="space-y-3">
                      <Label className="text-xs font-bold text-white/70 uppercase tracking-widest">
                        Enter 6-Digit Verification Code
                      </Label>
                      <Input
                        type="text"
                        maxLength={6}
                        placeholder="000000"
                        className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl text-center text-lg tracking-[0.3em] font-mono focus:border-purple-500/50 transition-all"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={() => {
                          setShowSetup(false);
                          setSetupData(null);
                        }}
                        variant="outline"
                        className="flex-1 h-12 rounded-xl border-white/10 hover:bg-white/5 font-bold"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => enable2FAMutation.mutate(verificationCode)}
                        disabled={verificationCode.length !== 6 || enable2FAMutation.isPending}
                        className="flex-1 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold"
                      >
                        {enable2FAMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Verify & Enable"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl">
        <Card className="glass-card border-0">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
            <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <Lock className="w-6 h-6 text-purple-400" />
              PWA Passkey Login Security
            </CardTitle>
            <CardDescription className="text-white/40">
              Set up biometric/device passkey login for fast and secure access on the PWA app.
            </CardDescription>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Device Passkey Credentials</h4>
                  <p className="text-xs text-white/40">
                    {user?.passkeyCredential ? "✅ Passkey is configured on your account." : "❌ No passkey registered yet."}
                  </p>
                </div>
                <Button
                  onClick={registerDevicePasskey}
                  disabled={isPasskeyRegistering}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl transition-all"
                >
                  {isPasskeyRegistering ? <Loader2 className="w-4 h-4 animate-spin" /> : "Register Device Passkey"}
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Force Passkey Login for PWA Admin</h4>
                  <p className="text-xs text-white/40">Restrict login to passkeys only when logging in as Admin</p>
                </div>
                <Button
                  variant={forcePasskeyOnly ? "default" : "outline"}
                  onClick={() => pwaPasskeyOnlyMutation.mutate(!forcePasskeyOnly)}
                  disabled={pwaPasskeyOnlyMutation.isPending}
                  className="rounded-xl px-5"
                >
                  {pwaPasskeyOnlyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : (forcePasskeyOnly ? "Enabled" : "Disabled")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl">
        <Card className="glass-card border-0">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
              <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
                ⚙️ Advanced
              </CardTitle>
              <CardDescription className="text-white/40">
                Configure advanced bot settings.
              </CardDescription>
            </div>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 glass-panel rounded-xl border-white/5">
              <div className="space-y-0.5">
                <Label className="text-white font-bold">Automation Feature</Label>
                <p className="text-xs text-white/40">Enable or disable DigitalOcean automation for users</p>
              </div>
              <Button
                variant={automationEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newValue = !automationEnabled;
                  setAutomationEnabled(newValue);
                  togglePaymentMutation.mutate({ key: "AUTOMATION_ENABLED", value: newValue.toString() });
                }}
                className={automationEnabled ? "bg-green-500 hover:bg-green-600" : "border-white/20"}
              >
                {automationEnabled ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 glass-panel rounded-xl border-white/5">
              <div className="space-y-0.5">
                <Label className="text-white font-bold">Special Offers Feature</Label>
                <p className="text-xs text-white/40">Enable or disable the Special Offers menu in the bot</p>
              </div>
              <Button
                variant={specialOffersEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newValue = !specialOffersEnabled;
                  setSpecialOffersEnabled(newValue);
                  togglePaymentMutation.mutate({ key: "SPECIAL_OFFERS_ENABLED", value: newValue.toString() });
                }}
                className={specialOffersEnabled ? "bg-green-500 hover:bg-green-600" : "border-white/20"}
              >
                {specialOffersEnabled ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="space-y-2 pt-6 border-t border-white/5">
              <Label htmlFor="support" className="text-sm font-bold text-white/70 uppercase tracking-widest">Support Contact Username</Label>
              <div className="flex gap-3">
                <Input
                  id="support"
                  type="text"
                  placeholder="e.g. @rochana_imesh"
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                  value={supportContact}
                  onChange={(e) => setSupportContact(e.target.value)}
                />
                <Button
                  onClick={() => supportMutation.mutate(supportContact)}
                  disabled={supportMutation.isPending}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold"
                >
                  {supportMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
              <p className="text-xs text-white/40">
                The username that will be shown when users click Support in the bot.
              </p>
            </div>

            <div className="space-y-2 pt-6 border-t border-white/5">
              <Label htmlFor="faq" className="text-sm font-bold text-white/70 uppercase tracking-widest">FAQ Content</Label>
              <div className="space-y-3">
                <Textarea
                  id="faq"
                  placeholder="Enter FAQ content..."
                  className="glass-panel border-white/10 bg-purple-950/20 text-white min-h-[150px] rounded-xl focus:border-purple-500/50 transition-all"
                  value={faqText}
                  onChange={(e) => setFaqText(e.target.value)}
                />
                <Button
                  onClick={() => faqMutation.mutate(faqText)}
                  disabled={faqMutation.isPending}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  {faqMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update FAQ Content"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl">
        <Card className="glass-card border-0">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
              <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-purple-400" />
                Branding & Customization
              </CardTitle>
              <CardDescription className="text-white/40">
                Personalize your store and support contact information.
              </CardDescription>
            </div>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">Store Name</Label>
              <div className="flex gap-3">
                <Input
                  placeholder="e.g. Shopeefy Cloud Store"
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                />
                <Button
                  onClick={() => brandingMutation.mutate({ key: "STORE_NAME", value: storeName })}
                  disabled={brandingMutation.isPending}
                  className="h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  {brandingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">Store Theme Color</Label>
              <div className="flex gap-3 items-center">
                <div className="relative flex-1">
                  <Input
                    placeholder="e.g. #a855f7"
                    className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 pl-12 rounded-xl focus:border-purple-500/50 transition-all font-mono"
                    value={themeColor}
                    onChange={(e) => setThemeColor(e.target.value)}
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md overflow-hidden border border-white/20 flex items-center justify-center bg-transparent">
                    <input
                      type="color"
                      className="w-10 h-10 border-0 p-0 cursor-pointer bg-transparent absolute"
                      style={{ transform: "scale(1.5)" }}
                      value={themeColor.startsWith("#") && themeColor.length === 7 ? themeColor : "#a855f7"}
                      onChange={(e) => setThemeColor(e.target.value)}
                    />
                  </div>
                </div>
                <Button
                  onClick={() => brandingMutation.mutate({ key: "THEME_COLOR", value: themeColor })}
                  disabled={brandingMutation.isPending}
                  className="h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  {brandingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">Support Username (Link)</Label>
              <div className="flex gap-3">
                <Input
                  placeholder="e.g. @rochana_imesh"
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                  value={supportUsername}
                  onChange={(e) => setSupportUsername(e.target.value)}
                />
                <Button
                  onClick={() => brandingMutation.mutate({ key: "SUPPORT_USERNAME", value: supportUsername })}
                  disabled={brandingMutation.isPending}
                  className="h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  {brandingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">Support Button Text</Label>
              <div className="flex gap-3">
                <Input
                  placeholder="e.g. Write to Support"
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                  value={supportBtnText}
                  onChange={(e) => setSupportBtnText(e.target.value)}
                />
                <Button
                  onClick={() => brandingMutation.mutate({ key: "SUPPORT_BTN_TEXT", value: supportBtnText })}
                  disabled={brandingMutation.isPending}
                  className="h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  {brandingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">WhatsApp Contact Link</Label>
              <div className="flex gap-3">
                <Input
                  placeholder="e.g. https://wa.me/94760895782"
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                  value={whatsappLink}
                  onChange={(e) => setWhatsappLink(e.target.value)}
                />
                <Button
                  onClick={() => brandingMutation.mutate({ key: "WHATSAPP_CONTACT_LINK", value: whatsappLink })}
                  disabled={brandingMutation.isPending}
                  className="h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  {brandingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">Loading Animation Text</Label>
              <div className="flex gap-3">
                <Input
                  placeholder="e.g. Shopeefy..."
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                  value={loadingText}
                  onChange={(e) => setLoadingText(e.target.value)}
                />
                <Button
                  onClick={() => brandingMutation.mutate({ key: "LOADING_TEXT", value: loadingText })}
                  disabled={brandingMutation.isPending}
                  className="h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  {brandingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">Default Interface Theme (First Visit)</Label>
              <div className="flex gap-3">
                <select
                  className="flex-1 glass-panel border-white/10 bg-purple-950/20 text-white h-12 px-3 rounded-xl focus:border-purple-500/50 transition-all outline-none"
                  value={defaultTheme}
                  onChange={(e) => setDefaultTheme(e.target.value)}
                >
                  <option value="dark" className="bg-purple-950 text-white">Dark Theme (Black)</option>
                  <option value="light" className="bg-purple-950 text-white">Light Theme (White)</option>
                  <option value="system" className="bg-purple-950 text-white">System Preference</option>
                </select>
                <Button
                  onClick={() => brandingMutation.mutate({ key: "DEFAULT_THEME", value: defaultTheme })}
                  disabled={brandingMutation.isPending}
                  className="h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  {brandingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">Minimum Deposit Amount ($)</Label>
              <div className="flex gap-3">
                <Input
                  placeholder="e.g. 1.00"
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                  value={minDepositLimit}
                  onChange={(e) => setMinDepositLimit(e.target.value)}
                />
                <Button
                  onClick={() => brandingMutation.mutate({ key: "MIN_DEPOSIT_LIMIT", value: minDepositLimit })}
                  disabled={brandingMutation.isPending}
                  className="h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  {brandingMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-purple-400" />
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">
                  Developer Credits: <span className="text-purple-400">Rochana Imesh</span> (Immutable)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Service Configuration Card */}
      <div className="max-w-2xl">
        <Card className="glass-card border-0">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
            <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <Mail className="w-6 h-6 text-purple-400" />
              Email Service Configuration
            </CardTitle>
            <CardDescription className="text-white/40">
              Configure your passwordless email login service (Brevo, SendGrid, Resend, or Amazon SES).
            </CardDescription>
          </div>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">Active Email Provider</Label>
              <select
                className="w-full glass-panel border-white/10 bg-purple-950/20 text-white h-12 px-3 rounded-xl focus:border-purple-500/50 transition-all outline-none"
                value={emailService}
                onChange={(e) => {
                  setEmailService(e.target.value);
                  emailServiceMutation.mutate({ key: "EMAIL_SERVICE", value: e.target.value });
                }}
              >
                <option value="none" className="bg-purple-950 text-white">None / Disabled (Console Log Only)</option>
                <option value="resend" className="bg-purple-950 text-white">Resend API</option>
                <option value="sendgrid" className="bg-purple-950 text-white">SendGrid API</option>
                <option value="brevo" className="bg-purple-950 text-white">Brevo API</option>
                <option value="ses" className="bg-purple-950 text-white">Amazon SES (SMTP)</option>
                <option value="smtp" className="bg-purple-950 text-white">Custom / Generic SMTP</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
              <h4 className="text-sm font-bold text-purple-300 flex items-center gap-2">
                💡 99% Inbox Delivery Tip
              </h4>
              <p className="text-xs text-white/60 leading-relaxed">
                To guarantee that your emails land in the recipient's <b>Inbox</b> instead of Spam, ensure you configure the following DNS records on your domain provider:
              </p>
              <ul className="text-xs text-white/50 space-y-1 list-disc list-inside">
                <li>Configure <b>SPF</b> (Sender Policy Framework) record.</li>
                <li>Set up <b>DKIM</b> (DomainKeys Identified Mail) key.</li>
                <li>Configure a <b>DMARC</b> policy (e.g. <code className="text-purple-300">v=DMARC1; p=none;</code>).</li>
                <li>Avoid raw web host SMTPs. For 99% delivery, prefer <b>Resend</b>, <b>SendGrid</b>, or <b>Amazon SES</b>.</li>
              </ul>
            </div>

            <div className="flex items-center justify-between p-4 glass-panel rounded-xl border-white/5 my-4">
              <div className="space-y-0.5">
                <Label className="text-white font-bold">Restrict to Login/Signup Only</Label>
                <p className="text-xs text-white/40">When enabled, emails will only be sent for user login/signup OTP verification. Deposit and order receipt emails will be disabled.</p>
              </div>
              <Button
                variant={emailLoginOnly ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newValue = !emailLoginOnly;
                  setEmailLoginOnly(newValue);
                  emailServiceMutation.mutate({ key: "EMAIL_LOGIN_ONLY", value: newValue.toString() });
                }}
                className={emailLoginOnly ? "bg-purple-500 hover:bg-purple-600" : "border-white/20"}
              >
                {emailLoginOnly ? "Enabled" : "Disabled"}
              </Button>
            </div>

            {emailService !== "none" && (
              <div className="space-y-2 pt-4 border-t border-white/5">
                <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">Sender Email (From)</Label>
                <div className="flex gap-3">
                  <Input
                    placeholder="e.g. noreply@yourdomain.com"
                    className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl"
                    value={emailSender}
                    onChange={(e) => setEmailSender(e.target.value)}
                  />
                  <Button
                    onClick={() => emailServiceMutation.mutate({ key: "EMAIL_SENDER", value: emailSender })}
                    disabled={emailServiceMutation.isPending}
                    className="h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                  >
                    <Save className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-white/40">The email address that users will see as the sender.</p>
              </div>
            )}

            {emailService === "resend" && (
              <div className="space-y-2 pt-4 border-t border-white/5">
                <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">Resend API Key</Label>
                <div className="flex gap-3">
                  <Input
                    type="password"
                    placeholder="re_..."
                    className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl"
                    value={resendApiKey}
                    onChange={(e) => setResendApiKey(e.target.value)}
                  />
                  <Button
                    onClick={() => emailServiceMutation.mutate({ key: "RESEND_API_KEY", value: resendApiKey })}
                    disabled={emailServiceMutation.isPending}
                    className="h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                  >
                    <Save className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {emailService === "sendgrid" && (
              <div className="space-y-2 pt-4 border-t border-white/5">
                <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">SendGrid API Key</Label>
                <div className="flex gap-3">
                  <Input
                    type="password"
                    placeholder="SG._..."
                    className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl"
                    value={sendgridApiKey}
                    onChange={(e) => setSendgridApiKey(e.target.value)}
                  />
                  <Button
                    onClick={() => emailServiceMutation.mutate({ key: "SENDGRID_API_KEY", value: sendgridApiKey })}
                    disabled={emailServiceMutation.isPending}
                    className="h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                  >
                    <Save className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {emailService === "brevo" && (
              <div className="space-y-2 pt-4 border-t border-white/5">
                <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">Brevo API Key (SMTP Key)</Label>
                <div className="flex gap-3">
                  <Input
                    type="password"
                    placeholder="xkeysib-..."
                    className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl"
                    value={brevoApiKey}
                    onChange={(e) => setBrevoApiKey(e.target.value)}
                  />
                  <Button
                    onClick={() => emailServiceMutation.mutate({ key: "BREVO_API_KEY", value: brevoApiKey })}
                    disabled={emailServiceMutation.isPending}
                    className="h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                  >
                    <Save className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}

            {emailService === "ses" && (
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-white/70 uppercase tracking-widest">SMTP Host</Label>
                    <Input
                      placeholder="e.g. email-smtp.us-east-1.amazonaws.com"
                      className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl"
                      value={sesSmtpHost}
                      onChange={(e) => setSesSmtpHost(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-white/70 uppercase tracking-widest">SMTP Port</Label>
                    <Input
                      placeholder="e.g. 587"
                      className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl"
                      value={sesSmtpPort}
                      onChange={(e) => setSesSmtpPort(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white/70 uppercase tracking-widest">SMTP Username</Label>
                  <Input
                    placeholder="Enter SES SMTP Username..."
                    className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl"
                    value={sesSmtpUser}
                    onChange={(e) => setSesSmtpUser(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white/70 uppercase tracking-widest">SMTP Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter SES SMTP Password..."
                    className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl"
                    value={sesSmtpPass}
                    onChange={(e) => setSesSmtpPass(e.target.value)}
                  />
                </div>

                <Button
                  onClick={async () => {
                    await emailServiceMutation.mutateAsync({ key: "SES_SMTP_HOST", value: sesSmtpHost });
                    await emailServiceMutation.mutateAsync({ key: "SES_SMTP_PORT", value: sesSmtpPort });
                    await emailServiceMutation.mutateAsync({ key: "SES_SMTP_USER", value: sesSmtpUser });
                    await emailServiceMutation.mutateAsync({ key: "SES_SMTP_PASS", value: sesSmtpPass });
                    toast({ title: "SES SMTP Updated", description: "Amazon SES SMTP credentials have been updated." });
                  }}
                  disabled={emailServiceMutation.isPending}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold"
                >
                  {emailServiceMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                  Save Amazon SES Credentials
                </Button>
              </div>
            )}

            {emailService === "smtp" && (
              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-white/70 uppercase tracking-widest">SMTP Host</Label>
                    <Input
                      placeholder="e.g. smtp.gmail.com"
                      className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl"
                      value={smtpHost}
                      onChange={(e) => setSmtpHost(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-white/70 uppercase tracking-widest">SMTP Port</Label>
                    <Input
                      placeholder="e.g. 465 or 587"
                      className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl"
                      value={smtpPort}
                      onChange={(e) => setSmtpPort(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white/70 uppercase tracking-widest">SMTP Username</Label>
                  <Input
                    placeholder="Enter SMTP Username..."
                    className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white/70 uppercase tracking-widest">SMTP Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter SMTP Password..."
                    className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl"
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                  />
                </div>

                <Button
                  onClick={async () => {
                    await emailServiceMutation.mutateAsync({ key: "SMTP_HOST", value: smtpHost });
                    await emailServiceMutation.mutateAsync({ key: "SMTP_PORT", value: smtpPort });
                    await emailServiceMutation.mutateAsync({ key: "SMTP_USER", value: smtpUser });
                    await emailServiceMutation.mutateAsync({ key: "SMTP_PASS", value: smtpPass });
                    toast({ title: "SMTP Credentials Updated", description: "Custom SMTP credentials have been updated." });
                  }}
                  disabled={emailServiceMutation.isPending}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold"
                >
                  {emailServiceMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                  Save SMTP Credentials
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Stripe Gateway Configuration Card */}
      <div className="max-w-2xl">
        <Card className="glass-card border-0">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
            <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-purple-400" />
              Stripe Gateway Configuration
            </CardTitle>
            <CardDescription className="text-white/40">
              Configure your Stripe integration for accepting card deposits.
            </CardDescription>
          </div>
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">Stripe Secret Key (sk_live_...)</Label>
              <div className="flex gap-3">
                <Input
                  type="password"
                  placeholder="sk_..."
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl"
                  value={stripeSecretKey}
                  onChange={(e) => setStripeSecretKey(e.target.value)}
                />
                <Button
                  onClick={() => stripeConfigMutation.mutate({ key: "STRIPE_SECRET_KEY", value: stripeSecretKey })}
                  disabled={stripeConfigMutation.isPending}
                  className="h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  <Save className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-white/40">Your Stripe API Secret Key from the Stripe Dashboard.</p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/5">
              <Label className="text-sm font-bold text-white/70 uppercase tracking-widest">Stripe Webhook Secret (whsec_...)</Label>
              <div className="flex gap-3">
                <Input
                  type="password"
                  placeholder="whsec_..."
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl"
                  value={stripeWebhookSecret}
                  onChange={(e) => setStripeWebhookSecret(e.target.value)}
                />
                <Button
                  onClick={() => stripeConfigMutation.mutate({ key: "STRIPE_WEBHOOK_SECRET", value: stripeWebhookSecret })}
                  disabled={stripeConfigMutation.isPending}
                  className="h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  <Save className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-xs text-white/40">Used to verify and authorize webhook deposit events from Stripe.</p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5 flex items-center justify-between">
              <div>
                <Label className="text-sm font-bold text-white/70 uppercase tracking-widest block">Stripe Card Gateway Status</Label>
                <p className="text-xs text-white/40 mt-1">Temporarily lock or unlock Stripe card deposits for all USD users.</p>
              </div>
              <Button
                variant={stripeEnabled ? "default" : "outline"}
                onClick={() => {
                  const newValue = !stripeEnabled;
                  setStripeEnabled(newValue);
                  stripeConfigMutation.mutate({ key: "STRIPE_ENABLED", value: newValue ? "true" : "false" });
                }}
                disabled={stripeConfigMutation.isPending}
                className={stripeEnabled ? "bg-purple-500 hover:bg-purple-600 font-bold px-6 h-12 rounded-xl text-white" : "border-white/20 font-bold px-6 h-12 rounded-xl text-white"}
              >
                {stripeEnabled ? "🔓 Unlocked" : "🔒 Locked"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl">
        <Card className="glass-card border-0">
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
              <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
                <Megaphone className="w-6 h-6 text-purple-400" />
                Admin Notifications
              </CardTitle>
              <CardDescription className="text-white/40">
                Enable native browser push notifications to receive alerts.
              </CardDescription>
            </div>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 glass-panel rounded-xl border-white/5">
              <div className="space-y-0.5">
                <Label className="text-white font-bold">Browser Push Alerts</Label>
                <p className="text-xs text-white/40">
                  {typeof window !== 'undefined' && window.Notification && window.Notification.permission === 'granted'
                    ? "Notifications are enabled for this browser."
                    : "Receive instant alerts for new orders and deposits."}
                </p>
              </div>
              <Button
                variant={typeof window !== 'undefined' && window.Notification && window.Notification.permission === 'granted' ? "default" : "outline"}
                size="sm"
                disabled={typeof window !== 'undefined' && window.Notification && window.Notification.permission === 'granted'}
                onClick={() => window.dispatchEvent(new CustomEvent('trigger-push-setup'))}
                className={typeof window !== 'undefined' && window.Notification && window.Notification.permission === 'granted' ? "bg-green-500 hover:bg-green-600" : "border-purple-500/30 text-purple-400 hover:bg-purple-500/10"}
              >
                {typeof window !== 'undefined' && window.Notification && window.Notification.permission === 'granted' ? "Active" : "Enable Now"}
              </Button>
            </div>

            {typeof window !== 'undefined' && window.Notification && window.Notification.permission === 'granted' && (
              <div className="pt-4 border-t border-white/5">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full glass-panel border-blue-500/30 text-blue-400 hover:bg-blue-500/10 h-10 font-bold"
                  onClick={async () => {
                    try {
                      const res = await apiRequest("POST", "/api/admin/test-push", {});
                      if (res.ok) {
                        toast({
                          title: "Test Sent",
                          description: "Check your notification bar!",
                        });
                      }
                    } catch (err) {
                      toast({
                        title: "Failed to send test",
                        description: "Check server logs.",
                        variant: "destructive"
                      });
                    }
                  }}
                >
                  Send Test Notification
                </Button>
              </div>
            )}

            <div className="h-px bg-white/5 my-6" />

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/70 uppercase tracking-widest font-black">
                  VAPID Subject (Email)
                </Label>
                <CardDescription className="text-white/40">
                  Contact email used to register with push service (e.g., mailto:your-email@example.com)
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="e.g. mailto:your-email@example.com"
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                  value={vapidSubject}
                  onChange={(e) => setVapidSubject(e.target.value)}
                />
                <Button
                  onClick={() => vapidSubjectMutation.mutate(vapidSubject)}
                  disabled={vapidSubjectMutation.isPending}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  {vapidSubjectMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/70 uppercase tracking-widest font-black">
                  VAPID Public Key
                </Label>
                <CardDescription className="text-white/40">
                  Required for client browser to subscribe to push notification service
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Paste VAPID public key..."
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                  value={vapidPublicKey}
                  onChange={(e) => setVapidPublicKey(e.target.value)}
                />
                <Button
                  onClick={() => vapidPublicKeyMutation.mutate(vapidPublicKey)}
                  disabled={vapidPublicKeyMutation.isPending}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  {vapidPublicKeyMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="space-y-2">
                <Label className="text-sm font-bold text-white/70 uppercase tracking-widest font-black">
                  VAPID Private Key
                </Label>
                <CardDescription className="text-white/40">
                  Keep this secure. Used by server to sign sent push notification payloads
                </CardDescription>
              </div>
              <div className="flex gap-3">
                <Input
                  type="password"
                  placeholder="Paste VAPID private key..."
                  className="glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all"
                  value={vapidPrivateKey}
                  onChange={(e) => setVapidPrivateKey(e.target.value)}
                />
                <Button
                  onClick={() => vapidPrivateKeyMutation.mutate(vapidPrivateKey)}
                  disabled={vapidPrivateKeyMutation.isPending}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  {vapidPrivateKeyMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>


      <div className="max-w-2xl">
        <Card className="glass-card border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Lock className="w-6 h-6 text-purple-400" />
              Payment Gateway
            </CardTitle>
            <CardDescription className="text-white/60">
              Configure your payment provider details and enable/disable payment methods.
            </CardDescription>
          </div>

          <CardContent className="p-8 space-y-12">
            {/* Cryptomus Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-purple-400">Cryptomus Integration</h3>
                <Button
                  variant={cryptomusEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newValue = !cryptomusEnabled;
                    setCryptomusEnabled(newValue);
                    togglePaymentMutation.mutate({ key: "PAYMENT_CRYPTOMUS_ENABLED", value: newValue.toString() });
                  }}
                  className={cryptomusEnabled ? "bg-green-500 hover:bg-green-600" : "border-white/20"}
                >
                  {cryptomusEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white/50 uppercase tracking-widest">Cryptomus Merchant ID</Label>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Paste your Cryptomus Merchant ID"
                      className="glass-panel border-white/10 bg-white/5 text-white h-12"
                      value={cryptomusMerchantId}
                      onChange={(e) => setCryptomusMerchantId(e.target.value)}
                    />
                    <Button
                      onClick={() => cryptomusMerchantMutation.mutate(cryptomusMerchantId)}
                      disabled={cryptomusMerchantMutation.isPending}
                      className="h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                    >
                      <Save className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-white/40">Found in your Cryptomus dashboard settings.</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white/50 uppercase tracking-widest">Cryptomus API Key</Label>
                  <div className="flex gap-3">
                    <Input
                      type="password"
                      placeholder="Paste your Cryptomus API key"
                      className="glass-panel border-white/10 bg-white/5 text-white h-12"
                      value={cryptomusApiKey}
                      onChange={(e) => setCryptomusApiKey(e.target.value)}
                    />
                    <Button
                      onClick={() => cryptomusMutation.mutate(cryptomusApiKey)}
                      disabled={cryptomusMutation.isPending}
                      className="h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                    >
                      <Save className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-white/40">Get your API key from Cryptomus dashboard. Keep it secure!</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Binance Pay Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-yellow-500">Binance Pay Integration</h3>
                <Button
                  variant={binanceEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newValue = !binanceEnabled;
                    setBinanceEnabled(newValue);
                    togglePaymentMutation.mutate({ key: "PAYMENT_BINANCE_ENABLED", value: newValue.toString() });
                  }}
                  className={binanceEnabled ? "bg-green-500 hover:bg-green-600" : "border-white/20"}
                >
                  {binanceEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white/50 uppercase tracking-widest">Binance Pay ID</Label>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter your Binance Pay ID..."
                      className="glass-panel border-white/10 bg-white/5 text-white h-12"
                      value={binancePayId}
                      onChange={(e) => setBinancePayId(e.target.value)}
                    />
                    <Button
                      onClick={() => binancePayMutation.mutate(binancePayId)}
                      disabled={binancePayMutation.isPending}
                      className="h-12 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 font-bold"
                    >
                      <Save className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-white/40">Your Binance Pay ID for manual transfers.</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white/50 uppercase tracking-widest">Binance API Key</Label>
                  <div className="flex gap-3">
                    <Input
                      type="password"
                      placeholder="Enter Binance API Key..."
                      className="glass-panel border-white/10 bg-white/5 text-white h-12"
                      value={binanceApiKey}
                      onChange={(e) => setBinanceApiKey(e.target.value)}
                    />
                    <Button
                      onClick={() => binanceApiKeyMutation.mutate(binanceApiKey)}
                      disabled={binanceApiKeyMutation.isPending}
                      className="h-12 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 font-bold"
                    >
                      <Save className="w-5 h-5" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white/50 uppercase tracking-widest">Binance Secret Key</Label>
                  <div className="flex gap-3">
                    <Input
                      type="password"
                      placeholder="Enter Binance Secret Key..."
                      className="glass-panel border-white/10 bg-white/5 text-white h-12"
                      value={binanceSecretKey}
                      onChange={(e) => setBinanceSecretKey(e.target.value)}
                    />
                    <Button
                      onClick={() => binanceSecretKeyMutation.mutate(binanceSecretKey)}
                      disabled={binanceSecretKeyMutation.isPending}
                      className="h-12 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 font-bold"
                    >
                      <Save className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-white/40">Required for automated payment verification.</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* TRC20 Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-red-500">TRC20 (USDT) Integration</h3>
                <Button
                  variant={trc20Enabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newValue = !trc20Enabled;
                    setTrc20Enabled(newValue);
                    togglePaymentMutation.mutate({ key: "PAYMENT_TRC20_ENABLED", value: newValue.toString() });
                  }}
                  className={trc20Enabled ? "bg-green-500 hover:bg-green-600" : "border-white/20"}
                >
                  {trc20Enabled ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white/50 uppercase tracking-widest">TRC20 Wallet Address</Label>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter TRC20 USDT Wallet Address..."
                      className="glass-panel border-white/10 bg-white/5 text-white h-12"
                      value={trc20Wallet}
                      onChange={(e) => setTrc20Wallet(e.target.value)}
                    />
                    <Button
                      onClick={() => trc20WalletMutation.mutate(trc20Wallet)}
                      disabled={trc20WalletMutation.isPending}
                      className="h-12 px-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 font-bold"
                    >
                      <Save className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-white/40">USDT (TRC20) deposit address on the Tron network.</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white/50 uppercase tracking-widest">Verification Mode</Label>
                  <select
                    className="w-full glass-panel border-white/10 bg-purple-950/20 text-white h-12 px-3 rounded-xl focus:border-red-500/50 transition-all outline-none"
                    value={trc20VerificationMode}
                    onChange={(e) => {
                      setTrc20VerificationMode(e.target.value);
                      trc20VerificationModeMutation.mutate(e.target.value);
                    }}
                  >
                    <option value="binance" className="bg-purple-950 text-white">Binance API Keys (Deposit History)</option>
                    <option value="blockchain" className="bg-purple-950 text-white">Blockchain Network (TronScan)</option>
                  </select>
                  <p className="text-[10px] text-white/40">Select the service to use for payment verification.</p>
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5" />

            {/* Aptos Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-cyan-500">Aptos (USDT) Integration</h3>
                <Button
                  variant={aptosEnabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newValue = !aptosEnabled;
                    setAptosEnabled(newValue);
                    togglePaymentMutation.mutate({ key: "PAYMENT_APTOS_ENABLED", value: newValue.toString() });
                  }}
                  className={aptosEnabled ? "bg-green-500 hover:bg-green-600" : "border-white/20"}
                >
                  {aptosEnabled ? "Enabled" : "Disabled"}
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white/50 uppercase tracking-widest">Aptos Wallet Address</Label>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Enter Aptos USDT Wallet Address..."
                      className="glass-panel border-white/10 bg-white/5 text-white h-12"
                      value={aptosWallet}
                      onChange={(e) => setAptosWallet(e.target.value)}
                    />
                    <Button
                      onClick={() => aptosWalletMutation.mutate(aptosWallet)}
                      disabled={aptosWalletMutation.isPending}
                      className="h-12 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 font-bold"
                    >
                      <Save className="w-5 h-5" />
                    </Button>
                  </div>
                  <p className="text-[10px] text-white/40">USDT (Aptos) deposit address on the Aptos network.</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-white/50 uppercase tracking-widest">Verification Mode</Label>
                  <select
                    className="w-full glass-panel border-white/10 bg-purple-950/20 text-white h-12 px-3 rounded-xl focus:border-cyan-500/50 transition-all outline-none"
                    value={aptosVerificationMode}
                    onChange={(e) => {
                      setAptosVerificationMode(e.target.value);
                      aptosVerificationModeMutation.mutate(e.target.value);
                    }}
                  >
                    <option value="binance" className="bg-purple-950 text-white">Binance API Keys (Deposit History)</option>
                    <option value="blockchain" className="bg-purple-950 text-white">Blockchain Network (Aptos Fullnode)</option>
                  </select>
                  <p className="text-[10px] text-white/40">Select the service to use for payment verification.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl">
        <Card className="glass-card border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
            <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
              🔑 Google Login Configuration
            </CardTitle>
            <CardDescription className="text-white/40">
              Configure Google OAuth 2.0 Client credentials to enable Google Sign-In for administrators.
            </CardDescription>
          </div>
          <CardContent className="space-y-6 pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-white/70">Enable Google Login</Label>
                <p className="text-[10px] text-white/40">Allow administrators to log in using Google Single Sign-On.</p>
              </div>
              <Button
                variant={googleLoginEnabled ? "default" : "outline"}
                size="sm"
                onClick={() => setGoogleLoginEnabled(!googleLoginEnabled)}
                className={googleLoginEnabled ? "bg-green-500 hover:bg-green-600 font-bold" : "border-white/20 font-bold"}
              >
                {googleLoginEnabled ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <Label className="text-sm font-bold text-white/70">Google Client ID</Label>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter Google OAuth Client ID..."
                  className="glass-panel border-white/10 bg-white/5 text-white h-12"
                  value={googleClientId}
                  onChange={(e) => setGoogleClientId(e.target.value)}
                />
                <Button
                  onClick={handleSaveGoogleSettings}
                  disabled={googleConfigMutation.isPending}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  {googleConfigMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                </Button>
              </div>
              <p className="text-[10px] text-white/40">Provide the client ID registered in Google Cloud Console OAuth configuration.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-2xl pb-20">
        <Card className="glass-card border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10">
            <CardTitle className="text-2xl font-black tracking-tighter flex items-center gap-3">
              🎬 Tutorial Videos
            </CardTitle>
            <CardDescription className="text-white/40">
              Configure tutorial video links for the bot.
            </CardDescription>
          </div>
          <CardContent className="space-y-8 pt-6">
            <div className="space-y-4">
              <Label className="text-sm font-bold text-white/70">How to Buy Product</Label>
              <div className="flex gap-3">
                <Input
                  placeholder="Video URL..."
                  className="glass-panel border-white/10 bg-white/5 text-white h-12"
                  value={howToBuyVideo}
                  onChange={(e) => setHowToBuyVideo(e.target.value)}
                />
                <Button
                  onClick={() => tutorialBuyMutation.mutate(howToBuyVideo)}
                  disabled={tutorialBuyMutation.isPending}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  <Save className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-white/5">
              <Label className="text-sm font-bold text-white/70">How to Deposit Balance</Label>
              <div className="flex gap-3">
                <Input
                  placeholder="Video URL..."
                  className="glass-panel border-white/10 bg-white/5 text-white h-12"
                  value={howToDepositVideo}
                  onChange={(e) => setHowToDepositVideo(e.target.value)}
                />
                <Button
                  onClick={() => tutorialDepositMutation.mutate(howToDepositVideo)}
                  disabled={tutorialDepositMutation.isPending}
                  className="h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold"
                >
                  <Save className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
