import { Line } from "../../type/line";
import { Point } from "../../type/point";
import { Socket } from "../../type/socket";
import { appendChild } from "../../util/appendChild";
import { Block } from "../block";
import { flowgraph } from "../flowgraph";
import { line_pool, socket_pool } from "../pool";
import { SocketHint, socket_hint } from "./socket-hint";

class LineDrag {
  temp_line: {
    start: Point;
    start_soc: Socket;
    end: Point;
  } = {} as any;

  svg: SVGSVGElement;
  path: SVGPathElement;
  line_generating: boolean = false;

  constructor() {
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    this.path.setAttribute("visibility", "hidden");
    appendChild(this.svg, this.path);
  }

  init(): void {
    appendChild(flowgraph, this.svg);

    flowgraph.el.addEventListener("mousedown", this.mousedown.bind(this));
    flowgraph.el.addEventListener("mousemove", this.mousemove.bind(this));
    flowgraph.el.addEventListener("mouseup", this.mouseup.bind(this));

    socket_hint.el.addEventListener("mousedown", this.mousedown.bind(this));
    socket_hint.el.addEventListener("mousemove", this.mousemove.bind(this));
    socket_hint.el.addEventListener("mouseup", this.mouseup.bind(this));
  }

  init_block(blk: Block): void {
    blk.el.addEventListener("mousedown", this.mousedown.bind(this));
    blk.el.addEventListener("mousemove", this.mousemove.bind(this));
    blk.el.addEventListener("mouseup", this.mouseup.bind(this));
  }

  mousedown(ev: MouseEvent): void {
    if (this.line_generating)
      // 可能有多个event_listener绑定了这个事件，只要最先的一个
      return;
    let mouse = flowgraph.get_relative_pos(ev);
    if (socket_hint.visibility === "visible") {
      this.trigger(mouse);
      this.line_generating = true;
      socket_hint.move(mouse);
    }
  }

  mousemove(ev: MouseEvent) {
    if (!this.line_generating) return;
    let mouse = flowgraph.get_relative_pos(ev);
    this.move(mouse);
  }

  mouseup(ev: MouseEvent) {
    if (!this.line_generating) return;
    let mouse = flowgraph.get_relative_pos(ev);
    this.place(mouse);
    this.line_generating = false;
  }

  trigger(mouse: Point): void {
    let soc = socket_pool.nearest(mouse).soc;
    // console.log('triggered.')
    if (soc === undefined) throw new Error("Unfounded socket.");
    // console.log(soc.id.guid)
    if (soc.used) throw new Error("Socket is already used.");
    this.temp_line.start = soc.abs_pos;
    this.temp_line.end = mouse.clone();
    this.display();
    this.temp_line.start_soc = soc;
    soc.used = true;
  }

  move(mouse: Point): void {
    this.temp_line.end = mouse;
    this.display();
  }

  place(mouse: Point): void {
    // console.log('placed', this.temp_line)

    let nearest = socket_pool.nearest_within(mouse, SocketHint.radis);
    this.temp_line.start_soc.used = false;
    if (nearest === undefined) {
      socket_hint.move(mouse);
      this.hidden();
      return;
    }
    let line = new Line({
      start: this.temp_line.start_soc,
      end: nearest,
    });
    this.hidden();
    line_pool.add_line(line);
  }

  display(): void {
    this.path.setAttribute(
      "d",
      `M ${this.temp_line.start.x} ${this.temp_line.start.y} L ${this.temp_line.end.x} ${this.temp_line.end.y}`,
    );
    this.path.setAttribute("stroke-width", "5");
    this.path.setAttribute("stroke", "#000000");
    this.path.setAttribute("visibility", "visible");
  }

  hidden(): void {
    this.path.setAttribute("visibility", "hidden");
  }
}

const line_drag = new LineDrag();

export { LineDrag, line_drag };
