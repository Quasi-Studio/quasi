import { FUnderlineTextInput } from "@refina/fluentui";
import { Context, ref } from "refina";
import { currentProject } from "../../project";
import { ComponentBlock } from "./block";

export function getContent(block: ComponentBlock) {
  const title = (_: Context) => {
    _.$cls`mx-2 text-sm`;
    _.span(block.info.displayName(block.props));
  };
  const primaryInputInfo = block.primaryInputInfo?.[1];

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
        _.$ref(inputRef) &&
          _.fUnderlineTextInput(
            block.primaryValue,
            false,
            primaryInputInfo.displayName,
          );
        inputRef.current!.inputRef.current!.node.onchange = () => {
          currentProject.activeGraph.pushRecord();
        };
        inputRef.current!.inputRef.current!.node.onfocus = () => {
          currentProject.activeGraph.addSelectedBlock(block, false);
          _.$update();
        };
      },
    );
  };
}
