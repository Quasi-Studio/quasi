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
  disabled = false;

  ref = ref<SVGElementComponent<"g">>();
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
  abstract canDragRemove(): boolean;
  abstract checkConnectable(line: Line): boolean;

  onHover() {
    this.el!.classList.add("hovered");
  }
  onUnhover() {
    this.el!.classList.remove("hovered");
  }

  abstract onMouseDown(): void;

  protected connectToNewLine(line: Line) {
    line.type = this.type;
    line.initialize(this, this.graph.mouseBoardPos);

    this.graph.addLine(line);

    this.connectTo(line);
    return line;
  }

  protected abstract exportData(): any;
  exportRecord(): SocketRecord {
    return {
      ctor: this.constructor.name,
      id: this.id,
      type: this.type,
      label: this.label,
      disabled: this.disabled,
      blockId: this.block.id,
      path: this.path,
      data: this.exportData(),
    };
  }
  protected abstract importData(data: any): void;
  importRecord(record: SocketRecord) {
    this.id = record.id;
    this.type = record.type;
    this.label = record.label;
    this.disabled = record.disabled;
    this.path = record.path;
    this.importData(record.data);
  }

  path: string;
}

export interface SocketRecord {
  ctor: string;
  id: number;
  type: string;
  label: string;
  disabled: boolean;
  blockId: number;
  path: string;
  data: any;
}
