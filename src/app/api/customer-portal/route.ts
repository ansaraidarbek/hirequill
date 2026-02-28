import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { env } from "@/data/env/server";
import { getSubscriptionByUserId } from "@/db/subscriptions/subscriptions";

type LemonSubscriptionResponse = {
    data?: {
        attributes?: {
            urls?: {
                customer_portal?: string;
            };
        };
    };
    errors?: unknown;
};

export async function GET() {
    const { userId } = await auth();

    if (!userId) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const subscription = await getSubscriptionByUserId(userId);

    if (!subscription || subscription.plan !== "monthly") {
        return NextResponse.json(
            { message: "No active monthly subscription found" },
            { status: 404 },
        );
    }
    const providerSubscriptionId = subscription.providerSubscriptionId;

    if (!providerSubscriptionId) {
        return NextResponse.json(
            { message: "Subscription is missing provider id" },
            { status: 400 },
        );
    }
    const response = await fetch(
        `https://api.lemonsqueezy.com/v1/subscriptions/${providerSubscriptionId}`,
        {
            method: "GET",
            headers: {
                Accept: "application/vnd.api+json",
                Authorization: `Bearer ${env.LEMON_SQUEEZY_API_KEY}`,
            },
        },
    );

    if (!response.ok) {
        const errText = await response.text().catch(() => "");
        return NextResponse.json(
            {
                message: "Failed to fetch subscription from Lemon Squeezy",
                status: response.status,
                errText,
            },
            { status: 502 },
        );
    }
    const json = (await response.json()) as LemonSubscriptionResponse;
    const portalUrl = json?.data?.attributes?.urls?.customer_portal;

    if (!portalUrl) {
        return NextResponse.json(
            {
                message: "Customer portal link not available",
                response: json,
            },
            { status: 502 },
        );
    }

    return NextResponse.json({ portalUrl }, { status: 200 });
}
