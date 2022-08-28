import { render } from "eta";

export const template = `
const <%= it.componentName %> = (props) => {
  return (
    <%= it.renderedContent  %>
  )
}

export default <%= it.componentName %>;
`;

export function compile(ast: any): any {
  // react driver use jsx instead of template property if possible.
  return [
    {
      filename: "LoremIpsum.tsx",
      content: render(template, {
        componentName: ast.label,
        renderedContent: "",
      }),
    },
  ];
}
