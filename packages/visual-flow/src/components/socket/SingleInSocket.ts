import { Line, Socket } from "../../model";
import { socketCtors } from "../../recorder";

export class SingleInSocket extends Socket {
  ctorName: string = "SingleInSocket";

  connectedLine: Line | null = null;

  get allConnectedLines(): Line[] {
    return this.connectedLine ? [this.connectedLine] : [];
  }

  connectTo(line: Line): void {
    if (this.connectedLine) {
      this.connectedLine.a.disconnectTo(this.connectedLine);
      this.graph.removeLine(this.connectedLine);
    }
    this.connectedLine = line;
    line.b = this;
  }
  disconnectTo(_line: Line): void {
    this.connectedLine = null;
  }

  canDragFrom(): boolean {
    return false;
  }
  canDragRemove(): boolean {
    return this.connectedLine !== null;
  }
  checkConnectable(line: Line): boolean {
    return (
      !this.disabled &&
      line.type === this.type &&
      this.block.id !== line.a.block.id &&
      (!this.connectedLine || line.a.id !== this.connectedLine.a.id)
    );
  }

  onMouseDown(): void {
    if (this.connectedLine) {
      const line = this.connectedLine;
      this.connectedLine = null;
      line.neverLeaves = this;
      this.graph.startDraggingLine(line);
    } else {
      // do nothing
    }
  }

  getHoveredLine(): Line | null {
    return this.connectedLine;
  }

  protected exportData(): any {
    return {};
  }
  protected importData(_data: any): void {
    // do nothing
  }
}

socketCtors["SingleInSocket"] = SingleInSocket;
