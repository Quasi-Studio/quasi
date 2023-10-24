import {
  Direction,
  MultiOutSocket,
  PATH_OUT_RECT,
  RectBlock,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { Context } from "refina";

export class RootBlock extends RectBlock {
  constructor() {
    super();

    const outSocket = new MultiOutSocket();

    outSocket.type = "L";
    outSocket.path = PATH_OUT_RECT;

    this.addSocket(Direction.RIGHT, outSocket);
  }

  boardWidth = 200;
  boardHeight = 50;

  ctor() {
    return new RootBlock();
  }

  contentMain = (_: Context) => {
    _.$cls`absolute flex items-center left-0 top-0 justify-around text-gray-600`;
    _.$css`width:${this.pageWidth}px;height:${this.pageHeight}px;`;
    _.$css`transform:scale(${this.graph.boardScale})`;
    _.div("root");
  };
}

blockCtors["RootBlock"] = RootBlock;
