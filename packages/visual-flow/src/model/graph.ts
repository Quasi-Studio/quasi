import { Point, opposite } from "../types";
import { ModelBase } from "./base";
import { Block } from "./block";
import { Line, createPointWithDirection } from "./line";
import { Socket } from "./socket";

const MIN_DISTANCE = 20 * 20;
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
  lines: Line[] = [];

  protected state: State = idelState;

  hoveredSocket: Socket | null = null;

  protected blockZIndex: Block[] = [];

  addBlock(block: Block) {
    block.graph = this;
    this.blocks.push(block);
    this.blockZIndex.push(block);
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
    return socket && distance < MIN_DISTANCE ? { socket, distance } : null;
  }

  protected getHoveredBlock(pos: Point): null | Block {
    for (const b of this.blocks) {
      if (b.isPosInside(pos)) return b;
    }
    return null;
  }

  protected updateHoveredSocket(pos: Point) {
    const s = this.getNearestSocket(pos);
    if (s) {
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

    const blockLeftMax =
      this.el!.offsetLeft + this.el!.offsetWidth - block.width;
    const blockTopMax =
      this.el!.offsetTop + this.el!.offsetHeight - block.height;

    if (block.outsideGraph) {
      if (
        blockLeft > this.el!.offsetLeft &&
        blockLeft < blockLeftMax &&
        blockTop > this.el!.offsetTop &&
        blockTop < blockTopMax
      )
        block.outsideGraph = false;
    } else {
      if (blockLeft <= this.el!.offsetLeft) blockLeft = this.el!.offsetLeft + 1;
      else if (blockLeft >= blockLeftMax) blockLeft = blockLeftMax - 1;

      if (blockTop <= this.el!.offsetTop) blockTop = this.el!.offsetTop + 1;
      else if (blockTop >= blockTopMax) blockTop = blockTopMax - 1;
    }

    block.moveTo(blockLeft, blockTop);
  }

  protected updateDraggingLineEnd(pos: Point) {
    if (this.state.type !== StateType.DRAGGING_LINE)
      throw new Error("Not dragging line");
    this.state.line.b = createPointWithDirection(
      pos.x - this.el!.offsetLeft,
      pos.y - this.el!.offsetTop,
      this.hoveredSocket && this.hoveredSocket !== this.state.line.a
        ? this.hoveredSocket.direction
        : opposite(this.state.socket.direction),
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

  onMouseMove(pos: Point) {
    if (this.state.type === StateType.IDLE) {
      this.updateHoveredSocket(pos);
    } else if (this.state.type === StateType.DRAGGING_LINE) {
      this.updateHoveredSocket(pos);
      this.updateDraggingLineEnd(pos);
    } else {
      this.updateDraggingBlockPos(pos);
    }
  }

  onMouseDown(pos: Point) {
    if (this.state.type === StateType.IDLE) {
      if (this.hoveredSocket) {
        const line = this.hoveredSocket.connected
          ? this.hoveredSocket.disconnect()
          : this.hoveredSocket.connect(
              pos.x - this.el!.offsetLeft,
              pos.y - this.el!.offsetTop,
            );
        this.state = {
          type: StateType.DRAGGING_LINE,
          line,
          socket: this.hoveredSocket,
        };
      } else {
        const hoveredBlock = this.getHoveredBlock(pos);
        if (hoveredBlock) {
          hoveredBlock.dragging = true;
          this.moveBlockToTop(hoveredBlock);
          this.state = {
            type: StateType.DRAGGING_BLOCK,
            block: hoveredBlock,
            dx: pos.x - hoveredBlock.x,
            dy: pos.y - hoveredBlock.y,
          };
        }
      }
    } else {
      throw new Error("Why are you here?");
    }
  }

  onMouseUp(pos: Point) {
    if (this.state.type === StateType.DRAGGING_LINE) {
      if (
        this.hoveredSocket &&
        this.state.line.a !== this.hoveredSocket &&
        this.state.socket !== this.hoveredSocket &&
        !this.hoveredSocket.connected
      ) {
        this.hoveredSocket.connect(pos.x, pos.y, this.state.line);
      } else {
        this.state.line.a.disconnect();
      }
      this.state = idelState;
    } else if (this.state.type === StateType.DRAGGING_BLOCK) {
      this.updateDraggingBlockPos(pos);
      this.state.block.dragging = false;
      this.state = idelState;
    }
  }
}
