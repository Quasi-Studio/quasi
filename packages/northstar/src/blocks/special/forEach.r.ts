import {
  Direction,
  InSocket,
  MultiOutSocket,
  PATH_IN_ELIPSE,
  PATH_IN_RECT,
  PATH_OUT_ELIPSE,
  PATH_OUT_RECT,
  RectBlock,
  Socket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { Context } from "refina";
import { Props } from "../../utils/props";
import { SpecialBlock } from "./base";

export class ForEachBlock extends RectBlock implements SpecialBlock {
  duplicate() {
    const block = new ForEachBlock();
    block.initialize();
    return block;
  }

  parentSocket: InSocket;
  childrenSocket: MultiOutSocket;
  inputSocket: InSocket;
  outputSocket: MultiOutSocket;

  initialize(): void {
    this.parentSocket = new InSocket();
    this.parentSocket.type = "L";
    this.parentSocket.path = PATH_IN_RECT;
    this.addSocket(Direction.LEFT, this.parentSocket);

    this.childrenSocket = new MultiOutSocket();
    this.childrenSocket.type = "L";
    this.childrenSocket.path = PATH_OUT_RECT;
    this.addSocket(Direction.BOTTOM, this.childrenSocket);

    this.inputSocket = new InSocket();
    this.inputSocket.type = "D";
    this.inputSocket.path = PATH_IN_ELIPSE;
    this.addSocket(Direction.TOP, this.inputSocket);

    this.outputSocket = new MultiOutSocket();
    this.outputSocket.type = "D";
    this.outputSocket.path = PATH_OUT_ELIPSE;
    this.addSocket(Direction.RIGHT, this.outputSocket);
  }

  boardWidth = 200;
  boardHeight = 50;

  contentMain = (_: Context) => {
    _.$cls`absolute flex items-center left-0 top-0 justify-around text-gray-600`;
    _.$css`width:${this.pageWidth}px;height:${this.pageHeight}px;`;
    _.$css`transform:scale(${this.graph.boardScale})`;
    _.div("for each");
  };

  getProps(): Props {
    return {};
  }

  protected exportData() {
    return {
      ...super.exportData(),
      sourceSocket: this.parentSocket.id,
      layoutSocket: this.childrenSocket.id,
      inputSocket: this.inputSocket.id,
      outputSocket: this.outputSocket.id,
    };
  }
  protected importData(data: any, sockets: any): void {
    super.importData(data, sockets);
    this.parentSocket = sockets[data.sourceSocket];
    this.childrenSocket = sockets[data.layoutSocket];
    this.inputSocket = sockets[data.inputSocket];
    this.outputSocket = sockets[data.outputSocket];
  }

  toOutput(): ForEachBlockOutput {
    return {
      type: "for-each",
      id: this.id,
      parent: {
        blockId: this.parentSocket.connectedLine?.a.block.id ?? NaN,
        socketName: this.parentSocket.connectedLine?.a.label ?? "",
      },
      children: this.childrenSocket.connectedLines.map(line => ({
        blockId: (line.b as Socket).block.id,
        socketName: (line.b as Socket).label,
      })),
      input: {
        blockId: this.inputSocket.connectedLine?.a.block.id ?? NaN,
        socketName: this.inputSocket.connectedLine?.a.label ?? "",
      },
      output: this.outputSocket.connectedLines.map(line => ({
        blockId: (line.b as Socket).block.id,
        socketName: (line.b as Socket).label,
      })),
    };
  }
}

blockCtors["ForEachBlock"] = ForEachBlock;

export interface ForEachBlockOutput {
  type: "for-each";
  id: number;
  parent: {
    blockId: number;
    socketName: string;
  };
  children: {
    blockId: number;
    socketName: string;
  }[];
  input: {
    blockId: number;
    socketName: string;
  };
  output: {
    blockId: number;
    socketName: string;
  }[];
}
