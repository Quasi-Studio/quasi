import { Point } from "../type/point";
import { BlockShape } from "../type/block";
import { Color, Tricolor } from "../type/color";
import { ColorPreset, TricolorPreset } from "./color";
import calculateTextSize from "../util/font";
import { SocketInfo } from "../type/socket";

interface TextBlockCreateOption {
  text_color?: Color;
  text_size?: number;
  color?: Tricolor;
  font?: string;
}

const TextBlockDefaultOption: TextBlockCreateOption = {
  text_color: ColorPreset.text_light,
  color: TricolorPreset.blue,
  text_size: 20,
  font: "Consolas",
};

class TextBlock extends BlockShape {
  text_content: string;
  text_color: Color;
  text_size: number;
  text_font: string;
  block_color: Tricolor;

  constructor(content: string, option?: TextBlockCreateOption) {
    super();

    this.text_content = content;
    let opt = { ...TextBlockDefaultOption, ...option };
    this.text_color = opt.text_color!;
    this.text_size = opt.text_size!;
    this.block_color = opt.color!;
    this.text_font = opt.font!;
  }

  get color(): Tricolor {
    return this.block_color;
  }

  get path(): string {
    let size = calculateTextSize(
      this.text_size,
      this.text_font,
      this.text_content,
    );
    return `m 0 12 v ${size.height} c 0 9 3 12 12 12 h ${size.width} c 9 0 12 -3 12 -12 v -${size.height} c 0 -9 -3 -12 -12 -12 h -${size.width} c -9 0 -12 3 -12 12`;
  }

  get text(): {
    text: string;
    pos: Point;
    color: Color;
    size: number;
    font: string;
  }[] {
    let size = calculateTextSize(
      this.text_size,
      this.text_font,
      this.text_content,
    );
    return [
      {
        text: this.text_content,
        pos: new Point(12, 14 + size.ascent),
        color: this.text_color,
        size: this.text_size,
        font: this.text_font,
      },
    ];
  }

  get socket(): SocketInfo[] {
    let size = calculateTextSize(
      this.text_size,
      this.text_font,
      this.text_content,
    );
    return [
      {
        pos: new Point(0, size.height / 2 + 12),
        face: "left",
        hint: "left",
      },
      {
        pos: new Point(size.width / 2 + 12, 0),
        face: "up",
        hint: "up",
      },
      {
        pos: new Point(size.width + 24, size.height / 2 + 12),
        face: "right",
        hint: "right",
      },
      {
        pos: new Point(size.width / 2 + 12, size.height + 24),
        face: "down",
        hint: "down",
      },
    ];
  }

  update(key: string, val: any): string[] {
    if (key === "text") {
      this.text_content = val as string;
      return ["shape.text", "shape.path"];
    }
    return [];
  }
}

export default {
  text: TextBlock,
};
