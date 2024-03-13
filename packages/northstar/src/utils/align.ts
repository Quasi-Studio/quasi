import { currentProject } from '../project'

export function hasBlocksToAlign() {
  return currentProject.activeGraph.selectedBlocks.size > 1
}

export function alignBlocksToLeft() {
  const blocks = [...currentProject.activeGraph.selectedBlocks]
  const left = Math.min(...blocks.map(b => b.boardX))
  blocks.forEach(b => (b.boardX = left))
  currentProject.activeGraph.pushRecord()
}

export function alignBlocksToTop() {
  const blocks = [...currentProject.activeGraph.selectedBlocks]
  const top = Math.min(...blocks.map(b => b.boardY))
  blocks.forEach(b => (b.boardY = top))
  currentProject.activeGraph.pushRecord()
}
