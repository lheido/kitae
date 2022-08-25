import { Driver } from "../driver.model";

export class ReactDriver implements Driver {
  typeMatch(type: string): boolean {
    throw new Error("Method not implemented.");
  }
}
