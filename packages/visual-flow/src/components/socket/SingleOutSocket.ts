import { Line, Socket } from "../../model";
import { socketCtors } from "../../recorder";
import { BasicLine } from "../line";
import { PATH_OUT_ELIPSE, PATH_OUT_RECT } from "./constants";

export class SingleOutSocket extends Socket {
  ctorName: string = "SingleOutSocket";

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

  canDragFrom(): boolean {
    return !this.connectedLine && !this.disabled;
  }
  canDragRemove(): boolean {
    return false;
  }
  checkConnectable(_line: Line): boolean {
    return false;
  }

  getHoveredLine(): Line | null {
    return this.connectedLine;
  }

  onMouseDown(): void {
    if (this.connectedLine) {
      // do nothing
    } else {
      const line = this.connectToNewLine(new BasicLine());
      this.graph.startDraggingLine(line);
    }
  }

  protected exportData(): any {
    return {};
  }
  protected importData(_data: any): void {
    // do nothing
  }
}

socketCtors["SingleOutSocket"] = SingleOutSocket;
