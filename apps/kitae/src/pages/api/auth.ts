import { supabase } from "../../features/supabase";

export async function post({
  request,
}: {
  request: Request;
}): Promise<Response> {
  // Je ne comprends pas pourquoi c'est aussi compliqué...
  const body = await request.json();
  console.log(request.headers);
  const req = { body, method: request.method, headers: request.headers };
  const res = new Response(null, { status: 200 });
  supabase.auth.api.setAuthCookie(req, res);
  return res;
}
