import type { Content } from 'refina'
import { Component, _ } from 'refina'

import { component, content, textProp } from '../types'

export default component({
  displayName: () => 'Span',
  contents: {
    inner: content('inner', 'as-primary-and-socket'),
  },
  props: {
    class: textProp('class'),
  },
})

export interface SpanProps {
  inner: Content
  class: string
}

export class QSpan extends Component {
  $main(props: SpanProps) {
    _.$cls(props.class)
    _._span({}, props.inner)
  }
}
