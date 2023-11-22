import { monaco } from "@quasi-dev/monaco-editor";
import * as prettier from "prettier";
import BabelPlugin from "prettier/plugins/babel";
import mdui2Dts from "@quasi-dev/mdui2-dts";
//@ts-ignore
import EsTreePlugin from "prettier/plugins/estree";

export function initMonaco() {
  const formatProvider = {
    provideDocumentFormattingEdits: async (model, options, _token) => [
      {
        text: await prettier.format(model.getValue(), {
          parser: "babel",
          plugins: [BabelPlugin, EsTreePlugin],
          arrowParens: "avoid",
          tabWidth: options.tabSize,
        }),
        range: model.getFullModelRange() as monaco.IRange,
      },
    ],
  } as monaco.languages.DocumentFormattingEditProvider;

  monaco.languages.registerDocumentFormattingEditProvider(
    "javascript",
    formatProvider,
  );

  monaco.languages.typescript.javascriptDefaults.addExtraLib(
    mdui2Dts,
    "mdui.d.ts",
  );
}

let currentExtraLib = "";
export function setExtraLib(code: string) {
  if (currentExtraLib === code) return;
  monaco.languages.typescript.javascriptDefaults.addExtraLib(
    code,
    "context.d.ts",
  );
  currentExtraLib = code;
}
