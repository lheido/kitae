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

const USE_PRETTIER = true;

const expectedPage1ContentPrettier = `const PageNumber1 = (props) => {
  return (
    <div className="flex gap-1">
      <p>
        Lorem ipsum<button className="flex p-2 bg-teal-500">Button amet</button>
        <span>Lorem ipsum</span>
      </p>
    </div>
  );
};

export default PageNumber1;
`;

describe("compiler", () => {
  let result: any;

  beforeEach(() => {
    console.time("compile time");
    result = compile(ast, USE_PRETTIER);
    console.timeEnd("compile time");
  });

  it("should compile the ast to a set of files", async () => {
    expect(result.length).toEqual(1);
  });

  describe(ast.refs.page_1.label, () => {
    it("shouls have a react component ready filename", () => {
      expect(result[0].filename).toEqual("PageNumber1.tsx");
    });

    it("should have a nice compiled file content using prettier", () => {
      expect(result[0].content).toBe(expectedPage1ContentPrettier);
    });
  });
});
