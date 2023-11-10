import type { FuncBlockTypes } from "@quasi-dev/compiler";
import { blockCtors } from "@quasi-dev/visual-flow";
import { FuncBlockBase } from "./FuncBlockBase.r";

export class ExprBlock extends FuncBlockBase {
  type: FuncBlockTypes = "expr";
  label = "expression";
  outputLabel = "value";

  get slots() {
    const template = this.inputValue.value;
    const matches = template.matchAll(/\$[a-zA-Z0-9]+/g);
    return [...matches].map((match) => match[0].slice(1));
  }
}

blockCtors["ExprBlock"] = ExprBlock;
