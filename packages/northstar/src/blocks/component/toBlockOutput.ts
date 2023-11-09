import type {
  ComponentBlockCallbacks,
  ComponentBlockChildren,
  ComponentBlockOutput,
  ComponentBlockPlugins,
  ComponentBlockProps,
} from "@quasi-dev/compiler";
import { Block, SingleOutSocket, Socket } from "@quasi-dev/visual-flow";
import { singleOutSocketToOutput } from "../../utils/toOutpus";
import { ValidatorBlock } from "../special/validator";
import { ComponentBlock } from "./block";

export function toBlockOutput(block: ComponentBlock) {
  const callbacks = {} as ComponentBlockCallbacks;
  for (const event of block.info.events) {
    callbacks[event.name] = singleOutSocketToOutput(
      block.socketMap.get(event.name) as SingleOutSocket,
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
    ) {
      props[input.name] = block.primaryValue.value;
    } else {
      const socket = block.socketMap.get(input.name)?.allConnectedLines[0]?.a;
      props[input.name] = {
        blockId: socket?.block.id ?? NaN,
        socketName: socket?.label ?? "",
      };
    }
  }

  let children = {} as ComponentBlockChildren;
  for (const content of block.info.contents) {
    if (
      content.kind === "as-primary" ||
      (content.kind === "as-primary-and-socket" && block.primaryFilled)
    ) {
      children[content.name] = block.primaryValue.value;
    } else {
      children[content.name] =
        block.socketMap
          .get(content.name)
          ?.allConnectedLines.map((l) => (l.b as Socket).block)
          .sort((a, b) => a.boardY - b.boardY)
          .map((b) => b.id) ?? [];
    }
  }

  let plugins = {} as ComponentBlockPlugins;
  for (const plugin of block.info.plugins) {
    if (plugin.dataType !== "validator") throw new Error("Not implemented");

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

  return {
    type: "component",
    func: block.componentType,
    id: block.id,
    name: block.info.name,
    modelAllocator: block.info.modelAllocator,
    callbacks,
    props,
    plugins,
    children,
  } satisfies ComponentBlockOutput;
}
