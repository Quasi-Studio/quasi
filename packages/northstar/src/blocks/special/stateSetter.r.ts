import { StateSetterBlockOutput } from "@quasi-dev/compiler";
import {
  Block,
  Direction,
  MultiInSocket,
  PATH_IN_ELIPSE,
  PATH_IN_TRIANGLE,
  RectBlock,
  SingleInSocket,
  UseSocket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { Context } from "refina";
import { multiInSocketToOutput, singleInSocketToOutput } from "../../utils/toOutpus";

export class StateSetterBlock extends RectBlock {
  type = "state-setter";

  boardWidth = 50;
  boardHeight = 50;

  removable = true;
  duplicateable = true;

  dockingDirections: Direction[] = [Direction.LEFT];
  dockableDirections: Direction[] = [Direction.LEFT];

  get onsetSocket() {
    return this.getSocketByName("set") as MultiInSocket;
  }
  get inputSocket() {
    return this.getSocketByName("input") as SingleInSocket;
  }
  socketUpdater(useSocket: UseSocket): void {
    useSocket("set", MultiInSocket, {
      hideLabel: true,
      type: "E",
      path: PATH_IN_TRIANGLE,
      direction: Direction.TOP,
    });
    useSocket("input", SingleInSocket, {
      hideLabel: true,
      type: "D",
      path: PATH_IN_ELIPSE,
      direction: Direction.TOP,
    });
  }

  contentMain = (_: Context) => {
    _.$cls`absolute flex items-center left-0 top-0 justify-around text-gray-600`;
    _.$css`width:${this.pageWidth}px;height:${this.pageHeight}px;`;
    _.$css`transform:scale(${this.graph.boardScale})`;
    _.div(_ => {
      _.span("setter");
    });
  };

  toOutput(): StateSetterBlockOutput {
    let stateBlock: Block = this;
    while (stateBlock.dockedToBlock) {
      stateBlock = stateBlock.dockedToBlock;
    }
    return {
      type: "state-setter",
      id: this.id,
      onset: multiInSocketToOutput(this.onsetSocket),
      input: singleInSocketToOutput(this.inputSocket),
      state: stateBlock.id,
    };
  }
}

blockCtors["StateSetterBlock"] = StateSetterBlock;
