import { MdList } from '@refina/mdui'
import type { Content } from 'refina'
import { Component, _, byIndex, bySelf } from 'refina'
import {
  Direction,
  component,
  content,
  input,
  output,
  textProp,
} from '../types'

export default component({
  displayName: () => 'List',
  model: 'ListModel',
  contents: {
    inner: content('inner', undefined, Direction.BOTTOM),
  },
  inputs: {
    data: input('data'),
  },
  outputs: {
    current: output('current', undefined, Direction.RIGHT),
  },
  props: {
    class: textProp('class'),
    key: textProp('key', '$index'),
  },
})

export interface ListProps {
  inner: Content
  class: string
  data: Iterable<any>
  key: string
}

export class ListModel {
  current: any
}

export class QList extends Component {
  $main(model: ListModel, props: ListProps) {
    _.$cls(props.class)
    _(MdList)(
      props.data,
      props.key === '$index'
        ? byIndex
        : props.key === '$self'
          ? bySelf
          : props.key,
      v => {
        model.current = v
        _.embed(props.inner)
      },
    )
    model.current = null
  }
}
