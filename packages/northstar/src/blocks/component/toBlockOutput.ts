import type {
  BlockCallbacks,
  BlockProps,
  ComponentBlockOutput,
} from "@quasi-dev/compiler";
import { Block, Socket } from "@quasi-dev/visual-flow";
import { ComponentBlock } from "./block";

export function toBlockOutput(block: ComponentBlock) {
  const callbacks = {} as BlockCallbacks;
  for (const event of block.info.events) {
    const sockets = block.socketMap
      .get(event.name)
      ?.allConnectedLines?.map((l) => l.b as Socket);
    if (!sockets) continue;

    callbacks[event.name] = [];
    for (const socket of sockets) {
      callbacks[event.name].push({
        blockId: socket.block.id,
        name: socket.label,
      });
    }
  }

  const props = {} as BlockProps;
  for (const [k, v] of Object.entries(block.info.props)) {
    props[k] = block.props[k] ?? v.defaultVal;
  }
  for (const input of block.info.inputs) {
    const socket = block.socketMap.get(input.name)?.allConnectedLines[0]?.a;
    if (!socket) continue;
    props[input.name] = {
      blockId: socket.block.id,
      name: socket.label,
    };
  }

  const children = [] as Block[];
  for (const content of block.info.contents) {
    const socket = block.socketMap.get(content.name)?.allConnectedLines[0]?.b;
    if (!socket) continue;
    children.push((socket as Socket).block);
  }

  children.sort((a, b) => a.boardY - b.boardY);

  return {
    type: block.componentType,
    id: block.id,
    name: block.info.name,
    modelAllocator: block.info.modelAllocator,
    callbacks,
    props,
    children: children.map((b) => b.id),
  } satisfies ComponentBlockOutput;
}
