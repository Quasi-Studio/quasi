import { GraphStateType } from "@quasi-dev/visual-flow";
import { currentGraph } from "../store";

function isDuplicateable(block: any) {
  return block.duplicateable;
}

export function hasBlocksToDuplicate() {
  if (currentGraph.state.type === GraphStateType.DRAGGING_BLOCK) return false;
  return [...currentGraph.selectedBlocks].filter(isDuplicateable).length > 0;
}

export function duplicateBlocks() {
  const blocks = [...currentGraph.selectedBlocks].filter(isDuplicateable);
  currentGraph.clearSelectedBlocks();
  blocks.forEach((block) => {
    const newBlock = block.ctor();
    newBlock.boardX = block.boardX + 90;
    newBlock.boardY = block.boardY + 90;
    newBlock.attached = true;
    currentGraph.addBlock(newBlock);
    currentGraph.moveBlockToTop(newBlock);
    currentGraph.updateBlockZIndex();
    currentGraph.addSelectedBlock(newBlock, true);
  });
  currentGraph.pushRecord();
}
