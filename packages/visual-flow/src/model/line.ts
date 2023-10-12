import { Direction, Point, opposite, toPoint } from "../types";
import { ModelBase } from "./base";
import { Socket } from "./socket";

export type PointWithDirection = Point & { direction: Direction };

export class Line extends ModelBase<SVGElement> {
  constructor(
    public a: Socket,
    public b: Socket | PointWithDirection = {
      x: a.cx,
      y: a.cy,
      direction: opposite(a.direction),
    },
  ) {
    super();
  }

  get aPosition(): Point {
    return {
      x: this.a.cx,
      y: this.a.cy,
    };
  }

  get bPosition(): Point {
    if (this.b instanceof Point) {
      return this.b;
    } else {
      return {
        x: this.b.cx,
        y: this.b.cy,
      };
    }
  }

  connect(s: Socket) {
    if (this.b) throw new Error("Line already connected");
    this.b = s;
  }

  disconnect(s: Socket) {
    if (s === this.a) {
      if (this.b instanceof Point) {
        throw new Error("Line not connected");
      }
      const p = {
        x: this.a.cx,
        y: this.a.cy,
        direction: opposite(this.b.direction),
      };
      this.a = this.b;
      this.b = p;
    } else if (s === this.b) {
      this.b = {
        x: this.b.cx,
        y: this.b.cy,
        direction: opposite(this.a.direction),
      };
    } else {
      throw new Error("Socket not connected");
    }
  }

  get path(): string {
    let controlPoint1 = Point.add(
      this.aPosition,
      toPoint(this.a.direction, 20),
    );
    let controlPoint2 = Point.add(
      this.bPosition,
      toPoint(this.b.direction, 20),
    );
    return `M ${this.a.cx} ${this.a.cy} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${this.bPosition.x} ${this.bPosition.y}`;
  }
}
