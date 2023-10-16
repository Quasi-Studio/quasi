import type { Direction, Point } from "../types";
import type {
  Block,
  BlockRecord,
  GraphRecord,
  Line,
  LineRecord,
  Socket,
  SocketRecord,
} from "../model";

export type CtorMap<T> = Record<string, new () => T>;

export interface VfRecord {
  graph: GraphRecord;
  blocks: BlockRecord[];
  sockets: SocketRecord[];
  lines: LineRecord[];
}

export interface BlockOperation {
  type: "add-block" | "remove-block";
  block: Block;
}

export interface LineOperation {
  type: "add-line" | "remove-line";
  line: Line;
}

export interface ModifyConnectionOperation {
  type: "modify-connection";
  line: Line;
  fromSocket: Socket;
  toSocket: Socket;
}

export interface DockingOperation {
  type: "dock" | "undock";
  dockBy: Block;
  dockTo: Block;
  direction: Direction;
}

export interface MoveBlockOperation {
  type: "move-block";
  block: Block;
  fromBoardPos: Point;
  toBoardPos: Point;
}

export interface DragBoardOperation {
  type: "drag-board";
  fromBoardOffset: Point;
  toBoardOffset: Point;
}

export interface ScaleBoardOperation {
  type: "scale-board";
  fromBoardScale: number;
  toBoardScale: number;
}

export type VfMicroOperation =
  | BlockOperation
  | LineOperation
  | ModifyConnectionOperation
  | DockingOperation
  | MoveBlockOperation
  | DragBoardOperation
  | ScaleBoardOperation;

export type VfMacroOperation = VfMicroOperation[];
