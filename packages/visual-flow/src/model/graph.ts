import deepEqual from 'deep-equal'
import type { App, HTMLElementComponent } from 'refina'
import { ref } from 'refina'
import type { VfRecord } from '../recorder'
import { exportVf, importVf } from '../recorder'
import type { Direction } from '../types'
import { Point } from '../types'
import type { Block } from './block'
import type { Line } from './line'
import type { Socket } from './socket'

const MIN_ZINDEX = 0
const BOARD_SCALE_MIN = 0.2
const BOARD_SCALE_MAX = 4
const AUTO_MOVE_INTERVAL = 10
const AUTO_MOVE_START_PADDING = 70
const AUTO_MOVE_SPEED_SCALE = 0.07
const AUTO_MOVE_SPEED_MAX = AUTO_MOVE_START_PADDING * AUTO_MOVE_SPEED_SCALE
const GRID_SIZE = 30
const FULL_VIEW_PADDING = 100

export enum GraphStateType {
  IDLE,
  DRAGGING_LINE,
  DRAGGING_BLOCK,
  DRAGGING_MULTI_BLOCK,
  DRAGGING_BOARD,
}

interface IdelState {
  type: GraphStateType.IDLE
}
interface DraggingLineState {
  type: GraphStateType.DRAGGING_LINE
  line: Line
  predictor: Line
}
interface DraggingBlockState {
  type: GraphStateType.DRAGGING_BLOCK
  block: Block
  predictor: Block
  offsetBoardX0: number
  offsetBoardY0: number
}
interface DraggingMultiBlockState {
  type: GraphStateType.DRAGGING_MULTI_BLOCK
  blocks: {
    block: Block
    offsetBoardX0: number
    offsetBoardY0: number
  }[]
}
interface DraggingBoardState {
  type: GraphStateType.DRAGGING_BOARD
  startPageX: number
  startPageY: number
  initialBoardOffsetX: number
  initialBoardOffsetY: number
}
type State =
  | IdelState
  | DraggingLineState
  | DraggingBlockState
  | DraggingMultiBlockState
  | DraggingBoardState

const idelState = { type: GraphStateType.IDLE } as const

export class Graph {
  app: App

  ref = ref<HTMLElementComponent<'div'>>()
  get el() {
    return this.ref.current?.node
  }

  canvasRef = ref<HTMLElementComponent<'canvas'>>()
  get canvasEl() {
    return this.canvasRef.current?.node
  }

  getCanvasCtx() {
    return this.canvasRef.current!.node.getContext('2d')!
  }

  initialRecord: VfRecord
  recordStack: VfRecord[] = []
  recordIndex: number = -1
  get canUndo() {
    return this.recordIndex >= 0
  }

  get canRedo() {
    return this.recordIndex < this.recordStack.length - 1
  }

  reset() {
    this.blocks = []
    this.blockZIndex = []
    this.boardMoveSpeed = { x: 0, y: 0 }
    this.lines = []
    this.boardOffsetX = 0
    this.boardOffsetY = 0
    this.boardScale = 1
  }

  undo() {
    this.selectedBlocks.clear()
    if (this.recordIndex === 0) {
      importVf(this.initialRecord, this)
      --this.recordIndex
    }
    else {
      importVf(this.recordStack[--this.recordIndex], this)
    }
  }

  redo() {
    this.selectedBlocks.clear()
    importVf(this.recordStack[++this.recordIndex], this)
  }

  captureInitialRecord() {
    this.initialRecord = exportVf(this)
  }

  pushRecord() {
    const record = exportVf(this)
    const lastRecord
      = this.recordIndex === -1
        ? this.initialRecord
        : this.recordStack[this.recordIndex]
    if (deepEqual(record, lastRecord))
      return

    this.recordStack = this.recordStack.slice(0, this.recordIndex + 1)
    this.recordStack.push(record)
    this.recordIndex++
  }

