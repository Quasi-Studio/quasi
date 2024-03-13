import type { Content } from 'refina'
import { Component, _ } from 'refina'
import { MdButton } from '@refina/mdui'
import { component, content, event, input, textProp } from '../types'

export default component({
  displayName: () => 'Button',
  contents: {
    inner: content('inner', 'as-primary'),
  },
  inputs: {
    disabled: input('disabled', 'as-hidden-socket'),
  },
  events: {
    onClick: event('onClick'),
  },
  props: {
    class: textProp('class'),
  },
})

export interface ButtonProps {
  inner: Content
  class: string
  disabled: boolean
  onClick: () => void
}

export class QButton extends Component {
  $main(props: ButtonProps) {
    _.$cls(props.class)
    if (_(MdButton)(props.inner, props.disabled))
      props.onClick()
  }
}
