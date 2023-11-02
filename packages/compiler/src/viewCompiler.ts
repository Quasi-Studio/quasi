import {
  ComponentBlockProps,
  ComponentBlockOutput,
  RootBlockOutput,
  ViewOutput,
  ComponentBlockCallbacks,
  ComponentBlockChildren,
  FuncBlockOutput,
  ImpBlockOutput,
  IfBlockOutput,
  ComponentBlockPlugins,
} from "./types";
import { Compiler } from "./compiler";
import { ConnectTo } from "./types/base";

export class ViewCompiler {
  constructor(
    public compiler: Compiler,
    public view: ViewOutput,
  ) {}

  dataLines: {}[] = [];

  getViewRoot() {
    const first = this.view.specialBlocks.findIndex((b) => b.type === "root");
    if (first === -1) {
      throw new Error("No root block found");
    }
    const last = this.view.specialBlocks.findIndex((b) => b.type === "root");
    if (first !== last) {
      throw new Error("Cannot have multiple root blocks in one view");
    }
    return this.view.specialBlocks[first] as RootBlockOutput;
  }

  getComponentBlockById(id: number) {
    const block = this.view.componentBlocks.find((b) => b.id === id);
    if (!block) {
      throw new Error(`Block ${id} not found`);
    }
    return block;
  }

  getBlockById(id: number) {
    const block =
      this.view.componentBlocks.find((b) => b.id === id) ??
      this.view.specialBlocks.find((b) => b.id === id);
    if (!block) {
      throw new Error(`Block ${id} not found`);
    }
    return block;
  }

  compile() {
    const root = this.getViewRoot();

    const mainFunc = root.children
      .map((c) => this.compileComponentBlock(this.getComponentBlockById(c)))
      .join("\n");

    const modelsDef = [...this.modelAllocators.entries()]
      .map(([k, v]) => {
        return `const ${k} = ${v};`;
      })
      .join("\n");

    const linesDef = this.lineDefs.join("\n");

    const impsDef = this.impDefs.join("\n");

    return `
import { view } from "refina";

${modelsDef}

${linesDef}

${impsDef}

view(_ => {
  ${mainFunc}
});
`;
  }

  compileStringBlock(block: FuncBlockOutput): string {
    return `\`${block.value.replace(/\{([a-zA-Z0-9]+)\}/g, (_, name) => {
      const input = block.inputs.find((i) => i.slot === name);
      if (!input) {
        throw new Error(`Cannot find input ${name} in block ${block.id}`);
      }
      return `\${${this.compileDataLineEnd(input)}}`;
    })}\``;
  }

  compileExprBlock(block: FuncBlockOutput): string {
    return block.value.replace(/\$([a-zA-Z0-9]+)/g, (_, name) => {
      const input = block.inputs.find((i) => i.slot === name);
      if (!input) {
        throw new Error(`Cannot find input ${name} in block ${block.id}`);
      }
      return `(${this.compileDataLineEnd(input)})`;
    });
  }

  lineDefs: string[] = [];
  compileDataLineEnd({ blockId, socketName }: ConnectTo): string {
    if (Number.isNaN(blockId)) return "null";

    const lineId = `line${this.lineDefs.length}`;

    const block = this.getBlockById(blockId);
    switch (block.type) {
      case "string":
        if (socketName !== "output") {
          throw new Error(
            `Cannot find socket ${socketName} in block ${blockId}`,
          );
        }
        this.lineDefs.push(
          `const ${lineId} = () => ${this.compileStringBlock(block)};`,
        );
        break;
      case "root":
        throw new Error("Not implemented");
      case "component":
        if (!block.modelAllocator)
          throw new Error("This component block has no data output");
        this.lineDefs.push(
          `const ${lineId} = () => ${this.compileModel(
            blockId,
            block.modelAllocator,
          )}["${socketName}"];`,
        );
        break;
      case "expr":
        if (socketName !== "output") {
          throw new Error(
            `Cannot find socket ${socketName} in block ${blockId}`,
          );
        }
        this.lineDefs.push(
          `const ${lineId} = () => (${this.compileExprBlock(block)});`,
        );
        break;
      case "imp":
        throw new Error("Not implemented");
      case "if":
        throw new Error("If-else block has no data output");
      case "view":
        throw new Error("view block has no data output");
      case "for-each":
        throw new Error("Not implemented");
    }
    return `${lineId}()`;
  }

