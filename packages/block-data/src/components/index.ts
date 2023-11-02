import {
  component,
  content,
  event,
  input,
  method,
  output,
  contentWrapper,
  plugin,
  t,
  layer,
  switchProp,
  textProp,
  dropdownProp,
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
      raised: switchProp(false),
      ripple: switchProp(true),
    },
  ),

  p: contentWrapper("Paragraph"),

  div: layer("Div"),

  span: contentWrapper("Span"),

  textInput: component(
    "TextInput",
    `new q.TextInput()`,
    [],
    input("label", "string", "as-primary"),
    output("value", "string", (id) => id),
    event("input", t.string),
    method("clear", [], (id) => `${id}.clear()`),
    plugin("validator", "validator"),
    {
      placeholder: textProp(),
      appearance: dropdownProp(
        ["outline", "underline", "filled-darker", "filled-lighter"],
        "outline",
      ),
    },
  ),
};
