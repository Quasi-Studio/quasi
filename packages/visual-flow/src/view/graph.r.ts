import { Component, _ } from 'refina'
import type { Graph } from '../model'
import { VfBlock } from './block.r'
import useStyles from './graph.styles'
import { VfLine } from './line.r'

export class VfGraph extends Component {
  $main(model: Graph) {
    model.app = _.$app

    const styles = useStyles()

    if (_.$updateContext) {
      const windowElement = _.$window as any
      windowElement.addEventListener(
        'resize',
        () => {
          model.onResize()
          // not update here, because it will cause performance issue
        },
        {
          passive: true,
        },
      )
      windowElement.addEventListener(
        'mousemove',
        (ev: MouseEvent) => {
          model.setMousePos(ev)
          if (model.onMouseMove((ev.buttons & 1) !== 0, ev.shiftKey)) {
            window.getSelection()?.removeAllRanges()
            this.$update()
          }
        },
        {
          passive: true,
        },
      )
      windowElement.addEventListener('mousedown', (ev: MouseEvent) => {
        model.setMousePos(ev)
        if (model.onMouseDown(ev.shiftKey)) {
          window.getSelection()?.removeAllRanges()
          if (document.activeElement instanceof HTMLElement)
            document.activeElement?.blur()

          ev.preventDefault()
          this.$update()
          return false
        }
        return true
      })
      windowElement.addEventListener('mouseup', (ev: MouseEvent) => {
        model.setMousePos(ev)
        if (model.onMouseUp(ev.shiftKey)) {
          ev.preventDefault()
          this.$update()
          return false
        }
        return true
      })
      _.$root.addEventListener(
        'wheel',
        ev => {
          model.setMousePos(ev)
          if (!model.isMouseInsideGraph)
            return

          if (ev.ctrlKey) {
            if (model.onScaling(-ev.deltaY / 1500)) {
              ev.preventDefault()
              this.$update()
            }
          }
          else if (ev.shiftKey) {
            if (model.onHorizontalScroll(ev.deltaY / 2)) {
              ev.preventDefault()
              this.$update()
            }
          }
          else {
            if (model.onVerticalScroll(ev.deltaY / 2)) {
              ev.preventDefault()
              this.$update()
            }
          }
          return true
        },
        {
          passive: false,
        },
      )

      model.blocks.forEach(block => block.updateSockets())
    }

    styles.root()
    _.$ref(model.ref)
    && _._div({}, _ => {
      const { bg, fg } = model.displayLines

      styles.bgSvg()
      _._svgSvg({}, _ => {
        _.for(bg, 'id', line => {
          _(VfLine)(line)
        })
      })

      styles.fgSvg()
      _._svgSvg({}, _ => {
        _.for(fg, 'id', line => {
          _(VfLine)(line)
        })
      })
    })

    _.for(model.blocks, 'id', block => {
      _(VfBlock)(block)
    })

    styles.canvas()
    _.$ref(model.canvasRef)
    && _._canvas({
      id: 'vf-thumbnail',
    })
  }
}
