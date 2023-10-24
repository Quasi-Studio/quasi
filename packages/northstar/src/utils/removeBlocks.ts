import { GraphStateType, Socket } from "@quasi-dev/visual-flow";
import { currentGraph } from "../store";

function isRemovable(block: any) {
  return block.removable;
}

export function hasBlocksToRemove() {
  if (currentGraph.state.type === GraphStateType.DRAGGING_BLOCK) return false;
  return [...currentGraph.selectedBlocks].filter(isRemovable).length > 0;
}

export function removeBlocks() {
  [...currentGraph.selectedBlocks].filter(isRemovable).forEach((block) => {
    block.allSockets.forEach((socket) => {
      socket.allConnectedLines.forEach((line) => {
        line.a.disconnectTo(line);
        (line.b as Socket).disconnectTo(line);
        currentGraph.removeLine(line);
      });
    });
    currentGraph.removeBlock(block);
    currentGraph.pushRecord();
  });
}
