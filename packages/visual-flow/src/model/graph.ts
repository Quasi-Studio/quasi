import { Point, opposite } from "../types";
import { calcLineEndDirection } from "../utils";
import { ModelBase } from "./base";
import { Block } from "./block";
import { Line, createPointWithDirection } from "./line";
import { Socket } from "./socket";

const MIN_ZINDEX = 0;

export enum StateType {
  IDLE,
  DRAGGING_LINE,
  DRAGGING_BLOCK,
}

export type State =
  | {
      type: StateType.IDLE;
    }
  | {
      type: StateType.DRAGGING_LINE;
      line: Line;
      socket: Socket;
    }
  | {
      type: StateType.DRAGGING_BLOCK;
      block: Block;
      dx: number;
      dy: number;
    };

const idelState = { type: StateType.IDLE } as const;

export class Graph extends ModelBase<HTMLDivElement> {
  blocks: Block[] = [];
  protected lines: Line[] = [];

  get displayLines(): {
    bg: Line[];
    fg: Line[];
  } {
    const state = this.state;
    if (state.type === StateType.DRAGGING_LINE) {
      return {
        bg: this.lines.filter((line) => line !== state.line),
        fg: [state.line],
      };
    } else {
      return {
        bg: this.lines,
        fg: [],
      };
    }
  }

  protected state: State = idelState;

  hoveredSocket: Socket | null = null;

  protected blockZIndex: Block[] = [];

  addBlock(block: Block) {
    block.graph = this;
    this.blocks.push(block);
    this.blockZIndex.push(block);
  }

  addLine(line: Line) {
    this.lines.push(line);
  }
  removeLine(line: Line) {
    this.lines.splice(this.lines.indexOf(line), 1);
  }

  getNearestSocket(pos: Point): null | { socket: Socket; distance: number } {
    let socket: Socket | null = null;
    let distance = Infinity;
    for (const b of this.blocks) {
      const s = b.getNearestSocket(pos);
      if (s && s.distance < distance) {
        distance = s.distance;
        socket = s.socket;
      }
    }
    return socket ? { socket, distance } : null;
  }

  protected getHoveredBlock(pos: Point): null | Block {
    for (const b of this.blocks) {
      if (b.isPosInside(pos)) return b;
    }
    return null;
  }

  protected updateHoveredSocket(pos: Point, checkConnectable: Line | null) {
    const s = this.getNearestSocket(pos);
    if (
      s &&
      (checkConnectable === null || s.socket.checkConnectable(checkConnectable))
    ) {
      if (this.hoveredSocket !== s.socket) {
        if (this.hoveredSocket) this.hoveredSocket.unhover();
        s.socket.hover();
      }
      this.hoveredSocket = s.socket;
    } else {
      if (this.hoveredSocket) this.hoveredSocket.unhover();
      this.hoveredSocket = null;
    }
  }

  protected updateDraggingBlockPos(pos: Point) {
    if (this.state.type !== StateType.DRAGGING_BLOCK)
      throw new Error("Not dragging block");
    const { block, dx, dy } = this.state;

    let blockLeft = pos.x - dx;
    let blockTop = pos.y - dy;

    const boundingRect = this.el!.getBoundingClientRect();
    const blockLeftMax = boundingRect.right - block.width;
    const blockTopMax = boundingRect.bottom - block.height;

    if (block.outsideGraph) {
      if (
        blockLeft > boundingRect.x &&
        blockLeft < blockLeftMax &&
        blockTop > boundingRect.y &&
        blockTop < blockTopMax
      )
        block.outsideGraph = false;
    } else {
      if (blockLeft <= boundingRect.x) blockLeft = boundingRect.x + 1;
      else if (blockLeft >= blockLeftMax) blockLeft = blockLeftMax - 1;

      if (blockTop <= boundingRect.y) blockTop = boundingRect.y + 1;
      else if (blockTop >= blockTopMax) blockTop = blockTopMax - 1;
    }

    block.moveTo(blockLeft, blockTop);
  }

