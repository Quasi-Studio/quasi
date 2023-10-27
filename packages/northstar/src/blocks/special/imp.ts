import {
  Block,
  Direction,
  InSocket,
  MultiOutSocket,
  PATH_IN_TRIANGLE,
  PATH_OUT_TRIANGLE,
  SingleOutSocket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { FuncBlockBase, FuncBlockTypes } from "./FuncBlockBase.r";

export class ImpBlock extends FuncBlockBase {
  constructor() {
    super();
    this.boardHeight = 80;

    const inputSocket = new InSocket();
    inputSocket.type = "E";
    inputSocket.label = "when";
    inputSocket.path = PATH_IN_TRIANGLE;
    this.addSocket(Direction.LEFT, inputSocket);

    const thenSocket = new SingleOutSocket();
    thenSocket.type = "E";
    thenSocket.label = "then";
    thenSocket.path = PATH_OUT_TRIANGLE;
    this.addSocket(Direction.RIGHT, thenSocket);

    this.updateSocketPosition();
  }

  name = "imperative code";

  useTextarea = true;

  getSlots() {
    const template = this.inputValue.value;
    const matches = template.matchAll(/\$[a-zA-Z0-9]+/g);
    return [...matches].map((match) => match[0].slice(1));
  }

  type: FuncBlockTypes = "imp";
}

blockCtors["ImpBlock"] = ImpBlock;
