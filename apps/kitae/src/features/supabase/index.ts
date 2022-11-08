import {
  CookieOptions,
  createClient,
  Session,
  User,
} from "@supabase/supabase-js";
import { parse, serialize } from "cookie";

/**
 * /!\ WARNING
 * This file implements custom setAuthCookie, refreshAccessToken and getUserByCookie methods.
 * The Supabase js sdk for node js doesn't work with Astro request/response objects.
 */

export const cookieOptions: CookieOptions = {
  name: "kitae",
  sameSite: "lax",
  domain: import.meta.env.PUBLIC_COOKIE_DOMAIN,
  path: "/",
  lifetime: 60 * 60 * 8,
};

export const ACCESS_TOKEN_NAME = `${cookieOptions.name}-access-token`;
export const REFRESH_TOKEN_NAME = `${cookieOptions.name}-refresh-token`;
export const PROVIDER_TOKEN_NAME = `${cookieOptions.name}-provider-token`;

export const supabase = createClient(
  import.meta.env.PUBLIC_KITAE_SUPABASE_URL,
  import.meta.env.PUBLIC_KITAE_SUPABASE_ANON_KEY,
  {
    persistSession: false,
    detectSessionInUrl: true,
    cookieOptions,
  }
);

export interface AuthRequestBody {
  session: Session | null;
}

export function setAuthCookie(body: AuthRequestBody, res: ResponseInit): void {
  if (!res.headers) throw new Error("No response headers found");
  if (!body.session) {
    throw new Error("No session found in the request");
  }
  if (!body.session.access_token || !body.session.refresh_token) {
    throw new Error(
      "Wrong session object: missing access_token or refresh_token properties"
    );
  }
  const cookies = [
    {
      name: ACCESS_TOKEN_NAME,
      value: body.session.access_token,
      options: {
        domain: cookieOptions.domain,
        sameSite: cookieOptions.sameSite,
        path: cookieOptions.path,
        httpOnly: true,
        maxAge: cookieOptions.lifetime,
      },
    },
    {
      name: REFRESH_TOKEN_NAME,
      value: body.session.refresh_token,
      options: {
        domain: cookieOptions.domain,
        sameSite: cookieOptions.sameSite,
        path: cookieOptions.path,
        httpOnly: true,
        maxAge: cookieOptions.lifetime,
      },
    },
  ];
  if (body.session.provider_token) {
    cookies.push({
      name: PROVIDER_TOKEN_NAME,
      value: body.session.provider_token,
      options: {
        domain: cookieOptions.domain,
        sameSite: cookieOptions.sameSite,
        path: cookieOptions.path,
        httpOnly: true,
        maxAge: cookieOptions.lifetime,
      },
    });
  }
  cookies
    .map((c) => serialize(c.name, c.value, c.options as any))
    .forEach((cookie) => (res.headers as Headers).append("Set-Cookie", cookie));
}

export async function refreshAccessToken(
  request: Request,
  response: ResponseInit
): Promise<{ data: Session; response: ResponseInit }> {
  const cookies = parse(request.headers.get("cookie") ?? "");
  const refreshToken = cookies[REFRESH_TOKEN_NAME] ?? undefined;
  if (refreshToken) {
    const { data, error } = await supabase.auth.api.refreshAccessToken(
      refreshToken
    );
    if (error) {
      throw new Error(error.message);
    }
    setAuthCookie({ session: data }, response);
    return { data: data as Session, response };
  } else {
    throw new Error("No refresh_token cookie found!");
  }
}

export async function getSessionByCookie(
  req: Request,
  res: ResponseInit
): Promise<Session> {
  const cookies = parse(req.headers.get("cookie") ?? "");
  const access_token = cookies[ACCESS_TOKEN_NAME];
  const refresh_token = cookies[REFRESH_TOKEN_NAME];
  const provider_token = cookies[PROVIDER_TOKEN_NAME];
  if (!access_token) {
    throw new Error("No access_token cookie found.");
  }
  const { user, error: getUserError } = await supabase.auth.api.getUser(
    access_token
  );
  if (getUserError) {
    if (!refresh_token) throw new Error("No refresh_token cookie found.");
    const { data } = await refreshAccessToken(req, res);
    return data;
  }
  return {
    access_token,
    user,
    refresh_token,
    provider_token,
    token_type: "bearer",
  };
}
