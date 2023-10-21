import { App, HTMLElementComponent, ref } from "refina";
import { VfRecord, exportVf, importVf } from "../recorder";
import { Direction, Point } from "../types";
import { Block } from "./block";
import { Line } from "./line";
import { Socket } from "./socket";

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
  predictor: Block;
  offsetBoardX0: number;
  offsetBoardY0: number;
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
  app: App;

  ref = ref<HTMLElementComponent<"div">>();
  get el() {
    return this.ref.current?.node;
  }

  recordStack: VfRecord[] = [];
  recordIndex: number = -1;
  get canUndo() {
    return this.recordIndex >= 0;
  }
  get canRedo() {
    return this.recordIndex < this.recordStack.length - 1;
  }

  reset() {
    this.blocks = [];
    this.blockZIndex = [];
    this.boardMoveSpeed = { x: 0, y: 0 };
    this.lines = [];
    this.boardOffsetX = 0;
    this.boardOffsetY = 0;
    this.boardScale = 1;
  }
  undo() {
    if (this.recordIndex === 0) {
      this.reset();
      --this.recordIndex;
    } else {
      importVf(this.recordStack[--this.recordIndex], this);
    }
  }
  redo() {
    importVf(this.recordStack[++this.recordIndex], this);
  }

  pushRecord() {
    this.recordStack = this.recordStack.slice(0, this.recordIndex + 1);
    this.recordStack.push(exportVf(this));
    this.recordIndex++;
  }
  overwriteRecord() {
    if (this.recordIndex < 0) {
      this.pushRecord();
    } else {
      this.recordStack[this.recordIndex] = exportVf(this);
    }
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
  getBlockById(id: number): Block {
    const block = this.blocks.find((b) => b.id === id);
    if (!block) throw new Error(`Block ${id} not found`);
    return block;
  }
  get blocksIdMap(): Record<number, Block> {
    return Object.fromEntries(this.blocks.map((b) => [b.id, b]));
  }
  get socketsIdMap(): Record<number, Socket> {
    return Object.fromEntries(
      this.blocks.flatMap((b) => b.allSockets).map((s) => [s.id, s]),
    );
  }

  lines: Line[] = [];
  getLineById(id: number): Line {
    const line = this.lines.find((l) => l.id === id);
    if (!line) throw new Error(`Line ${id} not found`);
    return line;
  }
  get linesIdMap(): Record<number, Line> {
    return Object.fromEntries(this.lines.map((l) => [l.id, l]));
  }

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
    } else if (state.type === StateType.DRAGGING_BLOCK) {
      const linkedLines = state.block.allSockets.flatMap(
        (s) => s.allConnectedLines,
      );
      return {
        bg: this.lines.filter((line) => !linkedLines.includes(line)),
        fg: linkedLines,
      };
    } else {
      return {
        bg: this.lines,
        fg: [],
      };
    }
  }

  state: State = idelState;
  protected mouseDown: boolean = false;
  protected scaleEndTimeout: number = NaN;
  protected hoveredItem: Block | Socket | null = null;
  mousePagePos: Point;
  mouseGraphPos: Point;
  mouseBoardPos: Point;

  selectedBlocks = new Set<Block>();
  clearSelectedBlocks() {
    for (const block of this.selectedBlocks) {
      block.selected = false;
    }
    this.selectedBlocks.clear();
  }
  addSelectedBlock(block: Block, shiftKey: boolean) {
    if (!shiftKey) {
      this.clearSelectedBlocks();
    }
    this.selectedBlocks.add(block);
    block.selected = true;
  }

  setHoveredItem(hoveredItem: Block | Socket | null) {
    if (this.hoveredItem !== hoveredItem) {
      this.hoveredItem?.onUnhover();
      hoveredItem?.onHover();
      this.hoveredItem = hoveredItem;
    }
  }

  setMousePos(ev: MouseEvent) {
    this.mousePagePos = { x: ev.pageX, y: ev.pageY };
    this.syncGraphAndBoardMousePos();
  }
  protected syncGraphAndBoardMousePos() {
    this.mouseGraphPos = this.pagePos2GraphPos(this.mousePagePos);
    this.mouseBoardPos = this.graphPos2BoardPos(this.mouseGraphPos);
  }

  protected blockZIndex: (Block | null)[] = [];

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
    this.selectedBlocks.delete(block);
    this.updateBlockZIndex();
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
    predictor,
    offsetBoardX0,
    offsetBoardY0,
  }: DraggingBlockState) {
    const { x: boardX0, y: boardY0 } = this.mouseBoardPos;
    const newPagePos = {
      x: boardX0 - offsetBoardX0,
      y: boardY0 - offsetBoardY0,
    };
    block.setBoardPos(newPagePos);
    predictor.setBoardPos(newPagePos);
    block.updatePosition();
    predictor.updatePosition();
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
    this.syncGraphAndBoardMousePos();
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

  protected getDraggingSource(
    blockOnly: boolean,
  ): null | readonly [Block, Socket | null] {
    let socketTarget: Socket | null = null,
      minSocketDistanceSquare: number = Infinity;
    for (let i = this.blockZIndex.length - 1; i >= 0; i--) {
      const block = this.blockZIndex[i];
      if (!block) continue;
      const result = block.getDraggingSource(blockOnly);
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
      if (!block) continue;
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
  protected getDockingTarget(block: Block): [Block, Direction, Point] | null {
    let minDockingDistanceSquare = Infinity;
    let dockingTarget: [Block, Direction, Point] | null = null;
    for (let i = this.blockZIndex.length - 1; i >= 0; i--) {
      const target = this.blockZIndex[i];
      if (!target) continue;
      if (target === block) continue;
      const result = target.isDockableBy(block);
      if (result !== null) {
        const [distanceSquare, ...dockingInfo] = result;
        if (distanceSquare < minDockingDistanceSquare) {
          minDockingDistanceSquare = distanceSquare;
          dockingTarget = [target, ...dockingInfo];
        }
      }
    }
    return dockingTarget;
  }

  moveBlockToTop(block: Block) {
    const index = this.blockZIndex.indexOf(block);
    if (index === -1) throw new Error("Block not found");
    this.blockZIndex[index] = null;
    this.blockZIndex.push(block);
  }

  updateBlockZIndex() {
    for (let i = 0; i < this.blockZIndex.length; i++) {
      const block = this.blockZIndex[i];
      if (block) {
        block.zIndex = i + MIN_ZINDEX;
      }
    }
  }

  startDraggingBlock(block: Block) {
    const predictor = block.createPredictor();
    this.addBlock(predictor);
    predictor.moveToTop();
    const { x: blockBoardX, y: blockBoardY } = block.boardPos;
    this.state = {
      type: StateType.DRAGGING_BLOCK,
      block,
      predictor: predictor,
      offsetBoardX0: this.mouseBoardPos.x - blockBoardX,
      offsetBoardY0: this.mouseBoardPos.y - blockBoardY,
    };
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
    ) {
      return true;
    }
    if (!Number.isNaN(this.scaleEndTimeout)) clearTimeout(this.scaleEndTimeout);
    this.scaleEndTimeout = setTimeout(() => {
      this.pushRecord();
      this.scaleEndTimeout = NaN;
      this.app.update();
    }, 500);

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

  onMouseMove(mouseDown: boolean, shiftKey: boolean): boolean {
    if (mouseDown && !this.mouseDown) {
      return this.onMouseDown(false);
    }
    if (!mouseDown && this.mouseDown) {
      return this.onMouseUp(false);
    }

    this.updateBoardMoveSpeed();
    if (this.state.type === StateType.IDLE) {
      const draggingSource = this.getDraggingSource(shiftKey);
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
        this.setHoveredItem(targetSocket);
        line.setBoardPosB(this.mouseBoardPos, targetSocket.direction);
        predictor.setBoardPosB(
          line.neverLeaves ? this.mouseBoardPos : targetSocket.boardPos,
          targetSocket.direction,
        );
      } else {
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
      const { x: boardX0, y: boardY0 } = this.mouseBoardPos;
      const { block, predictor, offsetBoardX0, offsetBoardY0 } = this.state;

      const newBlockBoardPos = {
        x: boardX0 - offsetBoardX0,
        y: boardY0 - offsetBoardY0,
      };

      block.pendingClick = false;
      block.setBoardPos(newBlockBoardPos);
      block.updatePosition();

      const dockingTarget = this.getDockingTarget(block);
      if (dockingTarget) {
        const [blockToDock, _direction, movementBoardPos] = dockingTarget;
        this.setHoveredItem(blockToDock);
        predictor.setBoardPos(Point.add(newBlockBoardPos, movementBoardPos));
      } else {
        this.setHoveredItem(null);
        predictor.setBoardPos(newBlockBoardPos);
      }
      predictor.updatePosition();

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

  onMouseDown(shiftKey: boolean) {
    if (this.mouseDown) {
      this.onMouseUp(shiftKey);
    }
    this.mouseDown = true;

    this.state = idelState;

    const hoveredBlock = this.getDraggingSource(shiftKey);
    if (hoveredBlock) {
      hoveredBlock[0].onMouseDown(hoveredBlock[1], shiftKey);
      return true;
    }
    if (this.isMouseInsideGraph) {
      if (!shiftKey) this.clearSelectedBlocks();
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

  onMouseUp(shiftKey: boolean) {
    if (!this.mouseDown) {
      this.onMouseDown(false);
    }
    this.mouseDown = false;

    if (this.state.type === StateType.IDLE) {
      return false;
    }
    if (this.state.type === StateType.DRAGGING_BOARD) {
      this.state = idelState;
      this.pushRecord();
      return true;
    }
    if (this.state.type === StateType.DRAGGING_BLOCK) {
      const { block, predictor } = this.state;
      this.removeBlock(predictor);

      const dockingTarget = this.getDockingTarget(block);
      if (dockingTarget) {
        const [blockToDock, dockingDirection, _movementBoardPos] =
          dockingTarget;
        block.dockTo(blockToDock, dockingDirection);
      }

      if (!block.attached) {
        if (this.isMouseInsideGraph) {
          block.attach();
          this.pushRecord();
        } else {
          this.removeBlock(block);
        }
      } else if (block.pendingClick) {
        this.addSelectedBlock(block, shiftKey);
        this.overwriteRecord();
      } else {
        if (!shiftKey) this.clearSelectedBlocks();
        this.pushRecord();
      }
      block.pendingClick = false;
      this.state = idelState;
      return true;
    }
    if (this.state.type === StateType.DRAGGING_LINE) {
      const { line, predictor } = this.state;
      const targetSocket = this.getDraggingTarget(line);
      if (!line.neverLeaves && targetSocket) {
        targetSocket.connectTo(line);
        line.dragging = false;
        this.moveBlockToTop(targetSocket.block);
        this.updateBlockZIndex();
      } else {
        line.a.disconnectTo(line);
        this.removeLine(line);
      }
      this.removeLine(predictor);
      this.state = idelState;
      this.pushRecord();
      return true;
    }
    return false;
  }

  onHorizontalScroll(delta: number) {
    this.boardOffsetX += delta / this.boardScale;
    this.updatePosition();
    return true;
  }

  onVerticalScroll(delta: number) {
    this.boardOffsetY += delta / this.boardScale;
    this.updatePosition();
    return true;
  }

  onResize() {
    this.updatePosition();
  }

  exportRecord(): GraphRecord {
    return {
      boardOffsetX: this.boardOffsetX,
      boardOffsetY: this.boardOffsetY,
      boardScale: this.boardScale,
      blockZIndex: (this.blockZIndex.filter((b) => b !== null) as Block[]).map(
        (b) => b.id,
      ),
    };
  }
  importRecord(record: GraphRecord, blocks: Record<number, Block>) {
    this.boardOffsetX = record.boardOffsetX;
    this.boardOffsetY = record.boardOffsetY;
    this.boardScale = record.boardScale;
    this.blockZIndex = record.blockZIndex.map((id) => blocks[id]);
    this.updateBlockZIndex();
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
