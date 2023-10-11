import { flowgraph } from "../flowgraph/flowgraph";
import { line_pool } from "../flowgraph/pool";
import { TricolorPreset } from "../preset/color";
import { appendChild } from "../util/appendChild";
import { Guid, root } from "../util/guid";
import {
  further,
  further_dis,
  get_point,
  reverse,
  rotate,
  to_point,
  update_point,
} from "./dire";
import { Point } from "./point";
import { Socket } from "./socket";

let line_guid = root.alloc();

class Line {
  start: Socket;
  end: Socket;
  id: Guid;

  el: SVGPathElement;

  static readonly color = TricolorPreset.red;

  constructor(info: { [key: string]: any }) {
    if (info.start !== undefined) this.start = info.start;
    if (info.end !== undefined) this.end = info.end;
    if (info.id !== undefined) this.id = info.id;
    if (this.start.used || this.end.used)
      throw new Error("Socket already used");
    this.start.used = true;
    this.end.used = true;
    this.id = line_guid.alloc();

    this.el = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline",
    );
    this.el.setAttribute("stroke", Line.color.primary.hex());
    this.el.setAttribute("stroke-width", "5");
    this.el.setAttribute("fill", "none");
    appendChild(flowgraph.el, this);

    this.el.addEventListener("dblclick", () => {
      line_pool.remove_line(this);
      this.destructor();
    });

    this.display();
  }

  destructor() {
    this.start.used = false;
    this.end.used = false;
    this.el.parentNode!.removeChild(this.el);
  }

  display() {
    this.el.setAttribute("points", this.path);
  }

  get path(): string {
    let turning_point: Point[] = [];

    let start = this.start.abs_pos;
    let end = this.end.abs_pos;

    let dire_start = this.start.face;
    let dire_end = this.end.face;

    let ext_1 = Point.add(start, to_point(dire_start, 20));
    let ext_2 = Point.add(end, to_point(dire_end, 20));

    if (dire_start === dire_end || dire_start === reverse(dire_end)) {
      let dire = dire_start;
      if (dire_start === dire_end) {
        // U type
        let dis = further_dis(dire, ext_1, ext_2);
        let tp1 = update_point(dire, ext_1, dis);
        let tp2 = update_point(dire, ext_2, dis);
        turning_point = [tp1, tp2];
        // console.log('U Entered')
      } else {
        if (get_point(rotate(dire), start) === get_point(rotate(dire), end)) {
          // - type
          turning_point = [];
          // console.log('- Entered')
        } else {
          let orth = rotate(dire);
          if (further(dire, end, start)) {
            // Z type
            let mid = (get_point(dire, start) + get_point(dire, end)) / 2;
            let tp1 = update_point(dire, start, mid);
            let tp2 = update_point(dire, end, mid);
            turning_point = [tp1, tp2];
            // console.log('Z Entered')
          } else {
            // S type
            let mid = (get_point(orth, start) + get_point(orth, end)) / 2;
            let tp1 = update_point(orth, ext_1, mid);
            let tp2 = update_point(orth, ext_2, mid);
            turning_point = [ext_1, tp1, tp2, ext_2];
            // console.log('S Entered')
          }
        }
      }
    } else {
      if (further(dire_start, end, start) && further(dire_end, start, end)) {
        // L type
        let tp = update_point(dire_start, start, get_point(dire_start, end));
        turning_point = [tp];
        // console.log('L Entered')
      }
      if (further(dire_start, end, start) && !further(dire_end, start, end)) {
        // ? type
        let mid =
          (get_point(dire_start, start) + get_point(dire_start, end)) / 2;
        let tp1 = update_point(dire_start, start, mid);
        let tp2 = update_point(dire_start, ext_2, mid);
        turning_point = [tp1, tp2, ext_2];
        // console.log('? Entered')
      }
      if (!further(dire_start, end, start) && further(dire_end, start, end)) {
        // ? type
        let mid = (get_point(dire_end, start) + get_point(dire_end, end)) / 2;
        let tp1 = update_point(dire_end, ext_1, mid);
        let tp2 = update_point(dire_end, end, mid);
        turning_point = [ext_1, tp1, tp2];
        // console.log('? Entered')
      }
      if (!further(dire_start, end, start) && !further(dire_end, start, end)) {
        // C type
        let tp = update_point(dire_end, ext_1, get_point(dire_end, ext_2));
        turning_point = [ext_1, tp, ext_2];
        // console.log('C Entered')
      }
    }
    let ret = `${start.x},${start.y}`;
    for (let i of turning_point) ret += ` ${i.x},${i.y}`;
    ret += ` ${end.x},${end.y}`;
    return ret;
  }
}

export { Line };
