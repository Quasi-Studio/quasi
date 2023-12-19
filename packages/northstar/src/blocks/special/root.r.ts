import type { RootBlockOutput } from "@quasi-dev/compiler";
import {
  Direction,
  MultiOutSocket,
  PATH_OUT_RECT,
  RectBlock,
  Socket,
  UseSocket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { Context } from "refina";
import { PropsData } from "../../utils/props";
import { SpecialBlock } from "./base";
import { currentProject } from "../../project";

export class RootBlock extends RectBlock implements SpecialBlock {
  ctorName: string = "RootBlock";

  boardWidth = 200;
  boardHeight = 50;

  get outSocket() {
    return this.getSocketByName("out") as MultiOutSocket;
  }
  socketUpdater(useSocket: UseSocket): void {
    useSocket("out", MultiOutSocket, {
      hideLabel: true,
      type: "L",
      path: PATH_OUT_RECT,
      direction: Direction.RIGHT,
    });
  }

  contentMain = (_: Context) => {
    _.$cls`absolute flex items-center left-0 top-0 justify-around text-gray-600 text-lg`;
    _.$css`width:${this.pageWidth}px;height:${this.pageHeight}px;`;
    _.$css`transform:scale(${this.graph.boardScale})`;
    _.div(_ => {
      _.div(_ => {
        _.$css`font-family:Consolas;transform:translateY(-2px);font-size:20px`;
        _.$cls`mr-1 font-semibold`;
        _.span(currentProject.activeView.name);
        _.span("root");
      });
    });
  };

  getProps(): PropsData {
    return [];
  }

  toOutput(): RootBlockOutput {
    return {
      type: "root",
      id: this.id,
      children: this.outSocket.connectedLines
        .map(line => (line.b as Socket).block)
        .sort((a, b) => a.boardY - b.boardY)
        .map(b => b.id),
    };
  }
}

blockCtors["RootBlock"] = RootBlock;
