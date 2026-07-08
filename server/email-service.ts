import nodemailer from "nodemailer";
import axios from "axios";
import { storage } from "./storage";

/**
 * Send a generic HTML email using the active email provider
 */
export async function sendGenericEmail(
  toEmail: string,
  subject: string,
  htmlContent: string,
  textContent?: string,
  isCampaign = false
): Promise<boolean> {
  try {
    const emailServiceSetting = await storage.getSetting("EMAIL_SERVICE");
    const service = emailServiceSetting?.value || "none";

    if (service === "none") {
      console.log(`[Email Service] Disabled. Email to ${toEmail} with subject "${subject}" was not sent.`);
      return true;
    }

    const senderSetting = await storage.getSetting("EMAIL_SENDER");
    const senderNameSetting = await storage.getSetting("EMAIL_SENDER_NAME");
    const rawFromEmail = senderSetting?.value || "noreply@shopeefy.com";
    const senderDisplayName = senderNameSetting?.value?.trim() || "Shopeefy";
    // Format: "Display Name <email@domain.com>" so inbox shows the brand name
    const fromEmail = `${senderDisplayName} <${rawFromEmail}>`;

    // Auto-generate textFallback from htmlContent if not provided (Spam prevention check)
    const textFallback = textContent || htmlContent
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Setup headers (Spam prevention check)
    const supportUsername = (await storage.getSetting("SUPPORT_USERNAME"))?.value || "support";
    const supportLink = `https://t.me/${supportUsername}`;
    
    const customHeaders: Record<string, string> = {
      "X-Mailer": "Shopeefy Mailer",
      "X-Auto-Response-Suppress": "All"
    };

    if (isCampaign) {
      customHeaders["List-Unsubscribe"] = `<${supportLink}>`;
      customHeaders["Precedence"] = "bulk";
    }

    console.log(`[Email Service] Sending email to ${toEmail} via ${service.toUpperCase()}...`);

    if (service === "resend") {
      const apiKey = (await storage.getSetting("RESEND_API_KEY"))?.value;
      if (!apiKey) throw new Error("Resend API Key is not configured.");

      const response = await axios.post(
        "https://api.resend.com/emails",
        {
          from: fromEmail,
          to: [toEmail],
          subject: subject,
          html: htmlContent,
          text: textFallback,
          headers: customHeaders
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`[Email Service] Resend sent successfully. Status: ${response.status}`);
      return true;
    }

    if (service === "sendgrid") {
      const apiKey = (await storage.getSetting("SENDGRID_API_KEY"))?.value;
      if (!apiKey) throw new Error("SendGrid API Key is not configured.");

      const response = await axios.post(
        "https://api.sendgrid.com/v3/mail/send",
        {
          personalizations: [{ to: [{ email: toEmail }] }],
          from: { email: fromEmail },
          subject: subject,
          content: [
            { type: "text/plain", value: textFallback },
            { type: "text/html", value: htmlContent }
          ],
          headers: customHeaders
        },
        {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`[Email Service] SendGrid sent successfully. Status: ${response.status}`);
      return true;
    }

    if (service === "brevo") {
      const apiKey = (await storage.getSetting("BREVO_API_KEY"))?.value;
      if (!apiKey) throw new Error("Brevo API Key is not configured.");

      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: { email: fromEmail },
          to: [{ email: toEmail }],
          subject: subject,
          htmlContent: htmlContent,
          textContent: textFallback,
          headers: customHeaders
        },
        {
          headers: {
            "api-key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`[Email Service] Brevo sent successfully. Status: ${response.status}`);
      return true;
    }

    if (service === "ses") {
      const smtpHost = (await storage.getSetting("SES_SMTP_HOST"))?.value || "email-smtp.us-east-1.amazonaws.com";
      const smtpPort = parseInt((await storage.getSetting("SES_SMTP_PORT"))?.value || "587");
      const smtpUser = (await storage.getSetting("SES_SMTP_USER"))?.value;
      const smtpPass = (await storage.getSetting("SES_SMTP_PASS"))?.value;

      if (!smtpUser || !smtpPass) {
        throw new Error("Amazon SES SMTP credentials are not configured.");
      }

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: fromEmail,
        to: toEmail,
        subject: subject,
        text: textFallback,
        html: htmlContent,
        headers: customHeaders
      });

      console.log("[Email Service] Amazon SES (SMTP) sent successfully.");
      return true;
    }

    if (service === "smtp") {
      const smtpHost = (await storage.getSetting("SMTP_HOST"))?.value;
      const smtpPort = parseInt((await storage.getSetting("SMTP_PORT"))?.value || "587");
      const smtpUser = (await storage.getSetting("SMTP_USER"))?.value;
      const smtpPass = (await storage.getSetting("SMTP_PASS"))?.value;

      if (!smtpHost || !smtpUser || !smtpPass) {
        throw new Error("Generic SMTP credentials are not fully configured.");
      }

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: fromEmail,
        to: toEmail,
        subject: subject,
        text: textFallback,
        html: htmlContent,
        headers: customHeaders
      });

      console.log("[Email Service] Generic SMTP sent successfully.");
      return true;
    }

    throw new Error(`Unsupported email service configured: ${service}`);
  } catch (error: any) {
    console.error(`[Email Service] Failed to send email to ${toEmail}:`, error.response?.data || error.message || error);
    return false;
  }
}

