import { BlockShape } from "../type/block";
import { ElementBase } from "../type/element-base";
import { appendChild } from "../util/appendChild";
import { Point } from "../type/point";
import { Guid, root } from "../util/guid";
import { line_pool, socket_pool } from "./pool";
import { Socket, SocketInfo, SocketInfoEq } from "../type/socket";
import { find } from "../util/array";

const block_guid = root.alloc();

class Block extends ElementBase<{
  plugins: {
    shape: BlockShape;
  };
  fields: {
    selected: boolean;
    position: Point;
    socket: Socket[];
  };
  id: Guid;
}> {
  el: SVGSVGElement;
  path_el: SVGPathElement;
  text_el: SVGTextElement[] = [];

  constructor(shape: BlockShape) {
    super({
      plugins: {
        shape,
      },
      fields: {
        selected: false,
        position: new Point(100, 200),
        socket: [],
      },
      id: block_guid.alloc(),
    });
  }

  init(par_el: HTMLElement | SVGElement): void {
    this.el = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.update("position");
    appendChild(par_el, this.el);

    this.path_el = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );

    this.update("shape.path");
    this.update("shape.color");
    appendChild(this, this.path_el);

    for (let i of this.val.plugins.shape.text) {
      let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      i.pos.apply(text, "left-top");
      text.textContent = i.text;
      text.setAttribute("font-family", i.font);
      text.setAttribute("font-size", i.size + "px");
      text.setAttribute("fill", i.color.hex());
      text.style.userSelect = "none";
      appendChild(this, text);
      this.text_el.push(text);
    }

    this.update("socket");
  }

  update(a: string): void {
    if (a === "selected") {
      if (this.val.fields.selected)
        this.path_el.setAttribute(
          "fill",
          this.val.plugins.shape.color.secondary.hex(),
        );
      else
        this.path_el.setAttribute(
          "fill",
          this.val.plugins.shape.color.primary.hex(),
        );
    }

    if (a === "position") {
      this.el.setAttribute("x", this.val.fields.position.x + "px");
      this.el.setAttribute("y", this.val.fields.position.y + "px");
      line_pool.search_block(this).forEach((val) => val.display());
    }

    if (a === "shape.path") {
      this.path_el.setAttribute("d", this.val.plugins.shape.path);
    }

    if (a === "shape.color") {
      this.path_el.setAttribute(
        "fill",
        this.val.plugins.shape.color.primary.hex(),
      );
      // this.path_el.setAttribute('stroke', this.val.plugins.shape.color.tertiary.hex())
      // this.path_el.setAttribute('stroke-width', '2px')
    }

    if (a === "shape.text") {
      this.text_el[0].textContent = this.val.plugins.shape.text[0].text;
      // 不得已才这么做的
      // TODO: Use Diff Algorithm
    }

    if (a === "socket") {
      let socket = this.val.plugins.shape.socket;
      let exist_socket = socket_pool.search_block(this);

      for (let i of exist_socket) {
        let info = i.info;
        let e: SocketInfo | undefined;
        if (
          (e = find(socket, (e: SocketInfo) => SocketInfoEq(info, e))) &&
          e !== undefined
        ) {
          socket_pool.remove_socket(i);
          socket = socket.filter((_e: SocketInfo) => _e !== e);
        }
      }

      for (let i of socket) {
        let s = new Socket({
          pos: i.pos,
          face: i.face,
          used: false,
          id: this.val.id.alloc(),
          hint: i.hint,
        });
        socket_pool.add_socket(s);
      }
    }
  }
}

export { Block };
