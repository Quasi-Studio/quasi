import {
  Direction,
  InSocket,
  MultiOutSocket,
  PATH_IN_TRIANGLE,
  Socket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { FuncBlockBase } from "./FuncBlockBase.r";
import { FuncBlockTypes, StateBlockOutput } from "@quasi-dev/compiler";

export class StateBlock extends FuncBlockBase {
  name = "state";
  type: FuncBlockTypes = "state";
  placeholder = "initial value";

  clone(): FuncBlockBase {
    const block = new StateBlock();
    block.initialize();
    return block;
  }

  setSocket: InSocket;

  initialize(): void {
    super.initialize();

    this.setSocket = new InSocket();
    this.setSocket.label = "set";
    this.setSocket.type = "E";
    this.setSocket.path = PATH_IN_TRIANGLE;
    this.addSocket(Direction.LEFT, this.setSocket);
  }

  getSlots(): string[] {
    return ["input"];
  }

  toOutput(): StateBlockOutput {
    return {
      type: "state",
      id: this.id,
      initExpr: this.inputValue.value,
      set: {
        blockId: this.setSocket.connectedLine?.a.block.id ?? NaN,
        socketName: this.setSocket.connectedLine?.a.label ?? "",
      },
      input: {
        blockId: this.inputSockets["input"].connectedLine?.a.block.id ?? NaN,
        socketName: this.inputSockets["input"].connectedLine?.a.label ?? "",
      },
      output: this.outputSocket.allConnectedLines.map((l) => ({
        blockId: (l.b as Socket).block.id,
        socketName: (l.b as Socket).label,
      })),
    };
  }

  protected exportData() {
    return {
      ...super.exportData(),
      setSocket: this.setSocket.id,
    };
  }
  protected importData(data: any, sockets: any): void {
    super.importData(data, sockets);
    this.setSocket = sockets[data.setSocket];
  }
}

blockCtors["StateBlock"] = StateBlock;
