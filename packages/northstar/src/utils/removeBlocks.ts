import { GraphStateType, Socket } from "@quasi-dev/visual-flow";
import { isComponentBlock } from "../blocks/component/block";
import { currentGraph } from "../store";

export function hasBlocksToRemove() {
  if (currentGraph.state.type === GraphStateType.DRAGGING_BLOCK) return false;
  return [...currentGraph.selectedBlocks].filter(isComponentBlock).length > 0;
}

export function removeBlocks() {
  [...currentGraph.selectedBlocks].filter(isComponentBlock).forEach((block) => {
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
