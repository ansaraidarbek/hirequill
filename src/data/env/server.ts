import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
    server: {
        CLERK_SECRET_KEY: z.string().min(1),
        CLERK_WEBHOOK_SIGNING_SECRET: z.string().min(1),
        DATABASE_URL: z.string().min(1),
        OPENAI_API_KEY: z.string().min(1),
        LEMON_SQUEEZY_API_KEY: z.string().min(1),
        LEMON_SQUEEZY_STORE_ID: z.string().min(1),
        LEMON_SQUEEZY_VARIANT_ID: z.string().min(1),
    },
    createFinalSchema: (env) => {
        return z.object(env).transform(({ ...rest }) => {
            return {
                ...rest,
                DATABASE_URL: rest.DATABASE_URL,
            };
        });
    },
    experimental__runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
