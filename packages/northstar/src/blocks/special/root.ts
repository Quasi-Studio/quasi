import {
  Direction,
  MultiOutSocket,
  PATH_OUT_RECT,
  RectBlock,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { updateSize } from "../utils";

export class RootBlock extends RectBlock {
  constructor() {
    super();

    const outSocket = new MultiOutSocket();

    outSocket.type = "L";
    outSocket.path = PATH_OUT_RECT;

    this.addSocket(Direction.RIGHT, outSocket);

    updateSize(this);
  }
  ctor() {
    return new RootBlock();
  }
}

blockCtors["RootBlock"] = RootBlock;
