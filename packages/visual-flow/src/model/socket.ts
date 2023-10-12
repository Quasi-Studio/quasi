import { Block } from ".";
import { opposite, type Direction, Point } from "../types";
import { ModelBase } from "./base";
import { Line, createPointWithDirection } from "./line";

export class Socket extends ModelBase<SVGElement> {
  constructor(public label: string) {
    super();
  }

  block: Block;
  direction: Direction;

  // position relative to the block
  blockX: number;
  blockY: number;

  checkConnectable: (line: Line) => boolean = () => this.connected === null;

  get graph() {
    return this.block.graph;
  }

  get graphX() {
    const graphPageX = this.graph.el!.getBoundingClientRect().left;
    return this.block.pageX + this.blockX - graphPageX;
  }
  get graphY() {
    const graphPageY = this.graph.el!.getBoundingClientRect().top;
    return this.block.pageY + this.blockY - graphPageY;
  }

  get pageX() {
    return this.block.pageX + this.blockX;
  }
  get pageY() {
    return this.block.pageY + this.blockY;
  }

  connected: Line | null = null;

  clone(): Socket {
    return new Socket(this.label);
  }

  hover() {
    this.el!.classList.add("hovered");
    this.connected?.hover();
  }

  unhover() {
    this.el!.classList.remove("hovered");
    this.connected?.unhover();
  }

  connect(currentX: number, currentY: number, line?: Line) {
    if (!line) {
      line = new Line(
        this.graph,
        this,
        createPointWithDirection(currentX, currentY, opposite(this.direction)),
      );
      this.graph.lines.push(line);
      this.connected = line;
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
