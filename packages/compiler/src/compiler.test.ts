import { compile } from "./compiler";
import { KitaeAST } from "./model";

const ast: KitaeAST = {
  pages: [{ id: "page_1" }],
  refs: {
    page_1: {
      label: "Page number 1",
      driver: "react",
      template: [
        {
          type: "container",
          className: "flex gap-1",
          children: [
            {
              type: "paragraph",
              semantic: "p",
              children: [
                {
                  type: "text",
                  content: "Lorem ipsum",
                },
                {
                  type: "button",
                  className: "flex p-2 bg-teal-500",
                  children: [
                    {
                      type: "text",
                      content: "Button amet",
                    },
                  ],
                },
                {
                  type: "container",
                  semantic: "span",
                  children: [
                    {
                      type: "text",
                      content: "Lorem ipsum",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
};

describe("compiler", () => {
  it("should compile the ast to a set of files", async () => {
    const result = compile(ast);
    expect(result.length).toEqual(1);
  });

  describe("Page number 1", () => {});
});