/**
 * Sends a passwordless OTP verification code email using the configured email service
 * @param toEmail Recipient email address
 * @param code The 6-digit verification OTP code
 */
export async function sendOtpEmail(toEmail: string, code: string): Promise<boolean> {
  const subject = "Your Verification Code - Shopeefy";
  const htmlContent = `
    <div style="font-family: sans-serif; padding: 25px; max-width: 550px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 20px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #8b5cf6; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.025em; font-style: italic;">SHOPEEFY</h2>
        <p style="color: #6b7280; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px; margin-bottom: 0;">Shop Bot Security</p>
      </div>
      <hr style="border: 0; border-top: 1px solid #f3f4f6; margin-bottom: 20px;" />
      <p style="color: #374151; font-size: 14px; font-weight: 500;">Hello,</p>
      <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">You requested a verification code to access your Shopeefy shop profile. Use the verification code below to login:</p>
      <div style="font-size: 36px; font-weight: 900; text-align: center; letter-spacing: 6px; margin: 30px 0; color: #1f2937; background-color: #f5f3ff; padding: 15px; border-radius: 12px; border: 1px dashed #c084fc;">
        ${code}
      </div>
      <p style="color: #ef4444; font-size: 12px; font-weight: 600; text-align: center;">* This code will expire in 10 minutes.</p>
      <hr style="border: 0; border-top: 1px solid #f3f4f6; margin: 25px 0 15px 0;" />
      <p style="font-size: 11px; color: #9ca3af; text-align: center; margin: 0;">If you did not request this email, please ignore this message.</p>
    </div>
  `;

  return sendGenericEmail(toEmail, subject, htmlContent, `Your verification code is: ${code}`);
}

/**
 * Sends a purchase confirmation email with credentials list
 */
