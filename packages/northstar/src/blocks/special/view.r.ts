import type { ViewBlockOutput } from "@quasi-dev/compiler";
import { Direction, SingleInSocket, PATH_IN_RECT, RectBlock, blockCtors } from "@quasi-dev/visual-flow";
import { Context } from "refina";
import { PropsData } from "../../utils/props";
import { SpecialBlock } from "./base";

export class ViewBlock extends RectBlock implements SpecialBlock {
  clone() {
    const block = new ViewBlock();
    block.viewName = this.viewName;
    block.initialize();
    return block;
  }

  removable = true;
  duplicateable = true;

  inSocket: SingleInSocket;

  initialize(): void {
    this.inSocket = new SingleInSocket();

    this.inSocket.type = "L";
    this.inSocket.label = "parent";
    this.inSocket.hideLabel = true;
    this.inSocket.path = PATH_IN_RECT;

    this.addSocket(Direction.LEFT, this.inSocket);
  }

  boardWidth = 200;
  boardHeight = 50;

  viewName: string;

  contentMain = (_: Context) => {
    _.$cls`absolute flex items-center left-0 top-0 justify-around text-gray-600`;
    _.$css`width:${this.pageWidth}px;height:${this.pageHeight}px;`;
    _.$css`transform:scale(${this.graph.boardScale})`;
    _.div(this.viewName);
  };

  getProps(): PropsData {
    return [];
  }

  protected exportData() {
    return {
      ...super.exportData(),
      inSocket: this.inSocket.id,
    };
  }
  protected importData(data: any, sockets: any): void {
    super.importData(data, sockets);
    this.inSocket = sockets[data.inSocket];
  }

  toOutput(): ViewBlockOutput {
    return {
      type: "view",
      id: this.id,
      viewName: this.viewName,
      parent: {
        blockId: this.inSocket.connectedLine?.a.block.id ?? NaN,
        socketName: this.inSocket.connectedLine?.a.label ?? "",
      },
    };
  }
}

blockCtors["ViewBlock"] = ViewBlock;
