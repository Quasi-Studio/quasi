import {
  Block,
  Direction,
  InSocket,
  PATH_IN_ELIPSE,
  PATH_IN_TRIANGLE,
  PATH_OUT_TRIANGLE,
  RectBlock,
  SingleOutSocket,
  Socket,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { Context } from "refina";
import { SpecialBlock } from "./base";
import { Props } from "../../utils/props";

export class IfElseBlock extends RectBlock implements SpecialBlock {
  ctor(): Block {
    return new IfElseBlock();
  }

  condSocket: InSocket;
  inputSocket: InSocket;
  thenSocket: SingleOutSocket;
  elseSocket: SingleOutSocket;

  constructor() {
    super();

    this.condSocket = new InSocket();
    this.condSocket.type = "D";
    this.condSocket.label = "condition";
    this.condSocket.path = PATH_IN_ELIPSE;
    this.addSocket(Direction.LEFT, this.condSocket);

    this.inputSocket = new InSocket();
    this.inputSocket.type = "E";
    this.inputSocket.label = "when";
    this.inputSocket.path = PATH_IN_TRIANGLE;
    this.addSocket(Direction.UP, this.inputSocket);

    this.thenSocket = new SingleOutSocket();
    this.thenSocket.type = "D";
    this.thenSocket.label = "then";
    this.thenSocket.path = PATH_OUT_TRIANGLE;
    this.addSocket(Direction.DOWN, this.thenSocket);

    this.elseSocket = new SingleOutSocket();
    this.elseSocket.type = "D";
    this.elseSocket.label = "else";
    this.elseSocket.path = PATH_OUT_TRIANGLE;
    this.addSocket(Direction.DOWN, this.elseSocket);
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

  getProps(): Props {
    return {};
  }

  toOutput(): IfBlockOutput {
    return {
      type: "if",
      id: this.id,
      condition: {
        blockId: this.condSocket.connectedLine?.a.block.id ?? NaN,
        socketName: this.condSocket.connectedLine?.a.label ?? "",
      },
      when: {
        blockId: this.inputSocket.connectedLine?.a.block.id ?? NaN,
        socketName: this.inputSocket.connectedLine?.a.label ?? "",
      },
      then: {
        blockId: (this.thenSocket.connectedLine?.b as Socket).block.id ?? NaN,
        socketName: (this.thenSocket.connectedLine?.b as Socket).label ?? "",
      },
      else: {
        blockId: (this.elseSocket.connectedLine?.b as Socket).block.id ?? NaN,
        socketName: (this.elseSocket.connectedLine?.b as Socket).label ?? "",
      },
    };
  }
}

blockCtors["IfElseBlock"] = IfElseBlock;

export interface IfBlockOutput {
  type: "if";
  id: number;
  condition: {
    /**
     * if the block is not connected, blockId will be `NaN`
     */
    blockId: number;
    socketName: string;
  };
  when: {
    blockId: number;
    socketName: string;
  };
  then: {
    blockId: number;
    socketName: string;
  };
  else: {
    blockId: number;
    socketName: string;
  };
}
