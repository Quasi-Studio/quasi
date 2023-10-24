import { Direction, MultiOutSocket, PATH_OUT_RECT, RectBlock, Socket, blockCtors } from "@quasi-dev/visual-flow";
import { Context } from "refina";
import { SpecialBlock } from "./base";

export class RootBlock extends RectBlock implements SpecialBlock {
  outSocket: MultiOutSocket;

  constructor() {
    super();

    this.outSocket = new MultiOutSocket();

    this.outSocket.type = "L";
    this.outSocket.path = PATH_OUT_RECT;

    this.addSocket(Direction.RIGHT, this.outSocket);
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

  toOutput(): RootBlockOutput {
    return {
      type: "root",
      id: this.id,
      children: this.outSocket.connectedLines.map(line => ({
        blockId: (line.b as Socket).block.id,
        socketName: (line.b as Socket).label,
      })),
    };
  }
}

blockCtors["RootBlock"] = RootBlock;

export interface RootBlockOutput {
  type: "root";
  id: number;
  children: {
    blockId: number;
    socketName: string;
  }[];
}
