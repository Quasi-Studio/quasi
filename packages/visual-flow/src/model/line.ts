import { Graph } from ".";
import { Direction, Point } from "../types";
import { ModelBase } from "./base";
import { Socket } from "./socket";

const CTRL_POINT_OFFSET_SCALE = 0.8;

function getCtrlPointOffset(delta: number) {
  return Math.abs(delta * CTRL_POINT_OFFSET_SCALE);
}

const pointWithDirectionSym = Symbol();

export type PointWithDirection = {
  graphX: number;
  graphY: number;
  direction: Direction;
  [pointWithDirectionSym]: true;
};

export function createPointWithDirection(
  graphX: number,
  graphY: number,
  direction: Direction,
): PointWithDirection {
  return {
    graphX,
    graphY,
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

  dragging: boolean = false;

  get aPosition(): Point {
    return {
      x: this.a.graphX,
      y: this.a.graphY,
    };
  }

  get bPosition(): Point {
    return {
      x: (this.b as Socket).graphX,
      y: (this.b as Socket).graphY,
    };
  }

  get connected() {
    //@ts-ignore
    return this.b[pointWithDirectionSym] !== true;
  }

  updatePath() {
    this.el!.setAttribute("d", this.path);
  }

  hover() {
    this.el!.classList.add("hovered");
  }

  unhover() {
    this.el!.classList.remove("hovered");
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
      this.a = this.b as Socket;
      this.b = undefined as any;
    } else if (s === this.b) {
      this.b = undefined as any;
    } else {
      throw new Error("Socket not connected");
    }
  }

  get path() {
    const delta = Point.minus(this.bPosition, this.aPosition);

    const delta1 = Point.getComponentByDirection(delta, this.a.direction);
    const offset1 = getCtrlPointOffset(delta1);
    const controlPoint1 = Point.moveFarther(
      this.aPosition,
      this.a.direction,
      offset1,
    );

    const delta2 = Point.getComponentByDirection(delta, this.b.direction);
    const offset2 = getCtrlPointOffset(delta2);
    const controlPoint2 = Point.moveFarther(
      this.bPosition,
      this.b.direction,
      offset2,
    );

    return `M ${this.a.graphX} ${this.a.graphY} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${this.bPosition.x} ${this.bPosition.y}`;
  }
}
