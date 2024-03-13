import type { Context } from 'refina'
import type { Socket } from '../../model'
import { Block } from '../../model'
import { Direction, Point } from '../../types'
import { spreadItems } from '../../utils'
import useStyles from './RectBlock.styles'

const SOCKET_PADDING_SCALE = -0.1

export abstract class RectBlock extends Block {
  ctorName: string = 'RectBlock'

  cloneTo(target: this): this {
    target.boardWidth = this.boardWidth
    target.boardHeight = this.boardHeight
    target.boardBorderRadius = this.boardBorderRadius
    return target
  }

  boardWidth: number
  boardHeight: number
  boardBorderRadius: number = 8

  get boundingRectBoardWidth() {
    return this.boardWidth
  }

  get boundingRectBoardHeight() {
    return this.boardHeight
  }

  get graphWidth() {
    return this.boardWidth * this.graph.boardScale
  }

  get graphHeight() {
    return this.boardHeight * this.graph.boardScale
  }

  get graphBorderRadius() {
    return this.boardBorderRadius * this.graph.boardScale
  }

  get pageWidth() {
    return this.graphWidth
  }

  get pageHeight() {
    return this.graphHeight
  }

  get pageBorderRadius() {
    return this.graphBorderRadius
  }

  getDockingBenchmarkBlockPos(direction: Direction): Point {
    switch (direction) {
      case Direction.LEFT:
        return new Point(0, 0)
      case Direction.RIGHT:
        return new Point(this.boardWidth, this.boardHeight)
      case Direction.TOP:
        return new Point(this.boardWidth, 0)
      case Direction.BOTTOM:
        return new Point(0, this.boardHeight)
    }
  }

  updateSocketPosition() {
    const leftSockets = this.allSockets.filter(
      s => s.direction === Direction.LEFT,
    )
    const rightSockets = this.allSockets.filter(
      s => s.direction === Direction.RIGHT,
    )
    const topSockets = this.allSockets.filter(
      s => s.direction === Direction.TOP,
    )
    const bottomSockets = this.allSockets.filter(
      s => s.direction === Direction.BOTTOM,
    )

    spreadItems(
      this.boardHeight,
      leftSockets.length,
      SOCKET_PADDING_SCALE,
    ).forEach((offset, i) => {
      leftSockets[i].blockX = 0
      leftSockets[i].blockY = offset
    })
    spreadItems(
      this.boardHeight,
      rightSockets.length,
      SOCKET_PADDING_SCALE,
    ).forEach((offset, i) => {
      rightSockets[i].blockX = this.boardWidth
      rightSockets[i].blockY = offset
    })
    spreadItems(
      this.boardWidth,
      topSockets.length,
      SOCKET_PADDING_SCALE,
    ).forEach((offset, i) => {
      topSockets[i].blockX = offset
      topSockets[i].blockY = 0
    })
    spreadItems(
      this.boardWidth,
      bottomSockets.length,
      SOCKET_PADDING_SCALE,
    ).forEach((offset, i) => {
      bottomSockets[i].blockX = offset
      bottomSockets[i].blockY = this.boardHeight
    })
  }

  isBlockPosInside(blockPos: Point): boolean {
    return (
      blockPos.x >= 0
      && blockPos.x <= this.boardWidth
      && blockPos.y >= 0
      && blockPos.y <= this.boardHeight
    )
  }

  get backgroudPath(): string {
    const {
      pageHeight: height,
      pageWidth: width,
      pageBorderRadius: radius,
    } = this
    const t1 = radius / 4
    const t2 = (radius * 3) / 4

    return `m 0 ${radius} v ${
      height - radius * 2
    } c 0 ${t2} ${t1} ${radius} ${radius} ${radius} h ${
      width - radius * 2
    } c ${t2} 0 ${radius} -${t1} ${radius} -${radius} 
            v -${
              height - radius * 2
            } c 0 -${t2} -${t1} -${radius} -${radius} -${radius} h -${
              width - radius * 2
            } c -${t2} 0 -${radius} ${t1} -${radius} ${radius}`
  }

  content: (_: Context) => void

  contentMain = (_: Context) => {
    const styles = useStyles()

    styles.contentOuterWrapper()
    _.$css`width:${this.pageWidth}px;height:${this.pageHeight}px;`
    _.$css`padding:${8 * this.graph.boardScale}px;`
    _._div({}, _ => {
      styles.contentInnerWrapper()
      _.$css`transform:scale(${this.graph.boardScale})`
      _._div({}, this.content)
    })
  }

  createPredictor(): Block {
    const predictor = super.createPredictor() as RectBlock
    predictor.boardWidth = this.boardWidth
    predictor.boardHeight = this.boardHeight
    predictor.boardBorderRadius = this.boardBorderRadius
    predictor.content = _ => {}
    return predictor
  }

  protected exportData(): any {
    return {
      boardHeight: this.boardHeight,
      boardWidth: this.boardWidth,
      boardBorderRadius: this.boardBorderRadius,
    } satisfies RectBlockRecordData
  }

  protected importData(
    data: RectBlockRecordData,
    _sockets: Record<number, Socket>,
  ): void {
    this.boardHeight = data.boardHeight
    this.boardWidth = data.boardWidth
    this.boardBorderRadius = data.boardBorderRadius
  }
}

interface RectBlockRecordData {
  boardHeight: number
  boardWidth: number
  boardBorderRadius: number
}
