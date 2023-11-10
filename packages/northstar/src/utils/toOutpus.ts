import type { ConnectTo, ViewOutput } from "@quasi-dev/compiler";
import type {
  MultiInSocket,
  MultiOutSocket,
  SingleInSocket,
  SingleOutSocket,
  Socket,
} from "@quasi-dev/visual-flow";
import { isComponentBlock, toBlockOutput } from "../blocks/component";
import { SpecialBlock } from "../blocks/special/base";
import { views } from "../store";

export function toOutput() {
  const viewsOutput: ViewOutput[] = [];
  views.forEach((view, name) => {
    viewsOutput.push({
      name,
      componentBlocks: view.graph.blocks
        .filter(isComponentBlock)
        .map(toBlockOutput),
      specialBlocks: view.graph.blocks
        .filter((b) => !isComponentBlock(b))
        .map((b) => (b as unknown as SpecialBlock).toOutput()),
    });
  });
  return {
    views: viewsOutput,
  };
}

export function multiInSocketToOutput(
  socket: MultiInSocket | undefined,
): ConnectTo[] {
  return (
    socket?.allConnectedLines.map((l) => ({
      blockId: l.a.block.id,
      socketName: l.a.label,
    })) ?? []
  );
}

export function multiOutSocketToOutput(
  socket: MultiOutSocket | undefined,
): ConnectTo[] {
  return (
    socket?.allConnectedLines.map((l) => ({
      blockId: (l.b as Socket).block.id,
      socketName: (l.b as Socket).label,
    })) ?? []
  );
}

export function singleInSocketToOutput(
  socket: SingleInSocket | undefined,
): ConnectTo {
  return {
    blockId: socket?.connectedLine?.a.block.id ?? NaN,
    socketName: socket?.connectedLine?.a.label ?? "",
  };
}

export function singleOutSocketToOutput(
  socket: SingleOutSocket | undefined,
): ConnectTo {
  return {
    blockId: (socket?.connectedLine?.b as Socket | undefined)?.block.id ?? NaN,
    socketName: (socket?.connectedLine?.b as Socket | undefined)?.label ?? "",
  };
}
