import { SVGElementComponent, ref } from "refina";
import { Graph } from ".";
import { Direction, Point, rotate } from "../types";
import { ModelBase } from "./base";
import { Socket } from "./socket";

const CTRL_POINT_OFFSET_SCALE = 0.8;

const ARROW_LENGTH = 25;
const ARROW_WIDTH = 7;
const LINE_OFFSET_FOR_ARROW = 3;

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

  arrowSide: "a" | "b" | null = null;

  lineRef = ref<SVGElementComponent>();
  get lineEl() {
    return this.lineRef.current!.node as SVGElement;
  }

  arrowRef = ref<SVGElementComponent>();
  get arrowEl() {
    return this.arrowRef.current!.node as SVGElement;
  }

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

  get arrowPosition() {
    if (this.arrowSide === "a") {
      return this.aPosition;
    } else if (this.arrowSide === "b") {
      return this.bPosition;
    } else {
      return null;
    }
  }

  get connected() {
    //@ts-ignore
    return this.b[pointWithDirectionSym] !== true;
  }

  updatePath() {
    this.lineEl!.setAttribute("d", this.linePath);
    this.arrowEl.setAttribute("d", this.arrowPath);
  }

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
    let point1 = this.aPosition;
    let point2 = this.bPosition;

    const delta = Point.minus(point2, point1);

    const delta1 = Point.getComponentByDirection(delta, this.a.direction);
    const offset1 = getCtrlPointOffset(delta1);
    const controlPoint1 = Point.moveFarther(point1, this.a.direction, offset1);

    const delta2 = Point.getComponentByDirection(delta, this.b.direction);
    const offset2 = getCtrlPointOffset(delta2);
    const controlPoint2 = Point.moveFarther(point2, this.b.direction, offset2);

    if (this.arrowSide === "a") {
      point1 = Point.moveFarther(
        point1,
        this.a.direction,
        LINE_OFFSET_FOR_ARROW,
      );
    } else if (this.arrowSide === "b") {
      point2 = Point.moveFarther(
        point2,
        this.b.direction,
        LINE_OFFSET_FOR_ARROW,
      );
    }

    return `M ${this.a.graphX} ${this.a.graphY} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${this.bPosition.x} ${this.bPosition.y}`;
  }

  get arrowPath() {
    const p0 = this.arrowPosition!;
    const p1 = Point.moveFarther(p0, this.b.direction, ARROW_LENGTH);
    const p2 = Point.moveFarther(p1, rotate(this.b.direction), ARROW_WIDTH);
    const p3 = Point.moveFarther(p1, rotate(this.b.direction), -ARROW_WIDTH);

    return `M${p0.x} ${p0.y} L${p2.x} ${p2.y} L${p3.x} ${p3.y} Z`;
  }
}
