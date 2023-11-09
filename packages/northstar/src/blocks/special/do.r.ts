import { DoBlockOutput } from "@quasi-dev/compiler";
import {
  Block,
  Direction,
  MultiInSocket,
  PATH_IN_TRIANGLE,
  PATH_OUT_TRIANGLE,
  RectBlock,
  SingleOutSocket,
  Socket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { Context } from "refina";
import { PropsData } from "../../utils/props";
import { multiInSocketToOutput, singleOutSocketToOutput } from "../../utils/toOutpus";

export class DoBlock extends RectBlock {
  type = "state-setter";

  boardWidth = 70;
  boardHeight = 30;

  removable = true;
  duplicateable = true;

  clone() {
    const block = new DoBlock();
    block.initialize();
    return block;
  }

  whenSocket: MultiInSocket;
  thenSockets: SingleOutSocket[] = [];

  initialize(): void {
    this.whenSocket = new MultiInSocket();
    this.whenSocket.label = "when";
    this.whenSocket.hideLabel = true;
    this.whenSocket.type = "E";
    this.whenSocket.path = PATH_IN_TRIANGLE;
    this.addSocket(Direction.TOP, this.whenSocket);

    this.updateSockets(2);
  }

  updateSockets(length: number): void {
    if (length < this.thenSockets.length) {
      for (let i = length; i < this.thenSockets.length; i++) {
        const socket = this.thenSockets[i];
        socket.allConnectedLines.forEach(l => {
          l.a.disconnectTo(l);
          (l.b as Socket).disconnectTo(l);
          this.graph.removeLine(l);
        });
        const sockets = this.getSocketsByDirection(socket.direction);
        const index = sockets.indexOf(socket);
        sockets.splice(index, 1);
      }
      this.thenSockets = this.thenSockets.slice(0, length);
    } else if (length > this.thenSockets.length) {
      for (let i = this.thenSockets.length; i < length; i++) {
        const socket = new SingleOutSocket();
        socket.label = `then${i}`;
        socket.hideLabel = true;
        socket.type = "E";
        socket.path = PATH_OUT_TRIANGLE;
        this.addSocket(Direction.BOTTOM, socket);
        this.thenSockets.push(socket);
      }
    }
  }

  getProps(): PropsData {
    return [
      {
        name: "number",
        type: "text",
        getVal: () => {
          return this.thenSockets.length.toString();
        },
        setVal: val => {
          const length = parseInt(val);
          if (isNaN(length)) return;
          this.updateSockets(length);
        },
      },
    ];
  }

  contentMain = (_: Context) => {
    _.$cls`absolute flex items-center left-0 top-0 justify-around text-gray-600`;
    _.$css`width:${this.pageWidth}px;height:${this.pageHeight}px;`;
    _.$css`transform:scale(${this.graph.boardScale})`;
    _.div(_ => {
      _.span("do");
    });
  };

  toOutput(): DoBlockOutput {
    let stateBlock: Block = this;
    while (stateBlock.dockedToBlock) {
      stateBlock = stateBlock.dockedToBlock;
    }
    return {
      type: "do",
      id: this.id,
      when: multiInSocketToOutput(this.whenSocket),
      then: this.thenSockets.map(singleOutSocketToOutput),
    };
  }

  protected exportData() {
    return {
      ...super.exportData(),
      whenSocket: this.whenSocket.id,
      thenSockets: this.thenSockets.map(s => s.id),
    };
  }
  protected importData(data: any, sockets: any): void {
    super.importData(data, sockets);
    this.whenSocket = sockets[data.whenSocket];
    this.thenSockets = data.thenSockets.map((id: number) => sockets[id]);
  }
}

blockCtors["DoBlock"] = DoBlock;
