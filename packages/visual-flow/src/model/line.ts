import type { SVGElementComponent } from 'refina'
import { ref } from 'refina'
import type { Direction } from '../types'
import { Point } from '../types'
import { calcLineEndDirection } from '../utils'
import { ModelBase } from './base'
import type { Graph } from './graph'
import type { Socket } from './socket'

const NEVER_LEAVES_DISTANCE_SQUARE = 100

const pointWithDirectionSym = Symbol('pointWithDirectionSym')

export interface PointWithDirection {
  boardX: number
  boardY: number
  direction: Direction
  [pointWithDirectionSym]: true
}

export interface LineColors {
  default: string
  hovered: string
  dragging: string
}

const defaultColors: Record<string, LineColors> = {
  L: {
    default: '#CE9178',
    hovered: '#AE7158',
    dragging: '#8E5138',
  },
  D: {
    default: '#4FC1FF',
    hovered: '#2EA0E5',
    dragging: '#0E80CB',
  },
  E: {
    default: '#DCDCAA',
    hovered: '#BCBC8B',
    dragging: '#9C9C6B',
  },
}

export abstract class Line extends ModelBase {
  abstract ctorName: string

  abstract clone(): Line

  graph: Graph
  type: string

  get colors(): LineColors {
    return defaultColors[this.type]
  }

  hasArrow: boolean = true

  dragging: boolean = false
  hovered: boolean = false
  predicting: boolean = false

  neverLeaves: Socket | null = null

  lineRef = ref<SVGElementComponent>()
  get lineEl() {
    return this.lineRef.current?.node
  }

  arrowRef = ref<SVGElementComponent>()
  get arrowEl() {
    return this.arrowRef.current?.node
  }

  a: Socket
  b: Socket | PointWithDirection

  initialize(socketA: Socket, boardPosB: Point) {
    this.a = socketA
    this.setBoardPosB(boardPosB)
  }

  setBoardPosB(boardPosB: Point, direction?: Direction) {
    if (
      this.neverLeaves
      && Point.distanceSquare(this.neverLeaves.boardPos, boardPosB)
      >= NEVER_LEAVES_DISTANCE_SQUARE
    )
      this.neverLeaves = null

    const boardPosA = this.a.boardPos
    this.b = {
      boardX: boardPosB.x,
      boardY: boardPosB.y,
      direction:
        direction
        ?? calcLineEndDirection(
          this.a.direction,
          boardPosB.x - boardPosA.x,
          boardPosB.y - boardPosA.y,
        ),
      [pointWithDirectionSym]: true,
    }
  }

  get graphPosA() {
    return this.a.graphPos
  }

  get graphPosB() {
    if (this.connected) {
      return (this.b as Socket).graphPos
    }
    else {
      return this.graph.boardPos2GraphPos({
        x: (this.b as PointWithDirection).boardX,
        y: (this.b as PointWithDirection).boardY,
      })
    }
  }

  get boardPosA() {
    return this.a.boardPos
  }

  get boardPosB() {
    if (this.connected) {
      return (this.b as Socket).boardPos
    }
    else {
      return {
        x: (this.b as PointWithDirection).boardX,
        y: (this.b as PointWithDirection).boardY,
      }
    }
  }

  get connected() {
    // @ts-expect-error type guard
    return this.b[pointWithDirectionSym] !== true
  }

  updatePosition() {
    this.lineEl?.setAttribute('d', this.linePath)
    this.arrowEl?.setAttribute('d', this.arrowPath)
  }

  onHover() {
    this.hovered = true
    if (this.lineEl)
      this.lineEl.style.stroke = this.colors.hovered
    if (this.arrowEl)
      this.arrowEl.style.fill = this.colors.hovered
  }

  onUnhover() {
    this.hovered = false
    if (this.lineEl)
      this.lineEl.style.stroke = this.colors.default
    if (this.arrowEl)
      this.arrowEl.style.fill = this.colors.default
  }

  disconnect(s: Socket) {
    if (s === this.a) {
      if (!this.connected) {
        this.graph.removeLine(this)
        return
      }
      this.a = this.b as Socket
      this.b = undefined as any
    }
    else if (s === this.b) {
      this.b = undefined as any
    }
    else {
      throw new Error('Socket not connected')
    }
  }

  abstract get linePath(): string

  abstract get arrowPath(): string

  abstract drawThumbnail(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    scale: number,
  ): void

  createPredictor(): Line {
    const predictor = this.clone()
    predictor.graph = this.graph
    predictor.a = this.a
    predictor.b = this.b
    predictor.predicting = true
    return predictor
  }

  protected abstract exportData(): any
  exportRecord(): LineRecord {
    return {
      ctor: this.ctorName,
      id: this.id,
      type: this.type,
      socketAId: this.a.id,
      socketBId: (this.b as Socket).id,
      hasArrow: this.hasArrow,
      data: this.exportData(),
    }
  }

  protected abstract importData(
    data: any,
    sockets: Record<number, Socket>,
  ): void
  importRecord(record: LineRecord, sockets: Record<number, Socket>) {
    this.id = record.id
    this.type = record.type
    this.a = sockets[record.socketAId]
    this.a.connectTo(this)
    this.b = sockets[record.socketBId]
    this.b.connectTo(this)
    this.hasArrow = record.hasArrow
    this.importData(record.data, sockets)
  }
}

export interface LineRecord {
  ctor: string
  id: number
  type: string
  socketAId: number
  socketBId: number
  hasArrow: boolean
  data: any
}
