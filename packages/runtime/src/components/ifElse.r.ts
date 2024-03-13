import type { Content } from 'refina'
import { Component, _ } from 'refina'

import { Direction, component, content, input } from '../types'

export default component({
  displayName: props => (props['[else]'] ? 'If else' : 'If'),
  contents: {
    then: content('then', 'as-socket', Direction.RIGHT),
    else: content('else', 'as-hidden-socket', Direction.BOTTOM),
  },
  inputs: {
    condition: input('condition'),
  },
})

export interface IfElseProps {
  condition: boolean
  then: Content
  else: Content
}

export class QIfElse extends Component {
  $main(props: IfElseProps) {
    if (props.condition)
      _.embed(props.then)
    else
      _.embed(props.else)
  }
}
