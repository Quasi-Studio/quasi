import type {
  ComponentBlockCallbacks,
  ComponentBlockChildren,
  ComponentBlockOutput,
  ComponentBlockProps,
} from "@quasi-dev/compiler";
import { Block, Socket } from "@quasi-dev/visual-flow";
import { ComponentBlock } from "./block";

export function toBlockOutput(block: ComponentBlock) {
  const callbacks = {} as ComponentBlockCallbacks;
  for (const event of block.info.events) {
    const sockets = block.socketMap
      .get(event.name)
      ?.allConnectedLines?.map((l) => l.b as Socket);
    if (!sockets) continue;

    callbacks[event.name] = [];
    for (const socket of sockets) {
      callbacks[event.name].push({
        blockId: socket.block.id,
        socketName: socket.label,
      });
    }
  }

  const props = {} as ComponentBlockProps;
  for (const [k, v] of Object.entries(block.info.props)) {
    props[k] = block.props[k] ?? v.defaultVal;
  }
  for (const input of block.info.inputs) {
    const socket = block.socketMap.get(input.name)?.allConnectedLines[0]?.a;
    if (!socket) continue;
    props[input.name] = {
      blockId: socket.block.id,
      socketName: socket.label,
    };
  }

  let children = {} as ComponentBlockChildren;
  for (const content of block.info.contents) {
    if (content.kind === "as-primary") {
      children[content.name] = block.primaryValue.value;
    } else if (
      content.kind === "as-primary-and-socket" &&
      block.primaryFilled
    ) {
      children[content.name] = block.primaryValue.value;
    } else {
      children[content.name] =
        block.socketMap
          .get(content.name)
          ?.allConnectedLines.map((l) => (l.b as Socket).block)
          .sort((a, b) => a.boardY - b.boardY)
          .map((b) => b.id) ?? [];
    }
  }

  return {
    type: "component",
    func: block.componentType,
    id: block.id,
    name: block.info.name,
    modelAllocator: block.info.modelAllocator,
    callbacks,
    props,
    children,
  } satisfies ComponentBlockOutput;
}
