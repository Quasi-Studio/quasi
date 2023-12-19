import type { ViewBlockOutput } from "@quasi-dev/compiler";
import {
  Direction,
  PATH_IN_RECT,
  RectBlock,
  SingleInSocket,
  UseSocket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { Context } from "refina";
import { PropsData } from "../../utils/props";
import { singleInSocketToOutput } from "../../utils/toOutput";
import { SpecialBlock } from "./base";

export class ViewBlock extends RectBlock implements SpecialBlock {
  ctorName: string = "ViewBlock";

  cloneTo(target: this): this {
    super.cloneTo(target);
    target.viewName = this.viewName;
    return target;
  }

  removable = true;
  duplicateable = true;

  boardWidth = 200;
  boardHeight = 50;

  viewName: string;

  get parentSocket() {
    return this.getSocketByName("parent") as SingleInSocket;
  }
  socketUpdater(useSocket: UseSocket): void {
    useSocket("parent", SingleInSocket, {
      hideLabel: true,
      type: "L",
      path: PATH_IN_RECT,
      direction: Direction.LEFT,
    });
  }

  contentMain = (_: Context) => {
    _.$cls`absolute flex items-center left-0 top-0 justify-around text-gray-600`;
    _.$css`width:${this.pageWidth}px;height:${this.pageHeight}px;`;
    _.$css`transform:scale(${this.graph.boardScale})`;
    _.div(this.viewName);
  };

  getProps(): PropsData {
    return [];
  }

  protected exportData(): any {
    return {
      ...super.exportData(),
      viewName: this.viewName,
    };
  }
  protected importData(data: any, sockets: any): void {
    super.importData(data, sockets);
    this.viewName = data.viewName;
  }

  toOutput(): ViewBlockOutput {
    return {
      type: "view",
      id: this.id,
      viewName: this.viewName,
      parent: singleInSocketToOutput(this.parentSocket),
    };
  }
}

blockCtors["ViewBlock"] = ViewBlock;
