import { Line, Socket } from "../../model";
import { lineCtors } from "../../recorder";
import { Point, rotate } from "../../types";

const CTRL_POINT_OFFSET_SCALE = 0.8;
const CTRL_POINT_OFFSET_MIN = 30;

const ARROW_SCALE_TO_BOARD = 3;
const ARROW_GRAPH_LENGTH_MAX = 25;
const ARROW_GRAPH_WIDTH_MAX = 7;

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
    let point1 = this.graphPosA;
    let point2 = this.graphPosB;

    const lineOffset =
      Math.min(1, this.graph.boardScale * ARROW_SCALE_TO_BOARD) *
      ARROW_GRAPH_LENGTH_MAX;

    point2 = Point.moveFarther(point2, this.b.direction, lineOffset);

    const delta = Point.minus(point2, point1);

    const delta1 = Point.getComponentByDirection(delta, this.a.direction);
    const offset1 = getCtrlPointOffset(delta1);
    const controlPoint1 = Point.moveFarther(point1, this.a.direction, offset1);

    const delta2 = Point.getComponentByDirection(delta, this.b.direction);
    const offset2 = getCtrlPointOffset(delta2);
    const controlPoint2 = Point.moveFarther(point2, this.b.direction, offset2);

    return `M${point1.x} ${point1.y} C${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${point2.x} ${point2.y}`;
  }

  get arrowPath() {
    const arrowLength =
      Math.min(1, this.graph.boardScale * ARROW_SCALE_TO_BOARD) *
      ARROW_GRAPH_LENGTH_MAX;
    const arrowWidth =
      Math.min(1, this.graph.boardScale * ARROW_SCALE_TO_BOARD) *
      ARROW_GRAPH_WIDTH_MAX;

    const p0 = this.graphPosB;
    const p1 = Point.moveFarther(p0, this.b.direction, arrowLength);
    const p2 = Point.moveFarther(p1, rotate(this.b.direction), arrowWidth);
    const p3 = Point.moveFarther(p1, rotate(this.b.direction), -arrowWidth);

    return `M${p0.x} ${p0.y} L${p2.x} ${p2.y} L${p3.x} ${p3.y} Z`;
  }

  protected exportData(): any {
    return {};
  }
  protected importData(_data: any, _sockets: Record<number, Socket>): void {
    // do nothing
  }
}

lineCtors["BasicLine"] = BasicLine;
