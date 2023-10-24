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
} from "../types";

export const button = component(
  "Button",
  null,
  content("inner", "as-primary-and-socket"),
  [],
  [],
  event("click", "void"),
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
  plugin("validator", "#input-validator"),
);
