import type { Content, RefTreeNode } from 'refina'
import { Component, _ } from 'refina'

import { Direction, component, content, input, output } from '../types'

export default component({
  displayName: () => 'For each',
  model: 'ForEachModel',
  contents: {
    inner: content('inner', 'as-socket', Direction.BOTTOM),
  },
  inputs: {
    iterable: input('iterable'),
  },
  outputs: {
    current: output('current', 'as-socket', Direction.RIGHT),
  },
})

export interface ForEachProps {
  inner: Content
  iterable: Iterable<unknown>
}

export class ForEachModel {
  current: unknown
}

export class QForEach extends Component {
  refNodes: Record<string, RefTreeNode> = {}
  $main(model: ForEachModel, props: ForEachProps) {
    const parentRefTreeNode = _.$lowlevel.$$currentRefNode

    let index = 0
    for (const v of props.iterable) {
      model.current = v

      const key = index.toString()

      this.refNodes[key] ??= {}
      _.$lowlevel.$$currentRefNode = this.refNodes[key]

      _.embed(props.inner)

      index++
    }

    _.$lowlevel.$$currentRefNode = parentRefTreeNode
  }
}
