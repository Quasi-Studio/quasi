import { SVGElementComponent, ref } from "refina";
import { Direction, Point } from "../types";
import { allocateId, calcLineEndDirection } from "../utils";
import { ModelBase } from "./base";
import { Graph } from "./graph";
import { Socket } from "./socket";

const pointWithDirectionSym = Symbol();

export type PointWithDirection = {
  boardX: number;
  boardY: number;
  direction: Direction;
  [pointWithDirectionSym]: true;
};

export abstract class Line extends ModelBase {
  abstract ctor(): Line;

  graph: Graph;
  type: string;

  hasArrow: boolean = true;

  dragging: boolean = false;
  predicting: boolean = false;

  neverLeaves: Socket | null = null;

  lineRef = ref<SVGElementComponent>();
  get lineEl() {
    return this.lineRef.current!.node as SVGElement;
  }

  arrowRef = ref<SVGElementComponent>();
  get arrowEl() {
    return this.arrowRef.current!.node as SVGElement;
  }

  a: Socket;
  b: Socket | PointWithDirection;

  initialize(socketA: Socket, boardPosB: Point) {
    this.a = socketA;
    this.setBoardPosB(boardPosB);
  }

  setBoardPosB(boardPosB: Point, direction?: Direction) {
    const boardPosA = this.a.boardPos;
    this.b = {
      boardX: boardPosB.x,
      boardY: boardPosB.y,
      direction:
        direction ??
        calcLineEndDirection(
          this.a.direction,
          boardPosB.x - boardPosA.x,
          boardPosB.y - boardPosA.y,
        ),
      [pointWithDirectionSym]: true,
    };
  }

  get graphPosA() {
    return this.a.graphPos;
  }
  get graphPosB() {
    if (this.connected) {
      return (this.b as Socket).graphPos;
    } else {
      return this.graph.boardPos2GraphPos({
        x: (this.b as PointWithDirection).boardX,
        y: (this.b as PointWithDirection).boardY,
      });
    }
  }

  get connected() {
    //@ts-ignore
    return this.b[pointWithDirectionSym] !== true;
  }

  updatePosition() {
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

  abstract get linePath(): string;

  abstract get arrowPath(): string;

  createPredictor(): Line {
    const predictor = this.ctor();
    predictor.graph = this.graph;
    predictor.a = this.a;
    predictor.b = this.b;
    predictor.predicting = true;
    return predictor;
  }
}
