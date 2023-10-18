import { Point } from "./point";

export enum Direction {
  LEFT,
  UP,
  RIGHT,
  DOWN,
  TOP = Direction.UP, // alias
  BOTTOM = Direction.DOWN, // alias
}

export function toPoint(dire: Direction, dist: number) {
  switch (dire) {
    case Direction.LEFT:
      return new Point(-dist, 0);
    case Direction.RIGHT:
      return new Point(dist, 0);
    case Direction.UP:
      return new Point(0, -dist);
    case Direction.DOWN:
      return new Point(0, dist);
  }
}

export function opposite(dire: Direction): Direction {
  switch (dire) {
    case Direction.LEFT:
      return Direction.RIGHT;
    case Direction.RIGHT:
      return Direction.LEFT;
    case Direction.UP:
      return Direction.DOWN;
    case Direction.DOWN:
      return Direction.UP;
  }
}

export function updatePoint(dire: Direction, p: Point, val: number): Point {
  if (dire === Direction.LEFT || dire === Direction.RIGHT)
    return new Point(val, p.y);
  if (dire === Direction.UP || dire === Direction.DOWN)
    return new Point(p.x, val);
  return 1 as never;
}

export function rotate(dire: Direction): Direction {
  switch (dire) {
    case Direction.LEFT:
      return Direction.UP;
    case Direction.RIGHT:
      return Direction.DOWN;
    case Direction.UP:
      return Direction.RIGHT;
    case Direction.DOWN:
      return Direction.LEFT;
  }
}

export function getPoint(dire: Direction, p: Point): number {
  if (dire === Direction.LEFT || dire === Direction.RIGHT) return p.x;
  if (dire === Direction.UP || dire === Direction.DOWN) return p.y;
  return 1 as never;
}

export function further(dire: Direction, p1: Point, p2: Point): boolean {
  switch (dire) {
    case Direction.LEFT:
      return p1.x < p2.x;
    case Direction.RIGHT:
      return p1.x > p2.x;
    case Direction.UP:
      return p1.y < p2.y;
    case Direction.DOWN:
      return p1.y > p2.y;
  }
}

export function futherDis(dire: Direction, p1: Point, p2: Point): number {
  switch (dire) {
    case Direction.LEFT:
      return Math.min(p1.x, p2.x);
    case Direction.RIGHT:
      return Math.max(p1.x, p2.x);
    case Direction.UP:
      return Math.min(p1.y, p2.y);
    case Direction.DOWN:
      return Math.max(p1.y, p2.y);
  }
}
