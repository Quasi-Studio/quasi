import { Block } from "./block";
import { BlockShape } from "../type/block";
import { block_pool } from "./pool";
import { drag } from "./interact/drag";
import { Guid, root } from "../util/guid";
import { socket_hint } from "./interact/socket-hint";
import { line_drag } from "./interact/line-drag";
import { Point } from "../type/point";
import { appendChild } from "../util/appendChild";

class FlowGraph {
  el: SVGSVGElement;
  guid: Guid = root;
  offset: Point;

  div_el: HTMLDivElement;

  constructor() {
    this.el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.el.setAttribute("width", "1000px");
    this.el.setAttribute("height", "1000px");
  }

  init() {
    socket_hint.init();
    drag.init();
    line_drag.init();
  }

  create_block(shape: BlockShape): Block {
    let b = new Block(shape);
    b.init(this.el);
    block_pool.add_block(b);
    drag.init_block(b);
    line_drag.init_block(b);
    socket_hint.init_block(b);
    return b;
  }

  get_relative_pos(ev: MouseEvent) {
    return Point.add(this.offset, new Point(ev.clientX, ev.clientY));
  }

  inject(el: HTMLDivElement) {
    this.div_el = el;
    appendChild(el, this.el);
    this.offset = new Point(-this.div_el.offsetLeft, -this.div_el.offsetTop);
  }
}

const flowgraph = new FlowGraph();
flowgraph.init();

export { flowgraph };
