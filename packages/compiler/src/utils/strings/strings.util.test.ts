import { toReactComponentName } from "./strings.util";

describe("Strings Utils", () => {
  describe("toReactComponentName", () => {
    it("should pascalcases a string", () => {
      expect(toReactComponentName("Lorem Ipsum_Dolor-sit.amet")).toBe(
        "LoremIpsumDolorSitAmet"
      );
    });
  });
});
