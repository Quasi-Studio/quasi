class Color {
  r: number;
  g: number;
  b: number;

  constructor(_r: number, _g: number, _b: number) {
    this.r = _r;
    this.g = _g;
    this.b = _b;
  }

  hex(): string {
    let s = "00000" + ((this.r << 16) + (this.g << 8) + this.b).toString(16);
    return "#" + s.substring(s.length - 6);
  }
}

class Tricolor {
  primary: Color;
  secondary: Color;
  tertiary: Color;

  constructor(p: Color, s: Color, t: Color) {
    this.primary = p;
    this.secondary = s;
    this.tertiary = t;
  }
}

export { Color, Tricolor };
