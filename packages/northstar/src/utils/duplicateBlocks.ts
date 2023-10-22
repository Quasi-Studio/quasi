import { GraphStateType } from "@quasi-dev/visual-flow";
import { isComponentBlock } from "../blocks/component/block";
import { graph } from "../store";

export function hasBlocksToDuplicate() {
  if (graph.state.type === GraphStateType.DRAGGING_BLOCK) return false;
  return [...graph.selectedBlocks].filter(isComponentBlock).length > 0;
}

export function duplicateBlocks() {
  const blocks = [...graph.selectedBlocks].filter(isComponentBlock);
  graph.clearSelectedBlocks();
  blocks.forEach((block) => {
    const newBlock = block.ctor();
    newBlock.boardX = block.boardX + 100;
    newBlock.boardY = block.boardY + 100;
    newBlock.attached = true;
    graph.addBlock(newBlock);
    graph.moveBlockToTop(newBlock);
    graph.updateBlockZIndex();
    graph.addSelectedBlock(newBlock, true);
  });
  graph.pushRecord();
}
