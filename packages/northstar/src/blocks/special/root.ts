import {
  Direction,
  MultiOutSocket,
  PATH_OUT_RECT,
  RectBlock,
  blockCtors,
} from "@quasi-dev/visual-flow";

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
}

blockCtors["RootBlock"] = RootBlock;
