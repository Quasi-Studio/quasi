import type { PositionInfo } from './base'

export type MethodDisplay =
  | 'as-socket'
  | 'as-hidden-socket'
  | 'as-hidable-socket'

export interface MethodInfo {
  displayName: string
  mode: MethodDisplay
  position: PositionInfo
}

export function method(
  displayName: string,
  mode: MethodDisplay = 'as-socket',
  position: PositionInfo = null,
): MethodInfo {
  return {
    displayName,
    mode,
    position,
  }
}
