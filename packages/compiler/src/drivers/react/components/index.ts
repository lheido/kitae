import { parse } from "yaml";
import * as Eta from "eta";
import fs from "fs";
import path from "path";

// TODO: move the code below to the designer.
const componentFilenames = fs
  .readdirSync(__dirname)
  .filter((filename) => filename.includes(".yaml"));

export const components = new Map(
  componentFilenames.map((filename) => {
    const componentName = filename.replace(".yaml", "");
    const parsedComponent = parse(
      fs.readFileSync(path.join(__dirname, `/${filename}`), "utf-8")
    );
    if (parsedComponent?.template) {
      parsedComponent.template = Eta.compile(parsedComponent.template, {
        ...Eta.config,
        autoEscape: false,
      });
    }
    return [componentName, parsedComponent];
  })
);
