import { Graph } from ".";
import { Direction, Point, opposite, toPoint } from "../types";
import { ModelBase } from "./base";
import { Socket } from "./socket";

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

  // get path() {
  //   let controlPoint1 = Point.add(
  //     this.aPosition,
  //     toPoint(this.a.direction, 80),
  //   );
  //   // let controlPoint2 = Point.add(
  //   //   this.bPosition,
  //   //   toPoint(this.b.direction, 80),
  //   // );
  //   let controlPoint2: Point;
  //   if (this.connected) {
  //     controlPoint2 = Point.add(
  //       this.bPosition,
  //       toPoint(this.b.direction, 80),
  //     );
  //   } else {
  //     controlPoint2 = this.bPosition;
  //   }
  //   return `M ${this.a.graphX} ${this.a.graphY} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${this.bPosition.x} ${this.bPosition.y}`;
  // }

  get path() {
    let controlPoint1 = Point.add(
      this.aPosition,
      toPoint(this.a.direction, 80),
    );
    if (this.connected) {
      let controlPoint2 = Point.add(
        this.bPosition,
        toPoint(this.b.direction, 80),
      );
      return `M ${this.a.graphX} ${this.a.graphY} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${this.bPosition.x} ${this.bPosition.y}`;
    } else {
      // controlPoint2 = this.bPosition;
      return `M ${this.a.graphX} ${this.a.graphY} S ${controlPoint1.x} ${controlPoint1.y}, ${this.b.graphX} ${this.b.graphY}`
    }
  }
}