  overwriteRecord() {
    if (this.recordIndex < 0)
      this.pushRecord()
    else
      this.recordStack[this.recordIndex] = exportVf(this)
  }

  /**
   * The position of the left-top corner of the graph in board coord.
   */
  boardOffsetX: number = 0
  boardOffsetY: number = 0

  get originGraphPos(): Point {
    return this.boardPos2GraphPos({ x: 0, y: 0 })
  }

  /**
   * 1 in board coord equals `boardScale` px in screen.
   */
  boardScale: number = 1

  boardPos2GraphPos(boardPos: Point): Point {
    return {
      x: (boardPos.x - this.boardOffsetX) * this.boardScale,
      y: (boardPos.y - this.boardOffsetY) * this.boardScale,
    }
  }

  graphPos2BoardPos(graphPos: Point): Point {
    return {
      x: graphPos.x / this.boardScale + this.boardOffsetX,
      y: graphPos.y / this.boardScale + this.boardOffsetY,
    }
  }

  graphPos2PagePos(graphPos: Point): Point {
    const boundingRect = this.el!.getBoundingClientRect()
    return {
      x: graphPos.x + boundingRect.x,
      y: graphPos.y + boundingRect.y,
    }
  }

  pagePos2GraphPos(pagePos: Point): Point {
    const boundingRect = this.el!.getBoundingClientRect()
    return {
      x: pagePos.x - boundingRect.x,
      y: pagePos.y - boundingRect.y,
    }
  }

  boardPos2PagePos(boardPos: Point): Point {
    return this.graphPos2PagePos(this.boardPos2GraphPos(boardPos))
  }

  pagePos2BoardPos(pagePos: Point): Point {
    return this.graphPos2BoardPos(this.pagePos2GraphPos(pagePos))
  }

  get isMouseInsideGraph(): boolean {
    const { left, top, right, bottom } = this.el!.getBoundingClientRect()
    return (
      this.mousePagePos.x >= left
      && this.mousePagePos.x <= right
      && this.mousePagePos.y >= top
      && this.mousePagePos.y <= bottom
    )
  }

  blocks: Block[] = []
  getBlockById(id: number): Block {
    const block = this.blocks.find(b => b.id === id)
    if (!block)
      throw new Error(`Block ${id} not found`)
    return block
  }

  get blocksIdMap(): Record<number, Block> {
    return Object.fromEntries(this.blocks.map(b => [b.id, b]))
  }

  get socketsIdMap(): Record<number, Socket> {
    return Object.fromEntries(
      this.blocks.flatMap(b => b.allSockets).map(s => [s.id, s]),
    )
  }

  lines: Line[] = []
  getLineById(id: number): Line {
    const line = this.lines.find(l => l.id === id)
    if (!line)
      throw new Error(`Line ${id} not found`)
    return line
  }

  get linesIdMap(): Record<number, Line> {
    return Object.fromEntries(this.lines.map(l => [l.id, l]))
  }

  get displayLines(): {
    bg: Line[]
    fg: Line[]
  } {
    const state = this.state
    if (state.type === GraphStateType.DRAGGING_LINE) {
      return {
        bg: this.lines.filter(
          line => line !== state.line && line !== state.predictor,
        ),
        fg: [state.predictor, state.line],
      }
    }
    else if (state.type === GraphStateType.DRAGGING_BLOCK) {
      const linkedLines = state.block.allSockets.flatMap(
        s => s.allConnectedLines,
      )
      return {
        bg: this.lines.filter(line => !linkedLines.includes(line)),
        fg: linkedLines,
      }
    }
    else {
      return {
        bg: this.lines,
        fg: [],
      }
    }
  }

  state: State = idelState
  protected mouseDown: boolean = false
  protected scaleEndTimeout: number = Number.NaN
  protected hoveredItem: Block | [Socket, Line | null] | null = null
  mousePagePos: Point
  mouseGraphPos: Point
  mouseBoardPos: Point

