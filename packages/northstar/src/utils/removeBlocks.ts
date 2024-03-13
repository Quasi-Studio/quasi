import type { Socket } from '@quasi-dev/visual-flow'
import { GraphStateType } from '@quasi-dev/visual-flow'
import { currentProject } from '../project'

function isRemovable(block: any) {
  return block.removable
}

export function hasBlocksToRemove() {
  if (currentProject.activeGraph.state.type === GraphStateType.DRAGGING_BLOCK)
    return false
  return (
    [...currentProject.activeGraph.selectedBlocks].filter(isRemovable).length
    > 0
  )
}

export function removeBlocks() {
  [...currentProject.activeGraph.selectedBlocks]
    .filter(isRemovable)
    .forEach(block => {
      block.allSockets.forEach(socket => {
        socket.allConnectedLines.forEach(line => {
          line.a.disconnectTo(line);
          (line.b as Socket).disconnectTo(line)
          currentProject.activeGraph.removeLine(line)
        })
      })
      currentProject.activeGraph.removeBlock(block)
      currentProject.activeGraph.pushRecord()
    })
}
