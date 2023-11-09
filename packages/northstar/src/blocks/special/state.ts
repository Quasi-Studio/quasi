import { FuncBlockTypes, StateBlockOutput } from "@quasi-dev/compiler";
import { Block, Direction, blockCtors } from "@quasi-dev/visual-flow";
import { multiOutSocketToOutput } from "../../utils/toOutpus";
import { FuncBlockBase } from "./FuncBlockBase.r";
import { StateSetterBlock } from "./stateSetter.r";

export class StateBlock extends FuncBlockBase {
  name = "state";
  type: FuncBlockTypes = "state";
  placeholder = "initial value";

  clone(): FuncBlockBase {
    const block = new StateBlock();
    block.initialize();
    return block;
  }

  dockableDirections: Direction[] = [Direction.LEFT];

  initialize(): void {
    super.initialize();
  }

  getSlots(): string[] {
    return [];
  }

  toOutput(): StateBlockOutput {
    const setters: number[] = [];
    let currentPluginBlock: Block | undefined = this;
    while (true) {
      currentPluginBlock = currentPluginBlock.dockedByBlocks[0]?.[1];
      if (!currentPluginBlock) {
        break;
      }
      if ((currentPluginBlock as StateSetterBlock).type === "state-setter") {
        setters.push(currentPluginBlock.id);
      } else {
        throw new Error(`Invalid plugin block ${currentPluginBlock.id}`);
      }
    }

    return {
      type: "state",
      id: this.id,
      initExpr: this.inputValue.value,
      output: multiOutSocketToOutput(this.outputSocket),
      setters,
    };
  }
}

blockCtors["StateBlock"] = StateBlock;
