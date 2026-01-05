import { createClient } from "@supabase/supabase-js";
import "dotenv-flow/config";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.warn(
        "Missing Supabase environment variables! Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.",
    );
}

export const supabase = createClient(supabaseUrl || "", supabaseServiceKey || "");
