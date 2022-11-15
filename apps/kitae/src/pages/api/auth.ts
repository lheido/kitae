import type { APIRoute } from "astro";
import { handleAuthCookies } from "../../features/supabase";
import { buildJsonResponse } from "../../features/utils/api";

export const post: APIRoute = async (context) => {
  const body = await context.request.json();
  await handleAuthCookies(body, context);
  return buildJsonResponse();
};
