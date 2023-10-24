import {
  Block,
  blockCtors
} from "@quasi-dev/visual-flow";
import { FuncBlockBase } from "./FuncBlockBase.r";

export class ExprBlock extends FuncBlockBase {
  ctor(): Block {
    return new ExprBlock();
  }

  getSlots() {
    const template = this.input.value;
    const matches = template.matchAll(/\$[a-zA-Z0-9]+/g);
    return [...matches].map((match) => match[0].slice(1));
  }
}

blockCtors["ExprBlock"] = ExprBlock;
