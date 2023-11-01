import type { RootBlockOutput } from "@quasi-dev/compiler";
import { Direction, MultiOutSocket, PATH_OUT_RECT, RectBlock, Socket, blockCtors } from "@quasi-dev/visual-flow";
import { Context } from "refina";
import { Props } from "../../utils/props";
import { SpecialBlock } from "./base";

export class RootBlock extends RectBlock implements SpecialBlock {
  clone() {
    const block = new RootBlock();
    block.initialize();
    return block;
  }

  outSocket: MultiOutSocket;

  initialize(): void {
    this.outSocket = new MultiOutSocket();

    this.outSocket.type = "L";
    this.outSocket.path = PATH_OUT_RECT;

    this.addSocket(Direction.RIGHT, this.outSocket);
  }

  boardWidth = 200;
  boardHeight = 50;

  contentMain = (_: Context) => {
    _.$cls`absolute flex items-center left-0 top-0 justify-around text-gray-600`;
    _.$css`width:${this.pageWidth}px;height:${this.pageHeight}px;`;
    _.$css`transform:scale(${this.graph.boardScale})`;
    _.div("root");
  };

  getProps(): Props {
    return {};
  }

  protected exportData() {
    return {
      ...super.exportData(),
      outSocket: this.outSocket.id,
    };
  }
  protected importData(data: any, sockets: any): void {
    super.importData(data, sockets);
    this.outSocket = sockets[data.outSocket];
  }

  toOutput(): RootBlockOutput {
    return {
      type: "root",
      id: this.id,
      children: this.outSocket.connectedLines.map(line => (line.b as Socket).block.id),
    };
  }
}

blockCtors["RootBlock"] = RootBlock;
