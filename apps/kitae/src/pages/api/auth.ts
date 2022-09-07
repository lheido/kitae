import { setAuthCookie } from "../../features/supabase";
import { buildJsonResponse } from "../../features/utils/api";

export async function post({ request }: { request: Request }) {
  const res = buildJsonResponse();
  setAuthCookie(await request.json(), res);
  return res;
}
