import { Line, Socket } from "../../model";
import { socketCtors } from "../../recorder";

export class InSocket extends Socket {
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
    throw new Error("Method not supported.");
  }

  canDragFrom(): boolean {
    return false;
  }
  canDragRemove(): boolean {
    return this.connectedLine !== null;
  }
  checkConnectable(line: Line): boolean {
    return (
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

  protected exportData(): any {
    return {};
  }
  protected importData(_data: any): void {
    // do nothing
  }
}

socketCtors["InSocket"] = InSocket;
