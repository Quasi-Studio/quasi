import { Line, Socket } from "../../model";
import { lineCtors } from "../../recorder";
import { Point, rotate } from "../../types";

const CTRL_POINT_OFFSET_SCALE = 0.8;
const CTRL_POINT_OFFSET_MIN = 30;

const ARROW_BOARD_LENGTH = 25;
const ARROW_BOARD_WIDTH = 7;
const LINE_END_OFFSET = ARROW_BOARD_LENGTH * 0.99;

function getCtrlPointOffset(delta: number) {
  return Math.max(
    Math.abs(delta * CTRL_POINT_OFFSET_SCALE),
    CTRL_POINT_OFFSET_MIN,
  );
}

export class BasicLine extends Line {
  ctor(): Line {
    return new BasicLine();
  }

  get linePath() {
    let point1 = this.boardPosA;
    let point2 = this.boardPosB;

    point2 = Point.moveFarther(point2, this.b.direction, LINE_END_OFFSET);

    const delta = Point.minus(point2, point1);

    const delta1 = Point.getComponentByDirection(delta, this.a.direction);
    const offset1 = getCtrlPointOffset(delta1);
    const controlPoint1 = Point.moveFarther(point1, this.a.direction, offset1);

    const delta2 = Point.getComponentByDirection(delta, this.b.direction);
    const offset2 = getCtrlPointOffset(delta2);
    const controlPoint2 = Point.moveFarther(point2, this.b.direction, offset2);

    const graphPos1 = this.graphPosA;
    const graphPos2 = this.graph.boardPos2GraphPos(point2);
    const graphCtrl1 = this.graph.boardPos2GraphPos(controlPoint1);
    const graphCtrl2 = this.graph.boardPos2GraphPos(controlPoint2);

    return `M${graphPos1.x} ${graphPos1.y} C${graphCtrl1.x} ${graphCtrl1.y}, ${graphCtrl2.x} ${graphCtrl2.y}, ${graphPos2.x} ${graphPos2.y}`;
  }

  get arrowPath() {
    const p0 = this.boardPosB;
    const p1 = Point.moveFarther(p0, this.b.direction, ARROW_BOARD_LENGTH);
    const p2 = Point.moveFarther(
      p1,
      rotate(this.b.direction),
      ARROW_BOARD_WIDTH,
    );
    const p3 = Point.moveFarther(
      p1,
      rotate(this.b.direction),
      -ARROW_BOARD_WIDTH,
    );

    const gp0 = this.graphPosB;
    const gp2 = this.graph.boardPos2GraphPos(p2);
    const gp3 = this.graph.boardPos2GraphPos(p3);

    return `M${gp0.x} ${gp0.y} L${gp2.x} ${gp2.y} L${gp3.x} ${gp3.y} Z`;
  }

  protected exportData(): any {
    return {};
  }
  protected importData(_data: any, _sockets: Record<number, Socket>): void {
    // do nothing
  }
}

lineCtors["BasicLine"] = BasicLine;
