import { QuasiOutput } from "./types";
import { ViewCompiler } from "./viewCompiler";
import * as prettier from "prettier";
import BabelPlugin from "prettier/plugins/babel";
//@ts-ignore
import EsTreePlugin from "prettier/plugins/estree";

export class Compiler {
  constructor(public input: QuasiOutput) {}

  runtimeModuleURL = "@quasi-dev/runtime";

  async compile() {
    const code = `
import QuasiRuntime, * as $quasi from "${this.runtimeModuleURL}";

const { app, defineView } = $quasi.refina;

${this.input.views
  .map((v) => {
    const viewCompiler = new ViewCompiler(this, v);
    return viewCompiler.compile();
  })
  .join("\n\n")}
`;
    return await prettier.format(code, {
      parser: "babel",
      plugins: [BabelPlugin, EsTreePlugin],
      arrowParens: "avoid",
    });
  }
}
