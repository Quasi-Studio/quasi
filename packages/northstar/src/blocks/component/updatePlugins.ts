import type { ComponentBlock } from './block'

export function updatePlugins(block: ComponentBlock) {
  const { info } = block

  const plugins = Object.values(info.plugins)

  for (const plugin of plugins)
    block.dockableDirections.push([plugin.direction, plugin.kind])
}
