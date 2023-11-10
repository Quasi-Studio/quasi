import type {
  FuncBlockOutput,
  FuncBlockTypes,
  ImpBlockOutput,
} from "@quasi-dev/compiler";
import {
  Direction,
  MultiInSocket,
  PATH_IN_TRIANGLE,
  PATH_OUT_TRIANGLE,
  SingleOutSocket,
  Socket,
  UseSocket,
  UsedSockets,
  blockCtors,
} from "@quasi-dev/visual-flow";
import {
  multiInSocketToOutput,
  singleOutSocketToOutput,
} from "../../utils/toOutpus";
import { FuncBlockBase } from "./FuncBlockBase.r";

export class ImpBlock extends FuncBlockBase {
  type: FuncBlockTypes = "imp";

  boardHeight = 80;

  label = "imperative code";
  outputLabel = "retVal";
  useTextarea = true;

  get whenSocket() {
    return this.getSocketByName("when") as MultiInSocket;
  }
  get thenSocket() {
    return this.getSocketByName("then") as SingleOutSocket;
  }

  socketUpdater(useSocket: UseSocket, usedSockets: UsedSockets): void {
    super.socketUpdater(useSocket, usedSockets);
    useSocket("when", MultiInSocket, {
      type: "E",
      path: PATH_IN_TRIANGLE,
      direction: Direction.LEFT,
    });
    useSocket("then", SingleOutSocket, {
      type: "E",
      path: PATH_OUT_TRIANGLE,
      direction: Direction.RIGHT,
    });
    usedSockets.find(([n]) => n === "output")![1].disabled =
      this.inputValue.value.match(/\breturn\b/g) === null;
  }

  get slots() {
    const template = this.inputValue.value;
    const matches = template.matchAll(/\$[a-zA-Z0-9]+/g);
    return [...matches].map((match) => match[0].slice(1));
  }

  toOutput(): ImpBlockOutput {
    return {
      ...(super.toOutput() as FuncBlockOutput),
      type: "imp",
      when: multiInSocketToOutput(this.whenSocket),
      then: singleOutSocketToOutput(this.thenSocket),
    };
  }
}

blockCtors["ImpBlock"] = ImpBlock;
