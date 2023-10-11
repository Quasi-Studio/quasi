import { Block } from "./block";
import { owner } from "../util/guid";
import { Socket } from "../type/socket";
import { Point } from "../type/point";
import { Line } from "../type/line";

class BlockPool {
  blocks: Block[] = [];

  add_block(e: Block): void {
    this.blocks.push(e);
  }

  lift_block(e: Block): void {
    e.el.parentNode!.appendChild(e.el);
  }

  owner(e: Socket): Block | undefined {
    let ret: Block[] = this.blocks.filter(
      (blk: Block) => blk.val.id.guid === owner(e.id),
    );
    if (ret.length === 0) return undefined;
    if (ret.length === 1) return ret[0];
    throw new Error("Multiple blocks found with same guid.");
  }
}

const block_pool = new BlockPool();

class SocketPool {
  sockets: Socket[] = [];

  add_socket(e: Socket): void {
    this.sockets.push(e);
  }

  remove_socket(e: Socket): void {
    this.sockets = this.sockets.filter((el) => el.id !== e.id);
  }

  remove_block(e: Block): void {
    this.sockets = this.sockets.filter((el) => owner(el.id) !== e.val.id.guid);
  }

  search_block(e: Block): Socket[] {
    return this.sockets.filter((el) => owner(el.id) === e.val.id.guid);
  }

  nearest(
    p: Point,
    filter: boolean = true,
  ): { soc: Socket | undefined; dis: number } {
    let min_dis: number = Number.MAX_VALUE;
    let ret: Socket | undefined = undefined;
    for (let soc of filter
      ? this.sockets.filter((s) => !s.used)
      : this.sockets) {
      let dis = Point.distance(p, soc.abs_pos);
      if (dis < min_dis) {
        min_dis = dis;
        ret = soc;
      }
    }
    return {
      soc: ret,
      dis: min_dis,
    };
  } // need optimization

  nearest_within(
    p: Point,
    dis: number,
    filter: boolean = true,
  ): Socket | undefined {
    let ret = this.nearest(p, filter);
    if (ret.soc === undefined || ret.dis > dis) return undefined;
    return ret.soc;
  }
}

const socket_pool = new SocketPool();

class LinePool {
  lines: Line[] = [];

  add_line(e: Line): void {
    this.lines.push(e);
  }

  remove_line(e: Line): void {
    this.lines = this.lines.filter((el) => el.id !== e.id);
  }

  search_block(b: Block): Line[] {
    return this.lines.filter(
      (el) =>
        owner(el.start.id) === b.val.id.guid ||
        owner(el.end.id) === b.val.id.guid,
    );
  }
}

const line_pool = new LinePool();

export { block_pool, socket_pool, line_pool };
