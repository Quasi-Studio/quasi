import {
  Context,
  HTMLElementComponent,
  SVGElementComponent,
  ref,
} from "refina";
import { Direction, Point, rotate } from "../types";
import { ModelBase } from "./base";
import { Graph } from "./graph";
import { Line } from "./line";
import { Socket } from "./socket";

const MIN_INSIDE_DISTANCE_SQUARE = 25 * 25;
const MIN_OUTSIDE_DISTANCE_SQUARE = 40 * 40;
const MIN_DOCKING_DISTANCE_SQUARE = 40 * 40;

export type UseSocket = <T extends Socket>(
  name: string,
  ctor: new () => T,
  data: Partial<T>,
) => T;

export type UsedSockets = [string, Socket][];

export abstract class Block extends ModelBase {
  abstract cloneTo(target: this): this;
  clone() {
    return this.cloneTo(new (this.constructor as any)());
  }

  graph: Graph;

  ref = ref<HTMLElementComponent<"div">>();
  get el() {
    return this.ref.current?.node;
  }

  bgRef = ref<SVGElementComponent<"path">>();
  get bgEl() {
    return this.bgRef.current?.node;
  }

  boardX: number;
  boardY: number;
  get boardPos(): Point {
    return { x: this.boardX, y: this.boardY };
  }
  get graphPos(): Point {
    return this.graph.boardPos2GraphPos(this.boardPos);
  }
  get pagePos(): Point {
    return this.graph.boardPos2PagePos(this.boardPos);
  }

  abstract get boundingRectBoardWidth(): number;
  abstract get boundingRectBoardHeight(): number;

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

  protected _selected: boolean = false;
  get selected() {
    return this._selected;
  }
  set selected(selected: boolean) {
    this._selected = selected;
    for (const [_d, b] of this.dockedByBlocks) {
      b.selected = selected;
    }
  }
  predicting: boolean = false;
  pendingClick: boolean = false;

  /**
   * Whether the block is attached to the graph.
   * When dragging from the panel, it is not attached until the mouse is released inside the graph.
   */
  attached = false;

  dockableDirections: [Direction, string][] = [];
  dockingDirections: [Direction, string][] = [];
  dockedToBlock: Block | null = null;
  dockedByBlocks: [Direction, Block][] = [];

  /**
   * @example `direction` is `LEFT`, then returns the top-left point of the block.
   */
  abstract getDockingBenchmarkBlockPos(direction: Direction): Point;
  getDockingBenchmarkBoardPos(direction: Direction): Point {
    return this.blockPos2BoardPos(this.getDockingBenchmarkBlockPos(direction));
  }
  getDockedBenchmarkBlockPos(direction: Direction): Point {
    return this.getDockingBenchmarkBlockPos(rotate(direction));
  }
  getDockedBenchmarkBoardPos(direction: Direction): Point {
    return this.getDockingBenchmarkBoardPos(rotate(direction));
  }

  setBoardPos(boardPos: Point) {
    if (this.dockedToBlock) {
      return;
    }
    this.boardX = boardPos.x;
    this.boardY = boardPos.y;
    this.setDockedBlocksPos();
  }

  setDockPos(direction: Direction, benchmarkBoardPoint: Point) {
    const benchmarkBlockPos = this.getDockingBenchmarkBlockPos(direction);
    this.boardX = benchmarkBoardPoint.x - benchmarkBlockPos.x;
    this.boardY = benchmarkBoardPoint.y - benchmarkBlockPos.y;
    this.setDockedBlocksPos();
    this.updatePosition(); // TODO: why remove this will cause issue?
  }

  protected setDockedBlocksPos() {
    for (const [dockedDirection, dockedBlock] of this.dockedByBlocks) {
      dockedBlock.setDockPos(
        dockedDirection,
        this.getDockedBenchmarkBoardPos(dockedDirection),
      );
    }
  }

