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
  const blockContents = Object.values(block.info.contents);
  const blockEvents = Object.values(block.info.events);
  const blockInputs = Object.values(block.info.inputs);
  const blockProps = Object.values(block.info.props);
  const blockPlugins = Object.values(block.info.plugins);

  const callbacks = {} as ComponentBlockCallbacks;
  for (const event of blockEvents) {
    callbacks[event.displayName] = singleOutSocketToOutput(
      block.getSocketByName(event.displayName) as SingleOutSocket,
    );
  }

  const props = {} as ComponentBlockProps;
  for (const v of blockProps) {
    if (v.type !== "readonly") {
      props[v.name] = block.props[v.name] ?? v.defaultVal;
    }
  }
  for (const input of blockInputs) {
    if (
      input.mode === "as-primary" ||
      (input.mode === "as-primary-and-socket" && block.primaryFilled)
    )
      continue;
    const socket = block.getSocketByName(input.displayName)
      ?.allConnectedLines[0]?.a;
    props[input.displayName] = {
      blockId: socket?.block.id ?? NaN,
      socketName: socket?.label ?? "",
    };
  }

  let children = {} as ComponentBlockChildren;
  for (const content of blockContents) {
    if (
      content.mode === "as-primary" ||
      (content.mode === "as-primary-and-socket" && block.primaryFilled)
    )
      continue;
    children[content.displayName] =
      block
        .getSocketByName(content.displayName)
        ?.allConnectedLines.map((l) => (l.b as Socket).block)
        .sort((a, b) => a.boardY - b.boardY)
        .map((b) => b.id) ?? [];
  }

  let plugins = {} as ComponentBlockPlugins;
  for (const plugin of blockPlugins) {
    if (plugin.kind !== "input-plugin") continue;

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

    plugins[plugin.displayName] = `$ => {
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
      name: primaryInputInfo[1].displayName,
      value: block.primaryValue.value,
      slots,
    };
  }

  return {
    type: "component",
    func: block.componentType,
    id: block.id,
    name: block.info.displayName(block.props),
    model: block.info.model,
    callbacks,
    props,
    plugins,
    children,
    primaryInput,
  } satisfies ComponentBlockOutput;
}
