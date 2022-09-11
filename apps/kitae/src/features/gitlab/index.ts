import { Projects, Users } from "@gitbeaker/node";
import type { Types } from "@gitbeaker/core";
import type { Session } from "@supabase/supabase-js";

export function createApi(oauthToken: string) {
  return new Projects({ oauthToken });
}

export async function getUserProjects(
  session: Session,
  options: Types.PaginatedRequestOptions = {}
) {
  if (!session.provider_token) throw new Error("Provider token not found.");
  const api = createApi(session.provider_token);
  return api.all({ membership: true, ...options });
}
