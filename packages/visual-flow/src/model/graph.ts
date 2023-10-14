import { HTMLElementComponent, ref } from "refina";
import { Point } from "../types";
import { Block } from "./block";
import { Line } from "./line";
import { Socket } from "./socket";

const MIN_ZINDEX = 0;
const BOARD_SCALE_MIN = 0.3;
const BOARD_SCALE_MAX = 1.5;

export enum StateType {
  IDLE,
  DRAGGING_LINE,
  DRAGGING_BLOCK,
  DRAGGING_BOARD,
}

export type State =
  | {
      type: StateType.IDLE;
    }
  | {
      type: StateType.DRAGGING_LINE;
      line: Line;
    }
  | {
      type: StateType.DRAGGING_BLOCK;
      block: Block;
      offsetPageX0: number;
      offsetPageY0: number;
    }
  | {
      type: StateType.DRAGGING_BOARD;
      startPageX: number;
      startPageY: number;
      initialBoardOffsetX: number;
      initialBoardOffsetY: number;
    };

const idelState = { type: StateType.IDLE } as const;

export class Graph {
  ref = ref<HTMLElementComponent<"div">>();
  get el() {
    return this.ref.current?.node;
  }

  /**
   * The position of the left-top corner of the graph in board coord.
   */
  boardOffsetX: number = 0;
  boardOffsetY: number = 0;

  /**
   * 1 in board coord equals `boardScale` px in screen.
   */
  boardScale: number = 1;

  boardPos2GraphPos(boardPos: Point): Point {
    return {
      x: (boardPos.x - this.boardOffsetX) * this.boardScale,
      y: (boardPos.y - this.boardOffsetY) * this.boardScale,
    };
  }
  graphPos2BoardPos(graphPos: Point): Point {
    return {
      x: graphPos.x / this.boardScale + this.boardOffsetX,
      y: graphPos.y / this.boardScale + this.boardOffsetY,
    };
  }

  graphPos2PagePos(graphPos: Point): Point {
    const boundingRect = this.el!.getBoundingClientRect();
    return {
      x: graphPos.x + boundingRect.x,
      y: graphPos.y + boundingRect.y,
    };
  }
  pagePos2GraphPos(pagePos: Point): Point {
    const boundingRect = this.el!.getBoundingClientRect();
    return {
      x: pagePos.x - boundingRect.x,
      y: pagePos.y - boundingRect.y,
    };
  }

  boardPos2PagePos(boardPos: Point): Point {
    return this.graphPos2PagePos(this.boardPos2GraphPos(boardPos));
  }
  pagePos2BoardPos(pagePos: Point): Point {
    return this.graphPos2BoardPos(this.pagePos2GraphPos(pagePos));
  }

  get isMouseInsideGraph(): boolean {
    const { left, top, right, bottom } = this.el!.getBoundingClientRect();
    return (
      this.mousePagePos.x >= left &&
      this.mousePagePos.x <= right &&
      this.mousePagePos.y >= top &&
      this.mousePagePos.y <= bottom
    );
  }

  blocks: Block[] = [];
  lines: Line[] = [];

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
  protected mouseDown: boolean = false;
  mousePagePos: Point;
  mouseGraphPos: Point;
  mouseBoardPos: Point;

  setMousePos(ev: MouseEvent) {
    this.mousePagePos = { x: ev.pageX, y: ev.pageY };
    this.mouseGraphPos = this.pagePos2GraphPos(this.mousePagePos);
    this.mouseBoardPos = this.graphPos2BoardPos(this.mouseGraphPos);
  }

  protected blockZIndex: Block[] = [];

  addBlock(block: Block) {
    block.graph = this;
    this.blocks.push(block);
    this.blockZIndex.push(block);
  }
  removeBlock(block: Block) {
    this.blocks.splice(this.blocks.indexOf(block), 1);
    const index = this.blockZIndex.indexOf(block);
    if (index === -1) throw new Error("Block not found");
    this.blockZIndex.splice(index, 1);
    this.updateBlockZIndex(index);
  }

  addLine(line: Line) {
    this.lines.push(line);
  }
  removeLine(line: Line) {
    this.lines.splice(this.lines.indexOf(line), 1);
  }

  updatePosition() {
    this.blocks.forEach((b) => b.updatePosition());
    this.lines.forEach((l) => l.updatePosition());
  }

