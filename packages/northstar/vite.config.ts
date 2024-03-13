import {
  PluginOption,
  UserConfig,
  build,
  createLogger,
  defineConfig,
} from "vite";
import Refina from "vite-plugin-refina";
import { viteStaticCopy } from "vite-plugin-static-copy";
import MonacoEditorPluginObj from "vite-plugin-monaco-editor";
import Inspect from "vite-plugin-inspect";

const MonacoEditorPlugin = (MonacoEditorPluginObj as any)
  .default as typeof MonacoEditorPluginObj;

// Base on https://github.com/vitejs/vite/issues/6757#issuecomment-1584823965
function TsBundleUrlPlugin(): PluginOption {
  let viteConfig: UserConfig;
  let command: string;

  return {
    name: "vite-plugin-ts-bundle-url",
    apply: "build",
    enforce: "post",

    config(config) {
      viteConfig = config;
    },

    configResolved(config) {
      command = config.command;
    },

    async transform(_code, id) {
      if (!(command === "build" && id.endsWith(".ts?url"))) {
        return;
      }

      const quietLogger = createLogger();
      quietLogger.info = () => undefined;

      const output = await build({
        ...viteConfig,
        plugins: [Refina()],
        configFile: false,
        clearScreen: false,
        customLogger: quietLogger,
        build: {
          ...viteConfig.build,
          lib: {
            entry: id.replace("?url", ""),
            name: "_",
            formats: ["es"],
          },
          write: false,
        },
      });

      if (!(output instanceof Array)) {
        throw new Error("Expected output to be Array");
      }
      const code = output[0].output[0].code;
      //@ts-ignore `@types/node` not installed.
      const encoded = Buffer.from(code, "utf8").toString("base64");
      const transformed = `export default "data:text/javascript;base64,${encoded}";`;
      // TODO: Fix this so emoji etc. get properly decoded from within audio worklet module added using this url

      console.log(`TypeScript bundle url: ${id} (${transformed.length} bytes)`);

      return transformed;
    },
  };
}

export default defineConfig({
  plugins: [
    Inspect(),
    Refina() as any,
    MonacoEditorPlugin({}),
    TsBundleUrlPlugin(),
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/@quasi-dev/runtime/node_modules/@refina/mdui/node_modules/mdui/dist/icons/**/*",
          dest: "icons",
        },
        {
          src: "node_modules/@quasi-dev/runtime/node_modules/@refina/mdui/node_modules/mdui/dist/fonts/**/*",
          dest: "fonts",
        },
      ],
    }),
  ],
  server: {
    fs: {
      allow: ["../../.."],
    },
  },
});
