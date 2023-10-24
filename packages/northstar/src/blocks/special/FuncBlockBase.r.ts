import {
  Block,
  Direction,
  InSocket,
  MultiOutSocket,
  PATH_IN_ELIPSE,
  PATH_OUT_ELIPSE,
  RectBlock,
  Socket,
  blockCtors,
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

  boardWidth: number = 200;
  boardHeight: number = 50;

  useTextarea: boolean = false;
  input = d("");

  content = (_: Context) => {
    _._div(
      {
        onmousedown: ev => ev.stopPropagation(),
        onmouseup: ev => ev.stopPropagation(),
        onclick: ev => ev.stopPropagation(),
        onkeydown: ev => ev.stopPropagation(),
      },
      _ => {
        _.$css`font-family: Consolas`;
        (this.useTextarea
          ? _.fTextarea(this.input, false, "none")
          : _.fUnderlineTextInput(this.input, false, "template")) && this.updateSockets();
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
}
