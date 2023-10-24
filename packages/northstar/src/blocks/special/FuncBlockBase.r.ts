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

export abstract class FuncBlockBase extends RectBlock {
  constructor() {
    super();
    const outSocket = new MultiOutSocket();
    outSocket.type = "D";
    outSocket.label = "output";
    outSocket.path = PATH_OUT_ELIPSE;
    this.addSocket(Direction.DOWN, outSocket);
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
          : _.$css`min-height:24px` && _.fUnderlineTextInput(this.inputValue, false, this.placeholder)) &&
          this.updateSockets();
      },
    );
  };

  abstract getSlots(): string[];

  sockets: Record<string, InSocket> = {};
  updateSockets() {
    const slots = this.getSlots();
    const newSockets: Record<string, InSocket> = {};
    for (const slot of slots) {
      if (this.sockets[slot]) {
        newSockets[slot] = this.sockets[slot];
      } else {
        const socket = new InSocket();
        socket.type = "D";
        socket.label = slot;
        socket.path = PATH_IN_ELIPSE;
        newSockets[slot] = socket;
        this.addSocket(Direction.UP, socket);
      }
    }
    for (const key in this.sockets) {
      if (!newSockets[key]) {
        const socket = this.sockets[key];
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
    this.sockets = newSockets;
    this.updateSocketPosition();
  }

  protected exportData(): any {
    return {
      inputValue: this.inputValue.value,
    };
  }
  protected importData(data: any): void {
    this.inputValue.value = data.inputValue;
    // this.updateSockets();
  }
}
