import { render, config } from "eta";
import { EtaConfig } from "eta/dist/types/config";
import Container, { semanticOptions } from "./container";

describe("Container", () => {
  describe("dev", () => {
    it("should wrap the container component with an high order component", async () => {
      const result = await render(Container.template, { prod: false });
      expect(result).toMatch("<Container>");
      expect(result).toMatch("export default _Container");
      expect(result).not.toMatch("export default Container");
    });
  });
  describe("prod", () => {
    it("should export the component without wrapper component", async () => {
      const result = await render(Container.template, { prod: true });
      expect(result).toMatch("export default Container");
      expect(result).not.toMatch("export default _Container");
    });
  });
  describe("semantic", () => {
    it("should contain the right semantic type.", async () => {
      const result = await render(Container.template, { prod: true });
      expect(result).toMatch(
        semanticOptions.map((o) => `'${o.value}'`).join(" | ")
      );
    });
  });
});
