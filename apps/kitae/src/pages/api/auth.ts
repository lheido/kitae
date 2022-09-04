import { supabase } from "../../features/supabase";

export async function post({ request }: { request: Request }) {
  console.log(request.body);
  const res = new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "aplication/json",
    },
  });
  supabase.auth.api.setAuthCookie(request, res);
  return res;
}
