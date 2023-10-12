export class Point {
  constructor(
    public x: number,
    public y: number,
  ) {}

  static distance(a: Point, b: Point): number {
    return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
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
}
