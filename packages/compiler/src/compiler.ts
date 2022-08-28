import { drivers } from "./drivers";
import { KitaeAST } from "./model";

export function compile(ast: KitaeAST): any {
  return ast.pages
    .map(({ id }) => {
      const driver = drivers.get(ast.refs[id].driver);
      return driver.compile(ast);
    })
    .flat();
}
