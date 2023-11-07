import { FuncBlockTypes, StateBlockOutput } from "@quasi-dev/compiler";
import {
  Direction,
  MultiInSocket,
  PATH_IN_TRIANGLE,
  Socket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { FuncBlockBase } from "./FuncBlockBase.r";

export class StateBlock extends FuncBlockBase {
  name = "state";
  type: FuncBlockTypes = "state";
  placeholder = "initial value";

  clone(): FuncBlockBase {
    const block = new StateBlock();
    block.initialize();
    return block;
  }

  onsetSocket: MultiInSocket;

  initialize(): void {
    super.initialize();

    this.onsetSocket = new MultiInSocket();
    this.onsetSocket.label = "set";
    this.onsetSocket.type = "E";
    this.onsetSocket.path = PATH_IN_TRIANGLE;
    this.addSocket(Direction.LEFT, this.onsetSocket);
  }

  getSlots(): string[] {
    return ["input"];
  }

  toOutput(): StateBlockOutput {
    return {
      type: "state",
      id: this.id,
      initExpr: this.inputValue.value,
      onset: this.onsetSocket.allConnectedLines.map((l) => ({
        blockId: l.a.block.id,
        socketName: l.a.label,
      })),
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
      setSocket: this.onsetSocket.id,
    };
  }
  protected importData(data: any, sockets: any): void {
    super.importData(data, sockets);
    this.onsetSocket = sockets[data.setSocket];
  }
}

blockCtors["StateBlock"] = StateBlock;
