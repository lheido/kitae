import { parse, serialize } from "cookie";
import { supabase } from "../../features/supabase";

export class ResponseProxy {
  constructor(public res: Response) {}

  setHeader(name: string, value: string | string[]) {
    const _value = Array.isArray(value) ? value : [value];
    _value.forEach((val) => this.res.headers.append(name, val));
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
  // supabase.auth.api.setAuthCookie(req, proxy);
  console.log("------START------");
  console.log("------------");
  proxy.setHeader(
    "Set-Cookie",
    [
      {
        name: "kitae-access-token",
        value: body.session.access_token,
        options: {
          domain: ".gitpod.io",
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 300,
        },
      },
      {
        name: "kitae-refresh-token",
        value: body.session.refresh_token,
        options: {
          domain: ".gitpod.io",
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          maxAge: 360000,
        },
      },
    ].map((c) => serialize(c.name, c.value, c.options as any))
  );
  console.log("------------");
  console.log(proxy.res.headers.get("Set-Cookie"));
  console.log("-----END-------");
  return proxy.res;
}
