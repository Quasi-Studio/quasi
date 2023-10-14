import { Line, Socket } from "../../model";
import { BasicLine } from "../line";

export class SingleOutSocket extends Socket {
  connectedLine: Line | null = null;

  get allConnectedLines(): Line[] {
    return this.connectedLine ? [this.connectedLine] : [];
  }

  connectTo(line: Line): void {
    this.connectedLine = line;
  }
  disconnectTo(line: Line): void {
    if (this.connectedLine === line) {
      this.connectedLine = null;
    } else {
      throw new Error("line not found");
    }
  }

  checkConnectable(_line: Line): boolean {
    return false;
  }

  onMouseDown(): void {
    if (this.connectedLine) {
      // do nothing
    } else {
      const line = this.connectToNewLine(new BasicLine());
      this.graph.startDraggingLine(line);
    }
  }
}
