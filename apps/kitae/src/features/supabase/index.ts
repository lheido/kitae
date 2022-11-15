import { CookieOptions, createClient, Session } from "@supabase/supabase-js";
import type { APIContext } from "astro";
import type { AstroCookies } from "astro/dist/core/cookies";

/**
 * /!\ WARNING
 * This file implements custom setAuthCookie, refreshAccessToken and getUserByCookie methods.
 * The Supabase js sdk for node js doesn't work with Astro request/response objects.
 */

export interface AppCookieOptions {
  domain?: string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  sameSite?: boolean | "lax" | "none" | "strict";
  secure?: boolean;
}

export const defaultCookieOptions: AppCookieOptions = {
  sameSite: "lax",
  domain: import.meta.env.PUBLIC_COOKIE_DOMAIN,
  path: "/",
  httpOnly: true,
  maxAge: 60 * 60 * 8,
};

export const ACCESS_TOKEN_NAME = `kitae-access-token`;
export const REFRESH_TOKEN_NAME = `kitae-refresh-token`;
export const PROVIDER_TOKEN_NAME = `kitae-provider-token`;

export const supabase = createClient(
  import.meta.env.PUBLIC_KITAE_SUPABASE_URL,
  import.meta.env.PUBLIC_KITAE_SUPABASE_ANON_KEY,
  {
    persistSession: false,
    detectSessionInUrl: true,
    cookieOptions: defaultCookieOptions as CookieOptions,
  }
);

export interface AuthRequestBody {
  session: Session | null;
}

export const handleAuthCookies = async (
  body: AuthRequestBody,
  { cookies }: APIContext
) => {
  if (!body.session) {
    throw new Error("No session found in the request");
  }
  if (!body.session.access_token || !body.session.refresh_token) {
    throw new Error(
      "Wrong session object: missing access_token or refresh_token properties"
    );
  }

  cookies.set(
    ACCESS_TOKEN_NAME,
    body.session.access_token,
    defaultCookieOptions
  );
  cookies.set(
    REFRESH_TOKEN_NAME,
    body.session.refresh_token,
    defaultCookieOptions
  );

  if (body.session.provider_token) {
    cookies.set(
      PROVIDER_TOKEN_NAME,
      body.session.provider_token,
      defaultCookieOptions
    );
  }
};

export const handleRefreshAccessToken = async (
  refreshToken: string,
  cookies: AstroCookies
) => {
  const { data, error } = await supabase.auth.api.refreshAccessToken(
    refreshToken
  );
  if (error) {
    throw new Error(error.message);
  }
  handleAuthCookies({ session: data }, { cookies } as APIContext);
  return { data: data as Session };
};

export const getSession = async (cookies: AstroCookies) => {
  if (!cookies.has(ACCESS_TOKEN_NAME)) {
    throw new Error("No access_token cookie found.");
  }
  const access_token = cookies.get(ACCESS_TOKEN_NAME).value;
  if (!access_token) {
    throw new Error("No access_token found in the access token cookie.");
  }
  const refresh_token = cookies.get(REFRESH_TOKEN_NAME).value;
  const provider_token = cookies.get(PROVIDER_TOKEN_NAME).value;
  const { user, error: getUserError } = await supabase.auth.api.getUser(
    access_token
  );
  if (getUserError) {
    if (!refresh_token) throw new Error("No refresh_token cookie found.");
    const { data } = await handleRefreshAccessToken(refresh_token, cookies);
    return data;
  }
  return {
    access_token,
    user,
    refresh_token,
    provider_token,
    token_type: "bearer",
  };
};
