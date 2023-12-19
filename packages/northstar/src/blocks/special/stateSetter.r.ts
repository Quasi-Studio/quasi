import {
  FuncBlockTypes,
  StateBlockOutput,
  StateSetterBlockOutput,
} from "@quasi-dev/compiler";
import {
  Block,
  Direction,
  MultiInSocket,
  PATH_IN_TRIANGLE,
  UseSocket,
  UsedSockets,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { multiInSocketToOutput } from "../../utils/toOutput";
import { ExprBlock } from "./expr";

export class StateSetterBlock extends ExprBlock {
  ctorName: string = "StateSetterBlock";

  type: FuncBlockTypes = "state-setter";
  label = "state setter";
  placeholder = "expr";

  removable = true;
  duplicateable = true;

  dockingDirections: [Direction, string][] = [[Direction.LEFT, "state-plugin"]];
  dockableDirections: [Direction, string][] = [
    [Direction.LEFT, "state-plugin"],
  ];

  get onsetSocket() {
    return this.getSocketByName("set") as MultiInSocket;
  }
  socketUpdater(useSocket: UseSocket, usedSockets: UsedSockets): void {
    super.socketUpdater(useSocket, usedSockets);
    useSocket("set", MultiInSocket, {
      hideLabel: true,
      type: "E",
      path: PATH_IN_TRIANGLE,
      direction: Direction.TOP,
    });
  }

  get noOutput(): boolean {
    return true;
  }

  toOutput(): StateSetterBlockOutput {
    let stateBlock: Block = this;
    while (stateBlock.dockedToBlock) {
      stateBlock = stateBlock.dockedToBlock;
    }
    return {
      ...(super.toOutput() as StateBlockOutput),
      type: "state-setter",
      onset: multiInSocketToOutput(this.onsetSocket),
      state: stateBlock.id,
    };
  }
}

blockCtors["StateSetterBlock"] = StateSetterBlock;
