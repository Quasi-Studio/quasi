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

export const textNode = component(
  "TextNode",
  null,
  [],
  input("text", "string", "as-primary-and-socket"),
  [],
  [],
  [],
  [],
  {},
);

export const button = component(
  "Button",
  null,
  content("inner", "as-primary-and-socket"),
  [],
  [],
  event("click", "void"),
  [],
  [],
  {
    appearance: dropdownProp(
      ["primary", "outline", "subtle", "transparent"],
      "secondary",
    ),
  },
);

export const p = contentWrapper("Paragraph");

export const div = layer("Div");

export const span = contentWrapper("Span");

export const textInput = component(
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
);
