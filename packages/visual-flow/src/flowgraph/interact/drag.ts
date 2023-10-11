import { socket_hint } from "./socket-hint";
import { Point } from "../../type/point";
import { Block } from "../block";
import { flowgraph } from "../flowgraph";
import { block_pool } from "../pool";

class Drag {
  mouse_start: Point;
  dragging = false;

  init() {
    flowgraph.el.addEventListener("click", (_) => {
      for (let blk of block_pool.blocks) blk.patch({ selected: false });
    });

    flowgraph.el.addEventListener("mousemove", (ev) => {
      this.onmousemove(ev);
    });
  }

  init_block(b: Block): void {
    b.el.addEventListener("mousedown", (ev) => this.onmousedown(b, ev));
    b.el.addEventListener("mouseup", (ev) => this.onmouseup(b, ev));
  }

  onmousedown(blk: Block, ev: MouseEvent): void {
    ev.preventDefault();
    let mouse = flowgraph.get_relative_pos(ev);
    this.mouse_start = mouse;
    if (socket_hint.visibility === "visible") return;
    blk.patch({ selected: true });
    this.dragging = true;
  }
  onmousemove(ev: MouseEvent): void {
    ev.preventDefault();
    let mouse = flowgraph.get_relative_pos(ev);
    if (this.dragging) {
      for (let blk of block_pool.blocks)
        if (blk.val.fields.selected)
          blk.patch({
            position: new Point(
              blk.val.fields.position.x + (mouse.x - this.mouse_start.x),
              blk.val.fields.position.y + (mouse.y - this.mouse_start.y),
            ),
          });
      this.mouse_start = mouse;
    }
    ev.preventDefault();
  }
  onmouseup(blk: Block, ev: MouseEvent): void {
    ev.preventDefault();
    if (socket_hint.visibility === "visible") return;
    block_pool.lift_block(blk);
    let mouse = flowgraph.get_relative_pos(ev);
    if (Point.eq(this.mouse_start, mouse) && this.dragging) {
      blk.patch({ selected: false });
      this.dragging = false;
      return;
    }
  }
}

const drag = new Drag();

export { Drag, drag };