  selectedBlocks = new Set<Block>()
  clearSelectedBlocks() {
    for (const block of this.selectedBlocks)
      block.selected = false

    this.selectedBlocks.clear()
  }

  addSelectedBlock(block: Block, shiftKey: boolean) {
    if (!shiftKey)
      this.clearSelectedBlocks()

    this.selectedBlocks.add(block)
    block.selected = true
  }

  setHoveredItem(hoveredItem: Block | [Socket, Line | null] | null) {
    if (this.hoveredItem !== hoveredItem) {
      if (Array.isArray(this.hoveredItem)) {
        this.hoveredItem[0].onUnhover()
        this.hoveredItem[1]?.onUnhover()
      }
      else {
        this.hoveredItem?.onUnhover()
      }

      if (Array.isArray(hoveredItem)) {
        hoveredItem[0].onHover()
        hoveredItem[1]?.onHover()
      }
      else {
        hoveredItem?.onHover()
      }
      this.hoveredItem = hoveredItem
    }
  }

  setMousePos(ev: MouseEvent) {
    this.mousePagePos = { x: ev.pageX, y: ev.pageY }
    this.syncGraphAndBoardMousePos()
  }

  protected syncGraphAndBoardMousePos() {
    this.mouseGraphPos = this.pagePos2GraphPos(this.mousePagePos)
    this.mouseBoardPos = this.graphPos2BoardPos(this.mouseGraphPos)
  }

  protected blockZIndex: (Block | null)[] = []

  addBlock(block: Block) {
    block.graph = this
    this.blocks.push(block)
    this.blockZIndex.push(block)
  }

  removeBlock(block: Block) {
    this.blocks.splice(this.blocks.indexOf(block), 1)
    const index = this.blockZIndex.indexOf(block)
    if (index === -1)
      throw new Error('Block not found')
    this.blockZIndex.splice(index, 1)
    this.selectedBlocks.delete(block)
    this.updateBlockZIndex()
  }

  addLine(line: Line) {
    line.graph = this
    this.lines.push(line)
  }

  removeLine(line: Line) {
    this.lines.splice(this.lines.indexOf(line), 1)
  }

  updatePosition() {
    this.blocks.forEach(b => b.updatePosition())
    this.lines.forEach(l => l.updatePosition())
    this.redrawCanvas()
  }

  protected updateDraggingBlockPosition({
    block,
    predictor,
    offsetBoardX0,
    offsetBoardY0,
  }: DraggingBlockState) {
    const { x: boardX0, y: boardY0 } = this.mouseBoardPos
    const newPagePos = {
      x: boardX0 - offsetBoardX0,
      y: boardY0 - offsetBoardY0,
    }
    block.setBoardPos(newPagePos)
    predictor.setBoardPos(newPagePos)
    block.updatePosition()
    predictor.updatePosition()
  }

  protected updateDraggingMultiBlocksPosition({
    blocks,
  }: DraggingMultiBlockState) {
    const { x: boardX0, y: boardY0 } = this.mouseBoardPos
    for (const blockData of blocks) {
      const { block, offsetBoardX0, offsetBoardY0 } = blockData
      const newPagePos = {
        x: boardX0 - offsetBoardX0,
        y: boardY0 - offsetBoardY0,
      }
      block.setBoardPos(newPagePos)
      block.updatePosition()
    }
  }

  protected updateDraggingLinePosition({ line, predictor }: DraggingLineState) {
    line.setBoardPosB(this.mouseBoardPos)
    line.updatePosition()
    predictor.setBoardPosB(this.mouseBoardPos)
    predictor.updatePosition()
  }