export async function sendPurchaseConfirmationEmail(
  toEmail: string,
  userName: string,
  productName: string,
  quantity: number,
  totalPriceUSD: number,
  credentialsList: string[]
): Promise<boolean> {
  const loginOnlySetting = await storage.getSetting("EMAIL_LOGIN_ONLY");
  if (loginOnlySetting?.value === "true") {
    console.log(`[Email Service] Suppressed purchase confirmation email to ${toEmail} (EMAIL_LOGIN_ONLY active).`);
    return true;
  }

  const subject = `Order Confirmed: ${productName} - Shopeefy`;

  const credentialsListHtml = credentialsList.map((cred, idx) => {
    const num = (idx + 1).toString().padStart(2, '0');
    return `
      <div style="background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px; margin-bottom: 8px; font-family: monospace; font-size: 14px; color: #38bdf8;">
        <span style="color: #64748b; margin-right: 10px; font-weight: bold;">[Item ${num}]</span>
        <code>${cred}</code>
      </div>
    `;
  }).join("");

  const htmlContent = `
    <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 24px; border: 1px solid #1e293b; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; font-weight: 800; margin: 0; display: inline-block;">Shopeefy</h1>
        <p style="color: #94a3b8; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px; font-weight: bold;">Order Confirmed</p>
      </div>
      
      <div style="background-color: #1e293b; border-radius: 16px; padding: 24px; border: 1px solid #334155; margin-bottom: 24px;">
        <h2 style="font-size: 18px; margin-top: 0; color: #e2e8f0; font-weight: 700;">Hello ${userName},</h2>
        <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">Thank you for your order! Your payment was verified and processed successfully. Here is your purchase summary:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
          <tr>
            <td style="color: #94a3b8; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #334155;">Product:</td>
            <td style="color: #f1f5f9; padding: 8px 0; font-size: 14px; font-weight: 700; text-align: right; border-bottom: 1px solid #334155;">${productName}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #334155;">Quantity:</td>
            <td style="color: #f1f5f9; padding: 8px 0; font-size: 14px; font-weight: 700; text-align: right; border-bottom: 1px solid #334155;">${quantity} pcs</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #334155;">Total Price:</td>
            <td style="color: #38bdf8; padding: 8px 0; font-size: 16px; font-weight: 700; text-align: right; border-bottom: 1px solid #334155;">$${totalPriceUSD.toFixed(2)}</td>
          </tr>
        </table>
      </div>
      
      <div style="background-color: #1a1e36; border-radius: 16px; padding: 24px; border: 1px dashed #6366f1; margin-bottom: 24px;">
        <h3 style="font-size: 16px; color: #a78bfa; margin-top: 0; margin-bottom: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">🔑 Purchased Credentials</h3>
        <div style="max-height: 300px; overflow-y: auto;">
          ${credentialsListHtml}
        </div>
      </div>
      
      <div style="text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 30px;">
        <p style="font-size: 12px; color: #64748b; line-height: 1.6; margin: 0;">
          Need help? Click "Support" inside the Shop Bot.<br/>
          Developer Credits: <span style="color: #8b5cf6; font-weight: 700;">Rochana Imesh</span>
        </p>
      </div>
    </div>
  `;

  return sendGenericEmail(toEmail, subject, htmlContent);
}

/**
 * Sends a deposit confirmation email
 */
