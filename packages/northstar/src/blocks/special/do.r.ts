import type { DoBlockOutput } from '@quasi-dev/compiler'
import type {
  Block,
  Socket,
  UseSocket,
} from '@quasi-dev/visual-flow'
import {
  Direction,
  MultiInSocket,
  PATH_IN_TRIANGLE,
  PATH_OUT_TRIANGLE,
  RectBlock,
  SingleOutSocket,
  blockCtors,
} from '@quasi-dev/visual-flow'
import type { Context } from 'refina'
import type { PropsData } from '../../utils/props'
import {
  multiInSocketToOutput,
  singleOutSocketToOutput,
} from '../../utils/toOutput'

const WIDTH = 70
const HEIGHT = 30

export class DoBlock extends RectBlock {
  ctorName: string = 'DoBlock'

  cloneTo(target: this): this {
    super.cloneTo(target)
    target.thenNum = this.thenNum
    target.rotate = this.rotate
    return target
  }

  type = 'state-setter'

  boardWidth = WIDTH
  boardHeight = HEIGHT

  removable = true
  duplicateable = true

  get whenSocket() {
    return this.getSocketByName('when') as MultiInSocket
  }

  get thenSockets() {
    return this.getSocketsByPrefix('then') as SingleOutSocket[]
  }

  thenNum: number = 2
  rotate: boolean = false

  socketUpdater(useSocket: UseSocket): void {
    useSocket('when', MultiInSocket, {
      hideLabel: true,
      type: 'E',
      path: PATH_IN_TRIANGLE,
      direction: this.rotate ? Direction.LEFT : Direction.TOP,
    })

    for (let i = 0; i < this.thenNum; i++) {
      useSocket(`then-${i}`, SingleOutSocket, {
        label: `${i + 1}`,
        type: 'E',
        path: PATH_OUT_TRIANGLE,
        direction: this.rotate ? Direction.RIGHT : Direction.BOTTOM,
      })
    }
  }

  getProps(): PropsData {
    return [
      {
        key: 'number',
        displayName: 'number',
        type: 'number',
        min: 2,
        max: 5,
        getVal: () => {
          return this.thenNum
        },
        setVal: val => {
          this.thenNum = val
        },
      },
      {
        key: 'rotate',
        displayName: 'rotate',
        type: 'switch',
        getVal: () => {
          return this.rotate
        },
        setVal: val => {
          this.rotate = val
          if (val) {
            this.boardWidth = HEIGHT
            this.boardHeight = WIDTH
          }
          else {
            this.boardWidth = WIDTH
            this.boardHeight = HEIGHT
          }
        },
      },
    ]
  }

  contentMain = (_: Context) => {
    _.$cls`absolute flex items-center left-0 top-0 justify-around text-gray-600`
    _.$css`width:${this.pageWidth}px;height:${this.pageHeight}px;`
    _.$css`transform:scale(${this.graph.boardScale})`
    _.div(_ => {
      _.span('do')
    })
  }

  protected exportData() {
    return {
      ...super.exportData(),
      thenNum: this.thenNum,
      rotate: this.rotate,
    }
  }

  protected importData(data: any, sockets: Record<number, Socket>): void {
    super.importData(data, sockets)
    this.thenNum = data.thenNum
    this.rotate = data.rotate
  }

  toOutput(): DoBlockOutput {
    let stateBlock: Block = this
    while (stateBlock.dockedToBlock)
      stateBlock = stateBlock.dockedToBlock

    return {
      type: 'do',
      id: this.id,
      when: multiInSocketToOutput(this.whenSocket),
      then: this.thenSockets.map(singleOutSocketToOutput),
    }
  }
}

blockCtors.DoBlock = DoBlock
