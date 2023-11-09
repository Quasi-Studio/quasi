import { Direction, Point } from "../..";
import { Line, Socket } from "../../model";
import { socketCtors } from "../../recorder";

export class MultiInSocket extends Socket {
  connectedLines: Line[] = [];

  get allConnectedLines(): Line[] {
    return this.connectedLines;
  }

  connectTo(line: Line): void {
    this.connectedLines.push(line);
    line.b = this;
  }
  disconnectTo(line: Line): void {
    const index = this.connectedLines.indexOf(line);
    if (index === -1) {
      throw new Error("line not found");
    }
    this.connectedLines.splice(index, 1);
  }

  canDragFrom(): boolean {
    return false;
  }
  canDragRemove(): boolean {
    return this.connectedLines.length > 0;
  }
  checkConnectable(line: Line): boolean {
    return (
      !this.disabled &&
      line.type === this.type &&
      this.block.id !== line.a.block.id &&
      this.connectedLines.every((l) => l.a.id !== line.a.id)
    );
  }

  getHoveredLine() {
    if (this.connectedLines.length > 0) {
      const { x: mouseDx, y: mouseDy } = Point.minus(
        this.graph.mouseBoardPos,
        this.boardPos,
      );
      const theta0 = Math.atan2(mouseDy, mouseDx);

      let nearestLineDeltaTheta = Infinity;
      let nearestLine = this.connectedLines[0];
      for (const line of this.connectedLines) {
        let { x: lineDx, y: lineDy } = Point.minus(
          line.a.boardPos,
          this.boardPos,
        );
        switch (this.direction) {
          case Direction.LEFT:
            lineDx = -Math.abs(lineDx);
            break;
          case Direction.RIGHT:
            lineDx = Math.abs(lineDx);
            break;
          case Direction.TOP:
            lineDy = -Math.abs(lineDy);
            break;
          case Direction.BOTTOM:
            lineDy = Math.abs(lineDy);
            break;
        }

        const theta = Math.atan2(lineDy, lineDx);
        const deltaTheta = Math.abs(theta - theta0);
        if (deltaTheta < nearestLineDeltaTheta) {
          nearestLineDeltaTheta = deltaTheta;
          nearestLine = line;
        }
      }
      return nearestLine;
    } else {
      return this.connectedLines[0] ?? null;
    }
  }

  onMouseDown(): void {
    if (this.connectedLines.length > 0) {
      const hoveredLine = this.getHoveredLine();
      this.disconnectTo(hoveredLine);
      hoveredLine.neverLeaves = this;
      this.graph.startDraggingLine(hoveredLine);
    } else {
      // do nothing
    }
  }

  protected exportData(): any {
    return {};
  }
  protected importData(_data: any): void {
    // do nothing
  }
}

socketCtors["MultiInSocket"] = MultiInSocket;
