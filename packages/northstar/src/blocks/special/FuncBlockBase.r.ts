import type {
  ConnectTo,
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
  directionMap,
  directionNameMap,
} from "@quasi-dev/visual-flow";
import { FTextarea, FUnderlineTextInput } from "@refina/fluentui";
import "@refina/fluentui-icons/expandUpLeft.r.ts";
import { Context, bySelf, d, ref } from "refina";
import { setExtraLib } from "../../utils";
import { PropData, PropsData } from "../../utils/props";
import { multiOutSocketToOutput } from "../../utils/toOutput";
import { SpecialBlock } from "./base";
import { currentProject } from "../../project";

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
  outputLabel: string = "output";
  abstract label: string;
  placeholder = "";

  inputValue = d("");
  slotsDirection = Direction.TOP;
  outputDirection = Direction.BOTTOM;

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
          currentProject.activeGraph.pushRecord();
        };

        if (this.useTextarea) {
          const slots = this.slots;

          _.$cls`monaco-dialog`;
          _.fDialog(
            (_, open) => {
              _.$cls`absolute right-0 top-0 text-gray-600`;
              _.button(_ => _.fiExpandUpLeft20Regular()) && open();
            },
            _ => {
              _.span(this.label);

              _.$cls`ml-10 inline-block text-base text-gray-500`;
              _.div(_ => {
                _.span("Params:");

                if (slots.length === 0) {
                  _.$cls`ml-2`;
                  _.span("none");
                }

                _.$cls`font-[Consolas]`;
                _.span(_ =>
                  _.for(this.slots, bySelf, (slot, i) => {
                    if (i !== 0) {
                      _.span(", ");
                    }
                    _.$cls`text-black`;
                    _.span(slot);
                  }),
                );
              });
            },
            _ => {
              const propagationStopper = (ev: Event) => ev.stopPropagation();
              _.$cls`h-[80vh] overflow-visible`;
              _._div(
                {
                  onclick: propagationStopper,
                  onmousedown: propagationStopper,
                  onmouseup: propagationStopper,
                  onmousemove: propagationStopper,
                  onkeydown: propagationStopper,
                },
                _ => {
                  if (
                    _.monacoEditor(this.inputValue.value, "javascript", {
                      tabSize: 2,
                    })
                  ) {
                    this.inputValue.value = _.$ev;
                    setExtraLib(this.slots.map(slot => `/** param */ declare const $${slot}: any;`).join("\n"));
                  }
                },
              );
            },
          );
        }
      },
    );
  };

  abstract get slotsUsage(): string[];
  get slots() {
    return [...new Set(this.slotsUsage)];
  }
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
        direction: this.slotsDirection,
      });
    }
    if (!this.noOutput) {
      useSocket("output", MultiOutSocket, {
        label: this.outputLabel,
        type: "D",
        path: PATH_OUT_ELIPSE,
        direction: this.outputDirection,
      });
    }
  }

  protected exportData(): any {
    return {
      ...super.exportData(),
      inputValue: this.inputValue.value,
      outputDirection: this.outputDirection,
      slotsDirection: this.slotsDirection,
    };
  }
  protected importData(data: any, sockets: any): void {
    super.importData(data, sockets);
    this.inputValue.value = data.inputValue;
    this.outputDirection = data.outputDirection;
    this.slotsDirection = data.slotsDirection;
  }

  getProps(): PropsData {
    return [
      {
        key: "slots-pos",
        displayName: "slots pos",
        type: "dropdown",
        options: ["TOP", "BOTTOM"],
        getVal: () => {
          return directionNameMap[this.slotsDirection];
        },
        setVal: val => {
          this.slotsDirection = directionMap[val];
        },
      } satisfies PropData,
      {
        key: "output-pos",
        displayName: "output pos",
        type: "dropdown",
        options: ["BOTTOM", "TOP"],
        getVal: () => {
          return directionNameMap[this.outputDirection];
        },
        setVal: val => {
          this.outputDirection = directionMap[val];
        },
      } satisfies PropData,
    ].slice(0, this.noOutput ? 1 : 2);
  }

  toOutput(): FuncBlockOutput | ValidatorBlockOutput | ImpBlockOutput | StateBlockOutput | StateSetterBlockOutput {
    const slots: Record<string, ConnectTo> = {};
    for (const socket of this.inputSockets) {
      slots[socket.label] = {
        blockId: socket.connectedLine?.a.block.id ?? NaN,
        socketName: socket.connectedLine?.a.label ?? "",
      };
    }

    return {
      type: this.type as any,
      id: this.id,
      value: this.inputValue.value,
      slots,
      output: multiOutSocketToOutput(this.outputSocket),
    };
  }
}
