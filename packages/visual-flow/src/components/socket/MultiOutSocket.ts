import { Line, Socket } from "../../model";
import { BasicLine } from "../line";

export class MultiOutSocket extends Socket {
  connectedLines: Line[] = [];

  connectTo(line: Line): void {
    this.connectedLines.push(line);
  }
  disconnectTo(line: Line) {
    const index = this.connectedLines.indexOf(line);
    if (index === -1) {
      throw new Error("line not found");
    }
    this.graph.removeLine(line);
    this.connectedLines.splice(index, 1);
  }

  checkConnectable(_line: Line): boolean {
    return false;
  }

  get allConnectedLines(): Line[] {
    return this.connectedLines;
  }

  onMouseDown(): void {
    const line = this.connectToNewLine(new BasicLine());
    this.graph.startDraggingLine(line);
  }
}
