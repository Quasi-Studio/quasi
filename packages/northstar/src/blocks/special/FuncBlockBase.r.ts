import type {
  FuncBlockOutput,
  FuncBlockTypes,
  ImpBlockOutput,
  StateBlockOutput,
  StateSetterBlockOutput,
  ValidatorBlockOutput,
} from "@quasi-dev/compiler";
import {
  Direction,
  MultiOutSocket,
  PATH_IN_ELIPSE,
  PATH_OUT_ELIPSE,
  RectBlock,
  SingleInSocket,
  UseSocket,
  UsedSockets,
} from "@quasi-dev/visual-flow";
import { FTextarea, FUnderlineTextInput } from "@refina/fluentui";
import { Context, d, ref } from "refina";
import { currentGraph } from "../../store";
import { PropsData } from "../../utils/props";
import { multiOutSocketToOutput } from "../../utils/toOutpus";
import { SpecialBlock } from "./base";

export abstract class FuncBlockBase extends RectBlock implements SpecialBlock {
  cloneTo(target: this): this {
    super.cloneTo(target);
    target.inputValue.value = this.inputValue.value;
    return target;
  }

  abstract type: FuncBlockTypes;

  removable = true;
  duplicateable = true;

  boardWidth: number = 200;
  boardHeight: number = 50;

  useTextarea: boolean = false;
  inputValue = d("");
  placeholder = "";

  outputLabel: string = "output";

  abstract label: string;

  content = (_: Context) => {
    _.$cls`text-xs ml-1 mt-[5px] leading-3 text-gray-600`;
    _.div(this.label);

    _._div(
      {
        onmousedown: ev => ev.stopPropagation(),
        onmouseup: ev => ev.stopPropagation(),
        onclick: ev => ev.stopPropagation(),
        onkeydown: ev => ev.stopPropagation(),
      },
      _ => {
        const inputRef = ref<FTextarea | FUnderlineTextInput>();
        _.$css`--fontFamilyBase: Consolas,'Segoe UI', 'Segoe UI Web (West European)', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', sans-serif`;
        _.$ref(inputRef) &&
          (this.useTextarea
            ? _.$css`margin-top:4px;max-width:180px` && _.fTextarea(this.inputValue, false, this.placeholder, "none")
            : _.$css`min-height:24px;margin-left:-4px` &&
              _.fUnderlineTextInput(this.inputValue, false, this.placeholder));
        inputRef.current!.inputRef.current!.node.onchange = () => {
          currentGraph.pushRecord();
        };
      },
    );
  };

  abstract get slots(): string[];
  get noOutput() {
    return false;
  }

  get inputSockets() {
    return this.getSocketsByPrefix("input") as SingleInSocket[];
  }
  get outputSocket() {
    return this.getSocketByName("output") as MultiOutSocket;
  }

  socketUpdater(useSocket: UseSocket, _usedSockets: UsedSockets): void {
    for (const slot of this.slots) {
      useSocket(`input-${slot}`, SingleInSocket, {
        label: slot,
        type: "D",
        path: PATH_IN_ELIPSE,
        direction: Direction.TOP,
      });
    }
    if (!this.noOutput) {
      useSocket("output", MultiOutSocket, {
        label: this.outputLabel,
        type: "D",
        path: PATH_OUT_ELIPSE,
        direction: Direction.BOTTOM,
      });
    }
  }

  protected exportData(): any {
    return {
      ...super.exportData(),
      inputValue: this.inputValue.value,
    };
  }
  protected importData(data: any, sockets: any): void {
    super.importData(data, sockets);
    this.inputValue.value = data.inputValue;
  }

  getProps(): PropsData {
    return [];
  }

  toOutput(): FuncBlockOutput | ValidatorBlockOutput | ImpBlockOutput | StateBlockOutput | StateSetterBlockOutput {
    const inputs = [];
    for (const socket of this.inputSockets) {
      inputs.push({
        slot: socket.label,
        blockId: socket.connectedLine?.a.block.id ?? NaN,
        socketName: socket.connectedLine?.a.label ?? "",
      });
    }

    return {
      type: this.type as any,
      id: this.id,
      value: this.inputValue.value,
      inputs,
      output: multiOutSocketToOutput(this.outputSocket),
    };
  }
}
