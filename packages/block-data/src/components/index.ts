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
    [],
    [],
    [],
    [],
    {},
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
    {
      color: dropdownProp(["unset", "primary", "accent"], "unset"),
      raised: switchProp(true),
      ripple: switchProp(false),
    },
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
    {},
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
    {
      type: dropdownProp(["toolbar", "tab", "both", "neither"], "toolbar"),
      colored: switchProp(true),
    },
  ),
};
