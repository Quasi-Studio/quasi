import { ColorPreset, TricolorPreset } from "../../preset/color";
import { Tricolor, Color } from "../../type/color";
import { Point } from "../../type/point";
import { Socket } from "../../type/socket";
import { appendChild } from "../../util/appendChild";
import calculateTextSize from "../../util/font";
import { Block } from "../block";
import { flowgraph } from "../flowgraph";
import { socket_pool } from "../pool";

class SocketHint {
  el: SVGSVGElement;
  text_svg: SVGSVGElement;
  text: SVGTextElement;
  text_path: SVGPathElement;

  visibility: "visible" | "hidden";

  static readonly color: Tricolor = TricolorPreset.tangerine;
  static readonly radis = 20;

  static readonly text_color: Color = ColorPreset.text_light;
  static readonly text_background_color: Tricolor = TricolorPreset.tangerine;
  static readonly font_size = 12;
  static readonly font_family = "Consolas";

  constructor() {
    this.el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    // path.setAttribute('d', 'M 0 5 A 1 1 0 0 0 10 5 A 1 1 0 0 0 0 5 M 1 5 A 1 1 0 0 1 9 5 A 1 1 0 0 1 1 5 M 3 5 A 1 1 0 0 0 7 5 A 1 1 0 0 0 3 5 Z')
    path.setAttribute("d", "m 0 0 v 5 a 1 1 0 0 0 10 0 a 1 1 0 0 0 -10 0 z");
    path.setAttribute("fill", SocketHint.color.primary.hex());
    appendChild(this.el, path);
    this.el.setAttribute("visibility", "hidden");
    this.visibility = "hidden";

    this.text_svg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );

    this.text_path = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    this.text_path.setAttribute(
      "fill",
      SocketHint.text_background_color.tertiary.hex(),
    );
    appendChild(this.text_svg, this.text_path);

    this.text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    this.text.setAttribute("font-family", SocketHint.font_family);
    this.text.setAttribute("font-size", SocketHint.font_size + "px");
    this.text.setAttribute("fill", SocketHint.text_color.hex());
    appendChild(this.text_svg, this.text);

    this.text_svg.setAttribute("visibility", "hidden");
  }

  init() {
    appendChild(flowgraph, this.el);
    appendChild(flowgraph, this.text_svg);
    flowgraph.el.addEventListener("mousemove", this.mousemove.bind(this));
    this.el.addEventListener("mousemove", this.mousemove.bind(this));
  }

  init_block(blk: Block) {
    blk.el.addEventListener("mousemove", this.mousemove.bind(this));
  }

  mousemove(ev: MouseEvent): void {
    ev.preventDefault();
    this.move(flowgraph.get_relative_pos(ev));
  }

  move(mouse: Point): void {
    // console.log('move', mouse)
    let nearest = socket_pool.nearest_within(mouse, SocketHint.radis, false);

    if (nearest !== undefined) {
      this.display(nearest, mouse);
      this.visibility = nearest.used ? "hidden" : "visible";
    } else {
      this.hidden();
      this.visibility = "hidden";
    }
  }

  display(soc: Socket, mouse_pos: Point): void {
    if (!soc.used) {
      let fixed_pos = Point.add(soc.abs_pos, new Point(-5, -5));
      fixed_pos.apply(this.el, "left-top");
      this.el.setAttribute("visibility", "visible");
      this.el.parentNode?.appendChild(this.el); // raise to top
    } else {
      this.el.setAttribute("visibility", "hidden");
    }

    this.text.textContent = soc.hint;
    let size = calculateTextSize(
      SocketHint.font_size,
      SocketHint.font_family,
      soc.hint,
    );
    this.text_path.setAttribute(
      "d",
      `m 0 0 v ${size.height + 5} h ${size.width + 5} v -${
        size.height + 5
      } h -${size.width + 5} z`,
    );
    this.text.setAttribute("x", "2.5px");
    this.text.setAttribute("y", size.ascent + 3 + "px");
    this.text_svg.appendChild(this.text); // raise to top

    Point.add(mouse_pos, new Point(5, -size.height)).apply(
      this.text_svg,
      "left-top",
    );
    this.text_svg.setAttribute("visibility", "visible");
    this.el.parentNode?.appendChild(this.text_svg); // raise to top
  }

  hidden(): void {
    this.el.setAttribute("visibility", "hidden");
    this.text_svg.setAttribute("visibility", "hidden");
  }
}

const socket_hint = new SocketHint();

export { SocketHint, socket_hint };
