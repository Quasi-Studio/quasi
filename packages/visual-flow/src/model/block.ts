import { Direction, Point } from "../types";
import { ModelBase } from "./base";
import { Socket } from "./socket";
import { Graph } from ".";

export class Block extends ModelBase<HTMLDivElement> {
  constructor(public text: string) {
    super();
  }

  graph: Graph;

  x: number;
  y: number;
  width: number;
  height: number;

  zIndex: number;

  dragging: boolean = false;

  outsideGraph = true;

  leftSockets: Socket[] = [];
  rightSockets: Socket[] = [];
  topSockets: Socket[] = [];
  bottomSockets: Socket[] = [];

  get allSockets(): Socket[] {
    return [
      ...this.leftSockets,
      ...this.rightSockets,
      ...this.topSockets,
      ...this.bottomSockets,
    ];
  }

  clone(): Block {
    const block = new Block(this.text);
    block.x = this.x;
    block.y = this.y;
    block.width = this.width;
    block.height = this.height;
    block.leftSockets = this.leftSockets.map((s) => s.clone());
    block.rightSockets = this.rightSockets.map((s) => s.clone());
    block.topSockets = this.topSockets.map((s) => s.clone());
    block.bottomSockets = this.bottomSockets.map((s) => s.clone());
    return block;
  }

  addSocket(direction: Direction, socket: Socket) {
    socket.block = this;
    socket.direction = direction;
    this.getSocketsByDirection(direction).push(socket);
    this.updateSocketPosition();
  }

  getSocketsByDirection(direction: Direction) {
    return {
      [Direction.LEFT]: this.leftSockets,
      [Direction.RIGHT]: this.rightSockets,
      [Direction.TOP]: this.topSockets,
      [Direction.BOTTOM]: this.bottomSockets,
    }[direction];
  }

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.el!.style.left = `${x}px`;
    this.el!.style.top = `${y}px`;

    for (const socket of this.allSockets) {
      if (socket.connected) {
        socket.connected.updatePath();
      }
    }
  }

  updateSocketPosition() {
    calcSocketPos(this.height, this.leftSockets.length).forEach((offset, i) => {
      this.leftSockets[i].cx = 0;
      this.leftSockets[i].cy = offset;
    });
    calcSocketPos(this.height, this.rightSockets.length).forEach(
      (offset, i) => {
        this.rightSockets[i].cx = this.width;
        this.rightSockets[i].cy = offset;
      },
    );
    calcSocketPos(this.width, this.topSockets.length).forEach((offset, i) => {
      this.topSockets[i].cx = offset;
      this.topSockets[i].cy = 0;
    });
    calcSocketPos(this.width, this.bottomSockets.length).forEach(
      (offset, i) => {
        this.bottomSockets[i].cx = offset;
        this.bottomSockets[i].cy = this.height;
      },
    );
  }

  getNearestSocket(pos: Point): null | { socket: Socket; distance: number } {
    const dx = pos.x - this.x;
    const dy = pos.y - this.y;

    let socket: Socket | null = null;
    let distance = Infinity;
    for (const s of this.allSockets) {
      const d = (s.cy - dy) * (s.cy - dy) + (s.cx - dx) * (s.cx - dx);
      if (d < distance) {
        distance = d;
        socket = s;
      }
    }
    return socket ? { socket, distance } : null;
  }

  isPosInside(pos: Point) {
    return (
      pos.x >= this.x &&
      pos.x <= this.x + this.width &&
      pos.y >= this.y &&
      pos.y <= this.y + this.height
    );
  }

  get path() {
    return `m 0 12 v ${this.height - 24} c 0 9 3 12 12 12 h ${
      this.width - 24
    } c 9 0 12 -3 12 -12 
            v -${this.height - 24} c 0 -9 -3 -12 -12 -12 h -${
              this.width - 24
            } c -9 0 -12 3 -12 12`;
  }
}

/**
 * Calculate the position of sockets.
 * Additional `0.1*length` padding is added to the left and right.
 */
function calcSocketPos(length: number, socketNum: number) {
  const ret: number[] = [];
  const offset = (0.8 * length) / (socketNum + 1);
  let x = 0.1 * length;
  for (let i = 0; i < socketNum; i++) {
    x += offset;
    ret.push(x);
  }
  return ret;
}
