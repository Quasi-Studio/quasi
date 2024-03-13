import type { Line } from '../../model'
import { Socket } from '../../model'
import { socketCtors } from '../../recorder'
import { BasicLine } from '../line'

export class MultiOutSocket extends Socket {
  ctorName: string = 'MultiOutSocket'

  connectedLines: Line[] = []

  connectTo(line: Line): void {
    this.connectedLines.push(line)
  }

  disconnectTo(line: Line) {
    const index = this.connectedLines.indexOf(line)
    if (index === -1)
      throw new Error('line not found')

    this.connectedLines.splice(index, 1)
  }

  canDragFrom(): boolean {
    return !this.disabled
  }

  canDragRemove(): boolean {
    return false
  }

  checkConnectable(_line: Line): boolean {
    return false
  }

  get allConnectedLines(): Line[] {
    return this.connectedLines
  }

  getHoveredLine(): Line | null {
    return null
  }

  onMouseDown(): void {
    const line = this.connectToNewLine(new BasicLine())
    this.graph.startDraggingLine(line)
  }

  protected exportData(): any {
    return {}
  }

  protected importData(_data: any): void {
    // do nothing
  }
}

socketCtors.MultiOutSocket = MultiOutSocket
