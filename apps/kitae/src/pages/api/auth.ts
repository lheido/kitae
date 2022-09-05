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
  const req = { ...request, body: await request.json(), headers };
  supabase.auth.api.setAuthCookie(req, proxy);
  console.log(req.body);
  return proxy.res;
}
