import { Direction } from "./direction";

export class Point {
  constructor(
    public x: number,
    public y: number,
  ) {}

  static distanceSquare(a: Point, b: Point): number {
    return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y);
  }

  static eq(lhs: Point, rhs: Point): boolean {
    return lhs.x == rhs.x && lhs.y == rhs.y;
  }

  static add(a: Point, b: Point): Point {
    return new Point(a.x + b.x, a.y + b.y);
  }

  static minus(a: Point, b: Point): Point {
    return new Point(a.x - b.x, a.y - b.y);
  }

  static moveFarther(p: Point, direction: Direction, distance: number): Point {
    switch (direction) {
      case Direction.UP:
        return new Point(p.x, p.y - distance);
      case Direction.RIGHT:
        return new Point(p.x + distance, p.y);
      case Direction.DOWN:
        return new Point(p.x, p.y + distance);
      case Direction.LEFT:
        return new Point(p.x - distance, p.y);
    }
  }

  static getComponentByDirection(p: Point, direction: Direction): number {
    switch (direction) {
      case Direction.UP:
        return -p.y;
      case Direction.DOWN:
        return p.y;
      case Direction.RIGHT:
        return p.x;
      case Direction.LEFT:
        return -p.x;
    }
  }
}
