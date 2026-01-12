import { env } from "@/data/env/server";
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
    env.SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY
);
