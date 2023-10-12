import type { Direction } from "../types";
import { ModelBase } from "./base";
import { Line } from "./line";

export class Socket extends ModelBase<SVGElement> {
  constructor(
    public label: string,
    public direction: Direction,
  ) {
    super();
  }

  // position relative to the block
  cx: number;
  cy: number;

  connected: Line | null = null;

  clone(): Socket {
    return new Socket(this.label, this.direction);
  }

  hover() {
    this.el!.classList.add("hovered");
  }

  unhover() {
    this.el!.classList.remove("hovered");
  }

  connect(line?: Line) {
    if (!line) {
      line = new Line(this);
      return line;
    }
    if (this.connected) {
      throw new Error("Socket already connected");
    }
    this.connected = line;
    line.connect(this);
    return line;
  }

  disconnect() {
    const line = this.connected;
    line!.disconnect(this);
    this.connected = null;
    return line!;
  }
}

export type Sockets = Record<Direction, Socket[]>;
