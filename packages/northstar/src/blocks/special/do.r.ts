import { DoBlockOutput } from "@quasi-dev/compiler";
import {
  Block,
  Direction,
  MultiInSocket,
  PATH_IN_TRIANGLE,
  PATH_OUT_TRIANGLE,
  RectBlock,
  SingleOutSocket,
  Socket,
  UseSocket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { Context } from "refina";
import { PropsData } from "../../utils/props";
import { multiInSocketToOutput, singleOutSocketToOutput } from "../../utils/toOutpus";

export class DoBlock extends RectBlock {
  cloneTo(target: this): this {
    super.cloneTo(target);
    target.socketNum = this.socketNum;
    return target;
  }

  type = "state-setter";

  boardWidth = 70;
  boardHeight = 30;

  removable = true;
  duplicateable = true;

  get whenSocket() {
    return this.getSocketByName("when") as MultiInSocket;
  }
  get thenSockets() {
    return this.getSocketsByPrefix("then") as SingleOutSocket[];
  }

  socketNum: number = 2;

  socketUpdater(useSocket: UseSocket): void {
    useSocket("when", MultiInSocket, {
      hideLabel: true,
      type: "E",
      path: PATH_IN_TRIANGLE,
      direction: Direction.TOP,
    });

    for (let i = 0; i < this.socketNum; i++) {
      useSocket(`then-${i}`, SingleOutSocket, {
        hideLabel: true,
        type: "E",
        path: PATH_OUT_TRIANGLE,
        direction: Direction.BOTTOM,
      });
    }
  }

  getProps(): PropsData {
    return [
      {
        name: "number",
        type: "text",
        getVal: () => {
          return this.socketNum.toString();
        },
        setVal: val => {
          const length = parseInt(val);
          this.socketNum = isNaN(length) ? 0 : length;
        },
      },
    ];
  }

  contentMain = (_: Context) => {
    _.$cls`absolute flex items-center left-0 top-0 justify-around text-gray-600`;
    _.$css`width:${this.pageWidth}px;height:${this.pageHeight}px;`;
    _.$css`transform:scale(${this.graph.boardScale})`;
    _.div(_ => {
      _.span("do");
    });
  };

  toOutput(): DoBlockOutput {
    let stateBlock: Block = this;
    while (stateBlock.dockedToBlock) {
      stateBlock = stateBlock.dockedToBlock;
    }
    return {
      type: "do",
      id: this.id,
      when: multiInSocketToOutput(this.whenSocket),
      then: this.thenSockets.map(singleOutSocketToOutput),
    };
  }
}

blockCtors["DoBlock"] = DoBlock;
