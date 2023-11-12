import type {
  ComponentBlockCallbacks,
  ComponentBlockChildren,
  ComponentBlockOutput,
  ComponentBlockPlugins,
  ComponentBlockPrimaryInput,
  ComponentBlockProps,
  ConnectTo,
} from "@quasi-dev/compiler";
import { Block, SingleOutSocket, Socket } from "@quasi-dev/visual-flow";
import {
  singleInSocketToOutput,
  singleOutSocketToOutput,
} from "../../utils/toOutpus";
import { ValidatorBlock } from "../special/validator";
import { ComponentBlock } from "./block";

export function toBlockOutput(block: ComponentBlock) {
  const callbacks = {} as ComponentBlockCallbacks;
  for (const event of block.info.events) {
    callbacks[event.name] = singleOutSocketToOutput(
      block.getSocketByName(event.name) as SingleOutSocket,
    );
  }

  const props = {} as ComponentBlockProps;
  for (const v of block.info.props) {
    if (v.type !== "readonly") {
      props[v.name] = block.props[v.name] ?? v.defaultVal;
    }
  }
  for (const input of block.info.inputs) {
    if (
      input.kind === "as-primary" ||
      (input.kind === "as-primary-and-socket" && block.primaryFilled)
    )
      continue;
    const socket = block.getSocketByName(input.name)?.allConnectedLines[0]?.a;
    props[input.name] = {
      blockId: socket?.block.id ?? NaN,
      socketName: socket?.label ?? "",
    };
  }

  let children = {} as ComponentBlockChildren;
  for (const content of block.info.contents) {
    if (
      content.kind === "as-primary" ||
      (content.kind === "as-primary-and-socket" && block.primaryFilled)
    )
      continue;
    children[content.name] =
      block
        .getSocketByName(content.name)
        ?.allConnectedLines.map((l) => (l.b as Socket).block)
        .sort((a, b) => a.boardY - b.boardY)
        .map((b) => b.id) ?? [];
  }

  let plugins = {} as ComponentBlockPlugins;
  for (const plugin of block.info.plugins) {
    if (plugin.dataType !== "input-plugin") continue;

    const validators: ValidatorBlock[] = [];
    let currentPluginBlock: Block | undefined = block;
    while (true) {
      currentPluginBlock = currentPluginBlock.dockedByBlocks.find(
        ([d, b]) => d === plugin.direction,
      )?.[1];
      if (!currentPluginBlock) {
        break;
      }
      if ((currentPluginBlock as ValidatorBlock).type === "validator") {
        validators.push(currentPluginBlock as ValidatorBlock);
      } else {
        throw new Error(`Invalid plugin block ${currentPluginBlock.id}`);
      }
    }

    plugins[plugin.name] = `$ => {
      ${validators
        .map((v) => {
          if (v.inputValue.value.length === 0)
            throw new Error("Validator expression is empty");
          return `if(!(${v.inputValue})) return "${v.errorMessages}";`;
        })
        .join("\n")}
      return true;
    }`;
  }

  let primaryInput: ComponentBlockPrimaryInput = null;
  const primaryInputInfo = block.primaryInputInfo;
  if (primaryInputInfo) {
    const slots: Record<string, ConnectTo> = {};
    for (const socket of block.slotSockets) {
      slots[socket.label] = singleInSocketToOutput(socket);
    }
    primaryInput = {
      name: primaryInputInfo.name,
      value: block.primaryValue.value,
      slots,
    };
  }

  return {
    type: "component",
    func: block.componentType,
    id: block.id,
    name: block.info.name(block.props),
    modelAllocator: block.info.modelAllocator,
    callbacks,
    props,
    plugins,
    children,
    primaryInput,
  } satisfies ComponentBlockOutput;
}
