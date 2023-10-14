import { Line, Socket } from "../../model";

export class InSocket extends Socket {
  connectedLine: Line | null = null;

  get allConnectedLines(): Line[] {
    return this.connectedLine ? [this.connectedLine] : [];
  }

  connectTo(line: Line): void {
    this.connectedLine = line;
    line.b = this;
  }
  disconnectTo(line: Line): void {
    if (this.connectedLine === line) {
      this.connectedLine = null;
    } else {
      throw new Error("line not found");
    }
  }

  checkConnectable(line: Line): boolean {
    return !this.connectedLine && line.type === this.type;
  }

  onMouseDown(): void {
    if (this.connectedLine) {
      const line = this.connectedLine;
      this.connectedLine = null;
      this.graph.startDraggingLine(line);
    } else {
      // do nothing
    }
  }
}