  protected updateDraggingLineEnd(pagePos: Point) {
    if (this.state.type !== StateType.DRAGGING_LINE)
      throw new Error("Not dragging line");
    const boundingRect = this.el!.getBoundingClientRect();

    this.state.line.b = createPointWithDirection(
      pagePos.x - boundingRect.x,
      pagePos.y - boundingRect.y,
      this.hoveredSocket && this.hoveredSocket !== this.state.line.a
        ? this.hoveredSocket.direction
        : calcLineEndDirection(
            this.state.line.a.direction,
            pagePos.x - this.state.line.a.pageX,
            pagePos.y - this.state.line.a.pageY,
          ),
    );
    this.state.line.updatePath();
  }

  protected moveBlockToTop(block: Block) {
    const index = this.blockZIndex.indexOf(block);
    if (index === -1) throw new Error("Block not found");
    this.blockZIndex.splice(index, 1);
    this.blockZIndex.push(block);
    this.updateBlockZIndex(index);
  }

  protected updateBlockZIndex(fromIndex: number) {
    for (let i = fromIndex; i < this.blockZIndex.length; i++) {
      this.blockZIndex[i].zIndex = i + MIN_ZINDEX;
    }
  }

  onMouseMove(pagePos: Point) {
    if (this.state.type === StateType.IDLE) {
      this.updateHoveredSocket(pagePos, null);
      return false;
    } else if (this.state.type === StateType.DRAGGING_LINE) {
      this.updateHoveredSocket(pagePos, this.state.line);
      this.updateDraggingLineEnd(pagePos);
      return true;
    } else {
      this.updateDraggingBlockPos(pagePos);
      return true;
    }
  }

  onMouseDown(pagePos: Point) {
    if (this.state.type === StateType.IDLE) {
      if (this.hoveredSocket) {
        const boundingRect = this.el!.getBoundingClientRect();
        const graphX = pagePos.x - boundingRect.x;
        const graphY = pagePos.y - boundingRect.y;
        const line = this.hoveredSocket.connected
          ? this.hoveredSocket.disconnect()
          : this.hoveredSocket.connect(graphX, graphY);
        line.b = createPointWithDirection(
          graphX,
          graphY,
          calcLineEndDirection(
            line.a.direction,
            pagePos.x - line.a.pageX,
            pagePos.y - line.a.pageY,
          ),
        );
        line.dragging = true;
        this.state = {
          type: StateType.DRAGGING_LINE,
          line,
          socket: this.hoveredSocket,
        };
        return true;
      }
      const hoveredBlock = this.getHoveredBlock(pagePos);
      if (hoveredBlock) {
        hoveredBlock.dragging = true;
        this.moveBlockToTop(hoveredBlock);
        this.state = {
          type: StateType.DRAGGING_BLOCK,
          block: hoveredBlock,
          dx: pagePos.x - hoveredBlock.pageX,
          dy: pagePos.y - hoveredBlock.pageY,
        };
        return true;
      }
      return false;
    }
    throw new Error("Why are you here?");
  }

  onMouseUp(pagePos: Point) {
    if (this.state.type === StateType.DRAGGING_LINE) {
      if (
        this.hoveredSocket &&
        this.state.line.a !== this.hoveredSocket &&
        this.state.socket !== this.hoveredSocket &&
        !this.hoveredSocket.connected
      ) {
        this.hoveredSocket.connect(pagePos.x, pagePos.y, this.state.line);
      } else {
        this.state.line.a.disconnect();
      }
      this.state.line.dragging = false;
      this.state = idelState;
      return true;
    }
    if (this.state.type === StateType.DRAGGING_BLOCK) {
      this.updateDraggingBlockPos(pagePos);
      this.state.block.dragging = false;
      this.state = idelState;
      return true;
    }
    return false;
  }
}
