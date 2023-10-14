import { Line, Socket } from "../../model";

export class InSocket extends Socket {
  connectedLine: Line | null = null;

  get allConnectedLines(): Line[] {
    return this.connectedLine ? [this.connectedLine] : [];
  }

  connectTo(line: Line): void {
    if (this.connectedLine) {
      this.connectedLine.a.disconnectTo(this.connectedLine);
    }
    this.connectedLine = line;
    line.b = this;
  }
  disconnectTo(_line: Line): void {
    throw new Error("Method not supported.");
  }

  checkConnectable(line: Line): boolean {
    return line.type === this.type && this.block.id !== line.a.block.id;
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
