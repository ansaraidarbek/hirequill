import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { env } from "@/data/env/server";
import { env as clientEnv } from "@/data/env/client";

type LemonCheckoutResponse = {
    data?: {
        attributes?: {
            url?: string;
        };
    };
    errors?: unknown;
};

function getSafeAppUrl(req: NextRequest) {
    // Do NOT trust req.headers.get("origin") (spoofable).
    // Prefer your known site URL; optionally allow localhost/ngrok in dev.
    const appUrl = clientEnv.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    return appUrl.replace(/\/$/, "");
}

export async function GET(req: NextRequest) {
    // 1) Auth
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2) Required IDs (store + variant) — docs say these are required relationships. :contentReference[oaicite:1]{index=1}
    const storeId = env.LEMON_SQUEEZY_STORE_ID;
    const variantId = env.LEMON_SQUEEZY_VARIANT_ID; // set this once, don’t fetch products/variants on every request

    if (!storeId || !variantId) {
        return NextResponse.json(
            { message: "Missing LEMON(S)QUEEZY store/variant env vars" },
            { status: 500 },
        );
    }

    // 3) Redirect URL back to your app (Lemon uses product_options.redirect_url). :contentReference[oaicite:2]{index=2}
    const appUrl = getSafeAppUrl(req);
    const redirectUrl = `${appUrl}/?checkout=success`;

    // 4) Create checkout (official)
    const body = {
        data: {
            type: "checkouts",
            attributes: {
                product_options: {
                    // This sets the “Continue” button destination after purchase. :contentReference[oaicite:3]{index=3}
                    redirect_url: redirectUrl,
                },
                checkout_data: {
                    // Custom data for webhooks: meta.custom_data. :contentReference[oaicite:4]{index=4}
                    custom: { user_id: userId },
                },
                // Optional:
                // test_mode: env.NODE_ENV !== "production",
            },
            relationships: {
                store: { data: { type: "stores", id: String(storeId) } },
                variant: { data: { type: "variants", id: String(variantId) } },
            },
        },
    };

    const res = await fetch("https://api.lemonsqueezy.com/v1/checkouts", {
        method: "POST",
        headers: {
            Accept: "application/vnd.api+json",
            "Content-Type": "application/vnd.api+json",
            Authorization: `Bearer ${env.LEMON_SQUEEZY_API_KEY}`,
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errText = await res.text().catch(() => "");
        return NextResponse.json(
            {
                message: "Failed to create checkout",
                status: res.status,
                errText,
            },
            { status: 500 },
        );
    }

    const json = (await res.json()) as LemonCheckoutResponse;
    const checkoutUrl = json?.data?.attributes?.url;

    if (!checkoutUrl) {
        return NextResponse.json(
            { message: "Checkout created but no url returned", response: json },
            { status: 500 },
        );
    }

    // 5) Redirect user to Lemon checkout URL (official flow)
    return NextResponse.redirect(checkoutUrl, { status: 302 });
}
