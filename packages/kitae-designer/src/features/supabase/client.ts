import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_KITAE_SUPABASE_URL,
  import.meta.env.VITE_KITAE_SUPABASE_ANON_KEY
);
