import type {
  FuncBlockOutput,
  FuncBlockTypes,
  ImpBlockOutput,
} from "@quasi-dev/compiler";
import {
  Direction,
  MultiInSocket,
  PATH_IN_TRIANGLE,
  PATH_OUT_TRIANGLE,
  SingleOutSocket,
  Socket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { FuncBlockBase } from "./FuncBlockBase.r";

export class ImpBlock extends FuncBlockBase {
  whenSocket: MultiInSocket;
  thenSocket: SingleOutSocket;
  initialize() {
    super.initialize();
    this.whenSocket = new MultiInSocket();
    this.whenSocket.type = "E";
    this.whenSocket.label = "when";
    this.whenSocket.path = PATH_IN_TRIANGLE;
    this.addSocket(Direction.LEFT, this.whenSocket);

    this.thenSocket = new SingleOutSocket();
    this.thenSocket.type = "E";
    this.thenSocket.label = "then";
    this.thenSocket.path = PATH_OUT_TRIANGLE;
    this.addSocket(Direction.RIGHT, this.thenSocket);

    this.updateSocketPosition();
    this.updateOutputSocket();
  }

  boardHeight = 80;

  name = "imperative code";

  outputLabel = "retVal";

  useTextarea = true;

  onInput() {
    this.updateOutputSocket();
  }

  updateOutputSocket() {
    if (this.inputValue.value.match(/\breturn\b/g)) {
      this.outputSocket.disabled = false;
    } else {
      this.outputSocket.disabled = true;
    }
  }

  getSlots() {
    const template = this.inputValue.value;
    const matches = template.matchAll(/\$[a-zA-Z0-9]+/g);
    return [...matches].map((match) => match[0].slice(1));
  }

  type: FuncBlockTypes = "imp";

  protected exportData(): any {
    return {
      ...super.exportData(),
      whenSocket: this.whenSocket.id,
      thenSocket: this.thenSocket.id,
    };
  }
  protected importData(data: any, sockets: any): void {
    super.importData(data, sockets);
    this.whenSocket = sockets[data.whenSocket];
    this.thenSocket = sockets[data.thenSocket];
  }

  toOutput(): ImpBlockOutput {
    return {
      ...(super.toOutput() as FuncBlockOutput),
      type: "imp",
      when: this.whenSocket.allConnectedLines.map((l) => ({
        blockId: l.a.block.id,
        socketName: l.a.label,
      })),
      then: {
        blockId: (this.thenSocket.connectedLine?.b as Socket)?.block.id ?? NaN,
        socketName: (this.thenSocket.connectedLine?.b as Socket)?.label ?? "",
      },
    };
  }
}

blockCtors["ImpBlock"] = ImpBlock;
