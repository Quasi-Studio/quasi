import { FUnderlineTextInput } from "@refina/fluentui";
import { Context, ref } from "refina";
import { currentGraph } from "../../store";
import { ComponentBlock } from "./block";

export function getContent(block: ComponentBlock) {
  const {
    info: { inputs, contents, name },
    props,
  } = block;

  const info =
    inputs.find(input => input.kind === "as-primary" || input.kind === "as-primary-and-socket") ??
    contents.find(content => content.kind === "as-primary" || content.kind === "as-primary-and-socket");

  const title = (_: Context) => {
    _.$cls`mx-2 text-sm`;
    _.span(name(props));
  };

  if (!info) return title;
  return (_: Context) => {
    _.$cls`text-gray-600`;
    title(_);

    if (!block.getPrimaryDisabled()) {
      const propagationStopper = (ev: Event) => ev.stopPropagation();
      _._span(
        {
          onmousedown: propagationStopper,
          onmouseup: propagationStopper,
          onclick: propagationStopper,
          onkeydown: propagationStopper,
        },
        _ => {
          const inputRef = ref<FUnderlineTextInput>();
          _.$css`font-family: Consolas; max-width: 108px; padding-left:4px`;
          _.$ref(inputRef) && _.fUnderlineTextInput(block.primaryValue, false, info.name);
          inputRef.current!.inputRef.current!.node.onchange = () => {
            currentGraph.pushRecord();
          };
          inputRef.current!.inputRef.current!.node.onfocus = () => {
            currentGraph.addSelectedBlock(block, false);
            _.$update();
          };
        },
      );
    }
  };
}
