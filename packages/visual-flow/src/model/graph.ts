import { HTMLElementComponent, ref } from "refina";
import { Point } from "../types";
import { Block, BlockRecord } from "./block";
import { Line, LineRecord } from "./line";
import { Socket, SocketRecord } from "./socket";

const MIN_ZINDEX = 0;
const BOARD_SCALE_MIN = 0.2;
const BOARD_SCALE_MAX = 4;
const AUTO_MOVE_INTERVAL = 10;
const AUTO_MOVE_START_PADDING = 70;
const AUTO_MOVE_SPEED_SCALE = 0.07;
const AUTO_MOVE_SPEED_MAX = AUTO_MOVE_START_PADDING * AUTO_MOVE_SPEED_SCALE;

export enum StateType {
  IDLE,
  DRAGGING_LINE,
  DRAGGING_BLOCK,
  DRAGGING_BOARD,
}

type IdelState = {
  type: StateType.IDLE;
};
type DraggingLineState = {
  type: StateType.DRAGGING_LINE;
  line: Line;
  predictor: Line;
};
type DraggingBlockState = {
  type: StateType.DRAGGING_BLOCK;
  block: Block;
  offsetPageX0: number;
  offsetPageY0: number;
};
type DraggingBoardState = {
  type: StateType.DRAGGING_BOARD;
  startPageX: number;
  startPageY: number;
  initialBoardOffsetX: number;
  initialBoardOffsetY: number;
};
type State =
  | IdelState
  | DraggingLineState
  | DraggingBlockState
  | DraggingBoardState;

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

  get originGraphPos(): Point {
    return this.boardPos2GraphPos({ x: 0, y: 0 });
  }

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
        bg: this.lines.filter(
          (line) => line !== state.line && line !== state.predictor,
        ),
        fg: [state.predictor, state.line],
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
  protected hoveredItem: Block | Socket | null = null;
  mousePagePos: Point;
  mouseGraphPos: Point;
  mouseBoardPos: Point;

  setHoveredItem(hoveredItem: Block | Socket | null) {
    if (this.hoveredItem !== hoveredItem) {
      this.hoveredItem?.onUnhover();
      hoveredItem?.onHover();
      this.hoveredItem = hoveredItem;
    }
  }

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
    line.graph = this;
    this.lines.push(line);
  }
  removeLine(line: Line) {
    this.lines.splice(this.lines.indexOf(line), 1);
  }

  updatePosition() {
    this.blocks.forEach((b) => b.updatePosition());
    this.lines.forEach((l) => l.updatePosition());
  }
  protected updateDraggingBlockPosition({
    block,
    offsetPageX0,
    offsetPageY0,
  }: DraggingBlockState) {
    const { x: pageX0, y: pageY0 } = this.mousePagePos;
    block.setPagePos({ x: pageX0 - offsetPageX0, y: pageY0 - offsetPageY0 });
    block.updatePosition();
    block.updateLinkedLinesPosition();
  }
  protected updateDraggingLinePosition({ line, predictor }: DraggingLineState) {
    line.updatePosition();
    predictor.updatePosition();
  }

  protected boardMoveSpeed: Point = { x: 0, y: 0 };
  protected boardMovingInterval = setInterval(() => {
    if (this.boardMoveSpeed.x === 0 && this.boardMoveSpeed.y === 0) return;
    this.boardOffsetX += this.boardMoveSpeed.x / this.boardScale;
    this.boardOffsetY += this.boardMoveSpeed.y / this.boardScale;
    this.updatePosition();
    if (this.state.type === StateType.DRAGGING_BLOCK) {
      this.updateDraggingBlockPosition(this.state);
    } else if (this.state.type === StateType.DRAGGING_LINE) {
      this.updateDraggingLinePosition(this.state);
    }
  }, AUTO_MOVE_INTERVAL);
  protected updateBoardMoveSpeed() {
    if (
      this.mouseDown &&
      ((this.state.type === StateType.DRAGGING_BLOCK &&
        this.state.block.attached) ||
        this.state.type === StateType.DRAGGING_LINE)
    ) {
      this.boardMoveSpeed = {
        x: calcMoveSpeed(this.mouseGraphPos.x, this.el!.clientWidth),
        y: calcMoveSpeed(this.mouseGraphPos.y, this.el!.clientHeight),
      };
    } else {
      this.boardMoveSpeed = { x: 0, y: 0 };
    }
  }

  protected getDraggingSource(): null | readonly [Block, Socket | null] {
    let socketTarget: Socket | null = null,
      minSocketDistanceSquare: number = Infinity;
    for (let i = this.blockZIndex.length - 1; i >= 0; i--) {
      const block = this.blockZIndex[i];
      const result = block.getDraggingSource();
      if (result !== null) {
        if (Array.isArray(result)) {
          if (result[1] === -Infinity) {
            return [result[0].block, result[0]] as const;
          }
          if (result[1] < minSocketDistanceSquare) {
            socketTarget = result[0];
            minSocketDistanceSquare = result[1];
          }
        } else {
          return [result, null] as const;
        }
      }
    }
    return socketTarget ? [socketTarget.block, socketTarget] : null;
  }
  protected getDraggingTarget(line: Line): null | Socket {
    let socketTarget: Socket | null = null,
      minSocketDistanceSquare: number = Infinity;
    for (let i = this.blockZIndex.length - 1; i >= 0; i--) {
      const block = this.blockZIndex[i];
      const result = block.getDraggingLineTarget(line);
      if (result !== null) {
        if (Array.isArray(result)) {
          if (result[1] < minSocketDistanceSquare) {
            socketTarget = result[0];
            minSocketDistanceSquare = result[1];
          }
        } else {
          return result;
        }
      }
    }
    return socketTarget;
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
    const predictor = line.createPredictor();
    this.addLine(predictor);

    line.dragging = true;
    this.state = {
      type: StateType.DRAGGING_LINE,
      line,
      predictor,
    };
  }

  onScaling(scaleDelta: number) {
    if (
      (this.boardScale <= BOARD_SCALE_MIN && scaleDelta < 0) ||
      (this.boardScale >= BOARD_SCALE_MAX && scaleDelta > 0)
    )
      return false;

    const oldScale = this.boardScale;
    let newScale = this.boardScale + scaleDelta;
    if (newScale < BOARD_SCALE_MIN) newScale = BOARD_SCALE_MIN;
    else if (newScale > BOARD_SCALE_MAX) newScale = BOARD_SCALE_MAX;

    const { x: mouseGraphX, y: mouseGraphY } = this.mouseGraphPos;

    const k = 1 / oldScale - 1 / newScale;

    this.boardOffsetX += mouseGraphX * k;
    this.boardOffsetY += mouseGraphY * k;

    this.boardScale = newScale;

    this.updatePosition();
    return true;
  }

  onMouseMove(mouseDown: boolean): boolean {
    if (mouseDown && !this.mouseDown) {
      return this.onMouseDown();
    }
    if (!mouseDown && this.mouseDown) {
      return this.onMouseUp();
    }

    this.updateBoardMoveSpeed();
    if (this.state.type === StateType.IDLE) {
      const draggingSource = this.getDraggingSource();
      if (draggingSource) {
        this.setHoveredItem(draggingSource[1] ?? draggingSource[0]);
      } else {
        this.setHoveredItem(null);
      }
      return false;
    }
    if (this.state.type === StateType.DRAGGING_LINE) {
      if (!mouseDown) {
        throw new Error("Not dragging line");
      }
      const { line, predictor } = this.state;
      const targetSocket = this.getDraggingTarget(line);
      if (targetSocket) {
        if (targetSocket !== line.neverLeaves) {
          line.neverLeaves = null;
        }
        this.setHoveredItem(targetSocket);
        line.setBoardPosB(this.mouseBoardPos, targetSocket.direction);
        predictor.setBoardPosB(
          line.neverLeaves ? this.mouseBoardPos : targetSocket.boardPos,
          targetSocket.direction,
        );
      } else {
        line.neverLeaves = null;
        this.setHoveredItem(null);
        line.setBoardPosB(this.mouseBoardPos);
        predictor.setBoardPosB(this.mouseBoardPos);
      }
      line.updatePosition();
      predictor.updatePosition();
      return false;
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
      return false;
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
      return false;
    }
    return false;
  }

  onMouseDown() {
    if (this.mouseDown) {
      this.onMouseUp();
    }
    this.mouseDown = true;

    this.state = idelState;

    const hoveredBlock = this.getDraggingSource();
    if (hoveredBlock) {
      hoveredBlock[0].onMouseDown(hoveredBlock[1]);
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
      const { line, predictor } = this.state;
      const targetSocket = this.getDraggingTarget(line);
      if (!line.neverLeaves && targetSocket) {
        targetSocket.connectTo(line);
        line.dragging = false;
      } else {
        line.a.disconnectTo(line);
      }
      this.removeLine(predictor);
      this.state = idelState;
      return true;
    }
    return false;
  }

  onResize() {
    this.updatePosition();
  }

  exportRecord(): GraphRecord {
    return {
      boardOffsetX: this.boardOffsetX,
      boardOffsetY: this.boardOffsetY,
      boardScale: this.boardScale,
      blockZIndex: this.blockZIndex.map((b) => b.id),
    };
  }
  importRecord(record: GraphRecord, blocks: Record<number, Block>) {
    this.boardOffsetX = record.boardOffsetX;
    this.boardOffsetY = record.boardOffsetY;
    this.boardScale = record.boardScale;
    this.blockZIndex = record.blockZIndex.map((id) => blocks[id]);
    this.updateBlockZIndex(0);
  }
}

function calcMoveSpeed(graphPos: number, sideLength: number) {
  if (graphPos < 0) {
    return -AUTO_MOVE_SPEED_MAX;
  }
  if (graphPos < AUTO_MOVE_START_PADDING) {
    return AUTO_MOVE_SPEED_SCALE * (graphPos - AUTO_MOVE_START_PADDING);
  }
  if (graphPos > sideLength) {
    return AUTO_MOVE_SPEED_MAX;
  }
  if (graphPos > sideLength - AUTO_MOVE_START_PADDING) {
    return (
      AUTO_MOVE_SPEED_SCALE * (graphPos - sideLength + AUTO_MOVE_START_PADDING)
    );
  }
  return 0;
}

export interface GraphRecord {
  boardOffsetX: number;
  boardOffsetY: number;
  boardScale: number;
  blockZIndex: number[];
}
