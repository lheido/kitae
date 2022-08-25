import { KitaeAST } from "./model";

export function transform(ast: KitaeAST): string {
  return "";
}

const ASTExample = {
  type: "react:component",
  inputs: {},
  styles: {
    padding: "1rem",
    className: "p-1 bg-teal-500 rounded", //tailwind support ?
    backgroundColor: "black",
  },
  children: [],
};
