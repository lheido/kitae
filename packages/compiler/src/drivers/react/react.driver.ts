import * as Eta from "eta";
import prettier from "prettier";
import { EtaConfig } from "eta/dist/types/config";
import {
  KitaeComponent,
  KitaeComponentNode,
  KitaeComponentTemplate,
} from "../../model";
import { toReactComponentName } from "../../utils";
import { components } from "./components";

const etaRenderConfig: Partial<EtaConfig> = {
  ...Eta.config,
  autoEscape: false,
};

const USE_PRETTIER = true;

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

const classNamePartial = `<% if (it.className) { %> className="<%= it.className %>"<% } %>`;

Eta.templates.define("className", Eta.compile(classNamePartial));

function renderNode(node: KitaeComponentNode) {
  if (!components.has(node.type)) {
    return '<p className="font-black text-red-500">Error: component not found.</p>';
  }
  const cmp = components.get(node.type);
  let template = cmp.template;
  if (!template) {
    template = components.get(cmp.extend).template;
  }
  let children: any = (node as KitaeComponentTemplate)?.children;
  if ("children" in node) {
    children = node.children.map((child) => renderNode(child)).join("");
  }
  return Eta.render(
    template,
    {
      props: {
        semantic: cmp?.props?.semantic?.default,
        ...node,
        children,
        content: node?.content ?? undefined,
      },
    },
    etaRenderConfig
  );
}

function _compile(
  componentName: string,
  ast: KitaeComponent,
  usePrettier = false
): any {
  const fileContent = Eta.render(
    template,
    {
      componentName,
      template: ast.template,
      useFragement: ast.template.length > 1,
      renderNode,
    },
    etaRenderConfig
  ) as string;
  if (usePrettier) {
    return prettier.format(fileContent, { parser: "typescript" });
  }
  return fileContent;
}

export function compile(ast: KitaeComponent, usePrettier = false): any {
  const componentName = toReactComponentName(ast.label);
  return [
    {
      filename: `${componentName}.tsx`,
      content: _compile(componentName, ast, usePrettier),
    },
  ];
}
