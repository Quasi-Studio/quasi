import { ComponentBlock } from "./block";

export function updatePlugins(block: ComponentBlock) {
  const { info } = block;

  const { plugins } = info;

  for (const plugin of plugins) {
    block.dockableDirections.push([plugin.direction, plugin.dataType]);
  }
}
