import type { Context, PrimaryElRef } from 'refina'
import { ref } from 'refina'
import { currentProject } from '../../project'
import { app } from '../../app.r'
import type { ComponentBlock } from './block'

export function getContent(block: ComponentBlock) {
  const title = (_: Context) => {
    _.$cls`mx-2 text-sm`
    _.span(block.info.displayName(block.props))
  }
  const primaryInputInfo = block.primaryInputInfo?.[1]

  if (!primaryInputInfo)
    return title
  return (_: Context) => {
    _.$cls`text-gray-600`
    title(_)

    const propagationStopper = (ev: Event) => ev.stopPropagation()
    block.getPrimaryDisabled() && _.$cls`invisible`
    _._span(
      {
        onmousedown: propagationStopper,
        onmouseup: propagationStopper,
        onclick: propagationStopper,
        onkeydown: propagationStopper,
      },
      _ => {
        const inputRef: PrimaryElRef = ref()
        _.$css`font-family: Consolas; max-width: 108px; padding-left:4px`
        _.$ref(inputRef)
        && _.fUnderlineInput(
          block.primaryValue,
          false,
          primaryInputInfo.displayName,
        )
        if (_.$updateContext) {
          setTimeout(() => {
            const inputEl = inputRef.current!.$primaryEl!.node.firstChild as
              | HTMLInputElement
              | undefined
            if (!inputEl)
              return
            inputEl.onchange = () => {
              currentProject.activeGraph.pushRecord()
            }
            inputEl.onfocus = () => {
              currentProject.activeGraph.addSelectedBlock(block, false)
              app.update()
            }
          }, 5)
        }
      },
    )
  }
}
