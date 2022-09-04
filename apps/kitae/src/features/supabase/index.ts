import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.PUBLIC_KITAE_SUPABASE_URL,
  import.meta.env.PUBLIC_KITAE_SUPABASE_ANON_KEY,
  {
    persistSession: false,
    detectSessionInUrl: true,
    cookieOptions: {
      name: "kitae",
      sameSite: "lax",
      domain: ".gitpod.io",
    },
  }
);
