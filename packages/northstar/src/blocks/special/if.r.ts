import type { IfBlockOutput } from "@quasi-dev/compiler";
import {
  Direction,
  MultiInSocket,
  PATH_IN_ELIPSE,
  PATH_IN_TRIANGLE,
  PATH_OUT_TRIANGLE,
  RectBlock,
  SingleInSocket,
  SingleOutSocket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { Context } from "refina";
import { PropsData } from "../../utils/props";
import { multiInSocketToOutput, singleInSocketToOutput, singleOutSocketToOutput } from "../../utils/toOutpus";
import { SpecialBlock } from "./base";

export class IfElseBlock extends RectBlock implements SpecialBlock {
  clone() {
    const block = new IfElseBlock();
    block.initialize();
    return block;
  }

  removable = true;
  duplicateable = true;

  condSocket: SingleInSocket;
  whenSocket: MultiInSocket;
  thenSocket: SingleOutSocket;
  elseSocket: SingleOutSocket;

  initialize(): void {
    this.condSocket = new SingleInSocket();
    this.condSocket.type = "D";
    this.condSocket.label = "condition";
    this.condSocket.path = PATH_IN_ELIPSE;
    this.addSocket(Direction.TOP, this.condSocket);

    this.whenSocket = new MultiInSocket();
    this.whenSocket.type = "E";
    this.whenSocket.label = "when";
    this.whenSocket.path = PATH_IN_TRIANGLE;
    this.addSocket(Direction.LEFT, this.whenSocket);

    this.thenSocket = new SingleOutSocket();
    this.thenSocket.type = "E";
    this.thenSocket.label = "then";
    this.thenSocket.path = PATH_OUT_TRIANGLE;
    this.addSocket(Direction.BOTTOM, this.thenSocket);

    this.elseSocket = new SingleOutSocket();
    this.elseSocket.type = "E";
    this.elseSocket.label = "else";
    this.elseSocket.path = PATH_OUT_TRIANGLE;
    this.addSocket(Direction.BOTTOM, this.elseSocket);
  }

  boardWidth: number = 200;
  boardHeight: number = 50;

  contentMain = (_: Context) => {
    _.$cls`absolute flex items-center left-0 top-0 justify-around text-gray-600`;
    _.$css`width:${this.pageWidth}px;height:${this.pageHeight}px;`;
    _.$css`transform:scale(${this.graph.boardScale})`;
    _.div("if-else");
  };

  getProps(): PropsData {
    return [];
  }

  protected exportData() {
    return {
      ...super.exportData(),
      condSocket: this.condSocket.id,
      inputSocket: this.whenSocket.id,
      thenSocket: this.thenSocket.id,
      elseSocket: this.elseSocket.id,
    };
  }
  protected importData(data: any, sockets: any): void {
    super.importData(data, sockets);
    this.condSocket = sockets[data.condSocket];
    this.whenSocket = sockets[data.inputSocket];
    this.thenSocket = sockets[data.thenSocket];
    this.elseSocket = sockets[data.elseSocket];
  }

  toOutput(): IfBlockOutput {
    return {
      type: "if",
      id: this.id,
      condition: singleInSocketToOutput(this.condSocket),
      when: multiInSocketToOutput(this.whenSocket),
      then: singleOutSocketToOutput(this.thenSocket),
      else: singleOutSocketToOutput(this.elseSocket),
    };
  }
}

blockCtors["IfElseBlock"] = IfElseBlock;