  compileImpBlock(block: ImpBlockOutput): string {
    return block.value.replace(/\$([a-zA-Z0-9]+)/g, (_, name) => {
      const input = block.inputs.find((i) => i.slot === name);
      if (!input) {
        throw new Error(`Cannot find input ${name} in block ${block.id}`);
      }
      return `(${this.compileDataLineEnd(input)})`;
    });
  }

  compileIfElseBlock(block: IfBlockOutput): string {
    return `if (${this.compileDataLineEnd(block.condition)}) {
    ${this.compileEventLineStart(block.then)}
  } else {
    ${this.compileEventLineStart(block.else)}
  }`;
  }

  impDefs: string[] = [];
  compileEventLineStart({ blockId, socketName }: ConnectTo): string {
    if (Number.isNaN(blockId)) return "";

    const impId = `imp${this.impDefs.length}`;
    const block = this.getBlockById(blockId);
    switch (block.type) {
      case "string":
        throw new Error("String block is not callable");
      case "root":
        throw new Error("Root block is not callable");
      case "component":
        if (!block.modelAllocator)
          throw new Error("This component block has no event input");
        this.impDefs.push(
          `const ${impId} = () => ${this.compileModel(
            blockId,
            block.modelAllocator,
          )}["${socketName}"]();`,
        );
        break;
      case "expr":
        throw new Error("Expr block is not callable");
      case "imp":
        if (socketName !== "when") {
          throw new Error(
            `Cannot find socket ${socketName} in block ${blockId}`,
          );
        }
        this.impDefs.push(
          `const ${impId} = () => {${this.compileImpBlock(
            block as ImpBlockOutput,
          )}};`,
        );
        break;
      case "if":
        if (socketName !== "when") {
          throw new Error(
            `Cannot find socket ${socketName} in block ${blockId}`,
          );
        }
        this.impDefs.push(
          `const ${impId} = () => {${this.compileIfElseBlock(block)}};`,
        );
        break;
      case "view":
        throw new Error("Expr block is not callable");
      case "for-each":
        throw new Error("Not implemented");
    }
    return `${impId}()`;
  }

  blockModelMap = new Map<number, string>();
  modelAllocators = new Map<string, string>();
  compileModel(blockId: number, allocator: string): string {
    if (this.blockModelMap.has(blockId))
      return this.blockModelMap.get(blockId)!;
    const modelId = `model${this.modelAllocators.size}`;
    this.blockModelMap.set(blockId, modelId);
    this.modelAllocators.set(modelId, allocator);
    return modelId;
  }

  compileComponentProps(props: ComponentBlockProps): Record<string, string> {
    return Object.fromEntries(
      Object.entries(props).map(([k, v]) => {
        if (typeof v === "string") {
          return [k, `"${v}"`];
        } else if (typeof v === "boolean") {
          return [k, v ? "true" : "false"];
        } else {
          return [k, this.compileDataLineEnd(v)];
        }
      }),
    );
  }

  compileComponentCallbacks(
    callbacks: ComponentBlockCallbacks,
  ): Record<string, string> {
    return Object.fromEntries(
      Object.entries(callbacks).map(([k, v]) => [
        k,
        `()=>{${v.map((e) => this.compileEventLineStart(e) + ";").join("")}}`,
      ]),
    );
  }
  compileComponentPlugins(
    plugins: ComponentBlockPlugins,
  ): Record<string, string> {
    return plugins;
  }
  compileComponentChildren(children: ComponentBlockChildren) {
    return Object.fromEntries(
      Object.entries(children).map(([k, v]) => {
        if (typeof v === "string") {
          return [k, `"${v}"`];
        } else {
          return [
            k,
            `_ => {
            ${v
              .map((c) =>
                this.compileComponentBlock(this.getComponentBlockById(c)),
              )
              .join("\n")}
          }`,
          ];
        }
      }),
    );
  }

  compileComponentBlock(block: ComponentBlockOutput): string {
    return `_.${block.func}(
  ${
    block.modelAllocator
      ? `${this.compileModel(block.id, block.modelAllocator)},\n`
      : ""
  }{
    ${Object.entries({
      ...this.compileComponentProps(block.props),
      ...this.compileComponentCallbacks(block.callbacks),
      ...this.compileComponentPlugins(block.plugins),
      ...this.compileComponentChildren(block.children),
    })
      .map(([k, v]) => `${k}:${v}`)
      .join(",\n")}
  });`;
  }
}