  protected redrawCanvas() {
    const ctx = this.getCanvasCtx()
    const {
      left: fullviewLeft,
      top: fullviewTop,
      right: fullviewRight,
      bottom: fullviewBottom,
    } = this.fullViewRect
    const { width: graphWidth, height: graphHeight }
      = this.el!.getBoundingClientRect()

    const left = Math.min(fullviewLeft, this.boardOffsetX)
    const top = Math.min(fullviewTop, this.boardOffsetY)
    const right = Math.max(
      fullviewRight,
      this.boardOffsetX + graphWidth / this.boardScale,
    )
    const bottom = Math.max(
      fullviewBottom,
      this.boardOffsetY + graphHeight / this.boardScale,
    )

    const width = right - left
    const height = bottom - top

    const scale = Math.sqrt(30000 / (width * height))
    if (this.canvasEl) {
      this.canvasEl.style.width = `${width * scale}px`
      this.canvasEl.style.height = `${height * scale}px`
      this.canvasEl.width = width * scale
      this.canvasEl.height = height * scale
    }

    const { fg: fgLines, bg: bgLines } = this.displayLines

    for (const line of bgLines)
      line.drawThumbnail(ctx, left, top, scale)

    for (const block of this.blockZIndex) {
      if (block) {
        ctx.fillStyle = block.selected ? 'rgb(17,94,163)' : 'rgb(71,158,245)'
        ctx.fillRect(
          (block.boardPos.x - left) * scale,
          (block.boardPos.y - top) * scale,
          block.boundingRectBoardWidth * scale,
          block.boundingRectBoardHeight * scale,
        )
      }
    }

    for (const line of fgLines)
      line.drawThumbnail(ctx, left, top, scale)

    ctx.strokeStyle = '#555555'
    ctx.lineWidth = 2
    ctx.strokeRect(
      (this.boardOffsetX - left) * scale,
      (this.boardOffsetY - top) * scale,
      (graphWidth / this.boardScale) * scale - 1,
      (graphHeight / this.boardScale) * scale - 1,
    )

    // ctx.fillStyle = "rgb(200,0,0)";
    // ctx.fillRect(10, 10, 55, 50);
  }

  protected boardMoveSpeed: Point = { x: 0, y: 0 }
  protected boardMovingInterval = setInterval(() => {
    this.updateBoardMoveSpeed()
    if (this.boardMoveSpeed.x === 0 && this.boardMoveSpeed.y === 0)
      return
    this.boardOffsetX += this.boardMoveSpeed.x / this.boardScale
    this.boardOffsetY += this.boardMoveSpeed.y / this.boardScale
    this.syncGraphAndBoardMousePos()
    this.updatePosition()
    if (this.state.type === GraphStateType.DRAGGING_BLOCK)
      this.updateDraggingBlockPosition(this.state)
    else if (this.state.type === GraphStateType.DRAGGING_MULTI_BLOCK)
      this.updateDraggingMultiBlocksPosition(this.state)
    else if (this.state.type === GraphStateType.DRAGGING_LINE)
      this.updateDraggingLinePosition(this.state)
  }, AUTO_MOVE_INTERVAL)

  protected updateBoardMoveSpeed() {
    if (
      this.mouseDown
      && ((this.state.type === GraphStateType.DRAGGING_BLOCK
      && this.state.block.attached)
      || this.state.type === GraphStateType.DRAGGING_MULTI_BLOCK
      || this.state.type === GraphStateType.DRAGGING_LINE)
    ) {
      this.boardMoveSpeed = {
        x: calcMoveSpeed(this.mouseGraphPos.x, this.el!.clientWidth),
        y: calcMoveSpeed(this.mouseGraphPos.y, this.el!.clientHeight),
      }
    }
    else {
      this.boardMoveSpeed = { x: 0, y: 0 }
    }
  }

  protected getDraggingSource(
    blockOnly: boolean,
  ): null | readonly [Block, Socket | null] {
    let socketTarget: Socket | null = null
    let minSocketDistanceSquare: number = Number.POSITIVE_INFINITY
    for (let i = this.blockZIndex.length - 1; i >= 0; i--) {
      const block = this.blockZIndex[i]
      if (!block)
        continue
      const result = block.getDraggingSource(blockOnly)
      if (result !== null) {
        if (Array.isArray(result)) {
          if (result[1] === Number.NEGATIVE_INFINITY)
            return [result[0].block, result[0]] as const

          if (result[1] < minSocketDistanceSquare) {
            socketTarget = result[0]
            minSocketDistanceSquare = result[1]
          }
        }
        else {
          return [result, null] as const
        }
      }
    }
    return socketTarget ? [socketTarget.block, socketTarget] : null
  }

