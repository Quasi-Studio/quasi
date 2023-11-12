//@ts-nocheck
import postcss, { Plugin } from "postcss";
import tailwindcss, { Config } from "tailwindcss";
import {
  VIRTUAL_CONTENT_EXTNAME,
  VIRTUAL_CONTENT_FILENAME,
  VIRTUAL_SOURCE_PATH,
} from "./polyfill/constants";

//@ts-ignore
self.process = {
  env: {},
};

export async function compileTailwindCSS(
  cssInput: string,
  contentInput: string,
  extname: string,
  config: Config | {} = {},
  plugins: Plugin[] = [],
) {
  self[VIRTUAL_CONTENT_EXTNAME] = extname;
  // Tailwind scans the config.content for files to parse classNames -> set a virtual file here
  if (!("content" in config)) {
    self[VIRTUAL_CONTENT_FILENAME] = contentInput;
    (config as Config).content = [VIRTUAL_CONTENT_FILENAME];
  }
  return await postcss([
    tailwindcss(config as Config),
    formatNodes,
    ...plugins,
  ]).process(cssInput, {
    from: VIRTUAL_SOURCE_PATH,
  });
}

// https://github.com/tailwindlabs/tailwindcss/blob/315e3a2445d682b2da9ca93fda77252fe32879ff/src/cli.js#L26-L42
function formatNodes(root) {
  indentRecursive(root);
  if (root.first) {
    root.first.raws.before = "";
  }
}

function indentRecursive(node, indent = 0) {
  node.each &&
    node.each((child, i) => {
      if (
        !child.raws.before ||
        !child.raws.before.trim() ||
        child.raws.before.includes("\n")
      ) {
        child.raws.before = `\n${
          node.type !== "rule" && i > 0 ? "\n" : ""
        }${"  ".repeat(indent)}`;
      }
      child.raws.after = `\n${"  ".repeat(indent)}`;
      indentRecursive(child, indent + 1);
    });
}