  protected getHoveredBlock(): null | Block {
    for (let i = this.blockZIndex.length - 1; i >= 0; i--) {
      const block = this.blockZIndex[i];
      if (block.testHovered(this.mousePagePos)) return block;
    }
    return null;
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

  startDraggingBlock(block: Block) {
    block.dragging = true;
    const { x: blockPageX, y: blockPageY } = block.pagePos;
    this.state = {
      type: StateType.DRAGGING_BLOCK,
      block,
      offsetPageX0: this.mousePagePos.x - blockPageX,
      offsetPageY0: this.mousePagePos.y - blockPageY,
    };
    this.moveBlockToTop(block);
  }

  startDraggingLine(line: Line) {
    line.dragging = true;
    this.state = {
      type: StateType.DRAGGING_LINE,
      line,
    };
  }

  onScale(graphPos: Point, scaleDelta: number) {
    if (
      (this.boardScale <= BOARD_SCALE_MIN && scaleDelta < 0) ||
      (this.boardScale >= BOARD_SCALE_MAX && scaleDelta > 0)
    )
      return false;

    const coordPos = this.graphPos2BoardPos(graphPos);

    this.boardScale += scaleDelta;
    if (this.boardScale < BOARD_SCALE_MIN) this.boardScale = BOARD_SCALE_MIN;
    else if (this.boardScale > BOARD_SCALE_MAX)
      this.boardScale = BOARD_SCALE_MAX;

    const newPosPos = this.graphPos2BoardPos(graphPos);

    this.boardOffsetX += coordPos.x - newPosPos.x;
    this.boardOffsetY += coordPos.y - newPosPos.y;

    this.updatePosition();
    return true;
  }

  onMouseMove(mouseDown: boolean) {
    if (mouseDown && !this.mouseDown) {
      this.onMouseDown();
      return;
    }
    if (!mouseDown && this.mouseDown) {
      this.onMouseUp();
      return;
    }

    if (this.state.type === StateType.DRAGGING_LINE) {
      if (!mouseDown) {
        throw new Error("Not dragging line");
      }
      const { line } = this.state;
      const hoveredBlock = this.getHoveredBlock();
      let connectableSocket: Socket | null;
      if (
        hoveredBlock &&
        (connectableSocket = hoveredBlock.checkConnectable(line))
      ) {
        line.setBoardPosB(this.mouseBoardPos, connectableSocket.direction);
      } else {
        line.setBoardPosB(this.mouseBoardPos);
      }
      line.updatePosition();
    }
    if (this.state.type === StateType.DRAGGING_BLOCK) {
      if (!mouseDown) {
        throw new Error("Not dragging block");
      }
      const { x: pageX0, y: pageY0 } = this.mousePagePos;
      const { block, offsetPageX0, offsetPageY0 } = this.state;
      block.setPagePos({ x: pageX0 - offsetPageX0, y: pageY0 - offsetPageY0 });
      block.updatePosition();
      block.updateLinkedLinesPosition();
    }
    if (this.state.type === StateType.DRAGGING_BOARD) {
      if (!mouseDown) {
        throw new Error("Not dragging board");
      }
      const {
        startPageX,
        startPageY,
        initialBoardOffsetX,
        initialBoardOffsetY,
      } = this.state;
      const { x: mousePageX, y: mousePageY } = this.mousePagePos;
      this.boardOffsetX =
        initialBoardOffsetX + (startPageX - mousePageX) / this.boardScale;
      this.boardOffsetY =
        initialBoardOffsetY + (startPageY - mousePageY) / this.boardScale;
      this.updatePosition();
    }
  }

  onMouseDown() {
    if (this.mouseDown) {
      this.onMouseUp();
    }
    this.mouseDown = true;

    this.state = idelState;

    const hoveredBlock = this.getHoveredBlock();
    if (hoveredBlock) {
      hoveredBlock.onMouseDown();
      return true;
    }
    if (this.isMouseInsideGraph) {
      const pagePos = this.mousePagePos;
      this.state = {
        type: StateType.DRAGGING_BOARD,
        startPageX: pagePos.x,
        startPageY: pagePos.y,
        initialBoardOffsetX: this.boardOffsetX,
        initialBoardOffsetY: this.boardOffsetY,
      };
      return true;
    }
    return false;
  }

  onMouseUp() {
    if (!this.mouseDown) {
      this.onMouseDown();
    }
    this.mouseDown = false;

    if (this.state.type === StateType.IDLE) {
      return false;
    }
    if (this.state.type === StateType.DRAGGING_BOARD) {
      this.state = idelState;
      return true;
    }
    if (this.state.type === StateType.DRAGGING_BLOCK) {
      const { block } = this.state;
      block.dragging = false;
      if (!block.attached) {
        if (this.isMouseInsideGraph) {
          block.attach();
        } else {
          this.removeBlock(block);
        }
      }
      this.state = idelState;
      return true;
    }
    if (this.state.type === StateType.DRAGGING_LINE) {
      const { line } = this.state;
      const hoveredBlock = this.getHoveredBlock();
      let connectableSocket: Socket | null;
      if (
        hoveredBlock &&
        (connectableSocket = hoveredBlock.checkConnectable(line))
      ) {
        connectableSocket.connectTo(line);
        line.dragging = false;
      } else {
        line.a.disconnectTo(line);
      }
      this.state = idelState;
      return true;
    }
    return false;
  }

  onResize() {
    this.updatePosition();
  }
}
