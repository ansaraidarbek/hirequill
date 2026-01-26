import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { env } from "@/data/env/server";
import {
    handleSubscriptionCreated,
    handleSubscriptionUpdated,
    handleSubscriptionCanceled,
    handleSubscriptionExpired,
} from "@/services/webhooks/lemonSqueezy";

// Disable body parsing to get raw body for signature verification
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const secret = env.LEMON_SQUEEZY_WEBHOOK_SECRET;

        if (!secret) {
            console.error("❌ LEMON_SQUEEZY_WEBHOOK_SECRET not set");
            return new Response("Webhook secret not configured", { status: 500 });
        }

        // Get raw body as text for signature verification
        const rawBody = await req.text();

        if (rawBody.length === 0) {
            return new Response("Empty request body", { status: 400 });
        }

        // Extract signature from X-Signature header (hex format)
        const signatureHeader = req.headers.get("X-Signature");
        if (!signatureHeader) {
            console.error("❌ Missing X-Signature header");
            return new Response("Missing signature", { status: 400 });
        }

        const signature = Buffer.from(signatureHeader, "hex");

        if (signature.length === 0) {
            return new Response("Invalid signature format", { status: 400 });
        }

        // Create HMAC-SHA256 hash of the raw body
        const hmac = Buffer.from(
            crypto.createHmac("sha256", secret).update(rawBody).digest("hex"),
            "hex",
        );

        // Verify signature using timing-safe comparison
        if (!crypto.timingSafeEqual(hmac, signature)) {
            console.error("❌ Webhook signature verification failed");
            return new Response("Invalid signature", { status: 401 });
        }

        // Parse the verified payload
        const payload = JSON.parse(rawBody) as {
            meta: {
                event_name: string;
                custom_data?: {
                    user_id?: string;
                };
            };
            data: unknown;
        };

        const eventName = payload.meta?.event_name;

        if (!eventName) {
            return new Response("Missing event_name in payload", { status: 400 });
        }

        // Handle different event types
        switch (eventName) {
            case "subscription_created":
                await handleSubscriptionCreated(
                    payload as Parameters<typeof handleSubscriptionCreated>[0],
                );
                break;

            case "subscription_updated":
                await handleSubscriptionUpdated(
                    payload as Parameters<typeof handleSubscriptionUpdated>[0],
                );
                break;

            case "subscription_canceled":
                await handleSubscriptionCanceled(
                    payload as Parameters<typeof handleSubscriptionCanceled>[0],
                );
                break;

            case "subscription_expired":
                await handleSubscriptionExpired(
                    payload as Parameters<typeof handleSubscriptionExpired>[0],
                );
                break;

            default:
                break;
        }

        return new Response("OK", { status: 200 });
    } catch (err) {
        console.error("❌ Webhook processing failed:", err);
        return new Response(
            `Webhook processing failed: ${err instanceof Error ? err.message : "Unknown error"}`,
            { status: 500 },
        );
    }
}
