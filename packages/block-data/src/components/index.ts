import {
  component,
  content,
  event,
  input,
  method,
  output,
  outputWrap,
  plugin,
  t,
} from "../types";

export const button = component(
  "Button",
  null,
  content("inner", "as-primary-and-socket"),
  [],
  [],
  event("click", "void"),
);

export const p = outputWrap("Paragraph");

export const div = outputWrap("Div");

export const span = outputWrap("Span");

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
