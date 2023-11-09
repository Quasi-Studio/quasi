import { StateSetterBlockOutput } from "@quasi-dev/compiler";
import {
  Block,
  Direction,
  MultiInSocket,
  PATH_IN_ELIPSE,
  PATH_IN_TRIANGLE,
  RectBlock,
  SingleInSocket,
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

  clone() {
    const block = new StateSetterBlock();
    block.initialize();
    return block;
  }

  onsetSocket: MultiInSocket;
  inputSocket: SingleInSocket;

  initialize(): void {
    this.onsetSocket = new MultiInSocket();
    this.onsetSocket.label = "set";
    this.onsetSocket.hideLabel = true;
    this.onsetSocket.type = "E";
    this.onsetSocket.path = PATH_IN_TRIANGLE;
    this.addSocket(Direction.TOP, this.onsetSocket);

    this.inputSocket = new SingleInSocket();
    this.inputSocket.label = "input";
    this.inputSocket.hideLabel = true;
    this.inputSocket.type = "D";
    this.inputSocket.path = PATH_IN_ELIPSE;
    this.addSocket(Direction.TOP, this.inputSocket);
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

  protected exportData() {
    return {
      ...super.exportData(),
      setSocket: this.onsetSocket.id,
      inputSocket: this.inputSocket.id,
    };
  }
  protected importData(data: any, sockets: any): void {
    super.importData(data, sockets);
    this.onsetSocket = sockets[data.setSocket];
    this.inputSocket = sockets[data.inputSocket];
  }
}

blockCtors["StateSetterBlock"] = StateSetterBlock;
