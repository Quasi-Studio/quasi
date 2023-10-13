import { Direction } from "../types";

const SAME_DIRECTION_MAX_SLOPE = 1;

export function calcLineEndDirection(
  startDirection: Direction,
  dx: number,
  dy: number,
) {
  switch (startDirection) {
    case Direction.LEFT:
      if (dx < 0) {
        const maxDy = -dx * SAME_DIRECTION_MAX_SLOPE;
        if (dy < -maxDy) return Direction.BOTTOM;
        if (dy > maxDy) return Direction.TOP;
        return Direction.RIGHT;
      }
      return Direction.LEFT;

    case Direction.RIGHT:
      if (dx > 0) {
        const maxDy = dx * SAME_DIRECTION_MAX_SLOPE;
        if (dy < -maxDy) return Direction.BOTTOM;
        if (dy > maxDy) return Direction.TOP;
        return Direction.LEFT;
      }
      return Direction.RIGHT;

    case Direction.TOP:
      if (dy < 0) {
        const maxDx = -dy * SAME_DIRECTION_MAX_SLOPE;
        if (dx < -maxDx) return Direction.RIGHT;
        if (dx > maxDx) return Direction.LEFT;
        return Direction.BOTTOM;
      }
      return Direction.TOP;

    case Direction.BOTTOM:
      if (dy > 0) {
        const maxDx = dy * SAME_DIRECTION_MAX_SLOPE;
        if (dx < -maxDx) return Direction.RIGHT;
        if (dx > maxDx) return Direction.LEFT;
        return Direction.TOP;
      }
      return Direction.BOTTOM;
  }
}
