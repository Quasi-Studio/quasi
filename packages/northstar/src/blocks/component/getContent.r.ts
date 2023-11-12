import { Context, ref } from "refina";
import { ComponentBlock } from "./block";
import { FUnderlineTextInput } from "@refina/fluentui";
import { currentGraph } from "../../store";

export function getContent(block: ComponentBlock) {
  const {
    info: { inputs, contents, name },
  } = block;

  const info =
    inputs.find(input => input.kind === "as-primary" || input.kind === "as-primary-and-socket") ??
    contents.find(content => content.kind === "as-primary" || content.kind === "as-primary-and-socket");

  const title = (_: Context) => {
    _.$cls`mx-2 text-sm`;
    _.span(name);
  };

  if (!info) return title;
  return (_: Context) => {
    _.$cls`text-gray-600`;
    title(_);

    _._span(
      {
        onmousedown: ev => ev.stopPropagation(),
        onmouseup: ev => ev.stopPropagation(),
        onclick: ev => ev.stopPropagation(),
        onkeydown: ev => ev.stopPropagation(),
      },
      _ => {
        const inputRef = ref<FUnderlineTextInput>();
        _.$css`font-family: Consolas; max-width: 108px; padding-left:4px`;
        _.$ref(inputRef) && _.fUnderlineTextInput(block.primaryValue, block.getPrimaryDisabled(), info.name);
        inputRef.current!.inputRef.current!.node.onchange = () => {
          currentGraph.pushRecord();
        };
        inputRef.current!.inputRef.current!.node.onfocus = () => {
          currentGraph.addSelectedBlock(block, false);
          _.$update();
        };
      },
    );
  };
}
