class Point {
  x: number;
  y: number;

  constructor(_x: number, _y: number) {
    this.x = _x;
    this.y = _y;
  }

  copy(a: Point): void {
    this.x = a.x;
    this.y = a.y;
  }

  apply(el: HTMLElement | SVGElement, option: "left-top" | "size"): void {
    if (el instanceof HTMLElement) {
      if (option == "left-top") {
        el.style.left = this.x + "px";
        el.style.top = this.y + "px";
      } else if (option == "size") {
        el.style.width = this.x + "px";
        el.style.height = this.y + "px";
      }
    } else if (el instanceof SVGElement) {
      if (option == "left-top") {
        el.setAttribute("x", this.x + "px");
        el.setAttribute("y", this.y + "px");
      } else if (option == "size") {
        el.setAttribute("width", this.x + "px");
        el.setAttribute("height", this.y + "px");
      }
    }
  }

  clone(): Point {
    return new Point(this.x, this.y);
  }

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

export { Point };
