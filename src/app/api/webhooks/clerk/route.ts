import {
    clerkUserCreate,
    clerkUserUpdate,
    clerkUserDelete,
} from "@/services/webhooks/clerk";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const evt = await verifyWebhook(req);

        switch (evt.type) {
            case "user.created":
                clerkUserCreate({ event: evt });
                break;
            case "user.updated":
                clerkUserUpdate({ event: evt });
                break;
            case "user.deleted":
                clerkUserDelete({ event: evt });
                break;
            default:
                break;
        }

        return new Response("OK", { status: 200 });
    } catch (err) {
        console.error("❌ Webhook verification failed:", err);
        return new Response("Invalid webhook", { status: 400 });
    }
}
