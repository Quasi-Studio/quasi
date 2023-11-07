import {
  component,
  content,
  contentWrapper,
  dropdownProp,
  event,
  input,
  layer,
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
    event("onInput", t.string),
    [],
    plugin("validator", "validator"),
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
};
