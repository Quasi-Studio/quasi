import { MdTableCell, MdTableHeader } from '@refina/mdui'
import type { Content } from 'refina'
import { Component, _ } from 'refina'
import {
  Direction,
  component,
  content,
  input,
  output,
  textProp,
} from '../types'
import type { TableModel } from './table.r'
import { currentTableSymbol } from './table.r'

export default component({
  displayName: () => 'Table Col',
  model: 'TableColModel',
  contents: {
    inner: content('inner'),
  },
  inputs: {
    prop: input('prop', 'as-primary'),
  },
  outputs: {
    value: output('value', 'as-hidable-socket', Direction.TOP),
  },
  props: {
    header: textProp('header', '$prop'),
    headClass: textProp('head class'),
    cellClass: textProp('cell class'),
  },
})

export interface TableColProps {
  inner: Content
  prop: string
  header: string
  headClass: string
  cellClass: string
}

export class TableColModel {
  value: any
}

export class QTableCol extends Component {
  $main(model: TableColModel, props: TableColProps) {
    const currentTable = _.$runtimeData[currentTableSymbol] as TableModel
    if (currentTable.renderingState === 'head') {
      _.$cls(props.headClass)
      _(MdTableHeader)(props.header === '$prop' ? props.prop : props.header)
    }
    else {
      model.value = currentTable.current[props.prop]
      _.$cls(props.cellClass)
      _(MdTableCell)(props.inner)
    }
  }
}
