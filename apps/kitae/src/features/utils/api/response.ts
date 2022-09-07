/** @deprecated */
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

export function buildJsonResponse(body = { ok: true }, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "aplication/json",
    },
  });
}
