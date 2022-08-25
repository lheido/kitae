import { compile } from "./compiler";

const ast = {
  pages: [{ label: "Page number 1", id: "Page_1" }],
  Page_1: {
    type: "component",
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
};

describe("compiler", () => {
  it("should compile the ast to a set of files", async () => {
    const result = compile(ast.Page_1);
    expect(result.files.length).toEqual(1);
  });
});
