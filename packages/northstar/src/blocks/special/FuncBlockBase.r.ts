import type { FuncBlockOutput, FuncBlockTypes } from "@quasi-dev/compiler";
import {
  Direction,
  InSocket,
  MultiOutSocket,
  PATH_IN_ELIPSE,
  PATH_OUT_ELIPSE,
  RectBlock,
  Socket,
} from "@quasi-dev/visual-flow";
import { Context, d } from "refina";
import { Props } from "../../utils/props";
import { SpecialBlock } from "./base";

export abstract class FuncBlockBase extends RectBlock implements SpecialBlock {
  clone(): FuncBlockBase {
    const block = new (this.constructor as any)() as FuncBlockBase;
    block.inputValue.value = this.inputValue.value;
    block.initialize();
    block.updateInputSockets();
    return block;
  }

  removable = true;
  duplicateable = true;

  boardWidth: number = 200;
  boardHeight: number = 50;

  useTextarea: boolean = false;
  inputValue = d("");
  placeholder = "";

  abstract name: string;

  content = (_: Context) => {
    _.$cls`text-xs ml-1 mt-[5px] leading-3 text-gray-600`;
    _.div(this.name);

    _._div(
      {
        onmousedown: ev => ev.stopPropagation(),
        onmouseup: ev => ev.stopPropagation(),
        onclick: ev => ev.stopPropagation(),
        onkeydown: ev => ev.stopPropagation(),
      },
      _ => {
        _.$css`--fontFamilyBase: Consolas,'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif`;
        (this.useTextarea
          ? _.$css`margin-top:4px;max-width:180px` && _.fTextarea(this.inputValue, false, this.placeholder, "none")
          : _.$css`min-height:24px;margin-left:-4px` &&
            _.fUnderlineTextInput(this.inputValue, false, this.placeholder)) && this.updateInputSockets();
      },
    );
  };

  abstract getSlots(): string[];

  inputSockets: Record<string, InSocket> = {};
  updateInputSockets() {
    const slots = this.getSlots();
    const newSockets: Record<string, InSocket> = {};
    for (const slot of slots) {
      if (this.inputSockets[slot]) {
        newSockets[slot] = this.inputSockets[slot];
      } else {
        const socket = new InSocket();
        socket.type = "D";
        socket.label = slot;
        socket.path = PATH_IN_ELIPSE;
        newSockets[slot] = socket;
        this.addSocket(Direction.UP, socket);
      }
    }
    for (const key in this.inputSockets) {
      if (!newSockets[key]) {
        const socket = this.inputSockets[key];
        socket.allConnectedLines.forEach(line => {
          line.a.disconnectTo(line);
          (line.b as Socket).disconnectTo(line);
          this.graph.removeLine(line);
        });
        const sockets = this.getSocketsByDirection(socket.direction);
        const index = sockets.indexOf(socket);
        sockets.splice(index, 1);
      }
    }
    this.inputSockets = newSockets;
    this.updateSocketPosition();
  }

  outputSocket: MultiOutSocket;
  initialize() {
    this.outputSocket = new MultiOutSocket();
    this.outputSocket.type = "D";
    this.outputSocket.label = "output";
    this.outputSocket.path = PATH_OUT_ELIPSE;
    this.addSocket(Direction.DOWN, this.outputSocket);
  }

  protected exportData(): any {
    return {
      ...super.exportData(),
      inputValue: this.inputValue.value,
      inputSockets: Object.fromEntries(Object.entries(this.inputSockets).map(([n, s]) => [n, s.id])),
      outputSocket: this.outputSocket.id,
    };
  }
  protected importData(data: any, sockets: any): void {
    super.importData(data, sockets);
    this.inputValue.value = data.inputValue;
    this.inputSockets = Object.fromEntries(Object.entries(data.inputSockets).map(([n, s]: any) => [n, sockets[s]]));
    this.outputSocket = sockets[data.outputSocket];
    // this.updateSockets();
  }

  abstract type: FuncBlockTypes;

  getProps(): Props {
    return {};
  }

  toOutput(): FuncBlockOutput {
    const inputs = [];
    for (const [slot, socket] of Object.entries(this.inputSockets)) {
      if (socket.connectedLine) {
        inputs.push({
          slot,
          blockId: socket.connectedLine.a.block.id,
          socketName: socket.connectedLine.a.label,
        });
      }
    }

    return {
      type: this.type,
      id: this.id,
      value: this.inputValue.value,
      inputs,
      output: this.outputSocket.allConnectedLines.map(l => ({
        blockId: (l.b as Socket).block.id,
        socketName: (l.b as Socket).label,
      })),
    };
  }
}
