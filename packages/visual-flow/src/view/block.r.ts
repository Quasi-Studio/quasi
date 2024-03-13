import { Component, _ } from 'refina'
import type { Block } from '../model'
import useStyles, { PADDING_FOR_SOCKETS } from './block.styles'
import { VfSocket } from './socket.r'

export class VfBlock extends Component {
  $main(model: Block) {
    const { x, y } = model.attached ? model.graphPos : model.pagePos
    const padding = PADDING_FOR_SOCKETS * model.graph.boardScale

    const styles = useStyles(model.selected, model.attached, model.predicting)

    styles.root()
    _.$css`left:${x}px;top:${y}px;z-index:${
      model.attached ? model.zIndex : 10000
    }`
    _.$ref(model.ref)
    && _._div({}, _ => {
      styles.svg()
      _.$css`left:${-padding}px; top:${-padding}px`
      _._svgSvg(
        {
          width:
              model.boundingRectBoardWidth * model.graph.boardScale
              + 2 * padding,
          height:
              model.boundingRectBoardHeight * model.graph.boardScale
              + 2 * padding,
        },
        _ => {
          _._svgG(
            {
              transform: `translate(${padding}, ${padding})`,
            },
            _ => {
              styles.bg()
              _.$ref(model.bgRef)
              && _._svgPath({
                d: model.backgroudPath,
              })

              _.for(model.allSockets, 'id', socket => {
                _(VfSocket)(socket)
              })
            },
          )
        },
      )

      _._div(
        {
          onmousedown: ev => {
            if (ev.defaultPrevented)
              ev.stopPropagation()
          },
          // onmousemove: (ev) => {
          //   if (!model.dragging) ev.stopPropagation();
          // },
          onmouseup: ev => {
            if (!model.selected)
              ev.stopPropagation()
          },
        },
        model.contentMain,
      )
    })
  }
}
