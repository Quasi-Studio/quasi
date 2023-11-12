import { FUnderlineTextInput } from "@refina/fluentui";
import { Context, ref } from "refina";
import { currentGraph } from "../../store";
import { ComponentBlock } from "./block";

export function getContent(block: ComponentBlock) {
  const title = (_: Context) => {
    _.$cls`mx-2 text-sm`;
    _.span(block.info.name(block.props));
  };
  const primaryInputInfo = block.primaryInputInfo;

  if (!primaryInputInfo) return title;
  return (_: Context) => {
    _.$cls`text-gray-600`;
    title(_);

    const propagationStopper = (ev: Event) => ev.stopPropagation();
    block.getPrimaryDisabled() && _.$cls`invisible`;
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
        _.$ref(inputRef) && _.fUnderlineTextInput(block.primaryValue, false, primaryInputInfo.name);
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
