import { Context, HTMLElementComponent, ref } from "refina";
import { Point } from "../types";
import { ModelBase } from "./base";
import { Graph } from "./graph";
import { Line } from "./line";
import { Socket } from "./socket";

const MIN_INSIDE_DISTANCE_SQUARE = 15 * 15;
const MIN_OUTSIDE_DISTANCE_SQUARE = 30 * 30;

export abstract class Block extends ModelBase {
  graph: Graph;

  ref = ref<HTMLElementComponent<"div">>();
  get el() {
    return this.ref.current?.node;
  }

  /**
   * `NaN` if not attached to the graph.
   * unit: board coord
   */
  boardX: number = NaN;
  boardY: number = NaN;
  get boardPos(): Point {
    return this.attached
      ? { x: this.boardX, y: this.boardY }
      : this.graph.pagePos2BoardPos(this.nonAttachedPagePos);
  }
  get graphPos(): Point {
    return this.attached
      ? this.graph.boardPos2GraphPos(this.boardPos)
      : this.graph.pagePos2GraphPos(this.nonAttachedPagePos);
  }
  get pagePos(): Point {
    return this.attached
      ? this.graph.boardPos2PagePos(this.boardPos)
      : this.nonAttachedPagePos;
  }

  boardPos2BlockPos(boardPos: Point): Point {
    return Point.minus(boardPos, this.boardPos);
  }
  graphPos2BlockPos(graphPos: Point): Point {
    return this.boardPos2BlockPos(this.graph.graphPos2BoardPos(graphPos));
  }
  pagePos2BlockPos(pagePos: Point): Point {
    return this.boardPos2BlockPos(this.graph.pagePos2BoardPos(pagePos));
  }
  blockPos2BoardPos(blockPos: Point): Point {
    return Point.add(blockPos, this.boardPos);
  }
  blockPos2GraphPos(blockPos: Point): Point {
    return this.graph.boardPos2GraphPos(this.blockPos2BoardPos(blockPos));
  }
  blockPos2PagePos(blockPos: Point): Point {
    return this.graph.boardPos2PagePos(this.blockPos2BoardPos(blockPos));
  }

  zIndex: number;

  dragging: boolean = false;

  /**
   * Whether the block is attached to the graph.
   * When dragging from the panel, it is not attached until the mouse is released inside the graph.
   */
  attached = false;
  /**
   * The position relative to body.
   * `NaN` if attached to the graph.
   */
  nonAttachedPageX: number;
  nonAttachedPageY: number;

  get nonAttachedPagePos(): Point {
    return { x: this.nonAttachedPageX, y: this.nonAttachedPageY };
  }

  abstract get allSockets(): Socket[];

  setPagePos(pagePos: Point) {
    if (this.attached) {
      const boardPos = this.graph.pagePos2BoardPos(pagePos);
      this.boardX = boardPos.x;
      this.boardY = boardPos.y;
    } else {
      this.nonAttachedPageX = pagePos.x;
      this.nonAttachedPageY = pagePos.y;
    }
  }

  /**
   * Only can be called after the block is attached to the graph.
   */
  moveTo(boardX: number, boardY: number) {
    this.boardX = boardX;
    this.boardY = boardY;
    this.updatePosition();
  }

  attach() {
    this.attached = true;
    const boardPos = this.graph.pagePos2BoardPos(this.nonAttachedPagePos);
    this.boardX = boardPos.x;
    this.boardY = boardPos.y;
    this.nonAttachedPageX = NaN;
    this.nonAttachedPageY = NaN;
  }

  updatePosition() {
    const { x, y } = this.pagePos;
    this.el!.style.left = `${x}px`;
    this.el!.style.top = `${y}px`;
    this.updateSocketPosition();
  }

  updateLinkedLinesPosition() {
    this.allSockets.forEach((s) =>
      s.allConnectedLines.forEach((l) => l.updatePosition()),
    );
  }

  abstract updateSocketPosition(): void;

  abstract isBlockPosInside(blockPos: Point): boolean;

  /**
   * @returns Whether the line is accepted.
   */
  checkConnectable(line: Line): Socket | null {
    const connectableSockets = this.allSockets.filter((s) =>
      s.checkConnectable(line),
    );

    const pagePos = this.graph.mousePagePos;
    const blockPos = this.pagePos2BlockPos(pagePos);
    return getNearSocket(connectableSockets, blockPos)?.[1] ?? null;
  }

  testHovered(pagePos: Point): boolean {
    if (this.isBlockPosInside(this.pagePos2BlockPos(pagePos))) {
      return true;
    } else {
      const blockPos = this.pagePos2BlockPos(pagePos);
      return this.allSockets.some((s) => {
        return (
          Point.distanceSquare(s.blockPos, blockPos) <=
          MIN_OUTSIDE_DISTANCE_SQUARE
        );
      });
    }
  }

  onMouseDown(): void {
    const pagePos = this.graph.mousePagePos;
    const blockPos = this.pagePos2BlockPos(pagePos);

    const maxSocketDistanceSquare = this.isBlockPosInside(blockPos)
      ? MIN_INSIDE_DISTANCE_SQUARE
      : MIN_OUTSIDE_DISTANCE_SQUARE;

    const result = getNearSocket(this.allSockets, blockPos);

    if (result && result[0] <= maxSocketDistanceSquare) {
      result[1].onMouseDown();
    } else {
      this.graph.startDraggingBlock(this);
    }
  }

  abstract get backgroudPath(): string;

  abstract contentMain: (_: Context) => void;
}

function getNearSocket(
  sockets: Socket[],
  blockPos: Point,
): [number, Socket] | null {
  let minSocketDistanceSquare = Infinity;
  let nearestSocket: null | Socket = null;
  for (const socket of sockets) {
    const distance = Point.distanceSquare(socket.blockPos, blockPos);
    if (distance < minSocketDistanceSquare) {
      minSocketDistanceSquare = distance;
      nearestSocket = socket;
    }
  }
  return nearestSocket ? [minSocketDistanceSquare, nearestSocket!] : null;
}
