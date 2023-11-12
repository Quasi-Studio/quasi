import { Direction } from "@quasi-dev/visual-flow";
import {
  component,
  content,
  contentWrapper,
  dropdownProp,
  event,
  input,
  layer,
  method,
  output,
  plugin,
  switchProp,
  t,
  textProp,
} from "../types";

export default {
  textNode: component(
    "TextNode",
    null,
    [],
    input("text", "string", "as-primary-and-socket"),
  ),

  button: component(
    "Button",
    null,
    content("inner", "as-primary"),
    [],
    [],
    event("onClick", "void"),
    [],
    [],
    [
      textProp("class"),
      dropdownProp("color", ["unset", "primary", "accent"], "unset"),
      switchProp("raised", true),
      switchProp("ripple", false),
    ],
  ),

  p: contentWrapper("Paragraph"),

  div: layer("Div"),

  span: contentWrapper("Span"),

  input: component(
    "TextInput",
    "InputModel",
    [],
    input("label", "string", "as-primary"),
    output("value", "string"),
    event("onInput", t.string, "as-hided-socket"),
    method("clear", [], "as-hided-socket"),
    plugin("validator", "input-plugin"),
    [
      textProp("class"),
    ],
  ),

  appbar: component(
    "Appbar",
    null,
    content("inner", "as-socket"),
    [],
    [],
    [],
    [],
    [],
    [
      dropdownProp("type", ["toolbar", "tab", "both", "neither"], "toolbar"),
      switchProp("colored", true),
    ],
  ),

  forEach: component(
    "For each",
    "ForEachModel",
    content("inner", "as-socket", Direction.BOTTOM),
    input("iterable", "iterable"),
    output("current", "unknown", "as-socket", Direction.RIGHT),
  ),

  ifElse: component(
    "If else",
    null,
    [
      content("then", "as-socket", Direction.RIGHT),
      content("else", "as-socket", Direction.BOTTOM),
    ],
    input("condition", t.boolean),
  ),
};
