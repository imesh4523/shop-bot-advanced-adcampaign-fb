import { e as useToast, r as reactExports, u as useQuery, f as useMutation, j as jsxRuntimeExports, L as LoaderCircle, B as Button, s as Shield, t as Mail, M as Megaphone, i as apiRequest, q as queryClient } from "./index-CSNdibbs.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardDescription, c as CardContent } from "./card-CahkRcxg.js";
import { I as Input } from "./input-C0x2T16k.js";
import { T as Textarea } from "./textarea-BBRChCyR.js";
import { L as Label } from "./label-BUXAiBlv.js";
import { B as Bot } from "./bot-DivTzGqi.js";
import { S as Sparkles } from "./sparkles-Cdj_5pNm.js";
import { S as Save } from "./save-D1A9d2Qd.js";
import { L as Lock } from "./lock-Ci3IYvU4.js";
import { C as CreditCard } from "./credit-card-BrQF1-NK.js";
function hexToHsl(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_, r2, g2, b2) => r2 + r2 + g2 + g2 + b2 + b2);
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
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return `${h} ${s}% ${l}%`;
}
function SettingsPage() {
  const { toast } = useToast();
  const [token, setToken] = reactExports.useState("");
  const [geminiApiKey, setGeminiApiKey] = reactExports.useState("");
  const [openaiApiKey, setOpenaiApiKey] = reactExports.useState("");
  const [openaiApiBase, setOpenaiApiBase] = reactExports.useState("");
  const [openaiModel, setOpenaiModel] = reactExports.useState("");
  const [aiProviderPriority, setAiProviderPriority] = reactExports.useState("gemini");
  const [extraInstructionsText, setExtraInstructionsText] = reactExports.useState("");
  const [broadcastToken, setBroadcastToken] = reactExports.useState("");
  const [supportBotToken, setSupportBotToken] = reactExports.useState("");
  const [supportContact, setSupportContact] = reactExports.useState("");
  const [cryptomusApiKey, setCryptomusApiKey] = reactExports.useState("");
  const [cryptomusMerchantId, setCryptomusMerchantId] = reactExports.useState("");
  const [binanceApiKey, setBinanceApiKey] = reactExports.useState("");
  const [binanceSecretKey, setBinanceSecretKey] = reactExports.useState("");
  const [binancePayId, setBinancePayId] = reactExports.useState("");
  const [faqText, setFaqText] = reactExports.useState("");
  const [howToBuyVideo, setHowToBuyVideo] = reactExports.useState("");
  const [howToDepositVideo, setHowToDepositVideo] = reactExports.useState("");
  const [storeName, setStoreName] = reactExports.useState("");
  const [themeColor, setThemeColor] = reactExports.useState("#a855f7");
  const [supportUsername, setSupportUsername] = reactExports.useState("");
  const [supportBtnText, setSupportBtnText] = reactExports.useState("");
  const [loadingText, setLoadingText] = reactExports.useState("");
  const [adminEmail, setAdminEmail] = reactExports.useState("");
  const [adminPassword, setAdminPassword] = reactExports.useState("");
  const [vapidPublicKey, setVapidPublicKey] = reactExports.useState("");
  const [vapidPrivateKey, setVapidPrivateKey] = reactExports.useState("");
  const [vapidSubject, setVapidSubject] = reactExports.useState("");
  const [emailService, setEmailService] = reactExports.useState("none");
  const [emailSender, setEmailSender] = reactExports.useState("");
  const [resendApiKey, setResendApiKey] = reactExports.useState("");
  const [sendgridApiKey, setSendgridApiKey] = reactExports.useState("");
  const [brevoApiKey, setBrevoApiKey] = reactExports.useState("");
  const [sesSmtpHost, setSesSmtpHost] = reactExports.useState("");
  const [sesSmtpPort, setSesSmtpPort] = reactExports.useState("");
  const [sesSmtpUser, setSesSmtpUser] = reactExports.useState("");
  const [sesSmtpPass, setSesSmtpPass] = reactExports.useState("");
  const [stripeSecretKey, setStripeSecretKey] = reactExports.useState("");
  const [stripeWebhookSecret, setStripeWebhookSecret] = reactExports.useState("");
  const [minDepositLimit, setMinDepositLimit] = reactExports.useState("1.00");
  const [digitalOceanApiKey, setDigitalOceanApiKey] = reactExports.useState("");
  const [currencyRateLkr, setCurrencyRateLkr] = reactExports.useState("300.0");
  const [currencyRateInr, setCurrencyRateInr] = reactExports.useState("83.0");
  const [currencyRateEur, setCurrencyRateEur] = reactExports.useState("0.92");
  const [showSetup, setShowSetup] = reactExports.useState(false);
  const [setupData, setSetupData] = reactExports.useState(null);
  const [verificationCode, setVerificationCode] = reactExports.useState("");
  const [showDisableForm, setShowDisableForm] = reactExports.useState(false);
  const [disableCode, setDisableCode] = reactExports.useState("");
  const [smtpHost, setSmtpHost] = reactExports.useState("");
  const [smtpPort, setSmtpPort] = reactExports.useState("");
  const [smtpUser, setSmtpUser] = reactExports.useState("");
  const [smtpPass, setSmtpPass] = reactExports.useState("");
  const [emailLoginOnly, setEmailLoginOnly] = reactExports.useState(false);
  const { data: setting, isLoading: isTokenLoading } = useQuery({
    queryKey: ["/api/settings/TELEGRAM_BOT_TOKEN"]
  });
  const { data: geminiSetting, isLoading: isGeminiLoading } = useQuery({
    queryKey: ["/api/settings/GEMINI_API_KEY"]
  });
  const { data: openaiApiSetting } = useQuery({
    queryKey: ["/api/settings/OPENAI_API_KEY"]
  });
  const { data: openaiBaseSetting } = useQuery({
    queryKey: ["/api/settings/OPENAI_API_BASE"]
  });
  const { data: openaiModelSetting } = useQuery({
    queryKey: ["/api/settings/OPENAI_MODEL"]
  });
  const { data: prioritySetting } = useQuery({
    queryKey: ["/api/settings/AI_PROVIDER_PRIORITY"]
  });
  const { data: extraInstructionsSetting, isLoading: isExtraInstructionsLoading } = useQuery({
    queryKey: ["/api/settings/EXTRA_INSTRUCTIONS"]
  });
  const { data: broadcastSetting, isLoading: isBroadcastLoading } = useQuery({
    queryKey: ["/api/settings/BROADCAST_BOT_TOKEN"]
  });
  const { data: supportBotSetting, isLoading: isSupportBotLoading } = useQuery({
    queryKey: ["/api/settings/TELEGRAM_SUPPORT_BOT_TOKEN"]
  });
  const { data: supportSetting, isLoading: isSupportLoading } = useQuery({
    queryKey: ["/api/settings/SUPPORT_CONTACT"]
  });
  const { data: cryptomusSetting, isLoading: isCryptomusLoading } = useQuery({
    queryKey: ["/api/settings/CRYPTOMUS_API_KEY"]
  });
  const { data: merchantSetting, isLoading: isMerchantLoading } = useQuery({
    queryKey: ["/api/settings/CRYPTOMUS_MERCHANT_ID"]
  });
  const { data: binanceSetting, isLoading: isBinanceLoading } = useQuery({
    queryKey: ["/api/settings/BINANCE_PAY_ID"]
  });
  const { data: binanceApiSetting, isLoading: isBinanceApiLoading } = useQuery({
    queryKey: ["/api/settings/BINANCE_API_KEY"]
  });
  const { data: binanceSecretSetting, isLoading: isBinanceSecretLoading } = useQuery({
    queryKey: ["/api/settings/BINANCE_SECRET_KEY"]
  });
  const { data: faqSetting, isLoading: isFaqLoading } = useQuery({
    queryKey: ["/api/settings/faq_content"]
  });
  const { data: howToBuySetting, isLoading: isHowToBuyLoading } = useQuery({
    queryKey: ["/api/settings/TUTORIAL_BUY_VIDEO"]
  });
  const { data: howToDepositSetting, isLoading: isHowToDepositLoading } = useQuery({
    queryKey: ["/api/settings/TUTORIAL_DEPOSIT_VIDEO"]
  });
  const { data: binanceEnabledSetting, isLoading: isBinanceEnabledLoading } = useQuery({
    queryKey: ["/api/settings/PAYMENT_BINANCE_ENABLED"]
  });
  const { data: cryptomusEnabledSetting, isLoading: isCryptomusEnabledLoading } = useQuery({
    queryKey: ["/api/settings/PAYMENT_CRYPTOMUS_ENABLED"]
  });
  const { data: trc20EnabledSetting, isLoading: isTrc20EnabledLoading } = useQuery({
    queryKey: ["/api/settings/PAYMENT_TRC20_ENABLED"]
  });
  const { data: aptosEnabledSetting, isLoading: isAptosEnabledLoading } = useQuery({
    queryKey: ["/api/settings/PAYMENT_APTOS_ENABLED"]
  });
  const { data: trc20WalletSetting, isLoading: isTrc20WalletLoading } = useQuery({
    queryKey: ["/api/settings/TRC20_WALLET_ADDRESS"]
  });
  const { data: aptosWalletSetting, isLoading: isAptosWalletLoading } = useQuery({
    queryKey: ["/api/settings/APTOS_WALLET_ADDRESS"]
  });
  const { data: trc20VerificationModeSetting, isLoading: isTrc20VerificationModeLoading } = useQuery({
    queryKey: ["/api/settings/TRC20_VERIFICATION_MODE"]
  });
  const { data: aptosVerificationModeSetting, isLoading: isAptosVerificationModeLoading } = useQuery({
    queryKey: ["/api/settings/APTOS_VERIFICATION_MODE"]
  });
  const { data: automationEnabledSetting, isLoading: isAutomationEnabledLoading } = useQuery({
    queryKey: ["/api/settings/AUTOMATION_ENABLED"]
  });
  const { data: specialOffersEnabledSetting, isLoading: isSpecialOffersEnabledLoading } = useQuery({
    queryKey: ["/api/settings/SPECIAL_OFFERS_ENABLED"]
  });
  const { data: storeNameSetting, isLoading: isStoreNameLoading } = useQuery({
    queryKey: ["/api/settings/STORE_NAME"]
  });
  const { data: themeColorSetting, isLoading: isThemeColorLoading } = useQuery({
    queryKey: ["/api/settings/THEME_COLOR"]
  });
  const { data: rateLkrSetting } = useQuery({
    queryKey: ["/api/settings/CURRENCY_RATE_LKR"]
  });
  const { data: rateInrSetting } = useQuery({
    queryKey: ["/api/settings/CURRENCY_RATE_INR"]
  });
  const { data: rateEurSetting } = useQuery({
    queryKey: ["/api/settings/CURRENCY_RATE_EUR"]
  });
  const { data: supportUsernameSetting, isLoading: isSupportUsernameLoading } = useQuery({
    queryKey: ["/api/settings/SUPPORT_USERNAME"]
  });
  const { data: supportBtnTextSetting, isLoading: isSupportBtnTextLoading } = useQuery({
    queryKey: ["/api/settings/SUPPORT_BTN_TEXT"]
  });
  const { data: loadingTextSetting, isLoading: isLoadingTextLoading } = useQuery({
    queryKey: ["/api/settings/LOADING_TEXT"]
  });
  const { data: vapidPublicSetting, isLoading: isVapidPublicLoading } = useQuery({
    queryKey: ["/api/settings/VAPID_PUBLIC_KEY"]
  });
  const { data: vapidPrivateSetting, isLoading: isVapidPrivateLoading } = useQuery({
    queryKey: ["/api/settings/VAPID_PRIVATE_KEY"]
  });
  const { data: vapidSubjectSetting, isLoading: isVapidSubjectLoading } = useQuery({
    queryKey: ["/api/settings/VAPID_SUBJECT"]
  });
  const { data: emailServiceSetting, isLoading: isEmailServiceLoading } = useQuery({
    queryKey: ["/api/settings/EMAIL_SERVICE"]
  });
  const { data: emailSenderSetting, isLoading: isEmailSenderLoading } = useQuery({
    queryKey: ["/api/settings/EMAIL_SENDER"]
  });
  const { data: resendApiKeySetting, isLoading: isResendApiKeyLoading } = useQuery({
    queryKey: ["/api/settings/RESEND_API_KEY"]
  });
  const { data: sendgridApiKeySetting, isLoading: isSendgridApiKeyLoading } = useQuery({
    queryKey: ["/api/settings/SENDGRID_API_KEY"]
  });
  const { data: brevoApiKeySetting, isLoading: isBrevoApiKeyLoading } = useQuery({
    queryKey: ["/api/settings/BREVO_API_KEY"]
  });
  const { data: sesHostSetting, isLoading: isSesHostLoading } = useQuery({
    queryKey: ["/api/settings/SES_SMTP_HOST"]
  });
  const { data: sesPortSetting, isLoading: isSesPortLoading } = useQuery({
    queryKey: ["/api/settings/SES_SMTP_PORT"]
  });
  const { data: sesUserSetting, isLoading: isSesUserLoading } = useQuery({
    queryKey: ["/api/settings/SES_SMTP_USER"]
  });
  const { data: sesPassSetting, isLoading: isSesPassLoading } = useQuery({
    queryKey: ["/api/settings/SES_SMTP_PASS"]
  });
  const { data: smtpHostSetting, isLoading: isSmtpHostLoading } = useQuery({
    queryKey: ["/api/settings/SMTP_HOST"]
  });
  const { data: smtpPortSetting, isLoading: isSmtpPortLoading } = useQuery({
    queryKey: ["/api/settings/SMTP_PORT"]
  });
  const { data: smtpUserSetting, isLoading: isSmtpUserLoading } = useQuery({
    queryKey: ["/api/settings/SMTP_USER"]
  });
  const { data: smtpPassSetting, isLoading: isSmtpPassLoading } = useQuery({
    queryKey: ["/api/settings/SMTP_PASS"]
  });
  const { data: emailLoginOnlySetting, isLoading: isEmailLoginOnlyLoading } = useQuery({
    queryKey: ["/api/settings/EMAIL_LOGIN_ONLY"]
  });
  const { data: stripeSecretSetting, isLoading: isStripeSecretLoading } = useQuery({
    queryKey: ["/api/settings/STRIPE_SECRET_KEY"]
  });
  const { data: stripeWebhookSetting, isLoading: isStripeWebhookLoading } = useQuery({
    queryKey: ["/api/settings/STRIPE_WEBHOOK_SECRET"]
  });
  const { data: minDepositSetting, isLoading: isMinDepositLoading } = useQuery({
    queryKey: ["/api/settings/MIN_DEPOSIT_LIMIT"]
  });
  const { data: digitalOceanSetting, isLoading: isDigitalOceanLoading } = useQuery({
    queryKey: ["/api/settings/DIGITALOCEAN_API_KEY"]
  });
  const [googleClientId, setGoogleClientId] = reactExports.useState("");
  const [googleLoginEnabled, setGoogleLoginEnabled] = reactExports.useState(false);
  const { data: googleClientIdSetting, isLoading: isGoogleClientIdLoading } = useQuery({
    queryKey: ["/api/settings/GOOGLE_CLIENT_ID"]
  });
  const { data: googleLoginEnabledSetting, isLoading: isGoogleLoginEnabledLoading } = useQuery({
    queryKey: ["/api/settings/GOOGLE_LOGIN_ENABLED"]
  });
  reactExports.useEffect(() => {
    if (googleClientIdSetting?.value !== void 0) setGoogleClientId(googleClientIdSetting.value);
  }, [googleClientIdSetting]);
  reactExports.useEffect(() => {
    if (googleLoginEnabledSetting?.value !== void 0) setGoogleLoginEnabled(googleLoginEnabledSetting.value === "true");
  }, [googleLoginEnabledSetting]);
  const isLoading = isTokenLoading || isBroadcastLoading || isSupportLoading || isCryptomusLoading || isMerchantLoading || isBinanceLoading || isBinanceApiLoading || isBinanceSecretLoading || isFaqLoading || isHowToBuyLoading || isHowToDepositLoading || isBinanceEnabledLoading || isCryptomusEnabledLoading || isAutomationEnabledLoading || isSpecialOffersEnabledLoading || isStoreNameLoading || isSupportUsernameLoading || isSupportBtnTextLoading || isLoadingTextLoading || isTrc20EnabledLoading || isAptosEnabledLoading || isTrc20WalletLoading || isAptosWalletLoading || isTrc20VerificationModeLoading || isAptosVerificationModeLoading || isGeminiLoading || isExtraInstructionsLoading || isVapidPublicLoading || isVapidPrivateLoading || isVapidSubjectLoading || isEmailServiceLoading || isEmailSenderLoading || isResendApiKeyLoading || isSendgridApiKeyLoading || isBrevoApiKeyLoading || isSesHostLoading || isSesPortLoading || isSesUserLoading || isSesPassLoading || isSmtpHostLoading || isSmtpPortLoading || isSmtpUserLoading || isSmtpPassLoading || isEmailLoginOnlyLoading || isStripeSecretLoading || isStripeWebhookLoading || isMinDepositLoading || isDigitalOceanLoading || isGoogleClientIdLoading || isGoogleLoginEnabledLoading;
  const [binanceEnabled, setBinanceEnabled] = reactExports.useState(true);
  const [cryptomusEnabled, setCryptomusEnabled] = reactExports.useState(true);
  const [trc20Enabled, setTrc20Enabled] = reactExports.useState(false);
  const [aptosEnabled, setAptosEnabled] = reactExports.useState(false);
  const [trc20Wallet, setTrc20Wallet] = reactExports.useState("");
  const [aptosWallet, setAptosWallet] = reactExports.useState("");
  const [trc20VerificationMode, setTrc20VerificationMode] = reactExports.useState("binance");
  const [aptosVerificationMode, setAptosVerificationMode] = reactExports.useState("binance");
  const [automationEnabled, setAutomationEnabled] = reactExports.useState(true);
  const [specialOffersEnabled, setSpecialOffersEnabled] = reactExports.useState(true);
  reactExports.useEffect(() => {
    if (binanceEnabledSetting?.value !== void 0) setBinanceEnabled(binanceEnabledSetting.value === "true");
  }, [binanceEnabledSetting]);
  reactExports.useEffect(() => {
    if (cryptomusEnabledSetting?.value !== void 0) setCryptomusEnabled(cryptomusEnabledSetting.value === "true");
  }, [cryptomusEnabledSetting]);
  reactExports.useEffect(() => {
    if (trc20EnabledSetting?.value !== void 0) setTrc20Enabled(trc20EnabledSetting.value === "true");
  }, [trc20EnabledSetting]);
  reactExports.useEffect(() => {
    if (aptosEnabledSetting?.value !== void 0) setAptosEnabled(aptosEnabledSetting.value === "true");
  }, [aptosEnabledSetting]);
  reactExports.useEffect(() => {
    if (trc20WalletSetting?.value !== void 0) setTrc20Wallet(trc20WalletSetting.value);
  }, [trc20WalletSetting]);
  reactExports.useEffect(() => {
    if (aptosWalletSetting?.value !== void 0) setAptosWallet(aptosWalletSetting.value);
  }, [aptosWalletSetting]);
  reactExports.useEffect(() => {
    if (trc20VerificationModeSetting?.value !== void 0) setTrc20VerificationMode(trc20VerificationModeSetting.value || "binance");
  }, [trc20VerificationModeSetting]);
  reactExports.useEffect(() => {
    if (aptosVerificationModeSetting?.value !== void 0) setAptosVerificationMode(aptosVerificationModeSetting.value || "binance");
  }, [aptosVerificationModeSetting]);
  reactExports.useEffect(() => {
    if (automationEnabledSetting?.value !== void 0) setAutomationEnabled(automationEnabledSetting.value === "true");
  }, [automationEnabledSetting]);
  reactExports.useEffect(() => {
    if (specialOffersEnabledSetting?.value !== void 0) setSpecialOffersEnabled(specialOffersEnabledSetting.value !== "false");
  }, [specialOffersEnabledSetting]);
  reactExports.useEffect(() => {
    if (setting?.value !== void 0) setToken(setting.value);
  }, [setting]);
  reactExports.useEffect(() => {
    if (supportBotSetting?.value !== void 0) setSupportBotToken(supportBotSetting.value);
  }, [supportBotSetting]);
  reactExports.useEffect(() => {
    if (geminiSetting?.value !== void 0) setGeminiApiKey(geminiSetting.value);
  }, [geminiSetting]);
  reactExports.useEffect(() => {
    if (openaiApiSetting?.value !== void 0) setOpenaiApiKey(openaiApiSetting.value);
  }, [openaiApiSetting]);
  reactExports.useEffect(() => {
    if (openaiBaseSetting?.value !== void 0) setOpenaiApiBase(openaiBaseSetting.value);
  }, [openaiBaseSetting]);
  reactExports.useEffect(() => {
    if (openaiModelSetting?.value !== void 0) setOpenaiModel(openaiModelSetting.value);
  }, [openaiModelSetting]);
  reactExports.useEffect(() => {
    if (prioritySetting?.value !== void 0) setAiProviderPriority(prioritySetting.value);
  }, [prioritySetting]);
  reactExports.useEffect(() => {
    if (extraInstructionsSetting?.value !== void 0) setExtraInstructionsText(extraInstructionsSetting.value);
  }, [extraInstructionsSetting]);
  reactExports.useEffect(() => {
    if (broadcastSetting?.value !== void 0) setBroadcastToken(broadcastSetting.value);
  }, [broadcastSetting]);
  reactExports.useEffect(() => {
    if (supportSetting?.value !== void 0) setSupportContact(supportSetting.value);
  }, [supportSetting]);
  reactExports.useEffect(() => {
    if (cryptomusSetting?.value !== void 0) setCryptomusApiKey(cryptomusSetting.value);
  }, [cryptomusSetting]);
  reactExports.useEffect(() => {
    if (merchantSetting?.value !== void 0) setCryptomusMerchantId(merchantSetting.value);
  }, [merchantSetting]);
  reactExports.useEffect(() => {
    if (binanceSetting?.value !== void 0) setBinancePayId(binanceSetting.value);
  }, [binanceSetting]);
  reactExports.useEffect(() => {
    if (binanceApiSetting?.value !== void 0) setBinanceApiKey(binanceApiSetting.value);
  }, [binanceApiSetting]);
  reactExports.useEffect(() => {
    if (binanceSecretSetting?.value !== void 0) setBinanceSecretKey(binanceSecretSetting.value);
  }, [binanceSecretSetting]);
  reactExports.useEffect(() => {
    if (faqSetting?.value !== void 0) setFaqText(faqSetting.value);
  }, [faqSetting]);
  reactExports.useEffect(() => {
    if (howToBuySetting?.value !== void 0) setHowToBuyVideo(howToBuySetting.value);
  }, [howToBuySetting]);
  reactExports.useEffect(() => {
    if (howToDepositSetting?.value !== void 0) setHowToDepositVideo(howToDepositSetting.value);
  }, [howToDepositSetting]);
  reactExports.useEffect(() => {
    if (storeNameSetting?.value !== void 0) setStoreName(storeNameSetting.value);
  }, [storeNameSetting]);
  reactExports.useEffect(() => {
    if (themeColorSetting?.value !== void 0) setThemeColor(themeColorSetting.value || "#a855f7");
  }, [themeColorSetting]);
  reactExports.useEffect(() => {
    if (rateLkrSetting?.value !== void 0) setCurrencyRateLkr(rateLkrSetting.value);
  }, [rateLkrSetting]);
  reactExports.useEffect(() => {
    if (rateInrSetting?.value !== void 0) setCurrencyRateInr(rateInrSetting.value);
  }, [rateInrSetting]);
  reactExports.useEffect(() => {
    if (rateEurSetting?.value !== void 0) setCurrencyRateEur(rateEurSetting.value);
  }, [rateEurSetting]);
  reactExports.useEffect(() => {
    if (supportUsernameSetting?.value !== void 0) setSupportUsername(supportUsernameSetting.value);
  }, [supportUsernameSetting]);
  reactExports.useEffect(() => {
    if (supportBtnTextSetting?.value !== void 0) setSupportBtnText(supportBtnTextSetting.value);
  }, [supportBtnTextSetting]);
  reactExports.useEffect(() => {
    if (loadingTextSetting?.value !== void 0) setLoadingText(loadingTextSetting.value);
  }, [loadingTextSetting]);
  reactExports.useEffect(() => {
    if (vapidPublicSetting?.value !== void 0) setVapidPublicKey(vapidPublicSetting.value);
  }, [vapidPublicSetting]);
  reactExports.useEffect(() => {
    if (vapidPrivateSetting?.value !== void 0) setVapidPrivateKey(vapidPrivateSetting.value);
  }, [vapidPrivateSetting]);
  reactExports.useEffect(() => {
    if (vapidSubjectSetting?.value !== void 0) setVapidSubject(vapidSubjectSetting.value);
  }, [vapidSubjectSetting]);
  reactExports.useEffect(() => {
    if (emailServiceSetting?.value !== void 0) setEmailService(emailServiceSetting.value || "none");
  }, [emailServiceSetting]);
  reactExports.useEffect(() => {
    if (emailSenderSetting?.value !== void 0) setEmailSender(emailSenderSetting.value);
  }, [emailSenderSetting]);
  reactExports.useEffect(() => {
    if (resendApiKeySetting?.value !== void 0) setResendApiKey(resendApiKeySetting.value);
  }, [resendApiKeySetting]);
  reactExports.useEffect(() => {
    if (sendgridApiKeySetting?.value !== void 0) setSendgridApiKey(sendgridApiKeySetting.value);
  }, [sendgridApiKeySetting]);
  reactExports.useEffect(() => {
    if (brevoApiKeySetting?.value !== void 0) setBrevoApiKey(brevoApiKeySetting.value);
  }, [brevoApiKeySetting]);
  reactExports.useEffect(() => {
    if (sesHostSetting?.value !== void 0) setSesSmtpHost(sesHostSetting.value);
  }, [sesHostSetting]);
  reactExports.useEffect(() => {
    if (sesPortSetting?.value !== void 0) setSesSmtpPort(sesPortSetting.value);
  }, [sesPortSetting]);
  reactExports.useEffect(() => {
    if (sesUserSetting?.value !== void 0) setSesSmtpUser(sesUserSetting.value);
  }, [sesUserSetting]);
  reactExports.useEffect(() => {
    if (sesPassSetting?.value !== void 0) setSesSmtpPass(sesPassSetting.value);
  }, [sesPassSetting]);
  reactExports.useEffect(() => {
    if (smtpHostSetting?.value !== void 0) setSmtpHost(smtpHostSetting.value);
  }, [smtpHostSetting]);
  reactExports.useEffect(() => {
    if (smtpPortSetting?.value !== void 0) setSmtpPort(smtpPortSetting.value);
  }, [smtpPortSetting]);
  reactExports.useEffect(() => {
    if (smtpUserSetting?.value !== void 0) setSmtpUser(smtpUserSetting.value);
  }, [smtpUserSetting]);
  reactExports.useEffect(() => {
    if (smtpPassSetting?.value !== void 0) setSmtpPass(smtpPassSetting.value);
  }, [smtpPassSetting]);
  reactExports.useEffect(() => {
    if (emailLoginOnlySetting?.value !== void 0) setEmailLoginOnly(emailLoginOnlySetting.value === "true");
  }, [emailLoginOnlySetting]);
  reactExports.useEffect(() => {
    if (stripeSecretSetting?.value !== void 0) setStripeSecretKey(stripeSecretSetting.value);
  }, [stripeSecretSetting]);
  reactExports.useEffect(() => {
    if (stripeWebhookSetting?.value !== void 0) setStripeWebhookSecret(stripeWebhookSetting.value);
  }, [stripeWebhookSetting]);
  reactExports.useEffect(() => {
    if (minDepositSetting?.value !== void 0) setMinDepositLimit(minDepositSetting.value);
  }, [minDepositSetting]);
  reactExports.useEffect(() => {
    if (digitalOceanSetting?.value !== void 0) setDigitalOceanApiKey(digitalOceanSetting.value);
  }, [digitalOceanSetting]);
  reactExports.useEffect(() => {
    try {
      const color = themeColor && typeof themeColor === "string" && themeColor.trim() !== "" ? themeColor : "#a855f7";
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
    mutationFn: async ({ key, value }) => {
      const res = await apiRequest("POST", "/api/settings", { key, value });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${variables.key}`] });
      toast({
        title: "Google Login Settings Saved",
        description: `${variables.key.replace("_", " ").toLowerCase()} updated successfully.`
      });
    }
  });
  const handleSaveGoogleSettings = () => {
    googleConfigMutation.mutate({ key: "GOOGLE_CLIENT_ID", value: googleClientId });
    googleConfigMutation.mutate({ key: "GOOGLE_LOGIN_ENABLED", value: googleLoginEnabled ? "true" : "false" });
  };
  const emailServiceMutation = useMutation({
    mutationFn: async ({ key, value }) => {
      const res = await apiRequest("POST", "/api/settings", { key, value });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${variables.key}`] });
      toast({
        title: "Email Configuration Saved",
        description: `${variables.key.replace("_", " ").toLowerCase()} updated successfully.`
      });
    }
  });
  const stripeConfigMutation = useMutation({
    mutationFn: async ({ key, value }) => {
      const res = await apiRequest("POST", "/api/settings", { key, value });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${variables.key}`] });
      toast({
        title: "Stripe Credentials Saved",
        description: `${variables.key.replace("_", " ").toLowerCase()} updated successfully.`
      });
    }
  });
  const mutation = useMutation({
    mutationFn: async (value) => {
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
        description: "Telegram Bot has been re-initialized with the new token."
      });
    }
  });
  const broadcastMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "Separate broadcast bot token has been saved."
      });
    }
  });
  const supportBotMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "Telegram Support bot token has been saved and re-initialized."
      });
    }
  });
  const geminiMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "Live support chat bot is now using the updated Gemini API key."
      });
    }
  });
  const extraInstructionsMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "Extra instructions & rules have been updated."
      });
    }
  });
  const supportMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "Support contact has been updated."
      });
    }
  });
  const cryptomusMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "Cryptomus integration is now ready to process payments."
      });
    }
  });
  const cryptomusMerchantMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "Merchant ID has been saved."
      });
    }
  });
  const binancePayMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "Binance Pay ID has been saved."
      });
    }
  });
  const binanceApiKeyMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "Binance API Key has been saved."
      });
    }
  });
  const binanceSecretKeyMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "Binance Secret Key has been saved."
      });
    }
  });
  const trc20WalletMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "TRC20 wallet address has been updated."
      });
    }
  });
  const aptosWalletMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "Aptos wallet address has been updated."
      });
    }
  });
  const trc20VerificationModeMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "TRC20 payment verification mode has been updated."
      });
    }
  });
  const aptosVerificationModeMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "Aptos payment verification mode has been updated."
      });
    }
  });
  const faqMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "FAQ content has been updated for all users."
      });
    }
  });
  const tutorialBuyMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "How to buy video URL has been updated."
      });
    }
  });
  const tutorialDepositMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "How to deposit video URL has been updated."
      });
    }
  });
  const brandingMutation = useMutation({
    mutationFn: async ({ key, value }) => {
      const res = await apiRequest("POST", "/api/settings", { key, value });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${variables.key}`] });
      toast({
        title: "Branding Updated",
        description: `${variables.key.replace("_", " ").toLowerCase()} has been updated.`
      });
    }
  });
  const currencyRatesMutation = useMutation({
    mutationFn: async (rates) => {
      const promises = Object.entries(rates).map(
        ([key, value]) => apiRequest("POST", "/api/settings", { key, value }).then((res) => res.json())
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/CURRENCY_RATE_LKR"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/CURRENCY_RATE_INR"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings/CURRENCY_RATE_EUR"] });
      toast({
        title: "Exchange Rates Updated",
        description: "Currency exchange rates have been saved successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Update Exchange Rates",
        description: error.message || "An error occurred.",
        variant: "destructive"
      });
    }
  });
  const togglePaymentMutation = useMutation({
    mutationFn: async ({ key, value }) => {
      const res = await apiRequest("POST", "/api/settings", { key, value });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/settings/${variables.key}`] });
      toast({
        title: "Setting Updated",
        description: `${variables.key.replace("PAYMENT_", "").replace("_ENABLED", "").toLowerCase()} ${variables.value === "true" ? "enabled" : "disabled"}.`
      });
    }
  });
  const adminCredentialsMutation = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/admin/credentials", data);
      return res.json();
    },
    onSuccess: () => {
      setAdminPassword("");
      toast({
        title: "Admin Credentials Updated",
        description: "Your login email and password have been updated successfully."
      });
    },
    onError: (err) => {
      toast({
        title: "Update Failed",
        description: err.message || "Failed to update admin credentials.",
        variant: "destructive"
      });
    }
  });
  const { data: twoFactorStatus, isLoading: is2FALoading, refetch: refetch2FA } = useQuery({
    queryKey: ["/api/admin/2fa/status"]
  });
  const setup2FAMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/2fa/setup");
      return res.json();
    },
    onSuccess: (data) => {
      setSetupData(data);
      setShowSetup(true);
      setVerificationCode("");
      toast({
        title: "2FA Setup Initiated",
        description: "Scan the QR code with your authenticator app."
      });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Setup Failed",
        description: err.message || "Could not initiate 2FA setup."
      });
    }
  });
  const enable2FAMutation = useMutation({
    mutationFn: async (code) => {
      const res = await apiRequest("POST", "/api/admin/2fa/enable", { code });
      return res.json();
    },
    onSuccess: (data) => {
      refetch2FA();
      setShowSetup(false);
      setSetupData(null);
      setVerificationCode("");
      toast({
        title: "2FA Enabled",
        description: data.message || "Two-factor authentication is now active."
      });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: err.message || "Could not verify code."
      });
    }
  });
  const disable2FAMutation = useMutation({
    mutationFn: async (code) => {
      const res = await apiRequest("POST", "/api/admin/2fa/disable", { code });
      return res.json();
    },
    onSuccess: (data) => {
      refetch2FA();
      setShowDisableForm(false);
      setDisableCode("");
      toast({
        title: "2FA Disabled",
        description: data.message || "Two-factor authentication has been disabled."
      });
    },
    onError: (err) => {
      toast({
        variant: "destructive",
        title: "Disable Failed",
        description: err.message || "Could not disable 2FA."
      });
    }
  });
  const vapidPublicKeyMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "Browser push notification credentials updated successfully."
      });
    }
  });
  const vapidPrivateKeyMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "Browser push notification credentials updated successfully."
      });
    }
  });
  const vapidSubjectMutation = useMutation({
    mutationFn: async (value) => {
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
        description: "Browser push notification contact email updated successfully."
      });
    }
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[400px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-8 h-8 animate-spin text-purple-400" }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-10 animate-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-5xl font-black tracking-tighter text-white drop-shadow-2xl", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass-panel px-6 py-2.5 rounded-full flex items-center gap-3 text-sm font-bold text-white shadow-lg border-white/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-5 h-5 text-purple-400" }),
        "Bot Configuration"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-6 h-6 text-purple-400" }),
          "Telegram Integration"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/60", children: "Configure your Telegram Bot token here. Changes are applied instantly." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "token", className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Bot Token" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "token",
                type: "password",
                placeholder: "Paste your bot token here...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
                value: token,
                onChange: (e) => setToken(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => mutation.mutate(token),
                disabled: mutation.isPending,
                className: "h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold",
                children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/40", children: [
            "You can get this token from ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://t.me/botfather", target: "_blank", rel: "noreferrer", className: "text-purple-400 hover:underline", children: "@BotFather" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "broadcast-token", className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Broadcast Bot Token (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "broadcast-token",
                type: "password",
                placeholder: "Separate token for broadcasting...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
                value: broadcastToken,
                onChange: (e) => setBroadcastToken(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => broadcastMutation.mutate(broadcastToken),
                disabled: broadcastMutation.isPending,
                className: "h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: broadcastMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40", children: "If provided, this bot will be used for sending broadcasts instead of the main bot." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "support-bot-token", className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Support Bot Token (Optional)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "support-bot-token",
                type: "password",
                placeholder: "Token for live support bot...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
                value: supportBotToken,
                onChange: (e) => setSupportBotToken(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => supportBotMutation.mutate(supportBotToken),
                disabled: supportBotMutation.isPending,
                className: "h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: supportBotMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40", children: "This bot is used to host a live support system. Any user messaging this bot will appear in the admin Live Support panel." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-6 h-6 text-purple-400" }),
          "AI Support Assistant (Gemini)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/60", children: "Configure your Google AI Studio Gemini API Key to power the live support chat bot." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "geminiApiKey", className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Gemini API Key(s)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "You can paste a single key or multiple keys separated by commas, semicolons, or newlines for automatic rotation & failover." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "geminiApiKey",
                placeholder: "Paste your Gemini API Keys here (one per line or separated by commas)...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white min-h-[80px] rounded-xl focus:border-purple-500/50 transition-all font-mono text-xs",
                value: geminiApiKey,
                onChange: (e) => setGeminiApiKey(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => geminiMutation.mutate(geminiApiKey),
                disabled: geminiMutation.isPending,
                className: "h-12 self-end px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold",
                children: geminiMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/40", children: [
            "Get your API key from the ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://aistudio.google.com/", target: "_blank", rel: "noreferrer", className: "text-purple-400 hover:underline", children: "Google AI Studio Dashboard" }),
            "."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-white/5 my-6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-5 h-5 text-blue-400" }),
            "OpenAI / DigitalOcean / Custom Provider"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Use an OpenAI-compatible API (e.g. DigitalOcean GenAI, DeepSeek, or OpenRouter) as an alternative or failover support bot." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "aiProviderPriority", className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "Provider Priority" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    id: "aiProviderPriority",
                    className: "flex-1 h-12 px-4 glass-panel border border-white/10 bg-[#0f0a1a] text-white rounded-xl focus:border-purple-500/50 transition-all text-sm",
                    value: aiProviderPriority,
                    onChange: (e) => setAiProviderPriority(e.target.value),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "gemini", children: "Prefer Gemini first (Fallback to OpenAI/DigitalOcean)" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "openai", children: "Prefer OpenAI/DigitalOcean first (Fallback to Gemini)" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => brandingMutation.mutate({ key: "AI_PROVIDER_PRIORITY", value: aiProviderPriority }),
                    disabled: brandingMutation.isPending,
                    className: "h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold",
                    children: brandingMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "openaiApiKey", className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "API Key" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "openaiApiKey",
                    type: "password",
                    placeholder: "Paste your API key here...",
                    className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all text-xs font-mono",
                    value: openaiApiKey,
                    onChange: (e) => setOpenaiApiKey(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => brandingMutation.mutate({ key: "OPENAI_API_KEY", value: openaiApiKey }),
                    disabled: brandingMutation.isPending,
                    className: "h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold",
                    children: brandingMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "openaiApiBase", className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "API Base URL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "openaiApiBase",
                    type: "text",
                    placeholder: "e.g. https://api.openai.com/v1 or DigitalOcean endpoint",
                    className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all text-sm",
                    value: openaiApiBase,
                    onChange: (e) => setOpenaiApiBase(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => brandingMutation.mutate({ key: "OPENAI_API_BASE", value: openaiApiBase }),
                    disabled: brandingMutation.isPending,
                    className: "h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold",
                    children: brandingMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "openaiModel", className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "Model Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    id: "openaiModel",
                    type: "text",
                    placeholder: "e.g. gpt-4o-mini, deepseek-chat, or your custom model",
                    className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all text-sm",
                    value: openaiModel,
                    onChange: (e) => setOpenaiModel(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => brandingMutation.mutate({ key: "OPENAI_MODEL", value: openaiModel }),
                    disabled: brandingMutation.isPending,
                    className: "h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold",
                    children: brandingMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-white/5 my-6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Extra Instructions & Rules" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Upload a text file (.txt) or write custom guidelines to guide the AI chatbot's behavior." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "file",
                accept: ".txt",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all cursor-pointer file:bg-purple-600/30 file:text-white file:border-0 file:h-full file:px-4 file:-ml-3 file:mr-3 file:hover:bg-purple-600/50 file:transition-all",
                onChange: (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const text = event.target?.result;
                    if (text !== void 0) {
                      setExtraInstructionsText(text);
                      toast({
                        title: "File Loaded",
                        description: `Successfully loaded content from "${file.name}". Click 'Save Instructions & Rules' below to apply.`
                      });
                    }
                  };
                  reader.readAsText(file);
                }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                placeholder: "Enter extra instructions, store guidelines, custom product rules, or restrictions for the AI bot...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white min-h-[150px] rounded-xl focus:border-purple-500/50 transition-all",
                value: extraInstructionsText,
                onChange: (e) => setExtraInstructionsText(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                onClick: () => extraInstructionsMutation.mutate(extraInstructionsText),
                disabled: extraInstructionsMutation.isPending,
                className: "w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold",
                children: [
                  extraInstructionsMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5 mr-2" }),
                  "Save Instructions & Rules"
                ]
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-2xl font-bold flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-6 h-6 text-purple-400" }),
          "DigitalOcean Integration"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/60", children: "Configure your DigitalOcean API key to automate OpenVPN droplet creation." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "digitalOceanApiKey", className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "DigitalOcean Personal Access Token" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "digitalOceanApiKey",
              type: "password",
              placeholder: "dop_v1_...",
              className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all text-xs font-mono",
              value: digitalOceanApiKey,
              onChange: (e) => setDigitalOceanApiKey(e.target.value)
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => brandingMutation.mutate({ key: "DIGITALOCEAN_API_KEY", value: digitalOceanApiKey }),
              disabled: brandingMutation.isPending,
              className: "h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold",
              children: brandingMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/40", children: [
          "Create a read/write token in your ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "https://cloud.digitalocean.com/account/api/tokens", target: "_blank", rel: "noreferrer", className: "text-purple-400 hover:underline", children: "DigitalOcean API settings" }),
          "."
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-2xl font-black tracking-tighter flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-6 h-6 text-purple-400" }),
          "Multi-Currency Exchange Rates"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Configure the exchange rates for converting USD value into other currencies (1 USD = Rate)." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-3 gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "LKR Rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "any",
                placeholder: "300",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
                value: currencyRateLkr,
                onChange: (e) => setCurrencyRateLkr(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "INR Rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "any",
                placeholder: "83",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
                value: currencyRateInr,
                onChange: (e) => setCurrencyRateInr(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "EUR Rate" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "number",
                step: "any",
                placeholder: "0.92",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
                value: currencyRateEur,
                onChange: (e) => setCurrencyRateEur(e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => currencyRatesMutation.mutate({
              CURRENCY_RATE_LKR: currencyRateLkr,
              CURRENCY_RATE_INR: currencyRateInr,
              CURRENCY_RATE_EUR: currencyRateEur
            }),
            disabled: currencyRatesMutation.isPending,
            className: "w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold",
            children: [
              currencyRatesMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5 mr-2" }),
              "Save Exchange Rates"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-2xl font-black tracking-tighter flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-6 h-6 text-purple-400" }),
          "Admin Login Credentials"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Update the email and password used to access this dashboard." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "New Login Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "email",
              placeholder: "Enter new admin email...",
              className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
              value: adminEmail,
              onChange: (e) => setAdminEmail(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "New Login Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "password",
              placeholder: "Enter new admin password...",
              className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
              value: adminPassword,
              onChange: (e) => setAdminPassword(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            onClick: () => adminCredentialsMutation.mutate({ newEmail: adminEmail, newPassword: adminPassword }),
            disabled: adminCredentialsMutation.isPending || !adminEmail || !adminPassword,
            className: "w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold",
            children: [
              adminCredentialsMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5 mr-2" }),
              "Update Credentials"
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-2xl font-black tracking-tighter flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-6 h-6 text-purple-400" }),
          "Two-Factor Authentication (2FA)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Add an extra layer of security to your admin account." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-6 space-y-6", children: is2FALoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-6 h-6 animate-spin text-purple-400" }) }) : twoFactorStatus?.enabled ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/25 rounded-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-green-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-green-400", children: "2FA is Enabled" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50", children: "Your administrator account is protected with TOTP verification." })
          ] })
        ] }),
        !showDisableForm ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => setShowDisableForm(true),
            variant: "destructive",
            className: "w-full h-12 rounded-xl font-bold bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 transition-all",
            children: "Disable Two-Factor Authentication"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 p-4 glass-panel border-red-500/20 rounded-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-red-200 uppercase tracking-widest", children: "Enter 2FA Code to Disable" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "text",
                maxLength: 6,
                placeholder: "000000",
                className: "glass-panel border-white/10 bg-red-950/10 text-white h-12 rounded-xl text-center text-lg tracking-[0.3em] font-mono focus:border-red-500/50 transition-all",
                value: disableCode,
                onChange: (e) => setDisableCode(e.target.value.replace(/\D/g, ""))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => setShowDisableForm(false),
                variant: "outline",
                className: "flex-1 h-12 rounded-xl border-white/10 hover:bg-white/5 font-bold",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => disable2FAMutation.mutate(disableCode),
                disabled: disableCode.length !== 6 || disable2FAMutation.isPending,
                variant: "destructive",
                className: "flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 font-bold",
                children: disable2FAMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin mx-auto" }) : "Confirm Disable"
              }
            )
          ] })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4 text-yellow-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-yellow-400", children: "2FA is Disabled" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/50", children: "Enable 2FA to prevent unauthorized access to the admin dashboard." })
          ] })
        ] }),
        !showSetup ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            onClick: () => setup2FAMutation.mutate(),
            disabled: setup2FAMutation.isPending,
            className: "w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold transition-all shadow-lg shadow-purple-500/15",
            children: setup2FAMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin mx-auto" }) : "Set Up Two-Factor Authentication"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6 p-4 glass-panel border-white/5 rounded-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-4", children: [
            setupData?.qrUrl && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-white rounded-2xl shadow-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: setupData.qrUrl,
                alt: "2FA QR Code",
                className: "w-[180px] h-[180px]"
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full text-center space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40 uppercase tracking-widest font-bold", children: "Secret Key" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "px-3 py-1.5 bg-black/40 rounded-lg text-sm text-purple-300 font-mono tracking-wider select-all border border-white/5 inline-block", children: setupData?.secret }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/30 pt-1", children: "Scan the QR code or enter the key manually into your app (Google Authenticator, Duo, etc.)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-white/5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "Enter 6-Digit Verification Code" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "text",
                maxLength: 6,
                placeholder: "000000",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl text-center text-lg tracking-[0.3em] font-mono focus:border-purple-500/50 transition-all",
                value: verificationCode,
                onChange: (e) => setVerificationCode(e.target.value.replace(/\D/g, ""))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => {
                  setShowSetup(false);
                  setSetupData(null);
                },
                variant: "outline",
                className: "flex-1 h-12 rounded-xl border-white/10 hover:bg-white/5 font-bold",
                children: "Cancel"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => enable2FAMutation.mutate(verificationCode),
                disabled: verificationCode.length !== 6 || enable2FAMutation.isPending,
                className: "flex-1 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold",
                children: enable2FAMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin mx-auto" }) : "Verify & Enable"
              }
            )
          ] })
        ] })
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl font-black tracking-tighter flex items-center gap-3", children: "⚙️ Advanced" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Configure advanced bot settings." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 glass-panel rounded-xl border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white font-bold", children: "Automation Feature" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40", children: "Enable or disable DigitalOcean automation for users" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: automationEnabled ? "default" : "outline",
              size: "sm",
              onClick: () => {
                const newValue = !automationEnabled;
                setAutomationEnabled(newValue);
                togglePaymentMutation.mutate({ key: "AUTOMATION_ENABLED", value: newValue.toString() });
              },
              className: automationEnabled ? "bg-green-500 hover:bg-green-600" : "border-white/20",
              children: automationEnabled ? "Enabled" : "Disabled"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 glass-panel rounded-xl border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white font-bold", children: "Special Offers Feature" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40", children: "Enable or disable the Special Offers menu in the bot" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: specialOffersEnabled ? "default" : "outline",
              size: "sm",
              onClick: () => {
                const newValue = !specialOffersEnabled;
                setSpecialOffersEnabled(newValue);
                togglePaymentMutation.mutate({ key: "SPECIAL_OFFERS_ENABLED", value: newValue.toString() });
              },
              className: specialOffersEnabled ? "bg-green-500 hover:bg-green-600" : "border-white/20",
              children: specialOffersEnabled ? "Enabled" : "Disabled"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-6 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "support", className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Support Contact Username" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                id: "support",
                type: "text",
                placeholder: "e.g. @rochana_imesh",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
                value: supportContact,
                onChange: (e) => setSupportContact(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => supportMutation.mutate(supportContact),
                disabled: supportMutation.isPending,
                className: "h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold",
                children: supportMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40", children: "The username that will be shown when users click Support in the bot." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-6 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "faq", className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "FAQ Content" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                id: "faq",
                placeholder: "Enter FAQ content...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white min-h-[150px] rounded-xl focus:border-purple-500/50 transition-all",
                value: faqText,
                onChange: (e) => setFaqText(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => faqMutation.mutate(faqText),
                disabled: faqMutation.isPending,
                className: "w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: faqMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : "Update FAQ Content"
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-2xl font-black tracking-tighter flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "w-6 h-6 text-purple-400" }),
          "Branding & Customization"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Personalize your store and support contact information." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Store Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. Shopeefy Cloud Store",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
                value: storeName,
                onChange: (e) => setStoreName(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => brandingMutation.mutate({ key: "STORE_NAME", value: storeName }),
                disabled: brandingMutation.isPending,
                className: "h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: brandingMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Store Theme Color" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. #a855f7",
                  className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 pl-12 rounded-xl focus:border-purple-500/50 transition-all font-mono",
                  value: themeColor,
                  onChange: (e) => setThemeColor(e.target.value)
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md overflow-hidden border border-white/20 flex items-center justify-center bg-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "color",
                  className: "w-10 h-10 border-0 p-0 cursor-pointer bg-transparent absolute",
                  style: { transform: "scale(1.5)" },
                  value: themeColor.startsWith("#") && themeColor.length === 7 ? themeColor : "#a855f7",
                  onChange: (e) => setThemeColor(e.target.value)
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => brandingMutation.mutate({ key: "THEME_COLOR", value: themeColor }),
                disabled: brandingMutation.isPending,
                className: "h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: brandingMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Support Username (Link)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. @rochana_imesh",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
                value: supportUsername,
                onChange: (e) => setSupportUsername(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => brandingMutation.mutate({ key: "SUPPORT_USERNAME", value: supportUsername }),
                disabled: brandingMutation.isPending,
                className: "h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: brandingMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Support Button Text" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. Write to Support",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
                value: supportBtnText,
                onChange: (e) => setSupportBtnText(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => brandingMutation.mutate({ key: "SUPPORT_BTN_TEXT", value: supportBtnText }),
                disabled: brandingMutation.isPending,
                className: "h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: brandingMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Loading Animation Text" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. Shopeefy...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
                value: loadingText,
                onChange: (e) => setLoadingText(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => brandingMutation.mutate({ key: "LOADING_TEXT", value: loadingText }),
                disabled: brandingMutation.isPending,
                className: "h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: brandingMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Minimum Deposit Amount ($)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. 1.00",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
                value: minDepositLimit,
                onChange: (e) => setMinDepositLimit(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => brandingMutation.mutate({ key: "MIN_DEPOSIT_LIMIT", value: minDepositLimit }),
                disabled: brandingMutation.isPending,
                className: "h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: brandingMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-4 h-4 text-purple-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-white/40 uppercase tracking-widest font-black", children: [
            "Developer Credits: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-purple-400", children: "Rochana Imesh" }),
            " (Immutable)"
          ] })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-2xl font-black tracking-tighter flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "w-6 h-6 text-purple-400" }),
          "Email Service Configuration"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Configure your passwordless email login service (Brevo, SendGrid, Resend, or Amazon SES)." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6 pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Active Email Provider" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              className: "w-full glass-panel border-white/10 bg-purple-950/20 text-white h-12 px-3 rounded-xl focus:border-purple-500/50 transition-all outline-none",
              value: emailService,
              onChange: (e) => {
                setEmailService(e.target.value);
                emailServiceMutation.mutate({ key: "EMAIL_SERVICE", value: e.target.value });
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "none", className: "bg-purple-950 text-white", children: "None / Disabled (Console Log Only)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "resend", className: "bg-purple-950 text-white", children: "Resend API" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "sendgrid", className: "bg-purple-950 text-white", children: "SendGrid API" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "brevo", className: "bg-purple-950 text-white", children: "Brevo API" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ses", className: "bg-purple-950 text-white", children: "Amazon SES (SMTP)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "smtp", className: "bg-purple-950 text-white", children: "Custom / Generic SMTP" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-sm font-bold text-purple-300 flex items-center gap-2", children: "💡 99% Inbox Delivery Tip" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-white/60 leading-relaxed", children: [
            "To guarantee that your emails land in the recipient's ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Inbox" }),
            " instead of Spam, ensure you configure the following DNS records on your domain provider:"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "text-xs text-white/50 space-y-1 list-disc list-inside", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              "Configure ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "SPF" }),
              " (Sender Policy Framework) record."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              "Set up ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "DKIM" }),
              " (DomainKeys Identified Mail) key."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              "Configure a ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "DMARC" }),
              " policy (e.g. ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "text-purple-300", children: "v=DMARC1; p=none;" }),
              ")."
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
              "Avoid raw web host SMTPs. For 99% delivery, prefer ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Resend" }),
              ", ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "SendGrid" }),
              ", or ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: "Amazon SES" }),
              "."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 glass-panel rounded-xl border-white/5 my-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white font-bold", children: "Restrict to Login/Signup Only" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40", children: "When enabled, emails will only be sent for user login/signup OTP verification. Deposit and order receipt emails will be disabled." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: emailLoginOnly ? "default" : "outline",
              size: "sm",
              onClick: () => {
                const newValue = !emailLoginOnly;
                setEmailLoginOnly(newValue);
                emailServiceMutation.mutate({ key: "EMAIL_LOGIN_ONLY", value: newValue.toString() });
              },
              className: emailLoginOnly ? "bg-purple-500 hover:bg-purple-600" : "border-white/20",
              children: emailLoginOnly ? "Enabled" : "Disabled"
            }
          )
        ] }),
        emailService !== "none" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Sender Email (From)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "e.g. noreply@yourdomain.com",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl",
                value: emailSender,
                onChange: (e) => setEmailSender(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => emailServiceMutation.mutate({ key: "EMAIL_SENDER", value: emailSender }),
                disabled: emailServiceMutation.isPending,
                className: "h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40", children: "The email address that users will see as the sender." })
        ] }),
        emailService === "resend" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Resend API Key" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "password",
                placeholder: "re_...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl",
                value: resendApiKey,
                onChange: (e) => setResendApiKey(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => emailServiceMutation.mutate({ key: "RESEND_API_KEY", value: resendApiKey }),
                disabled: emailServiceMutation.isPending,
                className: "h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        emailService === "sendgrid" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "SendGrid API Key" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "password",
                placeholder: "SG._...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl",
                value: sendgridApiKey,
                onChange: (e) => setSendgridApiKey(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => emailServiceMutation.mutate({ key: "SENDGRID_API_KEY", value: sendgridApiKey }),
                disabled: emailServiceMutation.isPending,
                className: "h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        emailService === "brevo" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Brevo API Key (SMTP Key)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "password",
                placeholder: "xkeysib-...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl",
                value: brevoApiKey,
                onChange: (e) => setBrevoApiKey(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => emailServiceMutation.mutate({ key: "BREVO_API_KEY", value: brevoApiKey }),
                disabled: emailServiceMutation.isPending,
                className: "h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        emailService === "ses" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "SMTP Host" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. email-smtp.us-east-1.amazonaws.com",
                  className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl",
                  value: sesSmtpHost,
                  onChange: (e) => setSesSmtpHost(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "SMTP Port" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. 587",
                  className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl",
                  value: sesSmtpPort,
                  onChange: (e) => setSesSmtpPort(e.target.value)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "SMTP Username" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Enter SES SMTP Username...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl",
                value: sesSmtpUser,
                onChange: (e) => setSesSmtpUser(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "SMTP Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "password",
                placeholder: "Enter SES SMTP Password...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl",
                value: sesSmtpPass,
                onChange: (e) => setSesSmtpPass(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: async () => {
                await emailServiceMutation.mutateAsync({ key: "SES_SMTP_HOST", value: sesSmtpHost });
                await emailServiceMutation.mutateAsync({ key: "SES_SMTP_PORT", value: sesSmtpPort });
                await emailServiceMutation.mutateAsync({ key: "SES_SMTP_USER", value: sesSmtpUser });
                await emailServiceMutation.mutateAsync({ key: "SES_SMTP_PASS", value: sesSmtpPass });
                toast({ title: "SES SMTP Updated", description: "Amazon SES SMTP credentials have been updated." });
              },
              disabled: emailServiceMutation.isPending,
              className: "w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold",
              children: [
                emailServiceMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5 mr-2" }),
                "Save Amazon SES Credentials"
              ]
            }
          )
        ] }),
        emailService === "smtp" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "SMTP Host" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. smtp.gmail.com",
                  className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl",
                  value: smtpHost,
                  onChange: (e) => setSmtpHost(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "SMTP Port" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  placeholder: "e.g. 465 or 587",
                  className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl",
                  value: smtpPort,
                  onChange: (e) => setSmtpPort(e.target.value)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "SMTP Username" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Enter SMTP Username...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl",
                value: smtpUser,
                onChange: (e) => setSmtpUser(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/70 uppercase tracking-widest", children: "SMTP Password" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "password",
                placeholder: "Enter SMTP Password...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl",
                value: smtpPass,
                onChange: (e) => setSmtpPass(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: async () => {
                await emailServiceMutation.mutateAsync({ key: "SMTP_HOST", value: smtpHost });
                await emailServiceMutation.mutateAsync({ key: "SMTP_PORT", value: smtpPort });
                await emailServiceMutation.mutateAsync({ key: "SMTP_USER", value: smtpUser });
                await emailServiceMutation.mutateAsync({ key: "SMTP_PASS", value: smtpPass });
                toast({ title: "SMTP Credentials Updated", description: "Custom SMTP credentials have been updated." });
              },
              disabled: emailServiceMutation.isPending,
              className: "w-full h-12 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 font-bold",
              children: [
                emailServiceMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin mr-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5 mr-2" }),
                "Save SMTP Credentials"
              ]
            }
          )
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-2xl font-black tracking-tighter flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-6 h-6 text-purple-400" }),
          "Stripe Gateway Configuration"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Configure your Stripe integration for accepting card deposits." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6 pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Stripe Secret Key (sk_live_...)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "password",
                placeholder: "sk_...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl",
                value: stripeSecretKey,
                onChange: (e) => setStripeSecretKey(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => stripeConfigMutation.mutate({ key: "STRIPE_SECRET_KEY", value: stripeSecretKey }),
                disabled: stripeConfigMutation.isPending,
                className: "h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40", children: "Your Stripe API Secret Key from the Stripe Dashboard." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest", children: "Stripe Webhook Secret (whsec_...)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "password",
                placeholder: "whsec_...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl",
                value: stripeWebhookSecret,
                onChange: (e) => setStripeWebhookSecret(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => stripeConfigMutation.mutate({ key: "STRIPE_WEBHOOK_SECRET", value: stripeWebhookSecret }),
                disabled: stripeConfigMutation.isPending,
                className: "h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40", children: "Used to verify and authorize webhook deposit events from Stripe." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-2xl font-black tracking-tighter flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Megaphone, { className: "w-6 h-6 text-purple-400" }),
          "Admin Notifications"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Enable native browser push notifications to receive alerts." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-4 glass-panel rounded-xl border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-white font-bold", children: "Browser Push Alerts" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/40", children: typeof window !== "undefined" && window.Notification && window.Notification.permission === "granted" ? "Notifications are enabled for this browser." : "Receive instant alerts for new orders and deposits." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: typeof window !== "undefined" && window.Notification && window.Notification.permission === "granted" ? "default" : "outline",
              size: "sm",
              disabled: typeof window !== "undefined" && window.Notification && window.Notification.permission === "granted",
              onClick: () => window.dispatchEvent(new CustomEvent("trigger-push-setup")),
              className: typeof window !== "undefined" && window.Notification && window.Notification.permission === "granted" ? "bg-green-500 hover:bg-green-600" : "border-purple-500/30 text-purple-400 hover:bg-purple-500/10",
              children: typeof window !== "undefined" && window.Notification && window.Notification.permission === "granted" ? "Active" : "Enable Now"
            }
          )
        ] }),
        typeof window !== "undefined" && window.Notification && window.Notification.permission === "granted" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-4 border-t border-white/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            className: "w-full glass-panel border-blue-500/30 text-blue-400 hover:bg-blue-500/10 h-10 font-bold",
            onClick: async () => {
              try {
                const res = await apiRequest("POST", "/api/admin/test-push", {});
                if (res.ok) {
                  toast({
                    title: "Test Sent",
                    description: "Check your notification bar!"
                  });
                }
              } catch (err) {
                toast({
                  title: "Failed to send test",
                  description: "Check server logs.",
                  variant: "destructive"
                });
              }
            },
            children: "Send Test Notification"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-white/5 my-6" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest font-black", children: "VAPID Subject (Email)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Contact email used to register with push service (e.g., mailto:your-email@example.com)" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "text",
                placeholder: "e.g. mailto:your-email@example.com",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
                value: vapidSubject,
                onChange: (e) => setVapidSubject(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => vapidSubjectMutation.mutate(vapidSubject),
                disabled: vapidSubjectMutation.isPending,
                className: "h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: vapidSubjectMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest font-black", children: "VAPID Public Key" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Required for client browser to subscribe to push notification service" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "text",
                placeholder: "Paste VAPID public key...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
                value: vapidPublicKey,
                onChange: (e) => setVapidPublicKey(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => vapidPublicKeyMutation.mutate(vapidPublicKey),
                disabled: vapidPublicKeyMutation.isPending,
                className: "h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: vapidPublicKeyMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-4 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70 uppercase tracking-widest font-black", children: "VAPID Private Key" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Keep this secure. Used by server to sign sent push notification payloads" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                type: "password",
                placeholder: "Paste VAPID private key...",
                className: "glass-panel border-white/10 bg-purple-950/20 text-white h-12 rounded-xl focus:border-purple-500/50 transition-all",
                value: vapidPrivateKey,
                onChange: (e) => setVapidPrivateKey(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => vapidPrivateKeyMutation.mutate(vapidPrivateKey),
                disabled: vapidPrivateKeyMutation.isPending,
                className: "h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: vapidPrivateKeyMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "text-2xl font-bold flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-6 h-6 text-purple-400" }),
          "Payment Gateway"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/60", children: "Configure your payment provider details and enable/disable payment methods." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-8 space-y-12", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-purple-400", children: "Cryptomus Integration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: cryptomusEnabled ? "default" : "outline",
                size: "sm",
                onClick: () => {
                  const newValue = !cryptomusEnabled;
                  setCryptomusEnabled(newValue);
                  togglePaymentMutation.mutate({ key: "PAYMENT_CRYPTOMUS_ENABLED", value: newValue.toString() });
                },
                className: cryptomusEnabled ? "bg-green-500 hover:bg-green-600" : "border-white/20",
                children: cryptomusEnabled ? "Enabled" : "Disabled"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/50 uppercase tracking-widest", children: "Cryptomus Merchant ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Paste your Cryptomus Merchant ID",
                    className: "glass-panel border-white/10 bg-white/5 text-white h-12",
                    value: cryptomusMerchantId,
                    onChange: (e) => setCryptomusMerchantId(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => cryptomusMerchantMutation.mutate(cryptomusMerchantId),
                    disabled: cryptomusMerchantMutation.isPending,
                    className: "h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40", children: "Found in your Cryptomus dashboard settings." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/50 uppercase tracking-widest", children: "Cryptomus API Key" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "password",
                    placeholder: "Paste your Cryptomus API key",
                    className: "glass-panel border-white/10 bg-white/5 text-white h-12",
                    value: cryptomusApiKey,
                    onChange: (e) => setCryptomusApiKey(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => cryptomusMutation.mutate(cryptomusApiKey),
                    disabled: cryptomusMutation.isPending,
                    className: "h-12 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40", children: "Get your API key from Cryptomus dashboard. Keep it secure!" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-white/5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-yellow-500", children: "Binance Pay Integration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: binanceEnabled ? "default" : "outline",
                size: "sm",
                onClick: () => {
                  const newValue = !binanceEnabled;
                  setBinanceEnabled(newValue);
                  togglePaymentMutation.mutate({ key: "PAYMENT_BINANCE_ENABLED", value: newValue.toString() });
                },
                className: binanceEnabled ? "bg-green-500 hover:bg-green-600" : "border-white/20",
                children: binanceEnabled ? "Enabled" : "Disabled"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/50 uppercase tracking-widest", children: "Binance Pay ID" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Enter your Binance Pay ID...",
                    className: "glass-panel border-white/10 bg-white/5 text-white h-12",
                    value: binancePayId,
                    onChange: (e) => setBinancePayId(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => binancePayMutation.mutate(binancePayId),
                    disabled: binancePayMutation.isPending,
                    className: "h-12 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 font-bold",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40", children: "Your Binance Pay ID for manual transfers." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/50 uppercase tracking-widest", children: "Binance API Key" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "password",
                    placeholder: "Enter Binance API Key...",
                    className: "glass-panel border-white/10 bg-white/5 text-white h-12",
                    value: binanceApiKey,
                    onChange: (e) => setBinanceApiKey(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => binanceApiKeyMutation.mutate(binanceApiKey),
                    disabled: binanceApiKeyMutation.isPending,
                    className: "h-12 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 font-bold",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/50 uppercase tracking-widest", children: "Binance Secret Key" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "password",
                    placeholder: "Enter Binance Secret Key...",
                    className: "glass-panel border-white/10 bg-white/5 text-white h-12",
                    value: binanceSecretKey,
                    onChange: (e) => setBinanceSecretKey(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => binanceSecretKeyMutation.mutate(binanceSecretKey),
                    disabled: binanceSecretKeyMutation.isPending,
                    className: "h-12 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 font-bold",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40", children: "Required for automated payment verification." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-white/5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-red-500", children: "TRC20 (USDT) Integration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: trc20Enabled ? "default" : "outline",
                size: "sm",
                onClick: () => {
                  const newValue = !trc20Enabled;
                  setTrc20Enabled(newValue);
                  togglePaymentMutation.mutate({ key: "PAYMENT_TRC20_ENABLED", value: newValue.toString() });
                },
                className: trc20Enabled ? "bg-green-500 hover:bg-green-600" : "border-white/20",
                children: trc20Enabled ? "Enabled" : "Disabled"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/50 uppercase tracking-widest", children: "TRC20 Wallet Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Enter TRC20 USDT Wallet Address...",
                    className: "glass-panel border-white/10 bg-white/5 text-white h-12",
                    value: trc20Wallet,
                    onChange: (e) => setTrc20Wallet(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => trc20WalletMutation.mutate(trc20Wallet),
                    disabled: trc20WalletMutation.isPending,
                    className: "h-12 px-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 font-bold",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40", children: "USDT (TRC20) deposit address on the Tron network." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/50 uppercase tracking-widest", children: "Verification Mode" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  className: "w-full glass-panel border-white/10 bg-purple-950/20 text-white h-12 px-3 rounded-xl focus:border-red-500/50 transition-all outline-none",
                  value: trc20VerificationMode,
                  onChange: (e) => {
                    setTrc20VerificationMode(e.target.value);
                    trc20VerificationModeMutation.mutate(e.target.value);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "binance", className: "bg-purple-950 text-white", children: "Binance API Keys (Deposit History)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "blockchain", className: "bg-purple-950 text-white", children: "Blockchain Network (TronScan)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40", children: "Select the service to use for payment verification." })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px bg-white/5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-cyan-500", children: "Aptos (USDT) Integration" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: aptosEnabled ? "default" : "outline",
                size: "sm",
                onClick: () => {
                  const newValue = !aptosEnabled;
                  setAptosEnabled(newValue);
                  togglePaymentMutation.mutate({ key: "PAYMENT_APTOS_ENABLED", value: newValue.toString() });
                },
                className: aptosEnabled ? "bg-green-500 hover:bg-green-600" : "border-white/20",
                children: aptosEnabled ? "Enabled" : "Disabled"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/50 uppercase tracking-widest", children: "Aptos Wallet Address" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    placeholder: "Enter Aptos USDT Wallet Address...",
                    className: "glass-panel border-white/10 bg-white/5 text-white h-12",
                    value: aptosWallet,
                    onChange: (e) => setAptosWallet(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    onClick: () => aptosWalletMutation.mutate(aptosWallet),
                    disabled: aptosWalletMutation.isPending,
                    className: "h-12 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 font-bold",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40", children: "USDT (Aptos) deposit address on the Aptos network." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs font-bold text-white/50 uppercase tracking-widest", children: "Verification Mode" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "select",
                {
                  className: "w-full glass-panel border-white/10 bg-purple-950/20 text-white h-12 px-3 rounded-xl focus:border-cyan-500/50 transition-all outline-none",
                  value: aptosVerificationMode,
                  onChange: (e) => {
                    setAptosVerificationMode(e.target.value);
                    aptosVerificationModeMutation.mutate(e.target.value);
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "binance", className: "bg-purple-950 text-white", children: "Binance API Keys (Deposit History)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "blockchain", className: "bg-purple-950 text-white", children: "Blockchain Network (Aptos Fullnode)" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40", children: "Select the service to use for payment verification." })
            ] })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl font-black tracking-tighter flex items-center gap-3", children: "🔑 Google Login Configuration" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Configure Google OAuth 2.0 Client credentials to enable Google Sign-In for administrators." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6 pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70", children: "Enable Google Login" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40", children: "Allow administrators to log in using Google Single Sign-On." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: googleLoginEnabled ? "default" : "outline",
              size: "sm",
              onClick: () => setGoogleLoginEnabled(!googleLoginEnabled),
              className: googleLoginEnabled ? "bg-green-500 hover:bg-green-600 font-bold" : "border-white/20 font-bold",
              children: googleLoginEnabled ? "Enabled" : "Disabled"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-6 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70", children: "Google Client ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Enter Google OAuth Client ID...",
                className: "glass-panel border-white/10 bg-white/5 text-white h-12",
                value: googleClientId,
                onChange: (e) => setGoogleClientId(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleSaveGoogleSettings,
                disabled: googleConfigMutation.isPending,
                className: "h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: googleConfigMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-white/40", children: "Provide the client ID registered in Google Cloud Console OAuth configuration." })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-2xl pb-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "glass-card border-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-gradient-to-r from-purple-500/20 to-blue-500/20 p-6 border-b border-white/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-2xl font-black tracking-tighter flex items-center gap-3", children: "🎬 Tutorial Videos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { className: "text-white/40", children: "Configure tutorial video links for the bot." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-8 pt-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70", children: "How to Buy Product" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Video URL...",
                className: "glass-panel border-white/10 bg-white/5 text-white h-12",
                value: howToBuyVideo,
                onChange: (e) => setHowToBuyVideo(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => tutorialBuyMutation.mutate(howToBuyVideo),
                disabled: tutorialBuyMutation.isPending,
                className: "h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4 pt-6 border-t border-white/5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-sm font-bold text-white/70", children: "How to Deposit Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Video URL...",
                className: "glass-panel border-white/10 bg-white/5 text-white h-12",
                value: howToDepositVideo,
                onChange: (e) => setHowToDepositVideo(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: () => tutorialDepositMutation.mutate(howToDepositVideo),
                disabled: tutorialDepositMutation.isPending,
                className: "h-12 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-600 font-bold",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-5 h-5" })
              }
            )
          ] })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  SettingsPage as default
};
