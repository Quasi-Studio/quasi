import { Direction, InSocket, PATH_IN_RECT, RectBlock, Socket, blockCtors } from "@quasi-dev/visual-flow";
import { Context } from "refina";
import { SpecialBlock } from "./base";

export class ViewBlock extends RectBlock implements SpecialBlock {
  inSocket: InSocket;

  constructor() {
    super();

    this.inSocket = new InSocket();

    this.inSocket.type = "L";
    this.inSocket.path = PATH_IN_RECT;

    this.addSocket(Direction.LEFT, this.inSocket);
  }

  boardWidth = 200;
  boardHeight = 50;

  ctor() {
    return new ViewBlock();
  }

  viewName: string;

  contentMain = (_: Context) => {
    _.$cls`absolute flex items-center left-0 top-0 justify-around text-gray-600`;
    _.$css`width:${this.pageWidth}px;height:${this.pageHeight}px;`;
    _.$css`transform:scale(${this.graph.boardScale})`;
    _.div(this.viewName);
  };

  toOutput(): ViewBlockOutput {
    return {
      type: "view",
      id: this.id,
      parent: {
        blockId: this.inSocket.connectedLine?.a.block.id ?? NaN,
        socketName: this.inSocket.connectedLine?.a.label ?? "",
      },
    };
  }
}

blockCtors["ViewBlock"] = ViewBlock;

export interface ViewBlockOutput {
  type: "view";
  id: number;
  parent: {
    blockId: number;
    socketName: string;
  };
}