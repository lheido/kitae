import { parse } from "yaml";
import fs from "fs";
import path from "path";

export const components = new Map([
  [
    "container",
    parse(fs.readFileSync(path.join(__dirname, "/container.yaml"), "utf-8")),
  ],
  [
    "paragraph",
    parse(fs.readFileSync(path.join(__dirname, "/paragraph.yaml"), "utf-8")),
  ],
  [
    "button",
    parse(fs.readFileSync(path.join(__dirname, "/button.yaml"), "utf-8")),
  ],
  ["text", parse(fs.readFileSync(path.join(__dirname, "/text.yaml"), "utf-8"))],
]);
