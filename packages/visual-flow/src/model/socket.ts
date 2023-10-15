import { SVGElementComponent, ref } from "refina";
import { Point, type Direction } from "../types";
import { ModelBase } from "./base";
import { Block } from "./block";
import { Graph } from "./graph";
import { Line } from "./line";

export abstract class Socket extends ModelBase {
  get graph(): Graph {
    return this.block.graph;
  }
  type: string;

  /**
   * label to be displayed
   */
  label: string;

  ref = ref<SVGElementComponent<"circle">>();
  get el() {
    return this.ref.current?.node;
  }

  block: Block;
  direction: Direction;

  /**
   * position relative to the block.
   * unit: board coord
   */
  blockX: number;
  blockY: number;

  get blockDisplayX() {
    return this.blockX * this.graph.boardScale;
  }
  get blockDisplayY() {
    return this.blockY * this.graph.boardScale;
  }
  get blockDisplayRadius() {
    return Math.min(this.graph.boardScale * 3, 1) * 5;
  }

  abstract get allConnectedLines(): Line[];

  abstract connectTo(line: Line): void;
  abstract disconnectTo(line: Line): void;

  get blockPos() {
    return { x: this.blockX, y: this.blockY };
  }
  get boardPos() {
    return Point.add(this.block.boardPos, this.blockPos);
  }
  get graphPos() {
    return this.graph.boardPos2GraphPos(this.boardPos);
  }

  abstract canDragFrom(): boolean;
  abstract checkConnectable(line: Line): boolean;

  onHover() {
    this.el!.classList.add("hovered");
  }
  onUnhover() {
    this.el!.classList.remove("hovered");
  }

  abstract onMouseDown(): void;

  protected connectToNewLine(line: Line) {
    line.graph = this.graph;
    line.type = this.type;
    line.initialize(this, this.graph.mouseBoardPos);

    this.graph.addLine(line);

    this.connectTo(line);
    return line;
  }
}
