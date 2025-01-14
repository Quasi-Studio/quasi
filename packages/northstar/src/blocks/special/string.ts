import type { FuncBlockTypes } from '@quasi-dev/compiler'
import { blockCtors } from '@quasi-dev/visual-flow'
import { FuncBlockBase } from './FuncBlockBase.r'

export class StringBlock extends FuncBlockBase {
  ctorName: string = 'StringBlock'

  type: FuncBlockTypes = 'string'

  label = 'string template'

  get slotsUsage() {
    const template = this.inputValue.value
    const matches = template.matchAll(/\{[a-zA-Z0-9_]+\}/g)
    return [...matches].map(match => match[0].slice(1, -1))
  }
}

blockCtors.StringBlock = StringBlock
