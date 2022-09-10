import { Users } from "@gitbeaker/node";

export function createAPi(oauthToken: string) {
  return new Users({ oauthToken });
}
