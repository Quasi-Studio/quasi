import { Point } from "./point";

type Direction = "left" | "right" | "up" | "down";

function to_point(dire: Direction, dist: number) {
  switch (dire) {
    case "left":
      return new Point(-dist, 0);
    case "right":
      return new Point(dist, 0);
    case "up":
      return new Point(0, -dist);
    case "down":
      return new Point(0, dist);
  }
}

function to_svg(dire: Direction, dist: number) {
  switch (dire) {
    case "left":
      return `h -${dist}`;
    case "right":
      return `h ${dist}`;
    case "up":
      return `v -${dist}`;
    case "down":
      return `v ${dist}`;
  }
}

function reverse(dire: Direction): Direction {
  switch (dire) {
    case "left":
      return "right";
    case "right":
      return "left";
    case "up":
      return "down";
    case "down":
      return "up";
  }
}

function further_dis(dire: Direction, p1: Point, p2: Point): number {
  switch (dire) {
    case "left":
      return Math.min(p1.x, p2.x);
    case "right":
      return Math.max(p1.x, p2.x);
    case "up":
      return Math.min(p1.y, p2.y);
    case "down":
      return Math.max(p1.y, p2.y);
  }
}

function update_point(dire: Direction, p: Point, val: number): Point {
  if (dire === "left" || dire === "right") return new Point(val, p.y);
  if (dire === "up" || dire === "down") return new Point(p.x, val);
  return 1 as never;
}

function rotate(dire: Direction): Direction {
  switch (dire) {
    case "left":
      return "up";
    case "right":
      return "down";
    case "up":
      return "left";
    case "down":
      return "right";
  }
}

function get_point(dire: Direction, p: Point): number {
  if (dire === "left" || dire === "right") return p.x;
  if (dire === "up" || dire === "down") return p.y;
  return 1 as never;
}

function further(dire: Direction, p1: Point, p2: Point): boolean {
  switch (dire) {
    case "left":
      return p1.x < p2.x;
    case "right":
      return p1.x > p2.x;
    case "up":
      return p1.y < p2.y;
    case "down":
      return p1.y > p2.y;
  }
}

export type { Direction };

export {
  to_point,
  to_svg,
  reverse,
  further_dis,
  rotate,
  update_point,
  get_point,
  further,
};
