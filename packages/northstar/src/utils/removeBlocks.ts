import { Socket } from "@quasi-dev/visual-flow";
import { isComponentBlock } from "../blocks/component";
import { graph } from "../store";

export function hasBlocksToRemove() {
  return [...graph.selectedBlocks].filter(isComponentBlock).length > 0;
}

export function removeBlocks() {
  [...graph.selectedBlocks].filter(isComponentBlock).forEach((block) => {
    block.allSockets.forEach((socket) => {
      socket.allConnectedLines.forEach((line) => {
        line.a.disconnectTo(line);
        (line.b as Socket).disconnectTo(line);
        graph.removeLine(line);
      });
    });
    graph.removeBlock(block);
    graph.pushRecord();
  });
}
