import { Context } from "refina";
import { ComponentBlock } from "./block";
import { updateSockets } from ".";

export function getContent(block: ComponentBlock) {
  const {
    info: { inputs, contents },
  } = block;

  const info =
    inputs.find(input => input.kind === "as-primary" || input.kind === "as-primary-and-socket") ??
    contents.find(content => content.kind === "as-primary" || content.kind === "as-primary-and-socket");
  if (!info) return (_: Context) => {};
  return (_: Context) => {
    _._div(
      {
        onmousedown: ev => ev.stopPropagation(),
        onmouseup: ev => ev.stopPropagation(),
        onclick: ev => ev.stopPropagation(),
        onkeydown: ev => ev.stopPropagation(),
      },
      _ =>
        _.$css`font-family: Consolas` &&
        _.fUnderlineTextInput(block.primaryValue, false, info.name) &&
        updateSockets(block),
    );
  };
}
