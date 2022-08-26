import { compile } from "./compiler";

const ast = {
  pages: [{ label: "Page number 1", id: "page_1" }],
  refs: {
    page_1: {
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
                  type: "button",
                  className: 'flex p-2 bg-teal-500',
                  children: [
                    {
                      type: "text",
                      content: "Button amet",
                    },
                  ]
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
    }
  }
};

describe("compiler", () => {
  it("should compile the ast to a set of files", async () => {
    const result = compile(ast.refs.page_1);
    expect(result.files.length).toEqual(1);
  });
});