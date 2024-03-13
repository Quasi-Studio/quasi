import type { PositionInfo } from './base'

type EventMode = 'as-socket' | 'as-hidden-socket' | 'as-hidable-socket'

export interface EventInfo {
  displayName: string
  mode: EventMode
  position: PositionInfo
}

export function event(
  displayName: string,
  mode: EventMode = 'as-socket',
  position: PositionInfo = null,
): EventInfo {
  return {
    displayName,
    mode,
    position,
  }
}
