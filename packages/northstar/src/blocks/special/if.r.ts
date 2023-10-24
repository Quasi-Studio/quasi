import {
  Block,
  Direction,
  InSocket,
  PATH_IN_ELIPSE,
  PATH_IN_TRIANGLE,
  PATH_OUT_TRIANGLE,
  RectBlock,
  SingleOutSocket,
  blockCtors
} from "@quasi-dev/visual-flow";
import { Context } from "refina";

export class IfElseBlock extends RectBlock {
  ctor(): Block {
    return new IfElseBlock();
  }

  constructor() {
    super();

    const condSocket = new InSocket();
    condSocket.type = "D";
    condSocket.label = "condition";
    condSocket.path = PATH_IN_ELIPSE;
    this.addSocket(Direction.LEFT, condSocket);

    const inputSocket = new InSocket();
    inputSocket.type = "E";
    inputSocket.label = "when";
    inputSocket.path = PATH_IN_TRIANGLE;
    this.addSocket(Direction.UP, inputSocket);

    const thenSocket = new SingleOutSocket();
    thenSocket.type = "D";
    thenSocket.label = "then";
    thenSocket.path = PATH_OUT_TRIANGLE;
    this.addSocket(Direction.DOWN, thenSocket);

    const elseSocket = new SingleOutSocket();
    elseSocket.type = "D";
    elseSocket.label = "else";
    elseSocket.path = PATH_OUT_TRIANGLE;
    this.addSocket(Direction.DOWN, elseSocket);
  }

  removable = true;
  duplicateable = true;

  boardWidth: number = 200;
  boardHeight: number = 50;

  contentMain = (_: Context) => {
    _.$cls`absolute flex items-center left-0 top-0 justify-around text-gray-600`;
    _.$css`width:${this.pageWidth}px;height:${this.pageHeight}px;`;
    _.$css`transform:scale(${this.graph.boardScale})`;
    _.div("if-else");
  };
}

blockCtors["IfElseBlock"] = IfElseBlock;
