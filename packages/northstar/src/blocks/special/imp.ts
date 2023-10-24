import { Block, blockCtors } from "@quasi-dev/visual-flow";
import { FuncBlockBase } from "./FuncBlockBase.r";

export class ImpBlock extends FuncBlockBase {
  constructor() {
    super();
    this.boardHeight = 80;
    this.updateSocketPosition();
  }

  ctor(): Block {
    return new ImpBlock();
  }

  name = "imperative code";

  useTextarea = true;

  getSlots() {
    const template = this.inputValue.value;
    const matches = template.matchAll(/\$[a-zA-Z0-9]+/g);
    return [...matches].map((match) => match[0].slice(1));
  }
}

blockCtors["ImpBlock"] = ImpBlock;
