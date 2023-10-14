import { Line, Socket } from "../../model";
import { Direction, Point, rotate } from "../../types";

const CTRL_POINT_OFFSET_SCALE = 0.8;
const CTRL_POINT_OFFSET_MIN = 30;

const ARROW_LENGTH = 25;
const ARROW_WIDTH = 7;
const LINE_OFFSET_FOR_ARROW = 25;

function getCtrlPointOffset(delta: number) {
  return Math.max(
    Math.abs(delta * CTRL_POINT_OFFSET_SCALE),
    CTRL_POINT_OFFSET_MIN,
  );
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

export class BasicLine extends Line {
  dragging: boolean = false;

  hover() {
    this.lineEl!.classList.add("hovered");
    this.arrowEl!.classList.add("hovered");
  }

  unhover() {
    this.lineEl!.classList.remove("hovered");
    this.arrowEl!.classList.remove("hovered");
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

  get linePath() {
    let point1 = this.graphPosA;
    let point2 = this.graphPosB;

    point2 = Point.moveFarther(point2, this.b.direction, LINE_OFFSET_FOR_ARROW);

    const delta = Point.minus(point2, point1);

    const delta1 = Point.getComponentByDirection(delta, this.a.direction);
    const offset1 = getCtrlPointOffset(delta1);
    const controlPoint1 = Point.moveFarther(point1, this.a.direction, offset1);

    const delta2 = Point.getComponentByDirection(delta, this.b.direction);
    const offset2 = getCtrlPointOffset(delta2);
    const controlPoint2 = Point.moveFarther(point2, this.b.direction, offset2);

    return `M${point1.x} ${point1.y} C${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${point2.x} ${point2.y}`;
  }

  get arrowPath() {
    const p0 = this.graphPosB;
    const p1 = Point.moveFarther(p0, this.b.direction, ARROW_LENGTH);
    const p2 = Point.moveFarther(p1, rotate(this.b.direction), ARROW_WIDTH);
    const p3 = Point.moveFarther(p1, rotate(this.b.direction), -ARROW_WIDTH);

    return `M${p0.x} ${p0.y} L${p2.x} ${p2.y} L${p3.x} ${p3.y} Z`;
  }
}
