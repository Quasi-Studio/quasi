import {
  Context,
  HTMLElementComponent,
  SVGElementComponent,
  ref,
} from "refina";
import { Point } from "../types";
import { ModelBase } from "./base";
import { Graph } from "./graph";
import { Line } from "./line";
import { Socket } from "./socket";

const MIN_INSIDE_DISTANCE_SQUARE = 25 * 25;
const MIN_OUTSIDE_DISTANCE_SQUARE = 40 * 40;

export abstract class Block extends ModelBase {
  graph: Graph;

  ref = ref<HTMLElementComponent<"div">>();
  get el() {
    return this.ref.current?.node;
  }

  bgRef = ref<SVGElementComponent<"path">>();
  get bgEl() {
    return this.bgRef.current?.node;
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

    return getNearestSocket(connectableSockets, blockPos)?.[0] ?? null;
  }

  getDraggingSource(): null | Block | [Socket, number] {
    if (!this.attached) {
      return this;
    }

    const blockPos = this.pagePos2BlockPos(this.graph.mousePagePos);

    const isInside = this.isBlockPosInside(blockPos);

    const draggableSockets = isInside
      ? this.allSockets.filter((s) => s.canDragFrom())
      : this.allSockets.filter((s) => s.canDragRemove() || s.canDragFrom());

    const maxSocketDistanceSquare: number = isInside
      ? MIN_INSIDE_DISTANCE_SQUARE
      : MIN_OUTSIDE_DISTANCE_SQUARE;

    const hoveredSocket = getNearestSocket(
      draggableSockets,
      blockPos,
      maxSocketDistanceSquare,
    );

    if (hoveredSocket) {
      return hoveredSocket;
    } else {
      return isInside ? this : null;
    }
  }

  getDraggingLineTarget(line: Line): null | Socket | [Socket, number] {
    const blockPos = this.pagePos2BlockPos(this.graph.mousePagePos);

    const connectableSockets = this.allSockets.filter((s) =>
      s.checkConnectable(line),
    );

    if (this.isBlockPosInside(blockPos)) {
      // if the mouse is inside the block, must connect to the nearest connectable socket.
      return getNearestSocket(connectableSockets, blockPos)?.[0] ?? null;
    } else {
      return getNearestSocket(
        connectableSockets,
        blockPos,
        MIN_OUTSIDE_DISTANCE_SQUARE,
      );
    }
  }

  onHover(): void {
    this.el!.classList.add("hovered");
    this.bgEl!.classList.add("hovered");
  }
  onUnhover(): void {
    this.el!.classList.remove("hovered");
    this.bgEl!.classList.remove("hovered");
  }

  onMouseDown(targetSocket: Socket | null): void {
    if (targetSocket) {
      targetSocket.onMouseDown();
    } else {
      this.graph.startDraggingBlock(this);
    }
  }

  abstract get backgroudPath(): string;

  abstract contentMain: (_: Context) => void;

  protected abstract exportData(): any;
  exportRecord(): BlockRecord {
    return {
      ctor: this.constructor.name,
      id: this.id,
      boardX: this.boardX,
      boardY: this.boardY,
      data: this.exportData(),
    };
  }
  protected abstract importData(
    data: any,
    sockets: Record<number, Socket>,
  ): void;
  importRecord(record: BlockRecord, sockets: Record<number, Socket>) {
    this.id = record.id;
    this.boardX = record.boardX;
    this.boardY = record.boardY;
    this.importData(record.data, sockets);
  }
}

function getNearestSocket(
  sockets: Socket[],
  blockPos: Point,
  maxSocketDistanceSquare: number = Infinity,
): [Socket, number] | null {
  let minSocketDistanceSquare = maxSocketDistanceSquare;
  let nearestSocket: null | Socket = null;
  for (const socket of sockets) {
    const distance = Point.distanceSquare(socket.blockPos, blockPos);
    if (distance < minSocketDistanceSquare) {
      minSocketDistanceSquare = distance;
      nearestSocket = socket;
    }
  }
  return nearestSocket ? [nearestSocket, minSocketDistanceSquare] : null;
}

export interface BlockRecord {
  ctor: string;
  id: number;
  boardX: number;
  boardY: number;
  data: any;
}
