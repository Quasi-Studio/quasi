import { GraphStateType } from "@quasi-dev/visual-flow";
import { isComponentBlock } from "../blocks/component/block";
import { currentGraph } from "../store";

export function hasBlocksToDuplicate() {
  if (currentGraph.state.type === GraphStateType.DRAGGING_BLOCK) return false;
  return [...currentGraph.selectedBlocks].filter(isComponentBlock).length > 0;
}

export function duplicateBlocks() {
  const blocks = [...currentGraph.selectedBlocks].filter(isComponentBlock);
  currentGraph.clearSelectedBlocks();
  blocks.forEach((block) => {
    const newBlock = block.ctor();
    newBlock.boardX = block.boardX + 100;
    newBlock.boardY = block.boardY + 100;
    newBlock.attached = true;
    currentGraph.addBlock(newBlock);
    currentGraph.moveBlockToTop(newBlock);
    currentGraph.updateBlockZIndex();
    currentGraph.addSelectedBlock(newBlock, true);
  });
  currentGraph.pushRecord();
}
