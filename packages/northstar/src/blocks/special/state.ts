import { FuncBlockTypes, StateBlockOutput } from "@quasi-dev/compiler";
import { Block, Direction, blockCtors } from "@quasi-dev/visual-flow";
import { ExprBlock } from "./expr";
import { StateSetterBlock } from "./stateSetter.r";

export class StateBlock extends ExprBlock {
  ctorName: string = "StateBlock";

  label = "state";
  type: FuncBlockTypes = "state";
  placeholder = "initial value";
  outputLabel = "current";

  dockableDirections: [Direction, string][] = [
    [Direction.LEFT, "state-plugin"],
  ];

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
      ...(super.toOutput() as StateBlockOutput),
      type: "state",
      setters,
    };
  }
}

blockCtors["StateBlock"] = StateBlock;
