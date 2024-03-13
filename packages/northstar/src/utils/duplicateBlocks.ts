import { GraphStateType } from '@quasi-dev/visual-flow'
import { currentProject } from '../project'

function isDuplicateable(block: any) {
  return block.duplicateable
}

export function hasBlocksToDuplicate() {
  if (currentProject.activeGraph.state.type === GraphStateType.DRAGGING_BLOCK)
    return false
  return (
    [...currentProject.activeGraph.selectedBlocks].filter(isDuplicateable)
      .length > 0
  )
}

export function duplicateBlocks() {
  const blocks = [...currentProject.activeGraph.selectedBlocks].filter(
    isDuplicateable,
  )
  currentProject.activeGraph.clearSelectedBlocks()
  blocks.forEach(block => {
    const newBlock = block.clone()
    newBlock.boardX = block.boardX + 90
    newBlock.boardY = block.boardY + 90
    newBlock.attached = true
    currentProject.activeGraph.addBlock(newBlock)
    currentProject.activeGraph.moveBlockToTop(newBlock)
    currentProject.activeGraph.updateBlockZIndex()
    currentProject.activeGraph.addSelectedBlock(newBlock, true)
  })
  currentProject.activeGraph.pushRecord()
}
