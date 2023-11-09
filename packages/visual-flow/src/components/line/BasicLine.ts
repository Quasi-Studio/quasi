import { Line, Socket } from "../../model";
import { lineCtors } from "../../recorder";
import { Point, rotate } from "../../types";

const CTRL_POINT_OFFSET_SCALE = 0.8;
const CTRL_POINT_OFFSET_MIN = 30;

const ARROW_BOARD_LENGTH = 25;
const ARROW_BOARD_WIDTH = 7;
export const LINE_END_OFFSET = ARROW_BOARD_LENGTH * 0.99;

function getCtrlPointOffset(delta: number) {
  return Math.max(
    Math.abs(delta * CTRL_POINT_OFFSET_SCALE),
    CTRL_POINT_OFFSET_MIN,
  );
}

export class BasicLine extends Line {
  clone(): Line {
    const line = new BasicLine();
    line.type = this.type;
    return line;
  }

  calcCtrlPoint(point1: Point, point2: Point) {
    const delta = Point.minus(point2, point1);

    const delta1 = Point.getComponentByDirection(delta, this.a.direction);
    const offset1 = getCtrlPointOffset(delta1);
    const controlPoint1 = Point.moveFarther(point1, this.a.direction, offset1);

    const delta2 = Point.getComponentByDirection(delta, this.b.direction);
    const offset2 = getCtrlPointOffset(delta2);
    const controlPoint2 = Point.moveFarther(point2, this.b.direction, offset2);

    return [controlPoint1, controlPoint2];
  }

  get linePath() {
    let point1 = this.boardPosA;
    let point2 = this.boardPosB;

    point2 = Point.moveFarther(point2, this.b.direction, LINE_END_OFFSET);

    const [controlPoint1, controlPoint2] = this.calcCtrlPoint(point1, point2);

    const graphPos1 = this.graphPosA;
    const graphPos2 = this.graph.boardPos2GraphPos(point2);
    const graphCtrl1 = this.graph.boardPos2GraphPos(controlPoint1);
    const graphCtrl2 = this.graph.boardPos2GraphPos(controlPoint2);

    return `M${graphPos1.x} ${graphPos1.y} C${graphCtrl1.x} ${graphCtrl1.y}, ${graphCtrl2.x} ${graphCtrl2.y}, ${graphPos2.x} ${graphPos2.y}`;
  }

  calcArrowPoint() {
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
    return { p2, p3 };
  }

  get arrowPath() {
    const { p2, p3 } = this.calcArrowPoint();

    const gp0 = this.graphPosB;
    const gp2 = this.graph.boardPos2GraphPos(p2);
    const gp3 = this.graph.boardPos2GraphPos(p3);

    return `M${gp0.x} ${gp0.y} L${gp2.x} ${gp2.y} L${gp3.x} ${gp3.y} Z`;
  }

  drawThumbnail(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    scale: number,
  ): void {
    if (this.predicting) return;

    ctx.lineWidth = Math.max(0.05, Math.min(2 * scale, 1));
    ctx.strokeStyle = this.dragging ? "rgb(15,84,140)" : "rgb(15,108,189)";
    ctx.fillStyle = ctx.strokeStyle;

    let point1 = this.boardPosA;
    let point2 = Point.moveFarther(
      this.boardPosB,
      this.b.direction,
      LINE_END_OFFSET,
    );
    const [controlPoint1, controlPoint2] = this.calcCtrlPoint(point1, point2);
    ctx.beginPath();
    ctx.moveTo((point1.x - left) * scale, (point1.y - top) * scale);
    ctx.bezierCurveTo(
      (controlPoint1.x - left) * scale,
      (controlPoint1.y - top) * scale,
      (controlPoint2.x - left) * scale,
      (controlPoint2.y - top) * scale,
      (point2.x - left) * scale,
      (point2.y - top) * scale,
    );
    ctx.stroke();

    const p0 = this.boardPosB;
    const { p2, p3 } = this.calcArrowPoint();
    ctx.beginPath();
    ctx.moveTo((p0.x - left) * scale, (p0.y - top) * scale);
    ctx.lineTo((p2.x - left) * scale, (p2.y - top) * scale);
    ctx.lineTo((p3.x - left) * scale, (p3.y - top) * scale);
    ctx.fill();
  }

  protected exportData(): any {
    return {};
  }
  protected importData(_data: any, _sockets: Record<number, Socket>): void {
    // do nothing
  }
}

lineCtors["BasicLine"] = BasicLine;
