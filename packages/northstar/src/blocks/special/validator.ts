import { Direction, Socket, blockCtors } from "@quasi-dev/visual-flow";
import { FuncBlockBase } from "./FuncBlockBase.r";
import { FuncBlockTypes, ValidatorBlockOutput } from "@quasi-dev/compiler";

export class ValidatorBlock extends FuncBlockBase {
  name = "validator";
  type: FuncBlockTypes = "validator";
  placeholder = "expression";
  noOutput = true;

  errorMessages: string = "Invalid input";

  clone(): FuncBlockBase {
    const block = new ValidatorBlock();
    block.initialize();
    return block;
  }

  initialize(): void {
    super.initialize();
    this.dockingDirections = [Direction.LEFT];
  }

  getSlots(): string[] {
    return [];
  }

  toOutput(): ValidatorBlockOutput {
    return {
      type: "validator",
      id: this.id,
      expr: this.inputValue.value,
    };
  }
}

blockCtors["ValidatorBlock"] = ValidatorBlock;