export async function sendDepositConfirmationEmail(
  toEmail: string,
  userName: string,
  amountUSD: number,
  paymentMethod: string,
  currentBalanceUSD: number,
  txId?: string
): Promise<boolean> {
  const loginOnlySetting = await storage.getSetting("EMAIL_LOGIN_ONLY");
  if (loginOnlySetting?.value === "true") {
    console.log(`[Email Service] Suppressed deposit confirmation email to ${toEmail} (EMAIL_LOGIN_ONLY active).`);
    return true;
  }

  const subject = `Deposit Confirmed: +$${amountUSD.toFixed(2)} - Shopeefy`;

  const txIdHtml = txId
    ? `<tr>
        <td style="color: #94a3b8; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #334155;">Transaction ID:</td>
        <td style="color: #cbd5e1; padding: 8px 0; font-size: 13px; font-family: monospace; text-align: right; border-bottom: 1px solid #334155;">${txId}</td>
       </tr>`
    : "";

  const htmlContent = `
    <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 24px; border: 1px solid #1e293b; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; font-weight: 800; margin: 0; display: inline-block;">Shopeefy</h1>
        <p style="color: #34d399; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px; font-weight: bold;">Deposit Confirmed</p>
      </div>
      
      <div style="background-color: #1e293b; border-radius: 16px; padding: 24px; border: 1px solid #334155; margin-bottom: 24px;">
        <h2 style="font-size: 18px; margin-top: 0; color: #e2e8f0; font-weight: 700;">Hello ${userName},</h2>
        <p style="color: #94a3b8; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">Your account has been successfully credited with the deposited funds. Here are the details:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
          <tr>
            <td style="color: #94a3b8; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #334155;">Amount Credited:</td>
            <td style="color: #34d399; padding: 8px 0; font-size: 16px; font-weight: 700; text-align: right; border-bottom: 1px solid #334155;">+$${amountUSD.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #334155;">Payment Method:</td>
            <td style="color: #f1f5f9; padding: 8px 0; font-size: 14px; font-weight: 700; text-align: right; text-transform: uppercase; border-bottom: 1px solid #334155;">${paymentMethod}</td>
          </tr>
          ${txIdHtml}
          <tr>
            <td style="color: #94a3b8; padding: 8px 0; font-size: 14px; border-bottom: 1px solid #334155;">Current Balance:</td>
            <td style="color: #38bdf8; padding: 8px 0; font-size: 16px; font-weight: 700; text-align: right; border-bottom: 1px solid #334155;">$${currentBalanceUSD.toFixed(2)}</td>
          </tr>
        </table>
      </div>
      
      <div style="text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 30px;">
        <p style="font-size: 12px; color: #64748b; line-height: 1.6; margin: 0;">
          Thank you for choosing Shopeefy!<br/>
          Developer Credits: <span style="color: #8b5cf6; font-weight: 700;">Rochana Imesh</span>
        </p>
      </div>
    </div>
  `;

  return sendGenericEmail(toEmail, subject, htmlContent);
}

/**
 * Sends a custom broadcast email message wrapped in a professional template layout
 */
export async function sendCampaignEmail(toEmail: string, subject: string, customMessage: string): Promise<boolean> {
  const loginOnlySetting = await storage.getSetting("EMAIL_LOGIN_ONLY");
  if (loginOnlySetting?.value === "true") {
    console.log(`[Email Service] Suppressed campaign email to ${toEmail} (EMAIL_LOGIN_ONLY active).`);
    return true;
  }

  const supportUsername = (await storage.getSetting("SUPPORT_USERNAME"))?.value || "support";
  const supportLink = `https://t.me/${supportUsername}`;
  
  const htmlContent = `
    <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 40px 20px; max-width: 600px; margin: 0 auto; border-radius: 24px; border: 1px solid #1e293b; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 1px solid #334155; padding-bottom: 20px;">
        <h1 style="background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 32px; font-weight: 800; margin: 0; display: inline-block;">Shopeefy</h1>
        <p style="color: #94a3b8; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px; font-weight: bold;">Important Announcement</p>
      </div>
      
      <div style="color: #e2e8f0; font-size: 16px; line-height: 1.8; margin-bottom: 30px;">
        ${customMessage}
      </div>
      
      <div style="text-align: center; border-top: 1px solid #1e293b; padding-top: 20px; margin-top: 30px;">
        <p style="font-size: 11px; color: #64748b; line-height: 1.6; margin: 0;">
          You received this email because you are a registered user of Shopeefy.<br/>
          To stop receiving these emails, contact support: <a href="${supportLink}" style="color: #8b5cf6; text-decoration: underline;">Support Chat</a><br/>
          Developer Credits: <span style="color: #8b5cf6; font-weight: 700;">Rochana Imesh</span>
        </p>
      </div>
    </div>
  `;

  const textFallback = `${subject}\n\n${customMessage.replace(/<[^>]+>/g, '')}\n\nTo unsubscribe, contact support: ${supportLink}`;
  return sendGenericEmail(toEmail, subject, htmlContent, textFallback, true);
}
