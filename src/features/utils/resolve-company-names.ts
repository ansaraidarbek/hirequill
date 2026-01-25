import { normalizeCompanyName } from "@/utils/normalizeCompanyName";
import { OpenAI } from "openai/client";

type CompanyResolution = {
    companyKey: string;
};

export async function resolveCompanyKey(params: {
    currentCompanyName: string;
    weeklyCompanyKeys: string[];
    client: OpenAI;
    model: string;
}): Promise<CompanyResolution> {
    const { currentCompanyName, weeklyCompanyKeys, client, model } = params;

    const normalizedCurrent = normalizeCompanyName(currentCompanyName);

    // 1) deterministic exact match on normalized name
    for (const item of weeklyCompanyKeys) {
        if (item === normalizedCurrent) {
            return {
                companyKey: item,
            };
        }
    }

    // 2) GPT disambiguation only when needed
    const system = `
        You resolve company names to canonical company keys for usage tracking.

        Output:
        - Return ONLY valid JSON with this exact schema:
        {"companyKey":"string"}

        Rules:
        1) companyKey must be a canonical key:
        - lowercase
        - kebab-case
        - only letters, numbers, and hyphens
        - no spaces, no punctuation, no extra text

        2) If "known" contains the same company (even with small variations),
        return the matching key from "known"

        3) If no confident match exists,
        generalize normalizedCurrent to correct company key format
        Example: brainrocket => brainrocket
        return companyKey = generalized normalizedCurrent

        4) Be conservative: only match when you are confident.
        `;

    const user = JSON.stringify(
        {
            normalizedCurrent,
            known: weeklyCompanyKeys,
        },
        null,
        2,
    );

    const payload: any = {
        model,
        messages: [
            { role: "system", content: system },
            { role: "user", content: user },
        ],
    };

    if (!model.startsWith("gpt-5")) {
        payload.temperature = 0;
    }

    const res = await client.chat.completions.create(payload);

    const raw = res.choices[0]?.message?.content?.trim();
    if (!raw) {
        return {
            companyKey: normalizedCurrent,
        };
    }

    // Safe parse
    let parsed: any;
    try {
        parsed = JSON.parse(raw);
    } catch {
        const key = normalizedCurrent;
        return {
            companyKey: key,
        };
    }

    const companyKey =
        typeof parsed.companyKey === "string" && parsed.companyKey.length
            ? parsed.companyKey
            : normalizedCurrent;

    return { companyKey };
}
