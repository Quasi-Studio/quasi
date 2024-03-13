import type { ConnectTo } from '@quasi-dev/compiler'
import type {
  MultiInSocket,
  MultiOutSocket,
  SingleInSocket,
  SingleOutSocket,
  Socket,
} from '@quasi-dev/visual-flow'

export function multiInSocketToOutput(
  socket: MultiInSocket | undefined,
): ConnectTo[] {
  return (
    socket?.allConnectedLines.map(l => ({
      blockId: l.a.block.id,
      socketName: l.a.label,
    })) ?? []
  )
}

export function multiOutSocketToOutput(
  socket: MultiOutSocket | undefined,
): ConnectTo[] {
  return (
    socket?.allConnectedLines.map(l => ({
      blockId: (l.b as Socket).block.id,
      socketName: (l.b as Socket).label,
    })) ?? []
  )
}

export function singleInSocketToOutput(
  socket: SingleInSocket | undefined,
): ConnectTo {
  return {
    blockId: socket?.connectedLine?.a.block.id ?? Number.NaN,
    socketName: socket?.connectedLine?.a.label ?? '',
  }
}

export function singleOutSocketToOutput(
  socket: SingleOutSocket | undefined,
): ConnectTo {
  return {
    blockId: (socket?.connectedLine?.b as Socket | undefined)?.block.id ?? Number.NaN,
    socketName: (socket?.connectedLine?.b as Socket | undefined)?.label ?? '',
  }
}
