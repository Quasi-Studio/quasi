import { Component, _ } from 'refina'
import type { Line } from '../model'
import useStyles from './line.styles'

export class VfLine extends Component {
  $main(model: Line) {
    const color
      = model.colors[
        model.dragging ? 'dragging' : model.hovered ? 'hovered' : 'default'
      ]

    const styles = useStyles(model.dragging, model.predicting)

    styles.curve()
    _.$css`stroke-width:${model.graph.boardScale * 3}px;stroke:${color}`
    _.$ref(model.lineRef)
    && _._svgPath({
      d: model.linePath,
    })

    styles.arrow()
    _.$css`fill:${color}`
    _.$ref(model.arrowRef)
    && _._svgPath({
      d: model.arrowPath,
    })
  }
}
