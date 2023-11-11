import { defineConfig } from "vite";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

export default defineConfig({
  plugins: [
    commonjs(),
    resolve(),
    {
      name: "helper",
      enforce: "pre",
      transform(code, id, options) {
        const names = [
          ["declaration", "Declaration"],
          ["comment", "Comment"],
          ["container", "Container"],
          ["document", "Document"],
          ["at-rule", "AtRule"],
          ["root", "Root"],
          ["rule", "Rule"],
        ];
        for (const name of names) {
          if (id.endsWith(`postcss/lib/${name[0]}.js`)) {
            console.log(`Removing ${name[1]} from ${id}`);
            return code.replace(`${name[1]}.default = ${name[1]}`, "");
          }
        }
      },
    },
  ],
  resolve: {
    alias: {
      colorette: "./src/polyfill/colorette.ts",
      fs: "./src/polyfill/fs.ts",
      path: "./src/polyfill/path.ts",
      url: "./src/polyfill/url.ts",
      "is-glob": "./src/polyfill/is-glob.ts",
      "glob-parent": "./src/polyfill/glob-parent.ts",
      "fast-glob": "./src/polyfill/fast-glob.ts",
    },
  },
  build: {
    lib: {
      entry: "src/index.ts",
      name: "BrowserTailwind",
      formats: ["es"],
    },
    minify: false,
  },
});
