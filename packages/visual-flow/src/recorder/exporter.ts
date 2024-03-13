import type { Graph } from '../model'
import type { VfRecord } from './types'

export function exportVf(graph: Graph) {
  const record: VfRecord = {
    graph: graph.exportRecord(),
    blocks: graph.blocks
      .filter(block => block.attached)
      .map(block => block.exportRecord()),
    sockets: graph.blocks
      .filter(block => block.attached)
      .flatMap(block =>
        block.allSockets.map(socket => socket.exportRecord()),
      ),
    lines: graph.lines
      .filter(line => line.connected)
      .map(line => line.exportRecord()),
  }
  return record
}
