import type { ViewBlockOutput } from "@quasi-dev/compiler";
import { Direction, PATH_IN_RECT, RectBlock, SingleInSocket, blockCtors } from "@quasi-dev/visual-flow";
import { Context } from "refina";
import { PropsData } from "../../utils/props";
import { singleInSocketToOutput } from "../../utils/toOutpus";
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

  parentSocket: SingleInSocket;

  initialize(): void {
    this.parentSocket = new SingleInSocket();

    this.parentSocket.type = "L";
    this.parentSocket.label = "parent";
    this.parentSocket.hideLabel = true;
    this.parentSocket.path = PATH_IN_RECT;

    this.addSocket(Direction.LEFT, this.parentSocket);
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
      inSocket: this.parentSocket.id,
    };
  }
  protected importData(data: any, sockets: any): void {
    super.importData(data, sockets);
    this.parentSocket = sockets[data.inSocket];
  }

  toOutput(): ViewBlockOutput {
    return {
      type: "view",
      id: this.id,
      viewName: this.viewName,
      parent: singleInSocketToOutput(this.parentSocket),
    };
  }
}

blockCtors["ViewBlock"] = ViewBlock;