  moveToTop() {
    for (const [_d, b] of this.dockedByBlocks) {
      this.graph.moveBlockToTop(b);
    }
    this.graph.moveBlockToTop(this);
    this.graph.updateBlockZIndex();
  }

  attach() {
    this.attached = true;
  }

  dockTo(block: Block, direction: Direction) {
    this.dockedToBlock = block;
    block.dockBy(this, direction);
  }
  protected dockBy(block: Block, direction: Direction) {
    this.dockedByBlocks.push([direction, block]);
    this.moveToTop();
    block.setDockPos(direction, this.getDockedBenchmarkBoardPos(direction));
  }
  undockFrom() {
    this.dockedToBlock!.undockBy(this);
    this.dockedToBlock = null;
  }
  protected undockBy(block: Block) {
    this.dockedByBlocks = this.dockedByBlocks.filter(([_d, b]) => b !== block);
  }

  sockets: [string, Socket][] = [];

  get allSockets(): Socket[] {
    return this.sockets.map(([_, socket]) => socket);
  }

  getSocketByName(name: string) {
    return this.sockets.find(([n, _]) => n === name)?.[1];
  }
  getSocketsByPrefix(prefix: string) {
    prefix += "-";
    return this.sockets
      .filter(([n, _]) => n.startsWith(prefix))
      .map(([_, s]) => s);
  }

  abstract socketUpdater(
    useSocket: UseSocket,
    usedSockets: [string, Socket][],
  ): void;

  updateSockets() {
    const socketsToRemove = new Map(this.sockets);
    const newSockets: [string, Socket][] = [];

    this.socketUpdater(
      <T extends Socket>(name: string, ctor: new () => T, data: Partial<T>) => {
        let socket = socketsToRemove.get(name);
        if (socket) {
          socketsToRemove.delete(name);
        } else {
          socket = new ctor();
          socket.block = this;
        }
        socket.label = name;
        if (data.disabled) {
          socket.allConnectedLines.forEach((l) => {
            l.a.disconnectTo(l);
            (l.b as Socket).disconnectTo(l);
            this.graph.removeLine(l);
          });
        }
        Object.assign(socket, data);
        newSockets.push([name, socket]);

        return socket as T;
      },
      newSockets,
    );

    for (const socket of socketsToRemove.values()) {
      socket.allConnectedLines.forEach((l) => {
        l.a.disconnectTo(l);
        (l.b as Socket).disconnectTo(l);
        this.graph.removeLine(l);
      });
    }
    this.sockets = newSockets;

    this.updateSocketPosition();
  }

  updatePosition() {
    const { x, y } = this.attached ? this.graphPos : this.pagePos;
    if (this.el) this.el.style.left = `${x}px`;
    if (this.el) this.el.style.top = `${y}px`;
    this.updateSocketPosition();
    this.updateLinkedLinesPosition();
    this.updateDockedBlocksPosition();
  }
  abstract updateSocketPosition(): void;
  protected updateLinkedLinesPosition() {
    this.allSockets.forEach((s) =>
      s.allConnectedLines.forEach((l) => l.updatePosition()),
    );
  }
  protected updateDockedBlocksPosition() {
    this.dockedByBlocks.forEach(([_d, b]) => {
      b.updatePosition();
    });
  }

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

