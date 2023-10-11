import { Color, Tricolor } from "./color";
import { PluginConfig } from "./element-base";
import { Point } from "./point";
import { SocketInfo } from "./socket";

abstract class BlockShape extends PluginConfig {
  // 其中的 pos 都是相对于 block 左上角的 offset
  abstract get color(): Tricolor;
  abstract get path(): string;
  abstract get text(): {
    text: string;
    pos: Point;
    color: Color;
    size: number;
    font: string;
  }[];
  abstract get socket(): SocketInfo[];
}

export { BlockShape };
