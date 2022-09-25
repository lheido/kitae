import { getSessionByCookie, supabase } from "../../../features/supabase";
import { buildJsonResponse } from "../../../features/utils/api";

export async function get({ request }: { request: Request }) {
  const response = buildJsonResponse();
  try {
    await getSessionByCookie(request, response);
  } catch (error) {
    return new Response(null, { status: 302, headers: { location: "/login" } });
  }

  const result = await supabase.from("projects").select();
  return buildJsonResponse(result, result.status);
}

export async function put({ request }: { request: Request }) {
  console.log("create project", await request.json());
  return buildJsonResponse();
}
