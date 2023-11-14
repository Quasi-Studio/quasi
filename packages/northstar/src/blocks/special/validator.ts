import { Direction, Socket, blockCtors } from "@quasi-dev/visual-flow";
import { FuncBlockBase } from "./FuncBlockBase.r";
import { FuncBlockTypes, ValidatorBlockOutput } from "@quasi-dev/compiler";

export class ValidatorBlock extends FuncBlockBase {
  label = "validator";
  type: FuncBlockTypes = "validator";
  placeholder = "expression";

  errorMessages: string = "Invalid input";

  dockingDirections: [Direction, string][] = [[Direction.LEFT, "input-plugin"]];
  dockableDirections: [Direction, string][] = [
    [Direction.LEFT, "input-plugin"],
  ];

  get slotsUsage(): string[] {
    return [];
  }
  get noOutput() {
    return true;
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
