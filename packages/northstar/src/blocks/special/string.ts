import { Block, blockCtors } from "@quasi-dev/visual-flow";
import { FuncBlockBase } from "./FuncBlockBase.r";

export class StringBlock extends FuncBlockBase {
  ctor(): Block {
    return new StringBlock();
  }

  name = "string template";

  getSlots() {
    const template = this.inputValue.value;
    const matches = template.matchAll(/\{[a-zA-Z0-9_]+\}/g);
    return [...matches].map((match) => match[0].slice(1, -1));
  }
}

blockCtors["StringBlock"] = StringBlock;