import type { IfBlockOutput } from "@quasi-dev/compiler";
import {
  Direction,
  MultiInSocket,
  PATH_IN_ELIPSE,
  PATH_IN_TRIANGLE,
  PATH_OUT_TRIANGLE,
  RectBlock,
  SingleInSocket,
  SingleOutSocket,
  UseSocket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { Context } from "refina";
import { PropsData } from "../../utils/props";
import { multiInSocketToOutput, singleInSocketToOutput, singleOutSocketToOutput } from "../../utils/toOutpus";
import { SpecialBlock } from "./base";

export class IfElseBlock extends RectBlock implements SpecialBlock {
  removable = true;
  duplicateable = true;

  boardWidth: number = 200;
  boardHeight: number = 50;

  get condSocket() {
    return this.getSocketByName("cond") as SingleInSocket;
  }
  get whenSocket() {
    return this.getSocketByName("when") as MultiInSocket;
  }
  get thenSocket() {
    return this.getSocketByName("then") as SingleOutSocket;
  }
  get elseSocket() {
    return this.getSocketByName("else") as SingleOutSocket;
  }

  socketUpdater(useSocket: UseSocket): void {
    useSocket("cond", SingleInSocket, {
      type: "D",
      path: PATH_IN_ELIPSE,
      direction: Direction.TOP,
    });
    useSocket("when", MultiInSocket, {
      type: "E",
      path: PATH_IN_TRIANGLE,
      direction: Direction.LEFT,
    });
    useSocket("then", SingleOutSocket, {
      type: "E",
      path: PATH_OUT_TRIANGLE,
      direction: Direction.BOTTOM,
    });
    useSocket("else", SingleOutSocket, {
      type: "E",
      path: PATH_OUT_TRIANGLE,
      direction: Direction.BOTTOM,
    });
  }

  contentMain = (_: Context) => {
    _.$cls`absolute flex items-center left-0 top-0 justify-around text-gray-600`;
    _.$css`width:${this.pageWidth}px;height:${this.pageHeight}px;`;
    _.$css`transform:scale(${this.graph.boardScale})`;
    _.div("if-else");
  };

  getProps(): PropsData {
    return [];
  }

  toOutput(): IfBlockOutput {
    return {
      type: "if",
      id: this.id,
      condition: singleInSocketToOutput(this.condSocket),
      when: multiInSocketToOutput(this.whenSocket),
      then: singleOutSocketToOutput(this.thenSocket),
      else: singleOutSocketToOutput(this.elseSocket),
    };
  }
}

blockCtors["IfElseBlock"] = IfElseBlock;
