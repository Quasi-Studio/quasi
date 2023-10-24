import { Block, blockCtors } from "@quasi-dev/visual-flow";
import { FuncBlockBase, FuncBlockTypes } from "./FuncBlockBase.r";

export class ExprBlock extends FuncBlockBase {
  ctor(): Block {
    return new ExprBlock();
  }

  name = "expression";

  getSlots() {
    const template = this.inputValue.value;
    const matches = template.matchAll(/\$[a-zA-Z0-9]+/g);
    return [...matches].map((match) => match[0].slice(1));
  }

  type: FuncBlockTypes = "expr";
}

blockCtors["ExprBlock"] = ExprBlock;