  getDraggingSource(blockOnly: boolean): null | Block | [Socket, number] {
    if (!this.attached) {
      return this;
    }

    const blockPos = this.pagePos2BlockPos(this.graph.mousePagePos);

    const isInside = this.isBlockPosInside(blockPos);

    if (blockOnly) return isInside ? this : null;

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
      return isInside ? [hoveredSocket[0], -Infinity] : hoveredSocket;
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

  isDockableBy(block: Block): null | [number, Direction, Point] {
    if (this === block || this.predicting) return null;
    let minDockingDistanceSquare = MIN_DOCKING_DISTANCE_SQUARE;
    let dockingInfo: [Direction, Point] | null = null;
    for (const [direction, type] of this.dockableDirections) {
      if (
        block.dockingDirections.some(
          (d) => d[0] == direction && d[1] == type,
        ) &&
        this.dockedByBlocks.every(([d, _b]) => d !== direction)
      ) {
        const p1 = this.getDockedBenchmarkBoardPos(direction);
        const p2 = block.getDockingBenchmarkBoardPos(direction);
        const distanceSquare = Point.distanceSquare(p1, p2);
        if (distanceSquare < minDockingDistanceSquare) {
          minDockingDistanceSquare = distanceSquare;
          dockingInfo = [direction, Point.minus(p1, p2)];
        }
      }
    }

    return dockingInfo !== null
      ? [minDockingDistanceSquare, ...dockingInfo]
      : null;
  }

  onHover(): void {
    this.el?.classList.add("hovered");
    this.bgEl?.classList.add("hovered");
    for (const [_d, b] of this.dockedByBlocks) {
      b.onHover();
    }
  }
  onUnhover(): void {
    this.el?.classList.remove("hovered");
    this.bgEl?.classList.remove("hovered");
    for (const [_d, b] of this.dockedByBlocks) {
      b.onUnhover();
    }
  }

  onMouseDown(targetSocket: Socket | null, preserveSelected: boolean): void {
    if (targetSocket) {
      this.graph.clearSelectedBlocks();
      targetSocket.onMouseDown();
    } else {
      if (this.selected && this.graph.selectedBlocks.size > 1) {
        for (const block of this.graph.selectedBlocks) {
          if (block.dockedToBlock) {
            block.undockFrom();
          }
          block.moveToTop();
        }
        this.graph.startDraggingSelectedBlocks();
      } else {
        if (this.dockedToBlock) {
          this.undockFrom();
        }
        this.graph.addSelectedBlock(this, preserveSelected);
        this.pendingClick = true;
        this.moveToTop();
        this.graph.startDraggingBlock(this);
      }
    }
  }

  abstract get backgroudPath(): string;

  abstract contentMain: (_: Context) => void;

  createPredictor(): Block {
    const predictor = this.clone();
    predictor.graph = this.graph;
    predictor.attached = this.attached;
    predictor.selected = true;
    predictor.predicting = true;
    predictor.boardX = this.boardX;
    predictor.boardY = this.boardY;
    return predictor;
  }

  protected abstract exportData(): any;
  exportRecord(): BlockRecord {
    return {
      ctor: this.constructor.name,
      id: this.id,
      boardX: this.boardX,
      boardY: this.boardY,
      dockableDirections: this.dockableDirections,
      dockingDirection: this.dockingDirections,
      dockedToBlock: this.dockedToBlock?.id ?? null,
      dockedByBlocks: this.dockedByBlocks.map(([d, b]) => [d, b.id]),
      sockets: this.sockets.map(([name, socket]) => [name, socket.id]),
      data: this.exportData(),
    };
  }
  protected abstract importData(
    data: any,
    sockets: Record<number, Socket>,
  ): void;
  importRecord(
    record: BlockRecord,
    blocks: Record<number, Block>,
    sockets: Record<number, Socket>,
  ) {
    this.id = record.id;
    this.attached = true;
    this.boardX = record.boardX;
    this.boardY = record.boardY;
    this.dockableDirections = record.dockableDirections;
    this.dockingDirections = record.dockingDirection;
    this.dockedToBlock = record.dockedToBlock
      ? blocks[record.dockedToBlock]
      : null;
    this.dockedByBlocks = record.dockedByBlocks.map(([d, b]) => [d, blocks[b]]);

    for (const [name, socketId] of record.sockets) {
      const socket = sockets[socketId];
      socket.block = this;
      this.sockets.push([name, socket]);
    }
    this.updateSocketPosition();

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
  dockableDirections: [Direction, string][];
  dockingDirection: [Direction, string][];
  dockedToBlock: number | null;
  dockedByBlocks: [Direction, number][];
  sockets: [string, number][];
  data: any;
}
