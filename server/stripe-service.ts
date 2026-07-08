import Stripe from "stripe";
import { storage } from "./storage";

// Keeping the export signature to avoid breaking imports in other files
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
export const isStripeConfigured = true; // Set to true to allow dynamic DB configuration check on demand

export interface CheckoutSessionOptions {
  userId: number;
  amountCents: number;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Creates a Stripe Checkout Session.
 * Queries Stripe Secret Key from database settings first, falling back to process.env.
 */
export async function createStripeSession(options: CheckoutSessionOptions): Promise<{ url: string; id: string }> {
  // Query Stripe Secret Key from DB first, fall back to environment variable
  const dbSecretKey = await storage.getSetting("STRIPE_SECRET_KEY");
  const secretKey = dbSecretKey?.value || process.env.STRIPE_SECRET_KEY || "";

  const chargedAmountCents = Math.round(options.amountCents * 1.045 + 30);

  if (secretKey) {
    try {
      const stripeInstance = new Stripe(secretKey, {} as any);

      const session = await stripeInstance.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Shop Balance Deposit",
                description: `Deposit of $${(options.amountCents / 100).toFixed(2)} into user balance (includes 4.5% + $0.30 processing fee)`,
              },
              unit_amount: chargedAmountCents,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        metadata: {
          userId: options.userId.toString(),
          amount: options.amountCents.toString(),
        },
        success_url: options.successUrl,
        cancel_url: options.cancelUrl,
      });

      return { url: session.url || "", id: session.id };
    } catch (err: any) {
      console.error("Error creating Stripe session, falling back to simulation:", err);
    }
  } else {
    console.log("[Stripe Service] No secret key configured in settings or environment. Using simulation fallback.");
  }

  // Fallback simulated checkout session
  const simId = `sim_session_${Math.random().toString(36).substring(2, 15)}`;
  const simUrl = `/checkout-simulation?session_id=${simId}&amount=${options.amountCents}&userId=${options.userId}`;
  return { url: simUrl, id: simId };
}
