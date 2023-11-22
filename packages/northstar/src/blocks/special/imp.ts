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
  UseSocket,
  UsedSockets,
  blockCtors,
} from "@quasi-dev/visual-flow";
import { PropsData } from "../../utils/props";
import {
  multiInSocketToOutput,
  singleOutSocketToOutput,
} from "../../utils/toOutpus";
import { FuncBlockBase } from "./FuncBlockBase.r";

export class ImpBlock extends FuncBlockBase {
  cloneTo(target: this): this {
    super.cloneTo(target);
    target.hasThen = this.hasThen;
    return target;
  }
  type: FuncBlockTypes = "imp";

  boardHeight = 80;

  label = "imperative code";
  outputLabel = "retVal";
  useTextarea = true;

  hasThen = false;

  get whenSocket() {
    return this.getSocketByName("when") as MultiInSocket;
  }
  get thenSocket() {
    return this.getSocketByName("then") as SingleOutSocket | undefined;
  }

  socketUpdater(useSocket: UseSocket, usedSockets: UsedSockets): void {
    super.socketUpdater(useSocket, usedSockets);
    useSocket("when", MultiInSocket, {
      type: "E",
      path: PATH_IN_TRIANGLE,
      direction: Direction.LEFT,
    });
    if (this.hasThen) {
      useSocket("then", SingleOutSocket, {
        type: "E",
        path: PATH_OUT_TRIANGLE,
        direction: Direction.RIGHT,
      });
    }
    usedSockets.find(([n]) => n === "output")![1].disabled =
      this.inputValue.value.match(/\breturn\b/g) === null;
  }

  get slotsUsage() {
    const template = this.inputValue.value;
    const matches = template.matchAll(/\$[a-zA-Z0-9]+/g);
    return [...matches].map((match) => match[0].slice(1));
  }

  getProps(): PropsData {
    return [
      {
        key: "[then]",
        displayName: "[then]",
        type: "switch",
        getVal: () => {
          return this.hasThen;
        },
        setVal: (val) => {
          this.hasThen = val;
        },
      },
    ];
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
