import { render } from "eta";
import {
  KitaeComponent,
  KitaeComponentNode,
  KitaeComponentTemplate,
  KitaeComponentTemplateLeaf,
} from "../../model";
import { toReactComponentName } from "../../utils";
import { components } from "./components";

// TODO: fix comma separator when children
const template = `
const <%= it.componentName %> = (props) => {
  return (
    <% if (it.useFragement) { %>
      <>
    <% } %>
    <% it.template.forEach(function(node){ %>
      <%= it.renderNode(node) %>
    <% }) %>
    <% if (it.useFragement) { %>
      </>
    <% } %>
  );
}

export default <%= it.componentName %>;
`;

function renderNode(node: KitaeComponentNode) {
  const cmp = components.get(node.type);
  let template = cmp.template;
  if (!template) {
    template = components.get(cmp.extend).template;
  }
  let children: any = (node as KitaeComponentTemplate)?.children;
  if ("children" in node) {
    children = node.children.map((child) => renderNode(child));
  }
  return render(
    template,
    {
      props: {
        ...node,
        semantic: "div",
        children,
        content: node?.content ?? undefined,
      },
    },
    { autoTrim: "slurp", autoEscape: false }
  );
}

export function compile(ast: KitaeComponent): any {
  const componentName = toReactComponentName(ast.label);
  return [
    {
      filename: `${componentName}.tsx`,
      content: render(
        template,
        {
          componentName,
          template: ast.template,
          useFragement: ast.template.length > 1,
          renderNode,
        },
        {
          autoTrim: "slurp",
          autoEscape: false,
        }
      ),
    },
  ];
}
