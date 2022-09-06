import { serialize } from "cookie";
import { supabase } from "../../features/supabase";

export class ResponseProxy {
  constructor(public res: Response) {}

  setHeader(name: string, value: string) {
    this.res.headers.set(name, value);
    return this;
  }

  getHeader(name: string) {
    return this.res.headers.get(name);
  }

  status(status: number) {
    this.res = new Response(this.res.body, {
      status,
      headers: this.res.headers,
    });
    return this;
  }

  end() {}

  json(_: never) {
    return this.res.json();
  }
}

export async function post({ request }: { request: Request }) {
  const res = new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "aplication/json",
    },
  });
  const proxy = new ResponseProxy(res);
  const headers: any = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  const body = await request.json();
  const req = { ...request, body, headers };
  supabase.auth.api.setAuthCookie(req, proxy);
  // proxy.res.headers.append(
  //   "Set-Cookie",
  //   serialize("kitae-refresh-token", body.session.refresh_token, {
  //     domain: ".gitpod.io",
  //     httpOnly: true,
  //     sameSite: "lax",
  //     maxAge: 360000,
  //   })
  // );
  return proxy.res;
}
