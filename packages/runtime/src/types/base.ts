/**
 * Copied from `@quasi-dev/visual-flow`
 */
export enum Direction {
  LEFT,
  UP,
  RIGHT,
  DOWN,
  TOP = Direction.UP, // alias
  BOTTOM = Direction.DOWN, // alias
}

export type PositionInfo = Direction | null;
