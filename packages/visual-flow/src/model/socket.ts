import type { SVGElementComponent } from 'refina'
import { ref } from 'refina'
import { Direction, Point } from '../types'
import { ModelBase } from './base'
import type { Block } from './block'
import type { Graph } from './graph'
import type { Line } from './line'

export abstract class Socket extends ModelBase {
  abstract ctorName: string

  get graph(): Graph {
    return this.block.graph
  }

  type: string

  /**
   * label to be displayed
   */
  label: string
  hideLabel = false
  disabled = false

  ref = ref<SVGElementComponent<'g'>>()
  get el() {
    return this.ref.current?.node
  }

  block: Block
  direction: Direction

  /**
   * position relative to the block.
   * unit: board coord
   */
  blockX: number
  blockY: number

  get blockDisplayX() {
    return this.blockX * this.graph.boardScale
  }

  get blockDisplayY() {
    return this.blockY * this.graph.boardScale
  }

  get blockDisplayRadius() {
    return Math.min(this.graph.boardScale * 3, 1) * 5
  }

  abstract get allConnectedLines(): Line[]

  abstract connectTo(line: Line): void
  abstract disconnectTo(line: Line): void

  get blockPos() {
    return { x: this.blockX, y: this.blockY }
  }

  get boardPos() {
    return Point.add(this.block.boardPos, this.blockPos)
  }

  get graphPos() {
    return this.graph.boardPos2GraphPos(this.boardPos)
  }

  abstract canDragFrom(): boolean
  abstract canDragRemove(): boolean
  abstract checkConnectable(line: Line): boolean

  onHover() {
    this.el?.classList.add('hovered')
  }

  onUnhover() {
    this.el?.classList.remove('hovered')
  }

  abstract onMouseDown(): void

  protected connectToNewLine(line: Line) {
    line.type = this.type
    line.initialize(this, this.graph.mouseBoardPos)

    this.graph.addLine(line)

    this.connectTo(line)
    return line
  }

  abstract getHoveredLine(): Line | null

  protected abstract exportData(): any
  exportRecord(): SocketRecord {
    return {
      ctor: this.ctorName,
      id: this.id,
      type: this.type,
      direction: this.direction,
      label: this.label,
      hideLabel: this.hideLabel,
      disabled: this.disabled,
      blockId: this.block.id,
      path: this.path,
      data: this.exportData(),
    }
  }

  protected abstract importData(data: any): void
  importRecord(record: SocketRecord) {
    this.id = record.id
    this.type = record.type
    this.direction = record.direction
    this.label = record.label
    this.hideLabel = record.hideLabel
    this.disabled = record.disabled
    this.path = record.path
    this.importData(record.data)
  }

  path: string

  get labelBoardPos() {
    switch (this.direction) {
      case Direction.LEFT:
        return { 'x': -4, 'y': -5, 'text-anchor': 'end' }
      case Direction.TOP:
        return { x: 5, y: 0 }
      case Direction.RIGHT:
        return { x: 5, y: -5 }
      case Direction.BOTTOM:
        return { x: 5, y: 15 }
    }
  }
}

export interface SocketRecord {
  ctor: string
  id: number
  type: string
  direction: Direction
  label: string
  hideLabel: boolean
  disabled: boolean
  blockId: number
  path: string
  data: any
}
