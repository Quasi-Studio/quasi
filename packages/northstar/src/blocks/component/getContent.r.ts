import { Context } from "refina";
import { ComponentBlock } from "./block";
import { updateSockets } from ".";

export function getContent(block: ComponentBlock) {
  const {
    info: { inputs, contents, name },
  } = block;

  const info =
    inputs.find(input => input.kind === "as-primary" || input.kind === "as-primary-and-socket") ??
    contents.find(content => content.kind === "as-primary" || content.kind === "as-primary-and-socket");
  if (!info) return (_: Context) => {};
  return (_: Context) => {
    _.$cls`mx-2 text-sm text-gray-600`;
    _.span(name);

    _._span(
      {
        onmousedown: ev => ev.stopPropagation(),
        onmouseup: ev => ev.stopPropagation(),
        onclick: ev => ev.stopPropagation(),
        onkeydown: ev => ev.stopPropagation(),
      },
      _ => {
        _.$css`font-family: Consolas; max-width: 108px; padding-left:4px` &&
          _.fUnderlineTextInput(block.primaryValue, false, info.name) &&
          updateSockets(block);
      },
    );
  };
}
