import { Graph } from ".";
import { Direction, Point, opposite, toPoint } from "../types";
import { ModelBase } from "./base";
import { Socket } from "./socket";

const pointWithDirectionSym = Symbol();

export type PointWithDirection = Point & {
  direction: Direction;
  [pointWithDirectionSym]: true;
};

export function createPointWithDirection(
  x: number,
  y: number,
  direction: Direction,
): PointWithDirection {
  return {
    x,
    y,
    direction,
    [pointWithDirectionSym]: true,
  };
}

export class Line extends ModelBase<SVGElement> {
  constructor(
    public graph: Graph,
    public a: Socket,
    public b: Socket | PointWithDirection,
  ) {
    super();
  }

  get aPosition(): Point {
    return {
      x: this.a.graphX,
      y: this.a.graphY,
    };
  }

  get bPosition(): Point {
    if (this.connected) {
      return {
        x: (this.b as Socket).graphX,
        y: (this.b as Socket).graphY,
      };
    } else {
      return this.b as PointWithDirection;
    }
  }

  get connected() {
    //@ts-ignore
    return this.b[pointWithDirectionSym] !== true;
  }

  updatePath() {
    this.el!.setAttribute("d", this.path);
  }

  connect(s: Socket) {
    if (this.connected) {
      throw new Error("Line already connected");
    }
    this.b = s;
  }

  disconnect(s: Socket) {
    if (s === this.a) {
      if (!this.connected) {
        this.graph.removeLine(this);
        return;
      }
      const p = createPointWithDirection(
        this.a.graphX,
        this.a.graphY,
        this.graph?.hoveredSocket?.direction ?? opposite(this.b.direction),
      );
      this.a = this.b as Socket;
      this.b = p;
    } else if (s === this.b) {
      this.b = createPointWithDirection(
        this.b.graphX,
        this.b.graphY,
        this.graph?.hoveredSocket?.direction ?? opposite(this.a.direction),
      );
    } else {
      throw new Error("Socket not connected");
    }
  }

  get path() {
    let controlPoint1 = Point.add(
      this.aPosition,
      toPoint(this.a.direction, 80),
    );
    let controlPoint2 = Point.add(
      this.bPosition,
      toPoint(this.b.direction, 80),
    );
    return `M ${this.a.graphX} ${this.a.graphY} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${this.bPosition.x} ${this.bPosition.y}`;
  }
}
