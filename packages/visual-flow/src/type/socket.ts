import { block_pool } from "../flowgraph/pool";
import { Guid } from "../util/guid";
import { Direction } from "./dire";
import { Point } from "./point";

class Socket {
  pos: Point;
  id: Guid;
  used: boolean;
  face: Direction;
  hint: string;

  constructor(info: { [key: string]: any }) {
    if (info.pos !== undefined) this.pos = info.pos as Point;
    if (info.id !== undefined) this.id = info.id as Guid;
    if (info.used !== undefined) this.used = info.used as boolean;
    if (info.face !== undefined) this.face = info.face as Direction;
    if (info.hint !== undefined) this.hint = info.hint as string;
  }

  get info(): SocketInfo {
    return {
      pos: this.pos,
      face: this.face,
      hint: this.hint,
    };
  }

  get abs_pos(): Point {
    let blk = block_pool.owner(this);
    if (blk === undefined) throw new Error("Socket has no owner");
    return Point.add(this.pos, blk.val.fields.position);
  }

  static eq(lhs: Socket, rhs: Socket) {
    return lhs.id.guid === rhs.id.guid;
  }
}

interface SocketInfo {
  pos: Point;
  face: Direction;
  hint: string;
}

function SocketInfoEq(lhs: SocketInfo, rhs: SocketInfo) {
  return Point.eq(lhs.pos, rhs.pos) && lhs.face === rhs.face;
}

export { Socket, SocketInfoEq };

export type { SocketInfo };