  protected getDraggingTarget(line: Line): null | Socket {
    let socketTarget: Socket | null = null
    let minSocketDistanceSquare: number = Number.POSITIVE_INFINITY
    for (let i = this.blockZIndex.length - 1; i >= 0; i--) {
      const block = this.blockZIndex[i]
      if (!block)
        continue
      const result = block.getDraggingLineTarget(line)
      if (result !== null) {
        if (Array.isArray(result)) {
          if (result[1] < minSocketDistanceSquare) {
            socketTarget = result[0]
            minSocketDistanceSquare = result[1]
          }
        }
        else {
          return result
        }
      }
    }
    return socketTarget
  }

  protected getDockingTarget(block: Block): [Block, Direction, Point] | null {
    let minDockingDistanceSquare = Number.POSITIVE_INFINITY
    let dockingTarget: [Block, Direction, Point] | null = null
    for (let i = this.blockZIndex.length - 1; i >= 0; i--) {
      const target = this.blockZIndex[i]
      if (!target)
        continue
      const result = target.isDockableBy(block)
      if (result !== null) {
        const [distanceSquare, ...dockingInfo] = result
        if (distanceSquare < minDockingDistanceSquare) {
          minDockingDistanceSquare = distanceSquare
          dockingTarget = [target, ...dockingInfo]
        }
      }
    }
    return dockingTarget
  }

  moveBlockToTop(block: Block) {
    const index = this.blockZIndex.indexOf(block)
    if (index === -1)
      throw new Error('Block not found')
    this.blockZIndex[index] = null
    this.blockZIndex.push(block)
  }

  updateBlockZIndex() {
    this.blockZIndex = this.blockZIndex.filter(b => b !== null)
    for (let i = 0; i < this.blockZIndex.length; i++) {
      const block = this.blockZIndex[i]
      if (block)
        block.zIndex = i + MIN_ZINDEX
    }
  }

  startDraggingBlock(block: Block) {
    const predictor = block.createPredictor()
    this.addBlock(predictor)
    predictor.moveToTop()
    const { x: blockBoardX, y: blockBoardY } = block.boardPos
    this.state = {
      type: GraphStateType.DRAGGING_BLOCK,
      block,
      predictor,
      offsetBoardX0: this.mouseBoardPos.x - blockBoardX,
      offsetBoardY0: this.mouseBoardPos.y - blockBoardY,
    }
  }

  startDraggingSelectedBlocks() {
    this.state = {
      type: GraphStateType.DRAGGING_MULTI_BLOCK,
      blocks: [...this.selectedBlocks].map(block => {
        const { x: blockBoardX, y: blockBoardY } = block.boardPos
        return {
          block,
          offsetBoardX0: this.mouseBoardPos.x - blockBoardX,
          offsetBoardY0: this.mouseBoardPos.y - blockBoardY,
        }
      }),
    }
  }

  startDraggingLine(line: Line) {
    const predictor = line.createPredictor()
    this.addLine(predictor)

    line.dragging = true
    this.state = {
      type: GraphStateType.DRAGGING_LINE,
      line,
      predictor,
    }
  }

