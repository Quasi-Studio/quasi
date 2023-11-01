import { QuasiOutput } from "./types";
import { ViewCompiler } from "./viewCompiler";
import * as prettier from "prettier";
import BabelPlugin from "prettier/plugins/babel";
//@ts-ignore
import EsTreePlugin from "prettier/plugins/estree";

export class Compiler {
  constructor(public input: QuasiOutput) {}

  async compile() {
    const appViewCompiler = new ViewCompiler(
      this,
      this.input.views.find((v) => v.name === "app")!,
    );

    return await prettier.format(appViewCompiler.compile(), {
      parser: "babel",
      plugins: [BabelPlugin, EsTreePlugin],
      printWidth: 120,
      arrowParens: "avoid",
    });
  }
}
