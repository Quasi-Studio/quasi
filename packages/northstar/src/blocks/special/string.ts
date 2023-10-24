import { Block, blockCtors } from "@quasi-dev/visual-flow";
import { FuncBlockBase } from "./FuncBlockBase.r";

export class StringBlock extends FuncBlockBase {
  ctor(): Block {
    return new StringBlock();
  }

  getSlots() {
    const template = this.input.value;
    const matches = template.matchAll(/\{[a-zA-Z_]+\}/g);
    return [...matches].map(match => match[0].slice(1, -1));
  }
}

blockCtors["StringBlock"] = StringBlock;