  toGridPos(pos: Point) {
    return {
      x: Math.round(pos.x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(pos.y / GRID_SIZE) * GRID_SIZE,
    }
  }

  onScaling(scaleDelta: number) {
    if (
      (this.boardScale <= BOARD_SCALE_MIN && scaleDelta < 0)
      || (this.boardScale >= BOARD_SCALE_MAX && scaleDelta > 0)
    )
      return true

    if (!Number.isNaN(this.scaleEndTimeout))
      clearTimeout(this.scaleEndTimeout)
    this.scaleEndTimeout = setTimeout(() => {
      this.pushRecord()
      this.scaleEndTimeout = Number.NaN
      this.app.update()
    }, 500)

    const oldScale = this.boardScale
    let newScale = this.boardScale + scaleDelta
    if (newScale < BOARD_SCALE_MIN)
      newScale = BOARD_SCALE_MIN
    else if (newScale > BOARD_SCALE_MAX)
      newScale = BOARD_SCALE_MAX

    const { x: mouseGraphX, y: mouseGraphY } = this.mouseGraphPos

    const k = 1 / oldScale - 1 / newScale

    this.boardOffsetX += mouseGraphX * k
    this.boardOffsetY += mouseGraphY * k

    this.boardScale = newScale

    this.syncGraphAndBoardMousePos()
    this.onMouseMove(this.mouseDown, false)
    this.updatePosition()
    return true
  }

  onMouseMove(mouseDown: boolean, shiftKey: boolean): boolean {
    if (mouseDown && !this.mouseDown)
      return this.onMouseDown(false)

    if (!mouseDown && this.mouseDown)
      return this.onMouseUp(false)

    if (this.state.type === GraphStateType.IDLE) {
      const draggingSource = this.getDraggingSource(shiftKey)
      if (draggingSource) {
        if (draggingSource[1]) {
          this.setHoveredItem([
            draggingSource[1],
            draggingSource[1].getHoveredLine(),
          ])
        }
        else {
          this.setHoveredItem(draggingSource[0])
        }
      }
      else {
        this.setHoveredItem(null)
      }
      return false
    }
    if (this.state.type === GraphStateType.DRAGGING_LINE) {
      if (!mouseDown)
        throw new Error('Not dragging line')

      const { line, predictor } = this.state
      const targetSocket = this.getDraggingTarget(line)
      if (targetSocket) {
        this.setHoveredItem([targetSocket, targetSocket.getHoveredLine()])
        line.setBoardPosB(this.mouseBoardPos, targetSocket.direction)
        predictor.setBoardPosB(
          line.neverLeaves ? this.mouseBoardPos : targetSocket.boardPos,
          targetSocket.direction,
        )
      }
      else {
        this.setHoveredItem(null)
        line.setBoardPosB(this.mouseBoardPos)
        predictor.setBoardPosB(this.mouseBoardPos)
      }
      line.updatePosition()
      predictor.updatePosition()

      this.redrawCanvas()
      return false
    }
    if (this.state.type === GraphStateType.DRAGGING_BLOCK) {
      if (!mouseDown)
        throw new Error('Not dragging block')

      const { x: boardX0, y: boardY0 } = this.mouseBoardPos
      const { block, predictor, offsetBoardX0, offsetBoardY0 } = this.state

      const newBlockBoardPos = {
        x: boardX0 - offsetBoardX0,
        y: boardY0 - offsetBoardY0,
      }

      block.pendingClick = false
      block.setBoardPos(newBlockBoardPos)
      block.updatePosition()

      const dockingTarget = this.getDockingTarget(block)
      if (dockingTarget) {
        const [blockToDock, _direction, movementBoardPos] = dockingTarget
        this.setHoveredItem(blockToDock)
        predictor.setBoardPos(Point.add(newBlockBoardPos, movementBoardPos))
      }
      else {
        this.setHoveredItem(null)
        predictor.setBoardPos(newBlockBoardPos)
      }
      predictor.updatePosition()

      this.redrawCanvas()
      return false
    }
    if (this.state.type === GraphStateType.DRAGGING_MULTI_BLOCK) {
      if (!mouseDown)
        throw new Error('Not dragging block')

      const { x: boardX0, y: boardY0 } = this.mouseBoardPos
      const { blocks } = this.state

      for (const blockData of blocks) {
        const { block, offsetBoardX0, offsetBoardY0 } = blockData
        const newBlockBoardPos = {
          x: boardX0 - offsetBoardX0,
          y: boardY0 - offsetBoardY0,
        }
        block.pendingClick = false
        block.setBoardPos(newBlockBoardPos)
        block.updatePosition()
        // this.setHoveredItem(null);
      }

      this.redrawCanvas()
      return false
    }
    if (this.state.type === GraphStateType.DRAGGING_BOARD) {
      if (!mouseDown)
        throw new Error('Not dragging board')

      const {
        startPageX,
        startPageY,
        initialBoardOffsetX,
        initialBoardOffsetY,
      } = this.state
      const { x: mousePageX, y: mousePageY } = this.mousePagePos
      this.boardOffsetX
        = initialBoardOffsetX + (startPageX - mousePageX) / this.boardScale
      this.boardOffsetY
        = initialBoardOffsetY + (startPageY - mousePageY) / this.boardScale
      this.updatePosition()
      return false
    }
    return false
  }

  onMouseDown(shiftKey: boolean) {
    if (this.mouseDown)
      this.onMouseUp(shiftKey)

    this.mouseDown = true

    this.state = idelState

    const hoveredBlock = this.getDraggingSource(shiftKey)
    if (hoveredBlock) {
      hoveredBlock[0].onMouseDown(hoveredBlock[1], shiftKey)
      return true
    }
    if (this.isMouseInsideGraph) {
      if (!shiftKey)
        this.clearSelectedBlocks()
      const pagePos = this.mousePagePos
      this.state = {
        type: GraphStateType.DRAGGING_BOARD,
        startPageX: pagePos.x,
        startPageY: pagePos.y,
        initialBoardOffsetX: this.boardOffsetX,
        initialBoardOffsetY: this.boardOffsetY,
      }
      return true
    }
    return false
  }

  onMouseUp(shiftKey: boolean) {
    if (!this.mouseDown)
      this.onMouseDown(false)

    this.mouseDown = false

    if (this.state.type === GraphStateType.IDLE)
      return false

    if (this.state.type === GraphStateType.DRAGGING_BOARD) {
      this.state = idelState
      this.pushRecord()
      return true
    }
    if (this.state.type === GraphStateType.DRAGGING_BLOCK) {
      const { block, predictor, offsetBoardX0, offsetBoardY0 } = this.state
      this.removeBlock(predictor)

      const dockingTarget = this.getDockingTarget(block)
      if (dockingTarget) {
        const [blockToDock, dockingDirection, _movementBoardPos]
          = dockingTarget
        block.dockTo(blockToDock, dockingDirection)
      }

      const { x: boardX0, y: boardY0 } = this.mouseBoardPos
      const newBlockBoardPos = this.toGridPos({
        x: boardX0 - offsetBoardX0,
        y: boardY0 - offsetBoardY0,
      })
      block.setBoardPos(newBlockBoardPos)
      block.updatePosition()

      if (!block.attached) {
        if (this.isMouseInsideGraph) {
          block.attach()
          this.pushRecord()
        }
        else {
          this.removeBlock(block)
        }
      }
      else if (block.pendingClick) {
        this.addSelectedBlock(block, shiftKey)
        this.overwriteRecord()
      }
      else {
        this.pushRecord()
      }
      block.pendingClick = false
      this.state = idelState
      return true
    }
    if (this.state.type === GraphStateType.DRAGGING_MULTI_BLOCK) {
      const { blocks } = this.state
      for (const blockData of blocks) {
        const { block, offsetBoardX0, offsetBoardY0 } = blockData
        const { x: boardX0, y: boardY0 } = this.mouseBoardPos
        const newBlockBoardPos = this.toGridPos({
          x: boardX0 - offsetBoardX0,
          y: boardY0 - offsetBoardY0,
        })
        block.setBoardPos(newBlockBoardPos)
        block.updatePosition()
      }
      this.pushRecord()
      this.state = idelState
      return true
    }
    if (this.state.type === GraphStateType.DRAGGING_LINE) {
      const { line, predictor } = this.state
      const targetSocket = this.getDraggingTarget(line)
      if (!line.neverLeaves && targetSocket) {
        targetSocket.connectTo(line)
        line.dragging = false
        this.moveBlockToTop(targetSocket.block)
        this.updateBlockZIndex()
      }
      else {
        line.a.disconnectTo(line)
        this.removeLine(line)
      }
      this.removeLine(predictor)
      this.state = idelState
      this.pushRecord()
      return true
    }
    return false
  }

  onHorizontalScroll(delta: number) {
    this.boardOffsetX += delta / this.boardScale
    this.syncGraphAndBoardMousePos()
    this.onMouseMove(this.mouseDown, false)
    this.updatePosition()
    return true
  }

  onVerticalScroll(delta: number) {
    this.boardOffsetY += delta / this.boardScale
    this.syncGraphAndBoardMousePos()
    this.onMouseMove(this.mouseDown, false)
    this.updatePosition()
    return true
  }

  onResize() {
    this.updatePosition()
  }

  resetViewport() {
    this.boardOffsetX = 0
    this.boardOffsetY = 0
    this.boardScale = 1
  }

  get fullViewRect() {
    const blocks = this.blocks.filter(b => b.attached)
    const left
      = Math.min(...blocks.map(b => b.boardPos.x)) - FULL_VIEW_PADDING
    const top
      = Math.min(...blocks.map(b => b.boardPos.y)) - FULL_VIEW_PADDING
    const right
      = Math.max(...blocks.map(b => b.boardPos.x + b.boundingRectBoardWidth))
      + FULL_VIEW_PADDING
    const bottom
      = Math.max(...blocks.map(b => b.boardPos.y + b.boundingRectBoardHeight))
      + FULL_VIEW_PADDING
    return {
      left,
      top,
      right,
      bottom,
      width: right - left,
      height: bottom - top,
    }
  }

  fullView() {
    if (this.blocks.length === 0) {
      this.resetViewport()
      return { width: Number.NaN, height: Number.NaN }
    }

    const { left, top, width, height } = this.fullViewRect

    const { width: graphWidth, height: graphHeight }
      = this.el!.getBoundingClientRect()

    const scale = Math.min(graphWidth / width, graphHeight / height)

    this.boardScale = scale
    this.boardOffsetX = left
    this.boardOffsetY = top

    return {
      width: width * scale,
      height: height * scale,
    }
  }

  exportRecord(): GraphRecord {
    return {
      boardOffsetX: this.boardOffsetX,
      boardOffsetY: this.boardOffsetY,
      boardScale: this.boardScale,
      blockZIndex: (this.blockZIndex.filter(b => b !== null) as Block[]).map(
        b => b.id,
      ),
    }
  }

  importRecord(record: GraphRecord, blocks: Record<number, Block>) {
    this.boardOffsetX = record.boardOffsetX
    this.boardOffsetY = record.boardOffsetY
    this.boardScale = record.boardScale
    this.blockZIndex = record.blockZIndex.map(id => blocks[id])
    this.updateBlockZIndex()
  }
}

function calcMoveSpeed(graphPos: number, sideLength: number) {
  if (graphPos < 0)
    return -AUTO_MOVE_SPEED_MAX

  if (graphPos < AUTO_MOVE_START_PADDING)
    return AUTO_MOVE_SPEED_SCALE * (graphPos - AUTO_MOVE_START_PADDING)

  if (graphPos > sideLength)
    return AUTO_MOVE_SPEED_MAX

  if (graphPos > sideLength - AUTO_MOVE_START_PADDING) {
    return (
      AUTO_MOVE_SPEED_SCALE * (graphPos - sideLength + AUTO_MOVE_START_PADDING)
    )
  }
  return 0
}

export interface GraphRecord {
  boardOffsetX: number
  boardOffsetY: number
  boardScale: number
  blockZIndex: number[]
}
